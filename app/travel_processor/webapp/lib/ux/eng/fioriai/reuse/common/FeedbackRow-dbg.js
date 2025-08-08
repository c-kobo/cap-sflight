"use strict";

sap.ui.define(["sap/base/Log", "sap/m/HBox", "sap/m/Label", "sap/m/Link", "sap/m/MessageToast", "sap/m/ToggleButton", "sap/ui/core/Fragment", "sap/ui/model/resource/ResourceModel", "sap/ui/performance/trace/FESRHelper", "ux/eng/fioriai/reuse/common/text"], function (Log, HBox, Label, Link, MessageToast, ToggleButton, Fragment, ResourceModel, FESRHelper, __ux_eng_fioriai_reuse_common_text) {
  "use strict";

  const getLibraryResourceBundle = __ux_eng_fioriai_reuse_common_text["getLibraryResourceBundle"];
  const getText = __ux_eng_fioriai_reuse_common_text["getText"];
  /**
   * Creates a feedback row UI component consisting of a link, a label, and toggle buttons for user feedback.
   *
   * @param relativeTo The control relative to which the feedback row is displayed.
   * @returns An HBox containing the feedback row elements.
   *
   * @remarks
   * - The feedback row includes:
   *   - A link that opens a popover with additional information when clicked.
   *   - A label prompting users to verify results before use.
   *   - Two toggle buttons (thumbs up and thumbs down) for user feedback.
   * - The popover is loaded dynamically using a fragment and is displayed relative to the link.
   * - Once a feedback button is pressed, both buttons are disabled, and a toast message is shown.
   */
  function createFeedbackRow(relativeTo) {
    let aiPopover;
    const aiLink = new Link({
      text: getText("CREATED_WITH_AI") + ".",
      press: function (event) {
        const sourceLink = event.getSource();
        if (!aiPopover) {
          Fragment.load({
            id: "aiPopoverFragment",
            name: "ux.eng.fioriai.reuse.common.fragment.AIPopover",
            controller: this
          }).then(oFragment => {
            aiPopover = oFragment;
            aiPopover.setModel(new ResourceModel({
              bundle: getLibraryResourceBundle()
            }), "i18n");
            aiPopover.openBy(sourceLink);
            const closeButton = Fragment.byId("aiPopoverFragment", "closeAIPopoverBtn");
            closeButton.attachPress(() => {
              aiPopover?.close();
            });
            aiPopover?.attachAfterClose(() => {
              // remove from UI5 control tree and release reference
              aiPopover?.destroy();
              aiPopover = undefined;
            });
          }).catch(error => {
            Log.error(getText("POPOVER_FAILURE"), error);
          });
        } else {
          aiPopover.openBy(sourceLink);
        }
      }
    }).addStyleClass("sapUiTinyMarginBottom sapUiTinyMarginEnd sapUiSmallMarginBegin");
    const verifyLabel = new Label({
      text: getText("VERIFY_RESULT_BEFORE_USE"),
      design: "Standard"
    }).addStyleClass("sapUiSmallMarginEnd");
    const thumbsUpButton = new ToggleButton({
      icon: "sap-icon://thumb-up",
      type: "Transparent",
      tooltip: getText("ERROR_EXPLANATION_TOOLTIP_THUMBS_UP"),
      press: function () {
        thumbsUpButton.setEnabled(false);
        thumbsDownButton.setEnabled(false);
        showMessageToast(getText("FEEDBACK_SENT"), relativeTo);
      }
    }).addStyleClass("sapUiTinyMarginEnd");
    FESRHelper.setSemanticStepname(thumbsUpButton, "press", "fai:ee:thumbUp");
    const thumbsDownButton = new ToggleButton({
      icon: "sap-icon://thumb-down",
      type: "Transparent",
      tooltip: getText("ERROR_EXPLANATION_TOOLTIP_THUMBS_DOWN"),
      press: function () {
        thumbsUpButton.setEnabled(false);
        thumbsDownButton.setEnabled(false);
        showMessageToast(getText("FEEDBACK_SENT"), relativeTo);
      }
    });
    FESRHelper.setSemanticStepname(thumbsDownButton, "press", "fai:ee:thumbDown");
    const feedbackRow = new HBox({
      justifyContent: "Start",
      alignItems: "Center",
      width: "100%",
      items: [aiLink, verifyLabel, thumbsUpButton, thumbsDownButton]
    }).addStyleClass("sapUiSmallMarginBottom sapUiSmallMarginStart");
    return feedbackRow;
  }

  /**
   * Displays a message using MessageToast.
   *
   * @param message The message to display.
   * @param relativeTo The dialog to position the MessageToast relative to.
   */
  function showMessageToast(message, relativeTo) {
    MessageToast.show(message, {
      of: relativeTo,
      offset: "0 -16"
    });
  }
  var __exports = {
    __esModule: true
  };
  __exports.createFeedbackRow = createFeedbackRow;
  __exports.showMessageToast = showMessageToast;
  return __exports;
});
//# sourceMappingURL=FeedbackRow-dbg.js.map
