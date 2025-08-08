declare module "ux/eng/fioriai/reuse/errorexplanation/ErrorExplanation" {
    /**
     * Application metadata for error explanation context.
     */
    interface ErrorExplanationMetadata {
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
    interface ErrorExplanationData {
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
    function explain(metadata: ErrorExplanationMetadata, data: ErrorExplanationData): Promise<void>;
}
//# sourceMappingURL=ErrorExplanation.d.ts.map