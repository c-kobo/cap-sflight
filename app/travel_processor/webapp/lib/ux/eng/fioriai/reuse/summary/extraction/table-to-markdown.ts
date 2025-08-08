import formatMessage from "sap/base/strings/formatMessage";
import ObjectPath from "sap/base/util/ObjectPath";
import NumberFormat from "sap/ui/core/format/NumberFormat";
import Context from "sap/ui/model/Context";
import ODataBoolean from "sap/ui/model/odata/type/Boolean";
import ODataDate from "sap/ui/model/odata/type/Date";
import ODataDateTimeOffset from "sap/ui/model/odata/type/DateTimeOffset";
import { generateMarkdownTable } from "ux/eng/fioriai/reuse/common/format";
import { ColumnSchema, TableRowData, TableRowDataValue } from "ux/eng/fioriai/reuse/summary/types";

function getPropertyValue(property: string | undefined, tableRowData: TableRowData) {
    if (!property) {
        return undefined;
    }
    const pathParts = property.split("/");
    let columnValue = ObjectPath.get(pathParts, tableRowData) as TableRowDataValue | undefined;
    // If the value is not found directly, check if it is a reference
    // and try to resolve it using the context.
    if (columnValue === undefined) {
        for (const part of pathParts) {
            const nestedValue = tableRowData[part];
            if (nestedValue && typeof nestedValue === "object" && "__ref" in nestedValue && tableRowData._context) {
                const refData = (tableRowData._context as Context).getProperty(part) as Record<string, unknown>;
                columnValue = ObjectPath.get(pathParts, refData) as TableRowDataValue | undefined;
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

function formatCellValue(column: ColumnSchema, tableRowData: TableRowData) {
    const valueProperties = Array.isArray(column.property) ? column.property : [column.property];
    if (valueProperties.length === 0) {
        return "";
    }

    switch (column.type) {
        case "Currency": {
            const value = getPropertyValue(valueProperties[0], tableRowData);
            if (typeof value === "number" || typeof value === "string") {
                const unit = getPropertyValue(column.unitProperty, tableRowData)?.toString();
                return NumberFormat.getCurrencyInstance().format(value, unit);
            }
            return "";
        }

        case "Number": {
            const value = getPropertyValue(valueProperties[0], tableRowData);
            if (typeof value === "number" || typeof value === "string") {
                const unit = column.unitProperty
                    ? getPropertyValue(column.unitProperty, tableRowData)?.toString()
                    : undefined;
                return NumberFormat.getUnitInstance().format(value, unit);
            }
            return "";
        }

        case "Date": {
            const value = getPropertyValue(valueProperties[0], tableRowData);
            if (typeof value === "string" || value instanceof Date) {
                return type.date.formatValue(value, "string").toString();
            }
            return "";
        }

        case "DateTime": {
            const value = getPropertyValue(valueProperties[0], tableRowData);
            if (typeof value === "string" || value instanceof Date) {
                return type.dateTimeOffset.formatValue(value, "string").toString();
            }
            return "";
        }

        case "Boolean": {
            const value = getPropertyValue(valueProperties[0], tableRowData);
            if (typeof value === "boolean") {
                return type.boolean.formatValue(value, "string").toString();
            }
            return "";
        }

        case "String":
        default: {
            const values = valueProperties.map((property) => getPropertyValue(property, tableRowData) ?? "");
            if (values.some((value) => value)) {
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
export function renderMarkdownTable(columns: ColumnSchema[], tableData: TableRowData[]): string {
    const prepareTableRow = (columns: ColumnSchema[], tableRowData: TableRowData) =>
        columns.map((column) => formatCellValue(column, tableRowData));

    const headers = columns.map((column) => column.label || "");
    const rows = tableData.map((row) => prepareTableRow(columns, row));

    return generateMarkdownTable(headers, rows);
}
