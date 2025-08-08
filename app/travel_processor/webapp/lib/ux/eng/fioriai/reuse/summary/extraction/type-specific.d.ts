declare module "ux/eng/fioriai/reuse/summary/extraction/type-specific" {
    import Element from "sap/ui/core/Element";
    import type { TypeSpecificTextHandler } from "ux/eng/fioriai/reuse/summary/types";
    /**
     * Map to handle UI5 type specific texts that are added to the summarization.
     * Access is done through a map UI5 metadata name -> type specific text function with:
     *
     * @param element The UI5 element.
     * @returns - Additional text to be added to the summarization, undefined if no additional text exists.
     */
    const typeSpecificTextMap: Map<string, TypeSpecificTextHandler>;
    /**
     * Returns the type specific text handler for the given UI5 element if exists.
     *
     * @param element UI5 element
     * @returns type specific text handler if exists, otherwise undefined
     */
    function getTypeSpecificTextHandler(element: Element): TypeSpecificTextHandler | undefined;
}
//# sourceMappingURL=type-specific.d.ts.map