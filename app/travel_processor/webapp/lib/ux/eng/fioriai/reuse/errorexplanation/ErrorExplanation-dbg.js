"use strict";

sap.ui.define(["ux/eng/fioriai/reuse/thirdparty/marked", "sap/m/Bar", "sap/m/BusyIndicator", "sap/m/Button", "sap/m/Dialog", "sap/m/FormattedText", "sap/m/library", "sap/m/Link", "sap/m/Title", "sap/m/VBox", "sap/ui/core/EventBus", "ux/eng/fioriai/reuse/common/FeedbackRow", "ux/eng/fioriai/reuse/common/text", "ux/eng/fioriai/reuse/errorexplanation/completion/ProcessErrorExplanation", "ux/eng/fioriai/reuse/summary/share/index"], function (__marked, Bar, BusyIndicator, Button, Dialog, FormattedText, sap_m_library, Link, Title, VBox, EventBus, __ux_eng_fioriai_reuse_common_FeedbackRow, __ux_eng_fioriai_reuse_common_text, __ux_eng_fioriai_reuse_errorexplanation_completion_ProcessErrorExplanation, __ux_eng_fioriai_reuse_summary_share_index) {
  "use strict";

  const marked = __marked["marked"];
  const ButtonType = sap_m_library["ButtonType"];
  const createFeedbackRow = __ux_eng_fioriai_reuse_common_FeedbackRow["createFeedbackRow"];
  const showMessageToast = __ux_eng_fioriai_reuse_common_FeedbackRow["showMessageToast"];
  const getText = __ux_eng_fioriai_reuse_common_text["getText"];
  const processErrorExplanation = __ux_eng_fioriai_reuse_errorexplanation_completion_ProcessErrorExplanation["processErrorExplanation"];
  const shareViaClipboard = __ux_eng_fioriai_reuse_summary_share_index["shareViaClipboard"];
  /**
   * Application metadata for error explanation context.
   */
  /**
   * Error information for AI-powered explanation.
   */
  /**
   * Displays an AI-powered error explanation dialog to the user.
   *
   * @param metadata Application context for error explanation
   * @param data Error details to be explained
   */
  async function explain(metadata, data) {
    const busyIndicator = new BusyIndicator().addStyleClass("sapUiSmallMargin");
    const busyIndicatorBox = new VBox({
      items: [busyIndicator],
      justifyContent: "Center",
      alignItems: "Center",
      height: "100%",
      width: "100%"
    });
    const customHeaderBar = new Bar();
    const customHeaderText = new Title({
      text: getText("ERROR_EXPLANATION_DIALOG_TITLE"),
      level: "H1"
    }).addStyleClass("sapUiMediumMarginEnd");
    customHeaderBar.addContentLeft(customHeaderText);
    const formattedHTML = new FormattedText();
    const copyButton = new Button({
      text: getText("SHARE_COPY_TO_CLIPBOARD"),
      type: ButtonType.Emphasized,
      visible: false,
      press: function () {
        const errorExplanation = formattedHTML.getHtmlText();
        shareViaClipboard(errorExplanation).then(() => {
          showMessageToast(getText("COPY_SUCCESS"), dialog);
        }).catch(error => {
          showMessageToast(`${getText("COPY_FAILURE")} ${error.message}`, dialog);
        });
      }
    });
    const dialog = new Dialog({
      title: getText("ERROR_EXPLANATION_DIALOG_TITLE"),
      content: busyIndicatorBox,
      buttons: [copyButton, new Button({
        text: getText("CANCEL"),
        type: ButtonType.Ghost,
        press: function () {
          dialog.close();
        }
      })],
      afterClose: function () {
        try {
          const eventBus = EventBus.getInstance();
          eventBus.publish("sap.feedback", "inapp.feature", {
            "areaId": "BetaPrgm",
            "triggerName": "BETA_PRGM_AI_ERROR_MESSAGE"
          });
        } finally {
          // ignore
        }
        dialog.destroy();
      },
      customHeader: customHeaderBar
    });
    dialog.open();
    const result = await processErrorExplanation("ERROR_EXPLANATION", {
      ISLM_AppName: metadata.appName ? metadata.appName : "App",
      ISLM_FioriId: metadata.fioriId ? metadata.fioriId : "none",
      ISLM_ComponentName: metadata.componentName ?? "none",
      ISLM_ErrorMessage: data.message ? data.message : "An error occurred",
      ISLM_ErrorDescription: data.description ? data.description : "none",
      ISLM_ErrorCode: data.code ? data.code : "none",
      ISLM_TargetLanguage: data.targetLanguage ?? getText("LOCALE")
    });
    if (result.success) {
      busyIndicatorBox.setVisible(false);
      const newLine = result.data.replace(/\\\n/g, "\n");
      const resArray = newLine.trim().slice(1, -1) // remove [" and "]
      .split(/",\s*"/);
      const parsedResults = await Promise.all([marked.parse(data.message), marked.parse(resArray[0].trim().slice(1)), marked.parse(resArray[1].trim().slice(0, -1))]);
      const combinedHtml = parsedResults.join("");
      formattedHTML.setHtmlText(combinedHtml);
      let isExpanded = false;
      const maxLength = 600;
      const textToDisplay = parsedResults[1].length > maxLength ? parsedResults[1].slice(0, maxLength) + "..." : parsedResults[1];
      const expandableText = new FormattedText({
        htmlText: textToDisplay
      });
      const showMoreLessLink = new Link({
        text: parsedResults[1].length > maxLength ? getText("SHOW_MORE") : "",
        // Only show link if text is truncated
        press: function () {
          if (isExpanded) {
            expandableText.setHtmlText(parsedResults[1].slice(0, maxLength) + "...");
            showMoreLessLink.setText(getText("SHOW_MORE"));
          } else {
            expandableText.setHtmlText(parsedResults[1]);
            showMoreLessLink.setText(getText("SHOW_LESS"));
          }
          isExpanded = !isExpanded;
        }
      });
      const wrapper = new VBox({
        items: [new FormattedText({
          htmlText: parsedResults[0]
        }), expandableText, ...(parsedResults[1].length > maxLength ? [showMoreLessLink.addStyleClass("sapUiSmallMarginBottom")] : []), new FormattedText({
          htmlText: parsedResults[2]
        })]
      });
      copyButton.setVisible(true);
      dialog.insertContent(wrapper.addStyleClass("sapUiSmallMargin"), 0);
      const feedbackRow = createFeedbackRow(dialog);
      // Add feedback row to the parent HBox
      dialog.insertContent(feedbackRow, 1);
    }
  }
  var __exports = {
    __esModule: true
  };
  __exports.explain = explain;
  return __exports;
});
//# sourceMappingURL=ErrorExplanation-dbg.js.map
