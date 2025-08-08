declare module "ux/eng/fioriai/reuse/easyfilter/helper/fieldMapping" {
    import { EasyFilterMetadata, PropertyMetadata } from "ux/eng/fioriai/reuse/easyfilter/EasyFilter";
    type FieldMapping<T> = {
        /** Fields indexed by simplified keys (with entity prefix removed) */
        fieldsByKey: Record<string, T>;
        /** Maps simplified keys back to their original field names */
        originalFieldNames: Record<string, string>;
    };
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
    function createFieldMappingWithSimplifiedKeys<T>(metadata: EasyFilterMetadata, fieldTransformer: (field: PropertyMetadata) => T): FieldMapping<T>;
    /**
     * Removes entity set prefix from a field name if present.
     *
     * @param fieldName The original field name
     * @param entitySet The entity set prefix to remove
     * @returns The field name with prefix removed, or original name if no prefix matches
     */
    function removeEntitySetPrefix(fieldName: string, entitySet?: string): string;
}
//# sourceMappingURL=fieldMapping.d.ts.map