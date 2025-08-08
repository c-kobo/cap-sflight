declare module "ux/eng/fioriai/reuse/common/format" {
    /**
     * Removes leading and trailing Markdown code block delimiters from the given value.
     *
     * @param value The value to transform.
     * @returns The value without leading and trailing Markdown code block delimiters.
     */
    function extractFromMarkdown(value: string): string;
    /**
     * Generates a Markdown table from the given headers and rows.
     *
     * @param headers Column headers.
     * @param rows Rows of the table. If a row has fewer elements than the headers, the missing elements are filled with an empty string. If a row has more elements than the headers, the extra elements are ignored.
     * @returns The Markdown table.
     */
    function generateMarkdownTable(headers: string[], rows: string[][]): string;
}
//# sourceMappingURL=format.d.ts.map