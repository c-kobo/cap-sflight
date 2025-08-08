import { CodeList, PropertyMetadata } from "ux/eng/fioriai/reuse/easyfilter/EasyFilter";

async function getCodeList(property: PropertyMetadata) {
    if (typeof property.codeList === "function") {
        property.codeList = await property.codeList();
    }
    return property.codeList;
}

/**
 * Get the code lists for properties.
 *
 * This function requests code lists if they are not available yet.
 *
 * @param properties The properties to get the code lists for
 * @returns The code lists for the properties
 */
export async function getCodeLists(properties: PropertyMetadata[]): Promise<(CodeList | undefined)[]> {
    return Promise.all(properties.map(getCodeList));
}

/**
 * Check if a code list is initialized.
 *
 * A code list can either be an array, in which case it is considered initialized, or a function that can be
 * called to initialize it.
 *
 * @param codeList The code list to check
 * @returns True if the code list is initialized, false otherwise
 */
export function isCodeListInitialized(
    codeList: CodeList | (() => Promise<CodeList>) | undefined
): codeList is CodeList {
    return codeList !== undefined && typeof codeList !== "function";
}

export function getCodeListMap(codeList: undefined): undefined;
export function getCodeListMap(codeList: CodeList): Record<string | number, string>;
export function getCodeListMap(
    codeList: CodeList | (() => Promise<CodeList>)
): Record<string | number, string> | "PENDING";
/**
 * Get a map of code list entries for a property.
 *
 * @param codeList The code list or a function that returns the code list for the property.
 * @returns A record mapping code list values to their descriptions, or "PENDING" if the code list is not loaded yet.
 */
export function getCodeListMap(
    codeList: CodeList | (() => Promise<CodeList>) | undefined
): Record<string | number, string> | "PENDING" | undefined {
    if (!codeList) {
        return undefined;
    }

    if (typeof codeList === "function") {
        return "PENDING";
    }

    return Object.fromEntries(codeList.map((entry) => [entry.value, entry.description || ""]));
}
