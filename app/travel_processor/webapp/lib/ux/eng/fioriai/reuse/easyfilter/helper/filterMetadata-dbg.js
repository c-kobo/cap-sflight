"use strict";

sap.ui.define([], function () {
  "use strict";

  /**
   * Filter the fields of the metadata.
   *
   * @param metadata Metadata to filter.
   * @param fieldFilter The filter function to apply to the fields.
   * @returns The filtered metadata.
   */
  function filterMetadata(metadata, fieldFilter) {
    return {
      ...metadata,
      fields: metadata.fields.filter(fieldFilter)
    };
  }
  return filterMetadata;
});
//# sourceMappingURL=filterMetadata-dbg.js.map
