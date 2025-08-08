import Log from "sap/base/Log";
import Button from "sap/m/Button";
import HBox from "sap/m/HBox";
import Label from "sap/m/Label";
import Link from "sap/m/Link";
import MessageToast from "sap/m/MessageToast";
import Popover from "sap/m/Popover";
import ToggleButton from "sap/m/ToggleButton";
import Control from "sap/ui/core/Control";
import Fragment from "sap/ui/core/Fragment";
import ResourceModel from "sap/ui/model/resource/ResourceModel";
import FESRHelper from "sap/ui/performance/trace/FESRHelper";
import { getLibraryResourceBundle, getText } from "ux/eng/fioriai/reuse/common/text";

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
export function createFeedbackRow(relativeTo: Control): HBox {
    let aiPopover: Popover | undefined;

    const aiLink = new Link({
        text: getText("CREATED_WITH_AI") + ".",
        press: function (event) {
            const sourceLink = event.getSource();
            if (!aiPopover) {
                Fragment.load({
                    id: "aiPopoverFragment",
                    name: "ux.eng.fioriai.reuse.common.fragment.AIPopover",
                    controller: this
                })
                    .then((oFragment) => {
                        aiPopover = oFragment as Popover;
                        aiPopover.setModel(new ResourceModel({ bundle: getLibraryResourceBundle() }), "i18n");
                        aiPopover.openBy(sourceLink);

                        const closeButton = Fragment.byId("aiPopoverFragment", "closeAIPopoverBtn") as Button;
                        closeButton.attachPress(() => {
                            aiPopover?.close();
                        });
                        aiPopover?.attachAfterClose(() => {
                            // remove from UI5 control tree and release reference
                            aiPopover?.destroy();
                            aiPopover = undefined;
                        });
                    })
                    .catch((error: Error) => {
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
export function showMessageToast(message: string, relativeTo?: Control): void {
    MessageToast.show(message, {
        of: relativeTo,
        offset: "0 -16"
    });
}
