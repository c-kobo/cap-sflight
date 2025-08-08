declare module "ux/eng/fioriai/reuse/summary/extraction/table" {
    import type MTable from "sap/m/Table";
    import type SmartTable from "sap/ui/comp/smarttable/SmartTable";
    import type MDCTable from "sap/ui/mdc/Table";
    import type UITable from "sap/ui/table/Table";
    import { ColumnSchema, TypeSpecificTextResult } from "ux/eng/fioriai/reuse/summary/types";
    /**
     * extracts table data with a given schema to produce a formatted markdown table
     * and adds table specific text to the result
     *
     * @param schema  The schema defining the columns of the table
     * @param tableData The data to be extracted based on the schema
     * @param tableText  The existing table text to be appended
     * @returns A `TypeSpecificTextResult` containing the extracted table text and a flag indicating the element was processed, or `undefined` if the schema or tableData is not provided.
     */
    function extractTableTextToMarkdown(schema: ColumnSchema[], tableData: object[], tableText: string | undefined): TypeSpecificTextResult | undefined;
    /**
     * Extracts text for a UI5 control of type sap.ui.mdc.Table based on the provided schema and table data.
     *
     * @param mdcTable UI5 control of type sap.ui.mdc.Table
     * @param schema The schema defining the columns of the table
     * @returns A `TypeSpecificTextResult` containing the extracted table text and a flag indicating the element was processed, or `undefined` if the schema or tableData is not provided.
     */
    function extractMdcTableText(mdcTable: MDCTable, schema: ColumnSchema[] | undefined): TypeSpecificTextResult | undefined;
    /**
     * Extracts text for a UI5 control of type sap.ui.comp.smarttable.SmartTable based on the provided schema and table data.
     *
     * @param smartTable UI5 control of type sap.ui.comp.smarttable.SmartTable
     * @param schema The schema defining the columns of the table
     * @returns A `TypeSpecificTextResult` containing the extracted table text and a flag indicating the element was processed, or `undefined` if the schema or tableData is not provided.
     */
    function extractSmartTableText(smartTable: SmartTable, schema: ColumnSchema[] | undefined): TypeSpecificTextResult;
    /**
     * Text for UI5 controls with metadata name sap.m.Table.
     *
     * @param mTable UI5 control of type sap.m.Table
     * @returns text with row count of the table
     */
    function mTableText(mTable: MTable): TypeSpecificTextResult | undefined;
    /**
     * Text for UI5 controls with metadata name sap.ui.mdc.Table.
     *
     * @param mdcTable UI5 control of type sap.ui.mdc.Table
     * @returns text with row count of the table
     */
    function mdcTableText(mdcTable: MDCTable): Promise<TypeSpecificTextResult | undefined>;
    /**
     * Text for UI5 controls with metadata name sap.ui.comp.smarttable.SmartTable.
     *
     * @param smartTable UI5 control of type sap.ui.comp.smarttable.SmartTable
     * @returns text with row count of the table
     */
    function smartTableText(smartTable: SmartTable): Promise<TypeSpecificTextResult | undefined>;
    /**
     * Text for UI5 controls with metadata name sap.ui.table.Table.
     *
     * @param uiTable UI5 control of type sap.ui.table.Table
     * @returns text with row count of the table
     */
    function uiTableText(uiTable: UITable): TypeSpecificTextResult | undefined;
    /**
     * Schema for UI5 controls with metadata name sap.ui.mdc.Table.
     *
     * @param mdcTable UI5 control of type sap.ui.mdc.Table
     * @returns schema of the table
     */
    function mdcTableSchema(mdcTable: MDCTable): Promise<ColumnSchema[]> | undefined;
    function attachEventOnceToTable(control: MDCTable | SmartTable, resolve: (columns: ColumnSchema[]) => void, reject: (error: Error) => void): void;
    function getColumnsForMDCTable(mdcTable: MDCTable): Promise<ColumnSchema[]>;
    /**
     * Schema for UI5 controls with metadata name sap.ui.comp.smarttable.SmartTable.
     *
     * @param smartTable UI5 control of type sap.ui.comp.smarttable.SmartTable
     * @returns schema of the table
     */
    function smartTableSchema(smartTable: SmartTable): Promise<ColumnSchema[]> | undefined;
    /**
     * Retrieves the column schema for a SmartTable by triggering the "beforeExport" event.
     *
     * @param smartTable UI5 control of type sap.ui.comp.smarttable.SmartTable
     * @returns A promise that resolves with the column schema of the table
     */
    function getColumnsForSmartTable(smartTable: SmartTable): Promise<ColumnSchema[]>;
    /**
     * Data for UI5 controls with metadata name sap.ui.mdc.Table.
     *
     * @param mdcTable UI5 control of type sap.ui.mdc.Table
     * @returns data of the table
     */
    function mdcTableData(mdcTable: MDCTable): object[] | undefined;
    /**
     * Data for UI5 controls with metadata name sap.ui.comp.smarttable.SmartTable.
     *
     * @param smartTable UI5 control of type sap.ui.comp.smarttable.SmartTable
     * @returns data of the table
     */
    function smartTableData(smartTable: SmartTable): object[] | undefined;
    /**
     * Filters an array of objects based on specified properties.
     *
     * @param additionalData  The array of objects to be filtered.
     * @param properties  The list of properties to filter by. Each property can be a string with a '/' separator.
     * @returns An array of objects containing only the specified properties.
     */
    function filterTableData(additionalData: object, properties: string[]): {
        [key: string]: string;
    }[];
}
//# sourceMappingURL=table.d.ts.map