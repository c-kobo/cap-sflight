"use strict";

sap.ui.define([], function () {
  "use strict";

  /**
   * Contain the rich text edit config for button groups and buttons. Some groups can not
   * be set initially and need to be added after the editor is ready. See function
   * onRichTextEditorReady()
   *
   * See also https://sapui5.hana.ondemand.com/sdk/#/topic/d4f3f1598373452bb73f2120930c133c
   */
  const richTextEditConfig = [{
    "name": "font-style",
    "visible": true,
    "priority": 10,
    "customToolbarPriority": 10,
    "buttons": ["bold", "italic", "underline", "strikethrough"]
  }, {
    "name": "font",
    "visible": true,
    "priority": 30,
    "customToolbarPriority": 30,
    "buttons": ["fontselect", "fontsizeselect", "forecolor", "backcolor"]
  }, {
    "name": "structure",
    "visible": true,
    "priority": 40,
    "customToolbarPriority": 40,
    "buttons": ["bullist", "numlist", "outdent", "indent"]
  }, {
    "name": "text-align",
    "visible": true,
    "priority": 50,
    "customToolbarPriority": 50,
    "buttons": ["alignleft", "aligncenter", "alignright", "alignjustify"]
  }, {
    "name": "undo",
    "visible": true,
    "priority": 70,
    "customToolbarPriority": 70,
    "buttons": ["undo", "redo"]
  }];
  const summaryValuesTemplate = {
    showLoading: true,
    isFailed: false,
    isShareAvailable: false,
    summaryValue: "",
    showAiNotice: false,
    richTextEditConfig: richTextEditConfig,
    thumbsUpClicked: false,
    thumbsDownClicked: false,
    allowSummaryInteraction: false
  };
  const sectionsTemplate = {
    partiallySelected: false,
    allSelected: true,
    busyState: false,
    selectCount: 0,
    totalCount: 0,
    sectionTree: [],
    excludedNodes: []
  };
  var __exports = {
    __esModule: true
  };
  __exports.summaryValuesTemplate = summaryValuesTemplate;
  __exports.sectionsTemplate = sectionsTemplate;
  return __exports;
});
//# sourceMappingURL=model-dbg.js.map
