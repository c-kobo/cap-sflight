declare module "ux/eng/fioriai/reuse/summary/section/section" {
    import TreeItemBase from "sap/m/TreeItemBase";
    import type CoreEvent from "sap/ui/base/Event";
    import View from "sap/ui/core/mvc/View";
    import JSONModel from "sap/ui/model/json/JSONModel";
    import ObjectPageLayout from "sap/uxap/ObjectPageLayout";
    import type ObjectPageSection from "sap/uxap/ObjectPageSection";
    import ObjectPageSubSection from "sap/uxap/ObjectPageSubSection";
    import type { Direction, SectionTree } from "ux/eng/fioriai/reuse/summary/types";
    /**
     * Gets the sections from the view.
     *
     * @param objectPage The view instance.
     * @returns An array of ObjectPageSection objects.
     */
    function getSections(objectPage: ObjectPageLayout): ObjectPageSection[];
    /**
     * Retrieves the headings from a DOM reference.
     *
     * @param domRef The DOM reference to retrieve the headings from.
     * @param selectors An array of CSS selectors to find headings.
     * @returns An array of elements representing the headings, or undefined if no headings are found.
     */
    function getHeadingsFromDomRef(domRef: Element, selectors: string[]): Element[] | undefined;
    /**
     *
     * @param element The HTMLElement to find the topmost parent for.
     * This function traverses the DOM tree upwards from the given element,
     * looking for the topmost parent element that has an id containing the same id prefix
     * @returns If no such parent is found, it returns the original element.
     */
    function findTopmostParentByIdPrefixSeparator(element: HTMLElement): HTMLElement;
    /**
     * Determine DOM elements and their corresponding headings for subsection headers.
     *
     * @param subSectionHeadings An array or NodeList of subsection headers.
     * @param subSectionDomRef The DOM reference to retrieve the elements from.
     * @param nodes An array of SectionTree objects to store the retrieved elements.
     */
    function getElementsForHeadings(subSectionHeadings: Element[], subSectionDomRef: Element, nodes: SectionTree[]): void;
    /**
     * Retrieves the headers of the sub-sections within an ObjectPageSubSection.
     *
     * @param subSection The ObjectPageSubSection from which to retrieve the headers.
     * @param nodes An array of SectionTree objects to store the retrieved headers.
     */
    function getSubSectionHeaders(subSection: ObjectPageSubSection, nodes: SectionTree[]): void;
    /**
     *
     * @param domRef dom reference of current section
     * @param selectors selectors to identify the section type
     * @returns heading placeholder for the section
     */
    function getHeadingPlaceholderFromDomRef(domRef: Element, selectors: {
        key: string;
        value: string;
    }[]): string;
    /**
     * Retrieves the title of a section.
     * A placeholder is returned in case no title is found.
     *
     * @param section The ObjectPageSection from which to retrieve the title.
     * @returns The title of the section.
     */
    function getSectionTitle(section: ObjectPageSection): string;
    /**
     * Creates a section tree based on the provided sections.
     *
     * @param view The view instance.
     * @returns An object containing the section tree and total count.
     */
    function createSectionTree(view: View): {
        sectionTree: SectionTree[];
        selectCount: number;
        totalCount: number;
    };
    /**
     * Sets the selection of a tree item and its children recursively.
     *
     * @param model The JSONModel instance.
     * @param treeItem The TreeItemBase instance.
     * @param path The path of the tree item.
     * @param selected The selection state to set.
     * @param direction The direction of the selection (optional).
     */
    function setSelection(model: JSONModel, treeItem: TreeItemBase, path: string, selected: boolean, direction?: Direction): void;
    /**
     * Sets the selection state of the sections based on the current section tree.
     * This determines the select all checkbox selection state based on the following rules:
     * - If all sections are selected, the partially selected state is false and the all selected state is true.
     * - If at least one section is selected, the partially selected state is true and the all selected state is true.
     * - If no sections are selected, the partially selected state is false and the all selected state is false.
     *
     * @param model The JSONModel instance.
     */
    function setSelectionState(model: JSONModel): void;
    /**
     * Handles the selection change event.
     *
     * @param selectedItems The selected items.
     * @param model The JSONModel instance.
     */
    function selectionChange(selectedItems: TreeItemBase[], model: JSONModel): void;
    /**
     * Selects or deselects all sections based on the provided event.
     *
     * @param event The event containing the selected state.
     * @param model The JSONModel instance.
     */
    function selectAllSections(event: CoreEvent<{
        selected: boolean;
    }>, model: JSONModel): void;
    /**
     * Filters the section tree based on the provided selection state.
     *
     * @param model The JSONModel instance.
     * @param selectionState The selection state to filter on.
     * @param withNodes Whether to include section nodes in the result (optional).
     * @returns An array of SectionTree objects corresponding to the provided selection state.
     */
    function getSelectedSections(model: JSONModel, selectionState: boolean, withNodes?: boolean): SectionTree[];
    /**
     * Determines if any blocks within the given subsection have a binding context.
     *
     * @param subSection The subsection to check for blocks with binding contexts.
     * @returns True if at least one block has a binding context, otherwise false.
     */
    function subSectionBindingExists(subSection: ObjectPageSubSection): boolean;
    /**
     * Processes lazy-loaded sections by connecting them to models and resolving the promise when the UI updates are complete.
     *
     * @param view The view instance.
     * @param lazyLoadSections An array of ObjectPageSubSection objects to process.
     * @param model The JSONModel instance.
     * @param fnResolve The function to resolve the promise.
     * @param checkUIUpdated The function to check for UI updates.
     */
    function processLazyLoadSections(view: View, lazyLoadSections: ObjectPageSubSection[], model: JSONModel, fnResolve: () => void, checkUIUpdated: (event: CoreEvent) => void): void;
    /**
     * Unstashes sections in the given model and updates the UI accordingly.
     *
     * @param model  The JSON model containing the sections and view properties
     * @returns A promise that resolves when the sections are unstashed and the UI is updated
     *
     * The function performs the following steps:
     * 1. Sets the busy state of the section dialog.
     * 2. Retrieves the view and object page layout from the model.
     * 3. Filters and processes the selected sections from the section tree dialog.
     * 4. Identifies lazy-loaded sections and connects them to models if necessary.
     * 5. Sets up a promise to resolve when the UI updates are complete.
     * 6. Observes the DOM for changes and checks for busy indicators to determine when the operation is complete.
     * 7. Handles special cases for V2 smart tables by attaching to the `beforeRebindTable` event.
     * 8. Resolves the promise when all sections are unstashed and the UI is updated.
     *
     * @throws If the operation is cancelled by the user.
     */
    function unstashSections(model: JSONModel): Promise<void>;
}
//# sourceMappingURL=section.d.ts.map