declare module "ux/eng/fioriai/reuse/summary/extraction/extraction" {
    import Element from "sap/ui/core/Element";
    import type View from "sap/ui/core/mvc/View";
    /**
     * Get the UI5 element from the given node.
     *
     * @param node node to get the UI5 element from
     * @returns - UI5 element if exists, otherwise undefined
     */
    function getUi5Element(node: Node): Element | undefined;
    /**
     * Find the UI5 element from the given node. It traverses the
     * parent nodes to find the UI5 element.
     *
     * @param node node to get the UI5 element from
     * @returns - UI5 element if exists, otherwise undefined
     */
    function findUi5Element(node: Node | null): Element | undefined;
    /**
     * Similar to HTMLElement.innerText, but also includes the value of input elements.
     *
     * @param node start node to get the inner text
     * @returns string representation of the inner text
     */
    function getInnerTextFromNode(node: Node): string;
    /**
     * Check if the node has any parent in the parents set.
     *
     * @param node node to check if it has any parent in the parents set
     * @param parents the parents set to check if the node has any parent in it
     * @returns true if the node has any parent in the parents set, otherwise false
     */
    function hasParent(node: Node, parents: Set<Node>): boolean;
    /**
     * Map to enhance the text of the nodes.
     */
    const textEnhancementMap: {
        [key: string]: {
            prefix: string;
            suffix: string;
        };
    };
    interface NodeWithText {
        node: Node;
        text: string;
    }
    /**
     * Returns a TreeWalker to traverse HTML nodes that may contain text.
     *
     * @param rootNode The root HTML node to start the search from.
     * @param excludedNodes nodes that are deselected.
     * @returns TreeWalker to traverse nodes
     */
    function getNodesWithTextTreeWalker(rootNode: Node, excludedNodes: Set<string>): TreeWalker;
    /**
     * Collects all nodes with text from the given root node.
     *
     * @param rootNode The root HTML node to start the search from.
     * @param excludedNodes nodes that are deselected.
     * @returns - List of nodes with text.
     */
    function getNodesWithText(rootNode: Node, excludedNodes: Set<string>): Promise<NodeWithText[]>;
    /**
     * Handles a UI5 element node by extracting text from it using a type-specific text handler.
     * If the text is successfully extracted, it adds the node and text to the nodesWithText array.
     * If the element is processed, it adds the node to the processedParents set.
     *
     * @param node  The UI5 element node to handle.
     * @param nodesWithText  An array to store nodes with their associated text.
     * @param processedParents  A set to keep track of processed parent nodes.
     * @returns A promise that resolves to a boolean indicating whether the element was processed.
     */
    function handleUi5Element(node: Node, nodesWithText: NodeWithText[], processedParents: Set<Node>): Promise<boolean>;
    /**
     * Enhances the text content of a given node and adds it to the list of nodes with text.
     *
     * @param node  The DOM node to process for text enhancement.
     * @param nodesWithText  An array to store nodes that contain text.
     * @param processedParents  A set to keep track of nodes that have been processed.
     */
    function handleTextEnhancement(node: Node, nodesWithText: NodeWithText[], processedParents: Set<Node>): void;
    /**
     * List of UI5 elements to skip from summarization.
     */
    const ui5SkipList: Set<string>;
    interface SkipPartsForElement {
        parentToSkip?: string[];
        classToSkip?: string[];
    }
    /**
     * Map to skip specific UI5 elements based on their parent and/or style classes.
     * If UI5 element is not a control, style classes will be ignore.
     *
     * For example: skip specific `sap.m.Title` only if it is a child of `sap.ui.layout.HorizontalLayout`
     * and has style class `sapMVarMngmtClickable` or `sapMVarMngmtTitle`.
     * Others `sap.m.Title` will not be skipped.
     */
    const ui5SpecificSkipList: Map<string, SkipPartsForElement>;
    /**
     * Check if an element is being skipped from summarization.
     *
     * For an element is in `ui5SkipList`, it checks if the element is on the list.
     * For an element is in `ui5SpecificSkipList`, it checks if its parent and/or style classes match skip criteria.
     *
     * @param element element to check if it exists in the skip list
     * @param elementMetadataName metadata name of the element
     * @returns `true` if element is being skipped, otherwise `false`
     */
    function isSkipping(element: Element, elementMetadataName: string): boolean;
    /**
     * Map to convert UI5 elements to a more readable node name.
     */
    const nodeNameMap: {
        [key: string]: string;
    };
    /**
     * Converts the nodes with text to a string.
     *
     * @param nodesWithText HTML nodes with text.
     * @returns string representation of the nodes with text.
     */
    function stringifyNodesWithText(nodesWithText: NodeWithText[]): string;
    /**
     * Returns the text to summarize from a given control.
     *
     * @param view root UI5 control to get content from.
     * @param excludedNodes sections that are deselected.
     * @returns content to summarize.
     */
    function getTextToSummarize(view: View, excludedNodes?: Set<string>): Promise<string>;
}
//# sourceMappingURL=extraction.d.ts.map