declare module "ux/eng/fioriai/reuse/common/FeedbackRow" {
    import HBox from "sap/m/HBox";
    import Control from "sap/ui/core/Control";
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
    function createFeedbackRow(relativeTo: Control): HBox;
    /**
     * Displays a message using MessageToast.
     *
     * @param message The message to display.
     * @param relativeTo The dialog to position the MessageToast relative to.
     */
    function showMessageToast(message: string, relativeTo?: Control): void;
}
//# sourceMappingURL=FeedbackRow.d.ts.map