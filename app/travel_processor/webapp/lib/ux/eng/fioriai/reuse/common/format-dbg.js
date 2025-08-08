"use strict";

sap.ui.define([], function () {
  "use strict";

  /**
   * Removes leading and trailing Markdown code block delimiters from the given value.
   *
   * @param value The value to transform.
   * @returns The value without leading and trailing Markdown code block delimiters.
   */
  function extractFromMarkdown(value) {
    const match = value.match(/```(?:\w+)?\n([\s\S]+)\n```/);
    return match ? match[1] : value;
  }

  /**
   * Generates a Markdown table from the given headers and rows.
   *
   * @param headers Column headers.
   * @param rows Rows of the table. If a row has fewer elements than the headers, the missing elements are filled with an empty string. If a row has more elements than the headers, the extra elements are ignored.
   * @returns The Markdown table.
   */
  function generateMarkdownTable(headers, rows) {
    if (headers.length === 0) {
      return "";
    }
    const escapeSpecialCharacters = value => value
    // eslint-disable-next-line fiori-custom/sap-no-hardcoded-color -- false positive
    .replaceAll("|", "&#124;") // column separator
    .replaceAll("\n", "<br>"); // line break

    return [`|${headers.map(escapeSpecialCharacters).join("|")}|`, `|${headers.map(() => "-").join("|")}|`, ...rows.map(row => `|${headers.map((_, index) => escapeSpecialCharacters(row[index] ?? "")).join("|")}|`)].join("\n");
  }
  var __exports = {
    __esModule: true
  };
  __exports.extractFromMarkdown = extractFromMarkdown;
  __exports.generateMarkdownTable = generateMarkdownTable;
  return __exports;
});
//# sourceMappingURL=format-dbg.js.map
