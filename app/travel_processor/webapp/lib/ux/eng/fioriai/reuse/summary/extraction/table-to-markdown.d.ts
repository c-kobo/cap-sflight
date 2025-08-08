declare module "ux/eng/fioriai/reuse/summary/extraction/table-to-markdown" {
    import { ColumnSchema, TableRowData, TableRowDataValue } from "ux/eng/fioriai/reuse/summary/types";
    function getPropertyValue(property: string | undefined, tableRowData: TableRowData): TableRowDataValue;
    const type: {
        date: any;
        dateTimeOffset: any;
        boolean: any;
    };
    function formatCellValue(column: ColumnSchema, tableRowData: TableRowData): any;
    /**
     * Renders a Markdown table from the given columns and table data.
     *
     * @param columns The schema of the table columns.
     * @param tableData The data for the table rows.
     * @returns The markdown string representing the table.
     */
    function renderMarkdownTable(columns: ColumnSchema[], tableData: TableRowData[]): string;
}
//# sourceMappingURL=table-to-markdown.d.ts.map