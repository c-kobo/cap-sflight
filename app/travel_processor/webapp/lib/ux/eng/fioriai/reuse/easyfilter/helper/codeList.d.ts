declare module "ux/eng/fioriai/reuse/easyfilter/helper/codeList" {
    import { CodeList, PropertyMetadata } from "ux/eng/fioriai/reuse/easyfilter/EasyFilter";
    function getCodeList(property: PropertyMetadata): Promise<CodeList>;
    /**
     * Get the code lists for properties.
     *
     * This function requests code lists if they are not available yet.
     *
     * @param properties The properties to get the code lists for
     * @returns The code lists for the properties
     */
    function getCodeLists(properties: PropertyMetadata[]): Promise<(CodeList | undefined)[]>;
    /**
     * Check if a code list is initialized.
     *
     * A code list can either be an array, in which case it is considered initialized, or a function that can be
     * called to initialize it.
     *
     * @param codeList The code list to check
     * @returns True if the code list is initialized, false otherwise
     */
    function isCodeListInitialized(codeList: CodeList | (() => Promise<CodeList>) | undefined): codeList is CodeList;
    function getCodeListMap(codeList: undefined): undefined;
    function getCodeListMap(codeList: CodeList): Record<string | number, string>;
    function getCodeListMap(codeList: CodeList | (() => Promise<CodeList>)): Record<string | number, string> | "PENDING";
}
//# sourceMappingURL=codeList.d.ts.map