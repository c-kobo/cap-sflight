import type MTable from "sap/m/Table";
import type UI5Event from "sap/ui/base/Event";
import type SmartTable from "sap/ui/comp/smarttable/SmartTable";
import type MDCTable from "sap/ui/mdc/Table";
import ODataListBinding from "sap/ui/model/odata/v2/ODataListBinding";
import type UITable from "sap/ui/table/Table";
import { renderMarkdownTable } from "ux/eng/fioriai/reuse/summary/extraction/table-to-markdown";
import { getText } from "../../common/text";
import { ColumnSchema, ExportSettings, TypeSpecificTextResult } from "../types";

/**
 * extracts table data with a given schema to produce a formatted markdown table
 * and adds table specific text to the result
 *
 * @param schema  The schema defining the columns of the table
 * @param tableData The data to be extracted based on the schema
 * @param tableText  The existing table text to be appended
 * @returns A `TypeSpecificTextResult` containing the extracted table text and a flag indicating the element was processed, or `undefined` if the schema or tableData is not provided.
 */
function extractTableTextToMarkdown(
    schema: ColumnSchema[],
    tableData: object[],
    tableText: string | undefined
): TypeSpecificTextResult | undefined {
    const columnProperties = schema.map((column) => column.property).flat();
    if (Array.isArray(tableData) && tableData.length > 0) {
        return {
            text: [renderMarkdownTable(schema, filterTableData(tableData, columnProperties)), tableText]
                .filter(Boolean)
                .join("\n"),
            elementProcessed: true
        };
    }
    //empty table lines: return only table text and mark element as processed to skip further node extraction processing
    return tableText ? { text: tableText, elementProcessed: true } : undefined;
}

/**
 * Extracts text for a UI5 control of type sap.ui.mdc.Table based on the provided schema and table data.
 *
 * @param mdcTable UI5 control of type sap.ui.mdc.Table
 * @param schema The schema defining the columns of the table
 * @returns A `TypeSpecificTextResult` containing the extracted table text and a flag indicating the element was processed, or `undefined` if the schema or tableData is not provided.
 */
export function extractMdcTableText(
    mdcTable: MDCTable,
    schema: ColumnSchema[] | undefined
): TypeSpecificTextResult | undefined {
    const tableData = mdcTableData(mdcTable);
    // Check if schema and tableData are defined
    if (schema && tableData) {
        const rowCount = mdcTable.getRowBinding().getCount() ?? mdcTable.getRowBinding().getLength();
        return extractTableTextToMarkdown(
            schema,
            tableData,
            typeof rowCount === "number" ? `${getText("TABLE_ROWS", [rowCount])}` : undefined
        );
    }
}

/**
 * Extracts text for a UI5 control of type sap.ui.comp.smarttable.SmartTable based on the provided schema and table data.
 *
 * @param smartTable UI5 control of type sap.ui.comp.smarttable.SmartTable
 * @param schema The schema defining the columns of the table
 * @returns A `TypeSpecificTextResult` containing the extracted table text and a flag indicating the element was processed, or `undefined` if the schema or tableData is not provided.
 */
export function extractSmartTableText(smartTable: SmartTable, schema: ColumnSchema[] | undefined) {
    const tableData = smartTableData(smartTable);
    // Check if schema and tableData are defined
    if (schema && tableData) {
        let tableText: string | undefined;
        //get inner table
        const table = smartTable.getTable();
        if (table?.isA<MTable>("sap.m.Table")) {
            tableText = mTableText(table)?.text;
        }
        if (table?.isA<UITable>("sap.ui.table.Table")) {
            tableText = uiTableText(table)?.text;
        }
        return extractTableTextToMarkdown(schema, tableData, tableText);
    }
}

/**
 * Text for UI5 controls with metadata name sap.m.Table.
 *
 * @param mTable UI5 control of type sap.m.Table
 * @returns text with row count of the table
 */
export function mTableText(mTable: MTable): TypeSpecificTextResult | undefined {
    const listBinding = mTable.getBinding("items") as ODataListBinding;
    const rowCount = listBinding.getCount() ?? listBinding.getLength();
    return typeof rowCount === "number"
        ? { text: `${getText("TABLE_ROWS", [rowCount])}`, elementProcessed: false }
        : undefined;
}

/**
 * Text for UI5 controls with metadata name sap.ui.mdc.Table.
 *
 * @param mdcTable UI5 control of type sap.ui.mdc.Table
 * @returns text with row count of the table
 */
export async function mdcTableText(mdcTable: MDCTable): Promise<TypeSpecificTextResult | undefined> {
    return extractMdcTableText(mdcTable, await mdcTableSchema(mdcTable));
}

/**
 * Text for UI5 controls with metadata name sap.ui.comp.smarttable.SmartTable.
 *
 * @param smartTable UI5 control of type sap.ui.comp.smarttable.SmartTable
 * @returns text with row count of the table
 */
export async function smartTableText(smartTable: SmartTable): Promise<TypeSpecificTextResult | undefined> {
    return extractSmartTableText(smartTable, await smartTableSchema(smartTable));
}

