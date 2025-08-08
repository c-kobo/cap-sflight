declare module "ux/eng/fioriai/reuse/summary/share/share" {
    /**
     * Convert HTML string into it's plain text representation.
     *
     * @param html string containing HTML
     * @returns plain text string
     */
    function convertHtmlToPlainText(html: string): string;
    /**
     *  Share summary via copy to clipboard.
     *
     * @param summaryHtml summary as HTML
     * @returns A promise that resolves when the data has been written to the clipboard
     */
    function shareViaClipboard(summaryHtml: string): Promise<void>;
    /**
     * Share summary with the CollaborationPopover
     * If TeamHelperService is not available - this function will not work.
     *
     * @param summaryHtml summary as HTML
     * @param shareDomRef DomRef of control to which the popover is rendered.
     */
    function shareViaCollaborationPopover(summaryHtml: string, shareDomRef: HTMLElement): Promise<void>;
    /**
     * Check if TeamHelperService is available.
     *
     * @returns Returns `true` if TeamHelperService is available, `false` otherwise.
     */
    function isShareAvailable(): Promise<boolean>;
}
//# sourceMappingURL=share.d.ts.map