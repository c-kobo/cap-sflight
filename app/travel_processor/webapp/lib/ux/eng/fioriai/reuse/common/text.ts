import ResourceBundle from "sap/base/i18n/ResourceBundle";
import Lib from "sap/ui/core/Lib";

/**
 * Get the library's resource bundle.
 *
 * @returns The resource bundle
 */
export function getLibraryResourceBundle(): ResourceBundle {
    return Lib.getResourceBundleFor("ux.eng.fioriai.reuse")!;
}

/**
 * Get a text from the library's resource bundle in the current locale.
 *
 * @param key The key of the text
 * @param args The arguments to replace in the text
 * @returns The text, or the key if the text is not found
 */
export function getText(key: string, args?: unknown[]): string {
    return getLibraryResourceBundle().getText(key, args);
}
