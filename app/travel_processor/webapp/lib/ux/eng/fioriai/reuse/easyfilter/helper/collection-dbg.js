"use strict";

sap.ui.define([], function () {
  "use strict";

  /**
   * Get the collection name from the EasyFilter metadata.
   *
   * This function sanitizes the collection name by removing non-alphanumeric characters from the beginning and end of the collection name.
   *
   * @param metadata The metadata to get the collection name from
   * @returns The sanitized collection name or "Unknown" if the collection name is not available.
   */
  function getCollectionName(metadata) {
    const collectionName = metadata.entitySet?.replace(/(\w)\W+$/, "$1").replace(/^\W+/, "");
    return collectionName ? collectionName : "Unknown";
  }
  var __exports = {
    __esModule: true
  };
  __exports.getCollectionName = getCollectionName;
  return __exports;
});
//# sourceMappingURL=collection-dbg.js.map
