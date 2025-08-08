"use strict";

sap.ui.define(["sap/ui/core/Control", "sap/ui/core/Element", "ux/eng/fioriai/reuse/common/log", "./type-specific"], function (Control, Element, __Log, ___type_specific) {
  "use strict";

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule && typeof obj.default !== "undefined" ? obj.default : obj;
  }
  const Log = _interopRequireDefault(__Log);
  const getTypeSpecificTextHandler = ___type_specific["getTypeSpecificTextHandler"];
  /**
   * Get the UI5 element from the given node.
   *
   * @param node node to get the UI5 element from
   * @returns - UI5 element if exists, otherwise undefined
   */
  function getUi5Element(node) {
    let ui5Element;
    if (node instanceof HTMLElement) {
      const ui5id = node.getAttribute("data-sap-ui") ?? node.id;
      ui5Element = Element.getElementById(ui5id);
    }
    return ui5Element;
  }

  /**
   * Find the UI5 element from the given node. It traverses the
   * parent nodes to find the UI5 element.
   *
   * @param node node to get the UI5 element from
   * @returns - UI5 element if exists, otherwise undefined
   */
  function findUi5Element(node) {
    let currentNode = node;
    while (currentNode) {
      const ui5Element = getUi5Element(currentNode);
      if (ui5Element) {
        return ui5Element;
      }
      currentNode = currentNode.parentElement;
    }
    return undefined;
  }

  /**
   * Similar to HTMLElement.innerText, but also includes the value of input elements.
   *
   * @param node start node to get the inner text
   * @returns string representation of the inner text
   */
  function getInnerTextFromNode(node) {
    const texts = [];
    const nodes = document.createTreeWalker(node, NodeFilter.SHOW_ALL);
    let currentNode;
    while (currentNode = nodes.nextNode()) {
      const text = currentNode instanceof HTMLInputElement ? currentNode.value : currentNode.nodeValue;
      if (text) {
        texts.push(text);
      }
    }
    return texts.join(" ");
  }

  /**
   * Check if the node has any parent in the parents set.
   *
   * @param node node to check if it has any parent in the parents set
   * @param parents the parents set to check if the node has any parent in it
   * @returns true if the node has any parent in the parents set, otherwise false
   */
  function hasParent(node, parents) {
    let currentNode = node;
    while (currentNode) {
      if (parents.has(currentNode)) {
        return true;
      }
      currentNode = currentNode.parentElement;
    }
    return false;
  }

  /**
   * Map to enhance the text of the nodes.
   */
  const textEnhancementMap = {
    "H1": {
      prefix: "\n# ",
      suffix: "\n"
    },
    "H2": {
      prefix: "\n## ",
      suffix: "\n"
    },
    "H3": {
      prefix: "\n### ",
      suffix: "\n"
    },
    "H4": {
      prefix: "\n#### ",
      suffix: "\n"
    },
    "H5": {
      prefix: "\n##### ",
      suffix: "\n"
    },
    "H6": {
      prefix: "\n###### ",
      suffix: "\n"
    },
    "LABEL": {
      prefix: "",
      suffix: ": "
    }
  };
  /**
   * Returns a TreeWalker to traverse HTML nodes that may contain text.
   *
   * @param rootNode The root HTML node to start the search from.
   * @param excludedNodes nodes that are deselected.
   * @returns TreeWalker to traverse nodes
   */
  function getNodesWithTextTreeWalker(rootNode, excludedNodes) {
    return document.createTreeWalker(rootNode, NodeFilter.SHOW_ALL, excludedNodes.size > 0 ? node => {
      const nodeId = node.id ?? "";
      if (nodeId && excludedNodes.has(nodeId)) {
        return NodeFilter.FILTER_REJECT;
      }
      return NodeFilter.FILTER_ACCEPT;
    } : undefined);
  }

  /**
   * Collects all nodes with text from the given root node.
   *
   * @param rootNode The root HTML node to start the search from.
   * @param excludedNodes nodes that are deselected.
   * @returns - List of nodes with text.
   */
  async function getNodesWithText(rootNode, excludedNodes) {
    const nodesWithText = [];
    const nodes = getNodesWithTextTreeWalker(rootNode, excludedNodes);
    const processedParents = new Set();
    let node;
    while (node = nodes.nextNode()) {
      if (hasParent(node, processedParents)) {
        continue;
      }
      /**
       * Step 1
       * Check if the node has a referenced UI5 element and if specific extractor exists for the UI5
       * metadata name. If yes call specific extractor and add resulting text to summary. This is
       * independent of the inner text of the node. Inner text is extracted afterwards.
       * if the complete text extraction for a specific UI5 element type was handled,
       * the node is added to processedParents and 'continue' after step 1.
       */
      if (await handleUi5Element(node, nodesWithText, processedParents)) {
        continue;
      }

      /**
       * Step 2
       * Check if text enhancement exists for the node. Enhancements exists for nodes like H1, H2, etc.
       * and are used to add prefix and suffix to the inner text of the node (done later). For nodes
       * with enhancements, the inner text is extracted and the node is added to processedParents. This
       * is required to properly handle nested HTML structures, like <H1>Header with <B>bold</B> text</H1>.
       * If no enhancement exists, the text is the inner text of the node with special handling for
       * input fields (value instead of nodeValue).
       */
      handleTextEnhancement(node, nodesWithText, processedParents);
    }
    return nodesWithText;
  }

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
  async function handleUi5Element(node, nodesWithText, processedParents) {
    const ui5Element = getUi5Element(node);
    if (ui5Element) {
      const typeSpecificTextHandler = getTypeSpecificTextHandler(ui5Element);
      if (typeof typeSpecificTextHandler === "function") {
        const additionalText = await typeSpecificTextHandler(ui5Element);
        if (additionalText && typeof additionalText.text === "string") {
          nodesWithText.push({
            node,
            text: additionalText.text
          });
          if (additionalText.elementProcessed) {
            processedParents.add(node);
            return true;
          }
        }
      }
    }
    return false;
  }

  /**
   * Enhances the text content of a given node and adds it to the list of nodes with text.
   *
   * @param node  The DOM node to process for text enhancement.
   * @param nodesWithText  An array to store nodes that contain text.
   * @param processedParents  A set to keep track of nodes that have been processed.
   */
  function handleTextEnhancement(node, nodesWithText, processedParents) {
    let text;
    if (textEnhancementMap[node.nodeName]) {
      const innerText = getInnerTextFromNode(node);
      if (innerText) {
        processedParents.add(node);
        text = innerText;
      }
    } else {
      text = node instanceof HTMLInputElement ? node.value : node.nodeValue;
    }
    if (text) {
      nodesWithText.push({
        node: node,
        text
      });
    }
  }

  /**
   * List of UI5 elements to skip from summarization.
   */
  const ui5SkipList = new Set(["sap.ui.core.InvisibleText", "sap.m.Button", "sap.uxap.AnchorBar", "sap.m.ToggleButton", "sap.uxap.ObjectPageHeaderActionButton", "sap.m.OverflowToolbarButton", "sap.m.SplitButton", "sap.m.IconTabFilter", "sap.m.RadioButton"]);
  /**
   * Map to skip specific UI5 elements based on their parent and/or style classes.
   * If UI5 element is not a control, style classes will be ignore.
   *
   * For example: skip specific `sap.m.Title` only if it is a child of `sap.ui.layout.HorizontalLayout`
   * and has style class `sapMVarMngmtClickable` or `sapMVarMngmtTitle`.
   * Others `sap.m.Title` will not be skipped.
   */
  const ui5SpecificSkipList = new Map([["sap.m.Title", {
    parentToSkip: ["sap.ui.layout.HorizontalLayout"],
    classToSkip: ["sapMVarMngmtClickable", "sapMVarMngmtTitle"]
  }], ["sap.ui.core.HTML", {
    parentToSkip: ["sap.m.CustomListItem"]
  }]]);

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
  function isSkipping(element, elementMetadataName) {
    if (ui5SkipList.has(elementMetadataName)) {
      return true;
    }
    const skipParts = ui5SpecificSkipList.get(elementMetadataName);
    if (!skipParts) {
      return false;
    }
    const parentElement = element.getParent();
    const parentControlMetadataName = parentElement?.getMetadata().getName() ?? "";
    const parentFlag = skipParts.parentToSkip?.includes(parentControlMetadataName) ?? false;
    if (element instanceof Control) {
      const classFlag = skipParts.classToSkip?.some(className => element.hasStyleClass(className)) ?? false;
      return skipParts.parentToSkip && skipParts.classToSkip ? parentFlag && classFlag : parentFlag || classFlag;
    } else {
      // if the element is not a control, it will not have style classes, therefore only consider `parentFlag`
      return parentFlag;
    }
  }

  /**
   * Map to convert UI5 elements to a more readable node name.
   */
  const nodeNameMap = {
    "sap.m.Label": "LABEL",
    "sap.ui.comp.smartfield.SmartLabel": "LABEL",
    "sap.fe.macros.controls.Section": "H3",
    "sap.uxap.ObjectPageSection": "H3",
    "sap.uxap.ObjectPageSubSection": "H4"
  };

  /**
   * Converts the nodes with text to a string.
   *
   * @param nodesWithText HTML nodes with text.
   * @returns string representation of the nodes with text.
   */
  function stringifyNodesWithText(nodesWithText) {
    const texts = [];
    for (const {
      node,
      text
    } of nodesWithText) {
      const ui5Element = findUi5Element(node);
      if (ui5Element) {
        const ui5MetadataName = ui5Element.getMetadata().getName();
        if (isSkipping(ui5Element, ui5MetadataName)) {
          continue;
        }
        const nodeName = nodeNameMap[ui5MetadataName] ?? node.nodeName;
        const {
          prefix,
          suffix
        } = textEnhancementMap[nodeName] ?? {
          prefix: "",
          suffix: ""
        };
        texts.push(`${prefix}${text}${suffix}`);
      }
    }
    return texts.join("\n");
  }

  /**
   * Returns the text to summarize from a given control.
   *
   * @param view root UI5 control to get content from.
   * @param excludedNodes sections that are deselected.
   * @returns content to summarize.
   */
  async function getTextToSummarize(view, excludedNodes = new Set()) {
    let text = view.getDomRef().innerText;
    try {
      const nodeWithText = await getNodesWithText(view.getDomRef(), excludedNodes);
      text = stringifyNodesWithText(nodeWithText);
    } catch (error) {
      Log.warning("Error while extracting text to summarize", error);
      // Fallback to innerText
    }
    return text;
  }
  var __exports = {
    __esModule: true
  };
  __exports.getUi5Element = getUi5Element;
  __exports.getTextToSummarize = getTextToSummarize;
  return __exports;
});
//# sourceMappingURL=extraction-dbg.js.map
