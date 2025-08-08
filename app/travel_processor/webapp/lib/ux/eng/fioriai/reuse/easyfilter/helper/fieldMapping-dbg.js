"use strict";

sap.ui.define([], function () {
  "use strict";

  /**
   * Transforms filter metadata fields into a more accessible format by creating simplified field keys.
   *
   * This utility strips entity set prefixes from field names to create cleaner, shorter keys while preserving the ability
   * to map back to original field names when needed.
   *
   * The mapping is guaranteed to be bijective because entity-prefixed fields (e.g., "/Customer/Name") never start with a "$",
   * while virtual fields (e.g., "$editState") always start with a "$". This ensures that shortened keys never collide with virtual fields.
   *
   * @example
   * Given fields: ["/Customer/Name", "/Customer/ID", "$editState"]
   * With entitySet: "/Customer/"
   * Returns:
   *  - fieldsByKey: { "Name": {...}, "ID": {...}, "$editState": {...} }
   *  - originalFieldNames: { "Name": "/Customer/Name", "ID": "/Customer/ID", "$editState": "$editState" }
   *
   * @template T The type of the transformed field data
   * @param metadata Filter metadata containing fields and optional entitySet prefix
   * @param fieldTransformer Function to transform each field into the desired format
   * @returns Object containing the transformed fields and reverse mapping to original names
   */
  function createFieldMappingWithSimplifiedKeys(metadata, fieldTransformer) {
    const fieldsByKey = {};
    const originalFieldNames = {};
    for (const field of metadata.fields) {
      const simplifiedKey = removeEntitySetPrefix(field.name, metadata.entitySet);
      fieldsByKey[simplifiedKey] = fieldTransformer(field);
      originalFieldNames[simplifiedKey] = field.name;
    }
    return {
      fieldsByKey,
      originalFieldNames
    };
  }

  /**
   * Removes entity set prefix from a field name if present.
   *
   * @param fieldName The original field name
   * @param entitySet The entity set prefix to remove
   * @returns The field name with prefix removed, or original name if no prefix matches
   */
  function removeEntitySetPrefix(fieldName, entitySet) {
    if (entitySet && fieldName.startsWith(entitySet)) {
      return fieldName.slice(entitySet.length);
    }
    return fieldName;
  }
  var __exports = {
    __esModule: true
  };
  __exports.createFieldMappingWithSimplifiedKeys = createFieldMappingWithSimplifiedKeys;
  return __exports;
});
//# sourceMappingURL=fieldMapping-dbg.js.map
