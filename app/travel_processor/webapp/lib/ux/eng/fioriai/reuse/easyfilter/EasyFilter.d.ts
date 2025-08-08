declare module "ux/eng/fioriai/reuse/easyfilter/EasyFilter" {
    import FilterOperator from "sap/ui/model/FilterOperator";
    import { Error, Result } from "ux/eng/fioriai/reuse/common/result";
    import { ODataErrorCode } from "ux/eng/fioriai/reuse/service/action";
    /**
     * Code list entry with value and optional description.
     */
    interface CodeListEntry {
        /** Code value */
        value: string | number;
        /** Human-readable description */
        description?: string;
    }
    /**
     * Collection of fixed values for a property.
     */
    type CodeList = CodeListEntry[];
    /**
     * Metadata for a property.
     */
    interface PropertyMetadata {
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
        filterRestriction?: "SingleValue" | "MultiValue" | "SingleRange" | "MultiRange" | "SearchExpression" | "MultiRangeOrSearchExpression";
    }
    /**
     * EasyFilter metadata configuration.
     */
    interface EasyFilterMetadata {
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
    type EasyFilterComparisonExpression = {
        /** Property name */
        name: string;
        /** Comparison operator */
        operator: FilterOperator.EQ | FilterOperator.NE | FilterOperator.GT | FilterOperator.GE | FilterOperator.LT | FilterOperator.LE;
        /** Values to compare against */
        values: string[] | number[] | boolean[] | Date[];
    };
    /**
     * Filter expression for substring matching.
     */
    type EasyFilterSubstringExpression = {
        /** Property name */
        name: string;
        /** Substring matching operator */
        operator: FilterOperator.Contains | FilterOperator.NotContains | FilterOperator.EndsWith | FilterOperator.NotEndsWith | FilterOperator.StartsWith | FilterOperator.NotStartsWith;
        /** String values to match */
        values: string[];
    };
    /**
     * Filter expression for range operations.
     */
    type EasyFilterRangeExpression = {
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
    type EasyFilterExpression = EasyFilterRangeExpression | EasyFilterSubstringExpression | EasyFilterComparisonExpression;
    /**
     * EasyFilter processing result.
     */
    type EasyFilterResult = {
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
    function createUserError(internalError: Error<ODataErrorCode>): Error<never>;
    /**
     * Processes natural language input to generate filter expressions.
     *
     * @param input Natural language filter query
     * @param metadata Field metadata for processing
     * @returns Filter expressions or error message
     */
    function easyFilter(input: string, metadata: EasyFilterMetadata): Promise<Result<EasyFilterResult>>;
}
//# sourceMappingURL=EasyFilter.d.ts.map