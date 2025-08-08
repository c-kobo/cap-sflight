"use strict";

sap.ui.define([], function () {
  "use strict";

  /**
   * Get the model version of the given model.
   *
   * @param model The model to get the version for
   * @returns The model version
   */
  function getModelVersion(model) {
    return model.getMetadata().getName();
  }
  var __exports = {
    __esModule: true
  };
  __exports.getModelVersion = getModelVersion;
  return __exports;
});
//# sourceMappingURL=model-dbg.js.map
