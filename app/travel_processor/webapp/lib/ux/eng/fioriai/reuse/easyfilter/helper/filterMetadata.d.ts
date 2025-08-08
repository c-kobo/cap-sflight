declare module "ux/eng/fioriai/reuse/easyfilter/helper/filterMetadata" {
    import { EasyFilterMetadata, PropertyMetadata } from "ux/eng/fioriai/reuse/easyfilter/EasyFilter";
    /**
     * Filter the fields of the metadata.
     *
     * @param metadata Metadata to filter.
     * @param fieldFilter The filter function to apply to the fields.
     * @returns The filtered metadata.
     */
    export default function filterMetadata(metadata: EasyFilterMetadata, fieldFilter: (field: PropertyMetadata) => boolean | undefined): EasyFilterMetadata;
}
//# sourceMappingURL=filterMetadata.d.ts.map