"use strict";

sap.ui.define(["ux/eng/fioriai/reuse/summary/extraction/table-to-markdown", "../../common/text"], function (__ux_eng_fioriai_reuse_summary_extraction_table_to_markdown, ____common_text) {
  "use strict";

  const renderMarkdownTable = __ux_eng_fioriai_reuse_summary_extraction_table_to_markdown["renderMarkdownTable"];
  const getText = ____common_text["getText"];
  /**
   * extracts table data with a given schema to produce a formatted markdown table
   * and adds table specific text to the result
   *
   * @param schema  The schema defining the columns of the table
   * @param tableData The data to be extracted based on the schema
   * @param tableText  The existing table text to be appended
   * @returns A `TypeSpecificTextResult` containing the extracted table text and a flag indicating the element was processed, or `undefined` if the schema or tableData is not provided.
   */
  function extractTableTextToMarkdown(schema, tableData, tableText) {
    const columnProperties = schema.map(column => column.property).flat();
    if (Array.isArray(tableData) && tableData.length > 0) {
      return {
        text: [renderMarkdownTable(schema, filterTableData(tableData, columnProperties)), tableText].filter(Boolean).join("\n"),
        elementProcessed: true
      };
    }
    //empty table lines: return only table text and mark element as processed to skip further node extraction processing
    return tableText ? {
      text: tableText,
      elementProcessed: true
    } : undefined;
  }

  /**
   * Extracts text for a UI5 control of type sap.ui.mdc.Table based on the provided schema and table data.
   *
   * @param mdcTable UI5 control of type sap.ui.mdc.Table
   * @param schema The schema defining the columns of the table
   * @returns A `TypeSpecificTextResult` containing the extracted table text and a flag indicating the element was processed, or `undefined` if the schema or tableData is not provided.
   */
  function extractMdcTableText(mdcTable, schema) {
    const tableData = mdcTableData(mdcTable);
    // Check if schema and tableData are defined
    if (schema && tableData) {
      const rowCount = mdcTable.getRowBinding().getCount() ?? mdcTable.getRowBinding().getLength();
      return extractTableTextToMarkdown(schema, tableData, typeof rowCount === "number" ? `${getText("TABLE_ROWS", [rowCount])}` : undefined);
    }
  }

  /**
   * Extracts text for a UI5 control of type sap.ui.comp.smarttable.SmartTable based on the provided schema and table data.
   *
   * @param smartTable UI5 control of type sap.ui.comp.smarttable.SmartTable
   * @param schema The schema defining the columns of the table
   * @returns A `TypeSpecificTextResult` containing the extracted table text and a flag indicating the element was processed, or `undefined` if the schema or tableData is not provided.
   */
  function extractSmartTableText(smartTable, schema) {
    const tableData = smartTableData(smartTable);
    // Check if schema and tableData are defined
    if (schema && tableData) {
      let tableText;
      //get inner table
      const table = smartTable.getTable();
      if (table?.isA("sap.m.Table")) {
        tableText = mTableText(table)?.text;
      }
      if (table?.isA("sap.ui.table.Table")) {
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
  function mTableText(mTable) {
    const listBinding = mTable.getBinding("items");
    const rowCount = listBinding.getCount() ?? listBinding.getLength();
    return typeof rowCount === "number" ? {
      text: `${getText("TABLE_ROWS", [rowCount])}`,
      elementProcessed: false
    } : undefined;
  }

  /**
   * Text for UI5 controls with metadata name sap.ui.mdc.Table.
   *
   * @param mdcTable UI5 control of type sap.ui.mdc.Table
   * @returns text with row count of the table
   */
  async function mdcTableText(mdcTable) {
    return extractMdcTableText(mdcTable, await mdcTableSchema(mdcTable));
  }

  /**
   * Text for UI5 controls with metadata name sap.ui.comp.smarttable.SmartTable.
   *
   * @param smartTable UI5 control of type sap.ui.comp.smarttable.SmartTable
   * @returns text with row count of the table
   */
  async function smartTableText(smartTable) {
    return extractSmartTableText(smartTable, await smartTableSchema(smartTable));
  }

  /**
   * Text for UI5 controls with metadata name sap.ui.table.Table.
   *
   * @param uiTable UI5 control of type sap.ui.table.Table
   * @returns text with row count of the table
   */
  function uiTableText(uiTable) {
    const listBinding = uiTable.getBinding("rows");
    const rowCount = listBinding.getCount() ?? listBinding.getLength();
    return typeof rowCount === "number" ? {
      text: `${getText("TABLE_ROWS", [rowCount])}`,
      elementProcessed: false
    } : undefined;
  }

  /**
   * Schema for UI5 controls with metadata name sap.ui.mdc.Table.
   *
   * @param mdcTable UI5 control of type sap.ui.mdc.Table
   * @returns schema of the table
   */
  function mdcTableSchema(mdcTable) {
    return mdcTable.getEnableExport() ? getColumnsForMDCTable(mdcTable) : undefined;
  }
  function attachEventOnceToTable(control, resolve, reject) {
    control.attachEventOnce("beforeExport", oEvent => {
      oEvent.preventDefault();
      const columns = oEvent.getParameter("exportSettings")?.workbook.columns;
      return columns ? resolve(columns) : reject(new Error("Columns not found in export settings"));
    });
  }
  function getColumnsForMDCTable(mdcTable) {
    return new Promise((resolve, reject) => {
      try {
        attachEventOnceToTable(mdcTable, resolve, reject);
        mdcTable.triggerExport().catch(error => {
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
  function smartTableSchema(smartTable) {
    return smartTable.getEnableExport() ? getColumnsForSmartTable(smartTable) : undefined;
  }

  /**
   * Retrieves the column schema for a SmartTable by triggering the "beforeExport" event.
   *
   * @param smartTable UI5 control of type sap.ui.comp.smarttable.SmartTable
   * @returns A promise that resolves with the column schema of the table
   */
  function getColumnsForSmartTable(smartTable) {
    return new Promise((resolve, reject) => {
      try {
        attachEventOnceToTable(smartTable, resolve, reject);
        smartTable.triggerExport().catch(error => {
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
  function mdcTableData(mdcTable) {
    const context = mdcTable.getRowBinding().getAllCurrentContexts();
    return context.map(ctx => {
      const obj = ctx.getObject();
      return {
        ...obj,
        _context: ctx
      };
    }) ?? undefined;
  }

  /**
   * Data for UI5 controls with metadata name sap.ui.comp.smarttable.SmartTable.
   *
   * @param smartTable UI5 control of type sap.ui.comp.smarttable.SmartTable
   * @returns data of the table
   */
  function smartTableData(smartTable) {
    // Get inner table
    const table = smartTable.getTable();
    let listBinding;
    if (table?.isA("sap.m.Table")) {
      listBinding = table.getBinding("items");
    } else if (table?.isA("sap.ui.table.Table")) {
      listBinding = table.getBinding("rows");
    }
    return listBinding?.getAllCurrentContexts().map(context => {
      const obj = context.getObject();
      return {
        ...obj,
        _context: context
      };
    }) ?? undefined;
  }

  /**
   * Filters an array of objects based on specified properties.
   *
   * @param additionalData  The array of objects to be filtered.
   * @param properties  The list of properties to filter by. Each property can be a string with a '/' separator.
   * @returns An array of objects containing only the specified properties.
   */
  function filterTableData(additionalData, properties) {
    const filteredData = additionalData.filter(row => properties.some(property => row[property.split("/")[0]])).map(row => {
      // Include _context property if it exists during instantiation
      const filteredRow = row._context ? {
        _context: row._context
      } : {};
      properties.forEach(property => {
        const prop = property.split("/")[0];
        if (prop in row) {
          filteredRow[prop] = row[prop];
        }
      });
      return filteredRow;
    });
    return filteredData;
  }
  var __exports = {
    __esModule: true
  };
  __exports.extractMdcTableText = extractMdcTableText;
  __exports.extractSmartTableText = extractSmartTableText;
  __exports.mTableText = mTableText;
  __exports.mdcTableText = mdcTableText;
  __exports.smartTableText = smartTableText;
  __exports.uiTableText = uiTableText;
  __exports.mdcTableSchema = mdcTableSchema;
  __exports.smartTableSchema = smartTableSchema;
  __exports.getColumnsForSmartTable = getColumnsForSmartTable;
  return __exports;
});
//# sourceMappingURL=table-dbg.js.map
