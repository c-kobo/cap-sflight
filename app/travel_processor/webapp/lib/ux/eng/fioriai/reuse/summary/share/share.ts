import ServiceContainer from "sap/suite/ui/commons/collaboration/ServiceContainer";
import TeamsHelperService from "sap/suite/ui/commons/collaboration/TeamsHelperService";

/**
 * Convert HTML string into it's plain text representation.
 *
 * @param html string containing HTML
 * @returns plain text string
 */
function convertHtmlToPlainText(html: string): string {
    // eslint-disable-next-line fiori-custom/sap-no-element-creation
    const span = document.createElement("span");
    // eslint-disable-next-line fiori-custom/sap-no-inner-html-write,fiori-custom/sap-no-inner-html-access
    span.innerHTML = html;
    const text = span.textContent ?? span.innerText ?? "";
    return text.trim();
}

/**
 *  Share summary via copy to clipboard.
 *
 * @param summaryHtml summary as HTML
 * @returns A promise that resolves when the data has been written to the clipboard
 */
export async function shareViaClipboard(summaryHtml: string) {
    const summaryPlainText = convertHtmlToPlainText(summaryHtml);
    const blobText = new Blob([summaryPlainText], { type: "text/plain" });
    const blobHtml = new Blob([summaryHtml], { type: "text/html" });
    const data = [
        new ClipboardItem({
            ["text/plain"]: blobText,
            ["text/html"]: blobHtml
        })
    ];
    // eslint-disable-next-line fiori-custom/sap-no-navigator
    return navigator.clipboard.write(data);
}

/**
 * Share summary with the CollaborationPopover
 * If TeamHelperService is not available - this function will not work.
 *
 * @param summaryHtml summary as HTML
 * @param shareDomRef DomRef of control to which the popover is rendered.
 */
export async function shareViaCollaborationPopover(summaryHtml: string, shareDomRef: HTMLElement): Promise<void> {
    const teamsHelper = (await ServiceContainer.getServiceAsync()) as TeamsHelperService;
    const params = {
        isShareAsLinkEnabled: true
    };
    const data = {
        title: "Summary",
        data: summaryHtml,
        format: "Vertical",
        placement: "HorizontalPreferredLeft",
        showPreview: false
    };
    const isLink = false;
    const config = {
        shareToTeams: true,
        shareToEmail: false,
        shareToCM: false
    };
    teamsHelper.getCollaborationPopover(params, data, shareDomRef, isLink, config);
}

/**
 * Check if TeamHelperService is available.
 *
 * @returns Returns `true` if TeamHelperService is available, `false` otherwise.
 */
export async function isShareAvailable(): Promise<boolean> {
    const teamsHelper = (await ServiceContainer.getServiceAsync()) as TeamsHelperService;
    return teamsHelper.getMetadata().getName() === "sap.suite.ui.commons.collaboration.TeamsHelperService";
}
