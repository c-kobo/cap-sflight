"use strict";

sap.ui.define(["ux/eng/fioriai/reuse/easyfill/ProcessFieldExtraction", "ux/eng/fioriai/reuse/languagemodel/ODataCompletion"], function (__ux_eng_fioriai_reuse_easyfill_ProcessFieldExtraction, __ux_eng_fioriai_reuse_languagemodel_ODataCompletion) {
  "use strict";

  const processFieldExtraction = __ux_eng_fioriai_reuse_easyfill_ProcessFieldExtraction["processFieldExtraction"];
  const createODataCompletionFunction = __ux_eng_fioriai_reuse_languagemodel_ODataCompletion["createODataCompletionFunction"];
  /**
   * Field metadata for extraction configuration.
   */
  /**
   * Extracted field values requiring runtime type validation.
   */
  // Initialize the AI completion function specific to EasyFill
  const complete = createODataCompletionFunction("EasyFill");

  /**
   * Extracts structured field values from natural language input using AI.
   *
   * @param userInput Natural language text to process
   * @param fieldMetadata Field definitions for extraction
   * @returns Result containing extracted values or error message
   * @example
   * const metadata: FieldMetadata = {
   *   "orderQuantity": { "description": "Quantity of items", "dataType": "number" },
   *   "priority": { "description": "Order priority", "dataType": "string" }
   * };
   *
   * const result = await extractFieldValuesFromText("Set quantity to 100 and make it urgent", metadata);
   * if (result.success) {
   *   // Type validation required for result.data values
   *   console.log("Extracted:", result.data);
   * }
   */
  async function extractFieldValuesFromText(userInput, fieldMetadata) {
    return processFieldExtraction(complete, userInput, fieldMetadata);
  }
  var __exports = {
    __esModule: true
  };
  __exports.extractFieldValuesFromText = extractFieldValuesFromText;
  return __exports;
});
//# sourceMappingURL=EasyFill-dbg.js.map