/**
 * Text for UI5 controls with metadata name sap.ui.table.Table.
 *
 * @param uiTable UI5 control of type sap.ui.table.Table
 * @returns text with row count of the table
 */
export function uiTableText(uiTable: UITable): TypeSpecificTextResult | undefined {
    const listBinding = uiTable.getBinding("rows") as ODataListBinding;
    const rowCount = listBinding.getCount() ?? listBinding.getLength();
    return typeof rowCount === "number"
        ? { text: `${getText("TABLE_ROWS", [rowCount])}`, elementProcessed: false }
        : undefined;
}

/**
 * Schema for UI5 controls with metadata name sap.ui.mdc.Table.
 *
 * @param mdcTable UI5 control of type sap.ui.mdc.Table
 * @returns schema of the table
 */
export function mdcTableSchema(mdcTable: MDCTable): Promise<ColumnSchema[]> | undefined {
    return mdcTable.getEnableExport() ? getColumnsForMDCTable(mdcTable) : undefined;
}

function attachEventOnceToTable(
    control: MDCTable | SmartTable,
    resolve: (columns: ColumnSchema[]) => void,
    reject: (error: Error) => void
): void {
    control.attachEventOnce("beforeExport", (oEvent: UI5Event<{ exportSettings?: ExportSettings }>) => {
        oEvent.preventDefault();
        const columns = oEvent.getParameter("exportSettings")?.workbook.columns;
        return columns ? resolve(columns) : reject(new Error("Columns not found in export settings"));
    });
}

function getColumnsForMDCTable(mdcTable: MDCTable): Promise<ColumnSchema[]> {
    return new Promise((resolve, reject) => {
        try {
            attachEventOnceToTable(mdcTable, resolve, reject);
            mdcTable.triggerExport().catch((error) => {
                reject(new Error(String(error)));
            });
        } catch (error) {
            reject(new Error(String(error)));
        }
    });
}

/**
 * Schema for UI5 controls with metadata name sap.ui.comp.smarttable.SmartTable.
 *
 * @param smartTable UI5 control of type sap.ui.comp.smarttable.SmartTable
 * @returns schema of the table
 */
export function smartTableSchema(smartTable: SmartTable): Promise<ColumnSchema[]> | undefined {
    return smartTable.getEnableExport() ? getColumnsForSmartTable(smartTable) : undefined;
}

/**
 * Retrieves the column schema for a SmartTable by triggering the "beforeExport" event.
 *
 * @param smartTable UI5 control of type sap.ui.comp.smarttable.SmartTable
 * @returns A promise that resolves with the column schema of the table
 */
export function getColumnsForSmartTable(smartTable: SmartTable): Promise<ColumnSchema[]> {
    return new Promise((resolve, reject) => {
        try {
            attachEventOnceToTable(smartTable, resolve, reject);
            smartTable.triggerExport().catch((error) => {
                reject(new Error(String(error)));
            });
        } catch (error) {
            reject(new Error(String(error)));
        }
    });
}

/**
 * Data for UI5 controls with metadata name sap.ui.mdc.Table.
 *
 * @param mdcTable UI5 control of type sap.ui.mdc.Table
 * @returns data of the table
 */
function mdcTableData(mdcTable: MDCTable): object[] | undefined {
    const context = mdcTable.getRowBinding().getAllCurrentContexts();
    return (
        context.map((ctx) => {
            const obj = ctx.getObject() as object;
            return { ...obj, _context: ctx };
        }) ?? undefined
    );
}

/**
 * Data for UI5 controls with metadata name sap.ui.comp.smarttable.SmartTable.
 *
 * @param smartTable UI5 control of type sap.ui.comp.smarttable.SmartTable
 * @returns data of the table
 */
function smartTableData(smartTable: SmartTable): object[] | undefined {
    // Get inner table
    const table = smartTable.getTable();
    let listBinding: ODataListBinding | undefined;

    if (table?.isA<MTable>("sap.m.Table")) {
        listBinding = table.getBinding("items") as ODataListBinding;
    } else if (table?.isA<UITable>("sap.ui.table.Table")) {
        listBinding = table.getBinding("rows") as ODataListBinding;
    }
    return (
        listBinding?.getAllCurrentContexts().map((context) => {
            const obj = context.getObject();
            return { ...obj, _context: context };
        }) ?? undefined
    );
}

/**
 * Filters an array of objects based on specified properties.
 *
 * @param additionalData  The array of objects to be filtered.
 * @param properties  The list of properties to filter by. Each property can be a string with a '/' separator.
 * @returns An array of objects containing only the specified properties.
 */
function filterTableData(additionalData: object, properties: string[]): { [key: string]: string }[] {
    const filteredData = (additionalData as unknown as Array<{ [key: string]: string }>)
        .filter((row) => properties.some((property) => row[property.split("/")[0]]))
        .map((row) => {
            // Include _context property if it exists during instantiation
            const filteredRow: { [key: string]: string } = row._context ? { _context: row._context } : {};
            properties.forEach((property) => {
                const prop = property.split("/")[0];
                if (prop in row) {
                    filteredRow[prop] = row[prop];
                }
            });
            return filteredRow;
        });
    return filteredData;
}
