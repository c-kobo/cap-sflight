import { EasyFilterMetadata } from "ux/eng/fioriai/reuse/easyfilter/EasyFilter";

/**
 * Get the collection name from the EasyFilter metadata.
 *
 * This function sanitizes the collection name by removing non-alphanumeric characters from the beginning and end of the collection name.
 *
 * @param metadata The metadata to get the collection name from
 * @returns The sanitized collection name or "Unknown" if the collection name is not available.
 */
export function getCollectionName(metadata: EasyFilterMetadata) {
    const collectionName = metadata.entitySet?.replace(/(\w)\W+$/, "$1").replace(/^\W+/, "");
    return collectionName ? collectionName : "Unknown";
}
