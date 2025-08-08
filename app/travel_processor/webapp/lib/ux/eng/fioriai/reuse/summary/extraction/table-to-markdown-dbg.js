"use strict";

sap.ui.define(["sap/base/strings/formatMessage", "sap/base/util/ObjectPath", "sap/ui/core/format/NumberFormat", "sap/ui/model/odata/type/Boolean", "sap/ui/model/odata/type/Date", "sap/ui/model/odata/type/DateTimeOffset", "ux/eng/fioriai/reuse/common/format"], function (formatMessage, ObjectPath, NumberFormat, ODataBoolean, ODataDate, ODataDateTimeOffset, __ux_eng_fioriai_reuse_common_format) {
  "use strict";

  const generateMarkdownTable = __ux_eng_fioriai_reuse_common_format["generateMarkdownTable"];
  function getPropertyValue(property, tableRowData) {
    if (!property) {
      return undefined;
    }
    const pathParts = property.split("/");
    let columnValue = ObjectPath.get(pathParts, tableRowData);
    // If the value is not found directly, check if it is a reference
    // and try to resolve it using the context.
    if (columnValue === undefined) {
      for (const part of pathParts) {
        const nestedValue = tableRowData[part];
        if (nestedValue && typeof nestedValue === "object" && "__ref" in nestedValue && tableRowData._context) {
          const refData = tableRowData._context.getProperty(part);
          columnValue = ObjectPath.get(pathParts, refData);
          break;
        }
      }
    }
    return columnValue;
  }
  const type = {
    date: new ODataDate(),
    dateTimeOffset: new ODataDateTimeOffset(),
    boolean: new ODataBoolean()
  };
  function formatCellValue(column, tableRowData) {
    const valueProperties = Array.isArray(column.property) ? column.property : [column.property];
    if (valueProperties.length === 0) {
      return "";
    }
    switch (column.type) {
      case "Currency":
        {
          const value = getPropertyValue(valueProperties[0], tableRowData);
          if (typeof value === "number" || typeof value === "string") {
            const unit = getPropertyValue(column.unitProperty, tableRowData)?.toString();
            return NumberFormat.getCurrencyInstance().format(value, unit);
          }
          return "";
        }
      case "Number":
        {
          const value = getPropertyValue(valueProperties[0], tableRowData);
          if (typeof value === "number" || typeof value === "string") {
            const unit = column.unitProperty ? getPropertyValue(column.unitProperty, tableRowData)?.toString() : undefined;
            return NumberFormat.getUnitInstance().format(value, unit);
          }
          return "";
        }
      case "Date":
        {
          const value = getPropertyValue(valueProperties[0], tableRowData);
          if (typeof value === "string" || value instanceof Date) {
            return type.date.formatValue(value, "string").toString();
          }
          return "";
        }
      case "DateTime":
        {
          const value = getPropertyValue(valueProperties[0], tableRowData);
          if (typeof value === "string" || value instanceof Date) {
            return type.dateTimeOffset.formatValue(value, "string").toString();
          }
          return "";
        }
      case "Boolean":
        {
          const value = getPropertyValue(valueProperties[0], tableRowData);
          if (typeof value === "boolean") {
            return type.boolean.formatValue(value, "string").toString();
          }
          return "";
        }
      case "String":
      default:
        {
          const values = valueProperties.map(property => getPropertyValue(property, tableRowData) ?? "");
          if (values.some(value => value)) {
            // graceful handling of V2 string template issue (off-by-one error - it sometimes says "{1}" is the template but provides a single value only)
            if (!column.template?.includes("{0}")) {
              return values.join(" ");
            }
            return formatMessage(column.template, values);
          }
          return "";
        }
    }
  }

  /**
   * Renders a Markdown table from the given columns and table data.
   *
   * @param columns The schema of the table columns.
   * @param tableData The data for the table rows.
   * @returns The markdown string representing the table.
   */
  function renderMarkdownTable(columns, tableData) {
    const prepareTableRow = (columns, tableRowData) => columns.map(column => formatCellValue(column, tableRowData));
    const headers = columns.map(column => column.label || "");
    const rows = tableData.map(row => prepareTableRow(columns, row));
    return generateMarkdownTable(headers, rows);
  }
  var __exports = {
    __esModule: true
  };
  __exports.renderMarkdownTable = renderMarkdownTable;
  return __exports;
});
//# sourceMappingURL=table-to-markdown-dbg.js.map
