declare module "ux/eng/fioriai/reuse/common/text" {
    import ResourceBundle from "sap/base/i18n/ResourceBundle";
    /**
     * Get the library's resource bundle.
     *
     * @returns The resource bundle
     */
    function getLibraryResourceBundle(): ResourceBundle;
    /**
     * Get a text from the library's resource bundle in the current locale.
     *
     * @param key The key of the text
     * @param args The arguments to replace in the text
     * @returns The text, or the key if the text is not found
     */
    function getText(key: string, args?: unknown[]): string;
}
//# sourceMappingURL=text.d.ts.map