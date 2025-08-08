declare module "ux/eng/fioriai/reuse/easyfilter/completion/deriveFilterConditions" {
    import { Result } from "ux/eng/fioriai/reuse/common/result";
    import { EasyFilterMetadata } from "ux/eng/fioriai/reuse/easyfilter/EasyFilter";
    import { Filter } from "ux/eng/fioriai/reuse/easyfilter/schemas/FilterSchema";
    /** Schema for validating the object returned by the OData action */
    const ODataResponseSchema: any;
    const odataResponseValidator: import("ux/eng/fioriai/reuse/languagemodel/JsonValidator").ValidationFunction<unknown>;
    type FilterConditionResult = {
        type: "FILTER";
        filter: Filter;
    } | {
        type: "NOT_A_FILTER";
    };
    /**
     * Derives the filter conditions based on the user input.
     *
     * @param userInput The input string from the user.
     * @param filterMetadata The metadata of the entity set to filter.
     * @returns The filter conditions based on the user input.
     */
    function deriveFilterConditions(userInput: string, filterMetadata: EasyFilterMetadata): Promise<Result<FilterConditionResult>>;
}
//# sourceMappingURL=deriveFilterConditions.d.ts.map