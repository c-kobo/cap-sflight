import FilterOperator from "sap/ui/model/FilterOperator";
import Log from "ux/eng/fioriai/reuse/common/log";
import { Error, error, Result, success } from "ux/eng/fioriai/reuse/common/result";
import { getText } from "ux/eng/fioriai/reuse/common/text";
import { processEasyFilterQuery } from "ux/eng/fioriai/reuse/easyfilter/completion/ProcessEasyFilter";
import { ODataErrorCode } from "ux/eng/fioriai/reuse/service/action";

/**
 * Code list entry with value and optional description.
 */
export interface CodeListEntry {
    /** Code value */
    value: string | number;

    /** Human-readable description */
    description?: string;
}

/**
 * Collection of fixed values for a property.
 */
export type CodeList = CodeListEntry[];

/**
 * Metadata for a property.
 */
export interface PropertyMetadata {
    /** Property name */
    name: string;

    /** Human-readable label */
    label?: string;

    /** Data type (e.g., "Edm.String", "Edm.DateTime") */
    dataType?: string;

    /** Whether the property can be used in filter conditions */
    filterable?: boolean;

    /** Whether the property is hidden from the filter bar UI */
    hiddenFilter?: boolean;

    /** Whether the property is mandatory in filter conditions */
    required?: boolean;

    /** Code list for the property, static or dynamic */
    codeList?: CodeList | (() => Promise<CodeList>);

    /** Path to the unit field for properties with units */
    unit?: string;

    /** Allowed filter operations for this property */
    filterRestriction?:
        | "SingleValue"
        | "MultiValue"
        | "SingleRange"
        | "MultiRange"
        | "SearchExpression"
        | "MultiRangeOrSearchExpression";
}

/**
 * EasyFilter metadata configuration.
 */
export interface EasyFilterMetadata {
    /** Metadata format version */
    version: 1;

    /** OData entity set name */
    entitySet?: string;

    /** Available fields */
    fields: PropertyMetadata[];
}

/**
 * Filter expression for comparison operations.
 */
export type EasyFilterComparisonExpression = {
    /** Property name */
    name: string;
    /** Comparison operator */
    operator:
        | FilterOperator.EQ
        | FilterOperator.NE
        | FilterOperator.GT
        | FilterOperator.GE
        | FilterOperator.LT
        | FilterOperator.LE;
    /** Values to compare against */
    values: string[] | number[] | boolean[] | Date[];
};

/**
 * Filter expression for substring matching.
 */
export type EasyFilterSubstringExpression = {
    /** Property name */
    name: string;
    /** Substring matching operator */
    operator:
        | FilterOperator.Contains
        | FilterOperator.NotContains
        | FilterOperator.EndsWith
        | FilterOperator.NotEndsWith
        | FilterOperator.StartsWith
        | FilterOperator.NotStartsWith;
    /** String values to match */
    values: string[];
};

/**
 * Filter expression for range operations.
 */
export type EasyFilterRangeExpression = {
    /** Property name */
    name: string;
    /** Range operator */
    operator: FilterOperator.BT | FilterOperator.NB;
    /** Range boundary values [lower, upper] */
    values: [string, string] | [number, number] | [Date, Date];
};

/**
 * Union of all filter expression types.
 */
export type EasyFilterExpression =
    | EasyFilterRangeExpression
    | EasyFilterSubstringExpression
    | EasyFilterComparisonExpression;

/**
 * EasyFilter processing result.
 */
export type EasyFilterResult = {
    /** Result format version */
    version: 1;
    /** Generated filter expressions */
    filter: EasyFilterExpression[];
};

/**
 * Creates a user-friendly error from an internal error.
 *
 * @param internalError Internal system error
 * @returns User-friendly error message
 */
function createUserError(internalError: Error<ODataErrorCode>): Error<never> {
    Log.error(internalError.message, internalError.code);

    switch (internalError.code) {
        case ODataErrorCode.temporaryError:
            return error(getText("EASYFILTER_TEMPORARY_ERROR"));

        case ODataErrorCode.unauthorized:
        case ODataErrorCode.configurationError:
        case ODataErrorCode.featureUnavailable:
            return error(getText("EASYFILTER_PERMANENT_ERROR"));

        default:
            return error(getText("EASYFILTER_UNEXPECTED_ERROR"));
    }
}

/**
 * Processes natural language input to generate filter expressions.
 *
 * @param input Natural language filter query
 * @param metadata Field metadata for processing
 * @returns Filter expressions or error message
 */
export async function easyFilter(input: string, metadata: EasyFilterMetadata): Promise<Result<EasyFilterResult>> {
    const result = await processEasyFilterQuery(input, metadata);

    if (!result.success) {
        return createUserError(result as Error<ODataErrorCode>);
    }

    switch (result.data.action) {
        case "APPLY_FILTER":
            return success({ version: 1, filter: result.data.filter });

        case "ASK_TO_REPHRASE":
            // map to error as this is how the consumer expects it
            return error(getText("EASYFILTER_UNCLEAR_INPUT_ERROR"));
    }
}
