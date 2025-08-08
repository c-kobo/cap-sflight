import { marked } from "marked";
import Bar from "sap/m/Bar";
import BusyIndicator from "sap/m/BusyIndicator";
import Button from "sap/m/Button";
import Dialog from "sap/m/Dialog";
import FormattedText from "sap/m/FormattedText";
import { ButtonType } from "sap/m/library";
import Link from "sap/m/Link";
import Title from "sap/m/Title";
import VBox from "sap/m/VBox";
import EventBus from "sap/ui/core/EventBus";
import { createFeedbackRow, showMessageToast } from "ux/eng/fioriai/reuse/common/FeedbackRow";
import { getText } from "ux/eng/fioriai/reuse/common/text";
import { processErrorExplanation } from "ux/eng/fioriai/reuse/errorexplanation/completion/ProcessErrorExplanation";
import { shareViaClipboard } from "ux/eng/fioriai/reuse/summary/share/index";

/**
 * Application metadata for error explanation context.
 */
export interface ErrorExplanationMetadata {
    /** Metadata format version */
    version: 1;

    /** Fiori application ID */
    fioriId?: string;

    /** Application name */
    appName?: string;

    /** UI5 component name */
    componentName?: string;
}

/**
 * Error information for AI-powered explanation.
 */
export interface ErrorExplanationData {
    /** Data format version */
    version: 1;

    /** Primary error message */
    message: string;

    /** Error code identifier */
    code?: string;

    /** Detailed error description */
    description?: string;

    /** URL for additional error information */
    descriptionUrl?: string;

    /** Target language for explanation (defaults to current locale) */
    targetLanguage?: string;
}

/**
 * Displays an AI-powered error explanation dialog to the user.
 *
 * @param metadata Application context for error explanation
 * @param data Error details to be explained
 */
export async function explain(metadata: ErrorExplanationMetadata, data: ErrorExplanationData): Promise<void> {
    const busyIndicator = new BusyIndicator().addStyleClass("sapUiSmallMargin");
    const busyIndicatorBox = new VBox({
        items: [busyIndicator],
        justifyContent: "Center",
        alignItems: "Center",
        height: "100%",
        width: "100%"
    });

    const customHeaderBar: Bar = new Bar();
    const customHeaderText: Title = new Title({
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
            shareViaClipboard(errorExplanation)
                .then(() => {
                    showMessageToast(getText("COPY_SUCCESS"), dialog);
                })
                .catch((error: Error) => {
                    showMessageToast(`${getText("COPY_FAILURE")} ${error.message}`, dialog);
                });
        }
    });
    const dialog = new Dialog({
        title: getText("ERROR_EXPLANATION_DIALOG_TITLE"),
        content: busyIndicatorBox,
        buttons: [
            copyButton,
            new Button({
                text: getText("CANCEL"),
                type: ButtonType.Ghost,
                press: function () {
                    dialog.close();
                }
            })
        ],
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
        const resArray = newLine
            .trim()
            .slice(1, -1) // remove [" and "]
            .split(/",\s*"/);

        const parsedResults = await Promise.all([
            marked.parse(data.message),
            marked.parse(resArray[0].trim().slice(1)),
            marked.parse(resArray[1].trim().slice(0, -1))
        ]);

        const combinedHtml = parsedResults.join("");
        formattedHTML.setHtmlText(combinedHtml);

        let isExpanded = false;
        const maxLength = 600;

        const textToDisplay =
            parsedResults[1].length > maxLength ? parsedResults[1].slice(0, maxLength) + "..." : parsedResults[1];

        const expandableText = new FormattedText({
            htmlText: textToDisplay
        });

        const showMoreLessLink = new Link({
            text: parsedResults[1].length > maxLength ? getText("SHOW_MORE") : "", // Only show link if text is truncated
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
            items: [
                new FormattedText({ htmlText: parsedResults[0] }),
                expandableText,
                ...(parsedResults[1].length > maxLength
                    ? [showMoreLessLink.addStyleClass("sapUiSmallMarginBottom")]
                    : []),
                new FormattedText({ htmlText: parsedResults[2] })
            ]
        });
        copyButton.setVisible(true);
        dialog.insertContent(wrapper.addStyleClass("sapUiSmallMargin"), 0);

        const feedbackRow = createFeedbackRow(dialog);
        // Add feedback row to the parent HBox
        dialog.insertContent(feedbackRow, 1);
    }
}
