declare module "ux/eng/fioriai/reuse/easyfilter/completion/getRelevantFields" {
    import { Result } from "ux/eng/fioriai/reuse/common/result";
    import { EasyFilterMetadata } from "ux/eng/fioriai/reuse/easyfilter/EasyFilter";
    /** Schema for validating the object returned by the OData action */
    const ODataResponseSchema: any;
    const odataResponseValidator: import("ux/eng/fioriai/reuse/languagemodel/JsonValidator").ValidationFunction<unknown>;
    type RelevantFieldsResult = {
        type: "FIELDS";
        fields: Set<string>;
    } | {
        type: "NOT_A_FILTER";
    } | {
        type: "SHOW_ALL";
    };
    /**
     * Get the relevant fields for an easy filter query based on the user input and filter metadata.
     *
     * @param userInput The input string from the user.
     * @param filterMetadata The metadata of the entity set to filter.
     * @returns The set of relevant fields, or "ASK_TO_REPHRASE" if the input is not clear.
     */
    function getRelevantFields(userInput: string, filterMetadata: EasyFilterMetadata): Promise<Result<RelevantFieldsResult>>;
}
//# sourceMappingURL=getRelevantFields.d.ts.map