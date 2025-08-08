"use strict";

sap.ui.define(["sap/ui/core/Element", "sap/ui/core/Rendering", "ux/eng/fioriai/reuse/common/text", "../../common/model", "../../common/types"], function (UI5Element, Rendering, __ux_eng_fioriai_reuse_common_text, ____common_model, ____common_types) {
  "use strict";

  const getText = __ux_eng_fioriai_reuse_common_text["getText"];
  const getModelVersion = ____common_model["getModelVersion"];
  const v2Model = ____common_types["v2Model"];
  /**
   * Gets the sections from the view.
   *
   * @param objectPage The view instance.
   * @returns An array of ObjectPageSection objects.
   */
  function getSections(objectPage) {
    const sections = objectPage.getSections();
    //only consider active section in case of tab based page layout
    return objectPage.getUseIconTabBar() ? sections.filter(section => section.getId() === objectPage.getSelectedSection()) : sections.filter(section => section.getVisible());
  }

  /**
   * Retrieves the headings from a DOM reference.
   *
   * @param domRef The DOM reference to retrieve the headings from.
   * @param selectors An array of CSS selectors to find headings.
   * @returns An array of elements representing the headings, or undefined if no headings are found.
   */
  function getHeadingsFromDomRef(domRef, selectors) {
    const headers = [];
    for (const selector of selectors) {
      if (domRef.querySelectorAll(selector)?.length) {
        Array.from(domRef.querySelectorAll(selector)).forEach(header => headers.push(header));
      }
    }
    return headers.length ? headers : undefined;
  }

  /**
   *
   * @param element The HTMLElement to find the topmost parent for.
   * This function traverses the DOM tree upwards from the given element,
   * looking for the topmost parent element that has an id containing the same id prefix
   * @returns If no such parent is found, it returns the original element.
   */
  function findTopmostParentByIdPrefixSeparator(element) {
    let topmost = null;
    if (element.id.includes("::")) {
      const lastColonIndex = element.id.lastIndexOf("::");
      const idLastPart = element.id.slice(lastColonIndex);
      const dashIndex = idLastPart.indexOf("-");
      let idPrefix;
      if (dashIndex !== -1) {
        idPrefix = element.id.slice(0, lastColonIndex + dashIndex);
        let parent = element.parentElement;
        while (parent) {
          if (parent.id.startsWith(idPrefix)) {
            topmost = parent;
          }
          parent = parent.parentElement;
        }
      }
    }
    // Return the last top most match, or the original element if no match
    return topmost ?? element;
  }

  /**
   * Determine DOM elements and their corresponding headings for subsection headers.
   *
   * @param subSectionHeadings An array or NodeList of subsection headers.
   * @param subSectionDomRef The DOM reference to retrieve the elements from.
   * @param nodes An array of SectionTree objects to store the retrieved elements.
   */
  function getElementsForHeadings(subSectionHeadings, subSectionDomRef, nodes) {
    const selectors = ["::Table", "::LineItem", "::Chart"];
    const skipElementsWithClass = ["sapUxAPObjectPageSubSectionHeader", "sapMIllustratedMessage", "sapMIllustratedMessageMainContent"];

    //filter out subsection headers with no text and those that match the selectors but don't represent a title/header while keeping all others
    //example: "::LineItem-title" is a valid header, "::LineItem::VM" is not
    const filteredHeadings = subSectionHeadings.filter(heading => heading.innerText.length > 0 && !selectors.some(selector => heading.id.includes(selector) && !heading.id.includes(selector + "-title") && !heading.id.includes(selector + "-header")) && selectors.some(selector => !heading.id.includes(selector)));
    const subSectionElements = [];
    for (const heading of filteredHeadings) {
      const headingText = heading.innerText;
      let matchedSelector;
      let parentElement = findTopmostParentByIdPrefixSeparator(heading.parentNode);
      while (parentElement && (!parentElement.id || parentElement.id.endsWith("-header") || Array.from(parentElement.classList).some(cls => skipElementsWithClass.includes(cls)))) {
        parentElement = parentElement.parentNode;
      }
      for (const selector of selectors) {
        //check if headings parent node matches table or chart selector anywhere in id
        if (parentElement.id?.includes(selector)) {
          matchedSelector = selector;
        }
      }
      if (matchedSelector) {
        //determine DOM element of table or chart in section domRef
        const index = parentElement.id.indexOf(matchedSelector);
        const rootElement = subSectionDomRef.querySelector("[id$='" + parentElement.id.slice(0, index + matchedSelector.length) + "']");
        if (rootElement) {
          subSectionElements.push({
            element: rootElement,
            heading: headingText
          });
        }
      }
      //no table or chart found in section -> form, identification or custom section
      else {
        subSectionElements.push({
          element: parentElement,
          heading: headingText
        });
      }
    }
    for (const subSectionElement of subSectionElements) {
      nodes.push({
        sectionID: subSectionElement.element.id,
        sectionName: subSectionElement.heading,
        selected: true,
        nodes: []
      });
    }
  }

  /**
   * Retrieves the headers of the sub-sections within an ObjectPageSubSection.
   *
   * @param subSection The ObjectPageSubSection from which to retrieve the headers.
   * @param nodes An array of SectionTree objects to store the retrieved headers.
   */
  function getSubSectionHeaders(subSection, nodes) {
    const domRef = subSection.getDomRef();
    //check if domRef is available. In case of stashed sections, domRef is not available
    if (domRef === null) {
      return;
    }
    //get headings of sub section from domref
    const subSectionHeadings = getHeadingsFromDomRef(domRef, ["div[id$='-headerTitle']"]) || getHeadingsFromDomRef(domRef, ["H1", "H2", "H3", "H4", "H5", "H6"]);
    if (!subSectionHeadings) {
      return;
    }
    getElementsForHeadings(subSectionHeadings, domRef, nodes);
  }

  /**
   *
   * @param domRef dom reference of current section
   * @param selectors selectors to identify the section type
   * @returns heading placeholder for the section
   */
  function getHeadingPlaceholderFromDomRef(domRef, selectors) {
    for (const selector of selectors) {
      if (domRef.querySelector(selector.value)) {
        return getText(selector.key);
      }
    }
    return getText("SECTION");
  }

  /**
   * Retrieves the title of a section.
   * A placeholder is returned in case no title is found.
   *
   * @param section The ObjectPageSection from which to retrieve the title.
   * @returns The title of the section.
   */
  function getSectionTitle(section) {
    let headerName = section.getTitle();
    //get section header from dom if not available
    if (headerName.length === 0) {
      const domRef = section.getDomRef();
      if (domRef === null) {
        //default placeholder for stashed sections without title
        return getText("SECTION");
      }
      const headings = getHeadingsFromDomRef(domRef, ["div[id$='-headerTitle']"]) || getHeadingsFromDomRef(domRef, ["H1", "H2", "H3"]);
      const heading = headings?.find(heading => heading.innerText.length > 0);
      headerName = heading ? heading.innerText : getHeadingPlaceholderFromDomRef(domRef, [{
        key: "Table",
        value: "div[id*='::table']"
      }, {
        key: "Table",
        value: "div[id*='::Table']"
      }, {
        key: "Form",
        value: "div[id*='::Form']"
      }, {
        key: "Chart",
        value: "div[id*='::Chart']"
      }, {
        key: "Custom",
        value: "div[id*='::CustomSection']"
      }]);
    }
    return headerName;
  }

  /**
   * Creates a section tree based on the provided sections.
   *
   * @param view The view instance.
   * @returns An object containing the section tree and total count.
   */
  function createSectionTree(view) {
    const sectionTree = [];
    const sections = getSections(view.getContent()[0]);
    let totalCount = 0;
    for (const section of sections) {
      totalCount += 1;
      const headerName = getSectionTitle(section);
      const member = {
        sectionID: section.getId(),
        sectionName: headerName,
        selected: true,
        nodes: []
      };
      const subSections = section.getSubSections();
      for (const subSection of subSections) {
        getSubSectionHeaders(subSection, member.nodes);
      }
      //avoid displaying single sub nodes for a section in tree hierarchy
      if (member.nodes.length === 1) {
        member.nodes = [];
      }
      totalCount += member.nodes.length;
      sectionTree.push(member);
    }
    //initially all sections are selected
    const selectCount = totalCount;
    return {
      sectionTree,
      selectCount,
      totalCount
    };
  }

  /**
   * Sets the selection of a tree item and its children recursively.
   *
   * @param model The JSONModel instance.
   * @param treeItem The TreeItemBase instance.
   * @param path The path of the tree item.
   * @param selected The selection state to set.
   * @param direction The direction of the selection (optional).
   */
  function setSelection(model, treeItem, path, selected, direction) {
    model.setProperty(path + "/selected", selected);
    //if the node has children, set the selection of the children
    if (!direction || direction === "DOWN") {
      const nodes = model.getProperty(path + "/nodes");
      if (nodes.length > 0) {
        for (const node of nodes) {
          setSelection(model, treeItem, path + "/nodes/" + nodes.indexOf(node), selected, "DOWN");
        }
      }
    }
    //after setting the selection of the children, check if the parent should be selected
    if (!treeItem.isTopLevel() && (!direction || direction === "UP")) {
      const parent = treeItem.getParentNode();
      if (parent) {
        const parentPath = parent.getItemNodeContext().context.sPath;
        //if the parent is selected and the current node is not selected, deselect the parent
        if (!selected && parent.getSelected()) {
          setSelection(model, parent, parentPath, false, "UP");
          //if the parent is not selected and all its child nodes are selected, select the parent
        } else if (selected && !parent.getSelected()) {
          const parentNodes = model.getProperty(parentPath + "/nodes");
          setSelection(model, parent, parentPath, parentNodes?.every(node => node.selected === true), "UP");
        }
      }
    }
  }

  /**
   * Sets the selection state of the sections based on the current section tree.
   * This determines the select all checkbox selection state based on the following rules:
   * - If all sections are selected, the partially selected state is false and the all selected state is true.
   * - If at least one section is selected, the partially selected state is true and the all selected state is true.
   * - If no sections are selected, the partially selected state is false and the all selected state is false.
   *
   * @param model The JSONModel instance.
   */
  function setSelectionState(model) {
    const sectionTree = model?.getProperty("/sections/sectionTree");
    let selectCount = 0;
    const allSelected = sectionTree.every(section => section.selected);
    //if all sections selected, partially selected is false
    if (allSelected) {
      model.setProperty("/sections/partiallySelected", false);
      model.setProperty("/sections/allSelected", true);
    } else {
      const partiallySelected = sectionTree.some(section => section.selected || section.nodes.some(node => node.selected));
      //if at least one node selected, both partially and all selected are true
      model.setProperty("/sections/partiallySelected", partiallySelected);
      model.setProperty("/sections/allSelected", partiallySelected ? true : allSelected);
    }
    //count selected sections and sub sections
    sectionTree.forEach(section => {
      selectCount += section.selected ? 1 : 0;
      selectCount += section.nodes.filter(node => node.selected).length;
    });
    model.setProperty("/sections/selectCount", selectCount);
  }

  /**
   * Handles the selection change event.
   *
   * @param selectedItems The selected items.
   * @param model The JSONModel instance.
   */
  function selectionChange(selectedItems, model) {
    for (const treeItem of selectedItems) {
      setSelection(model, treeItem, treeItem.getItemNodeContext().context.sPath, treeItem.getSelected());
    }
    setSelectionState(model);
  }

  /**
   * Selects or deselects all sections based on the provided event.
   *
   * @param event The event containing the selected state.
   * @param model The JSONModel instance.
   */
  function selectAllSections(event, model) {
    const allSelected = event.getParameter("selected");
    const sectionTree = model.getProperty("/sections/sectionTree");
    const treeItem = UI5Element.getElementById("SectionsTree").getItems()[0];
    for (const section of sectionTree) {
      setSelection(model, treeItem, "/sections/sectionTree/" + sectionTree.indexOf(section), allSelected);
    }
    setSelectionState(model);
  }

  /**
   * Filters the section tree based on the provided selection state.
   *
   * @param model The JSONModel instance.
   * @param selectionState The selection state to filter on.
   * @param withNodes Whether to include section nodes in the result (optional).
   * @returns An array of SectionTree objects corresponding to the provided selection state.
   */
  function getSelectedSections(model, selectionState, withNodes) {
    //get sections for requested selection state by checking on property selected in the sectionTree model
    const sectionTree = model.getProperty("/sections/sectionTree");
    const filteredSections = [];
    sectionTree.forEach(member => {
      if (member.nodes.length > 0) {
        const filteredSubSections = member.nodes.filter(subSection => subSection.selected === selectionState);
        //evaluate section nodes selection state
        if (withNodes) {
          //if all section nodes correspond to requested selection state: return the section instead
          if (filteredSubSections.length === member.nodes.length) {
            filteredSections.push(member);
          } else {
            filteredSubSections.forEach(selected => filteredSections.push(selected));
          }
          // If the section selection state is requested and section nodes are partially (de-)selected, return the section instead
        } else if (filteredSubSections.length > 0) {
          filteredSections.push(member);
        }
        //no section nodes: return section matching requested selection state
      } else if (member.selected === selectionState) {
        filteredSections.push(member);
      }
    });
    return filteredSections;
  }

  /**
   * Determines if any blocks within the given subsection have a binding context.
   *
   * @param subSection The subsection to check for blocks with binding contexts.
   * @returns True if at least one block has a binding context, otherwise false.
   */
  function subSectionBindingExists(subSection) {
    return subSection.getBlocks().some(block => {
      return !!block.getBindingContext();
    });
  }

  /**
   * Processes lazy-loaded sections by connecting them to models and resolving the promise when the UI updates are complete.
   *
   * @param view The view instance.
   * @param lazyLoadSections An array of ObjectPageSubSection objects to process.
   * @param model The JSONModel instance.
   * @param fnResolve The function to resolve the promise.
   * @param checkUIUpdated The function to check for UI updates.
   */
  function processLazyLoadSections(view, lazyLoadSections, model, fnResolve, checkUIUpdated) {
    let bindingRefreshed = false;
    const smartTables = [];
    const oDataModel = view.getModel();
    const opLayout = view.getContent()[0];
    for (const subSection of lazyLoadSections) {
      opLayout.fireEvent("subSectionEnteredViewPort", {
        subSection: subSection
      });
      //check if model is V2 and if so, collect all smart tables in the section
      if (getModelVersion(oDataModel) === v2Model) {
        const blocks = subSection.getBlocks();
        blocks.push(...subSection.getMoreBlocks());
        blocks.forEach(block => {
          const content = block.getAggregation("content");
          if (Array.isArray(content)) {
            for (const control of content) {
              if (control.isA("sap.ui.comp.smarttable.SmartTable")) {
                smartTables.push(control);
              }
            }
          }
        });
      }
      if (!bindingRefreshed) {
        bindingRefreshed = subSectionBindingExists(subSection);
      }
    }
    //if no binding context found in any of the unstashed or lazy loaded section blocks, resolve immediately
    if (!bindingRefreshed) {
      model.setProperty("/sections/busyState", false);
      fnResolve();
    }
    //special treatment for V2 smart tables: attach to beforeRebindTable event required as Rendering.UIUpdated event is not fired
    //attaching the same handler makes sure that promise is resolved after all sections including the ones with smart tables were refreshed
    if (smartTables.length > 0) {
      smartTables.forEach(smartTable => {
        smartTable.attachBeforeRebindTable(checkUIUpdated);
      });
    }
    Rendering.attachUIUpdated(checkUIUpdated);
    Rendering.renderPendingUIUpdates("unstashSections", 500);
  }

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
  async function unstashSections(model) {
    model.setProperty("/sections/busyState", true);
    const view = model.getProperty("/view");
    const opSections = getSections(view.getContent()[0]);
    const lazyLoadSections = [];
    //Get all sections from the current object page
    const sections = getSections(view.getContent()[0]);
    opSections.forEach(selected => {
      const section = selected;
      if (section) {
        const subSections = section.getSubSections();
        for (const subSection of subSections) {
          const allBlocks = subSection.getBlocks();
          //if section contains no blocks or only headers, connect to models to unstash
          if (allBlocks.filter(block => !block.getId().includes("::AriaText")).length === 0) {
            subSection.connectToModels();
            lazyLoadSections.push(subSection);
          }
          //check for section blocks that are lazy loaded
          else if (allBlocks.some(block => {
            return block.getBindingContext() === null;
          })) {
            lazyLoadSections.push(subSection);
          }
        }
      }
    });
    return new Promise((fnResolve, fnReject) => {
      setTimeout(() => {
        const checkUIUpdated = event => {
          if (Rendering.isPending() || event && event.getId().includes("beforeRebindTable")) {
            Rendering.detachUIUpdated(checkUIUpdated);
            setTimeout(checkUIUpdated, 500);
          } else {
            Rendering.detachUIUpdated(checkUIUpdated);
            const observer = new MutationObserver(() => {
              //if busy state is false, user has cancelled operation
              if (!model.getProperty("/sections/busyState")) {
                observer.disconnect();
                fnReject(new Error("Operation cancelled by user"));
              }
              let busyIndicatorIds = Array.from(document.querySelectorAll('[id*="busyIndicator"]')).map(indicator => indicator.id);
              //get page id part of first element of lazyLoadSections
              const pageId = sections[0].getId().split("--")[0];
              //remove entries from busyIndicatorIds where id does not match page id
              busyIndicatorIds = busyIndicatorIds.filter(indicator => indicator.includes(pageId));
              if (busyIndicatorIds.length === 0) {
                model.setProperty("/sections/busyState", false);
                observer.disconnect();
                fnResolve();
              }
            });
            observer.observe(document.body, {
              childList: true,
              subtree: true
            });
          }
        };
        if (lazyLoadSections.length > 0) {
          processLazyLoadSections(view, lazyLoadSections, model, fnResolve, checkUIUpdated);
        } else {
          model.setProperty("/sections/busyState", false);
          fnResolve();
        }
      }, 0);
    });
  }
  var __exports = {
    __esModule: true
  };
  __exports.createSectionTree = createSectionTree;
  __exports.selectionChange = selectionChange;
  __exports.selectAllSections = selectAllSections;
  __exports.getSelectedSections = getSelectedSections;
  __exports.unstashSections = unstashSections;
  return __exports;
});
//# sourceMappingURL=section-dbg.js.map
