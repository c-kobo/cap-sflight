declare module "ux/eng/fioriai/reuse/easyfilter/helper/FilterExpressionConverter" {
    import FilterOperator from "sap/ui/model/FilterOperator";
    import { EasyFilterExpression, PropertyMetadata } from "ux/eng/fioriai/reuse/easyfilter/EasyFilter";
    import { ParsedValue } from "ux/eng/fioriai/reuse/easyfilter/helper/parseValue";
    import { ComparisonPredicate, ComparisonPredicateWithUnit, Filter, RangePredicate, RangePredicateWithUnit, SetMembershipPredicate } from "ux/eng/fioriai/reuse/easyfilter/schemas/FilterSchema";
    function isValid(field: PropertyMetadata, valueToValidate: ParsedValue): boolean;
    function equals(a: ParsedValue, b: ParsedValue): boolean;
    /**
     * Create an EasyFilterExpression.
     *
     * @param field The field to create the expression for
     * @param operator The operator of the expression
     * @param value The value of the expression
     * @returns The created expression
     */
    function expression(field: PropertyMetadata, operator: EasyFilterExpression["operator"], value: ParsedValue | ParsedValue[]): EasyFilterExpression;
    /**
     * Create an EasyFilterExpression for a substring operator.
     *
     * @param field The field to create the expression for
     * @param operator The operator of the expression
     * @param value The value of the expression. If the value is not a string, no expression is created.
     * @returns The created expression or an empty array if the value is not a string
     */
    function substringExpression(field: PropertyMetadata, operator: Extract<EasyFilterExpression["operator"], FilterOperator.Contains | FilterOperator.NotContains | FilterOperator.StartsWith | FilterOperator.NotStartsWith | FilterOperator.EndsWith | FilterOperator.NotEndsWith>, value: ParsedValue): EasyFilterExpression[];
    /**
     * Convert a comparison predicate into an array of EasyFilterExpressions.
     *
     * @param field The field the predicate is for
     * @param predicate The comparison predicate to convert
     * @returns The corresponding EasyFilterExpressions
     */
    function processComparisonPredicate(field: PropertyMetadata, predicate: ComparisonPredicate): EasyFilterExpression[];
    /**
     * Convert a comparison predicate with a unit into an array of EasyFilterExpressions.
     *
     * @param field The field the predicate is for
     * @param predicate The comparison predicate to convert
     * @param unitField The field that represents the unit
     * @returns The corresponding EasyFilterExpressions
     */
    function processComparisonPredicateWithUnit(field: PropertyMetadata, predicate: ComparisonPredicateWithUnit, unitField: PropertyMetadata | undefined): EasyFilterExpression[];
    /**
     * Convert a range predicate into an array of EasyFilterExpressions.
     *
     * @param field The field the predicate is for
     * @param predicate The range predicate to convert
     * @returns The corresponding EasyFilterExpressions
     */
    function processRangePredicate(field: PropertyMetadata, predicate: RangePredicate): EasyFilterExpression[];
    /**
     * Convert a set membership predicate into an array of EasyFilterExpressions.
     *
     * @param field The field the predicate is for
     * @param predicate The set membership predicate to convert
     * @returns The corresponding EasyFilterExpressions
     */
    function processSetMembershipPredicate(field: PropertyMetadata, predicate: SetMembershipPredicate): EasyFilterExpression[];
    /**
     * Convert a range predicate with a unit into an array of EasyFilterExpressions.
     *
     * @param field The field the predicate is for
     * @param predicate The range predicate to convert
     * @param unitField The field that represents the unit
     * @returns The corresponding EasyFilterExpressions
     */
    function processRangePredicateWithUnit(field: PropertyMetadata, predicate: RangePredicateWithUnit, unitField: PropertyMetadata | undefined): EasyFilterExpression[];
    /**
     * Add expressions to an accumulator array.
     *
     * If an expression with the same name and operator already exists in the accumulator, the values are merged.
     *
     * @param acc The accumulator array
     * @param expressions The expressions to add
     */
    function addExpressions(acc: EasyFilterExpression[], expressions: EasyFilterExpression[]): void;
    function fieldDictionary(metadata: PropertyMetadata[]): (name: string | undefined) => PropertyMetadata;
    /**
     * Get the fields for which code lists must be initialized in order to convert the filter.
     *
     * This includes all fields for which there are filter predicates, as well as their unit fields (if any).
     *
     * @param filter The filter object
     * @param getFieldByName A function that returns the field metadata for a given field name
     * @returns The fields for which code lists must be initialized
     */
    function getFieldsToRequest(filter: Filter, getFieldByName: (name: string | undefined) => PropertyMetadata | undefined): PropertyMetadata[];
    /**
     * Converts a filter object into an array of EasyFilterExpressions.
     *
     * @param filter The filter object to convert
     * @param metadata The metadata of the properties
     * @returns The converted filter
     */
    function convertFilter(filter: Filter, metadata: PropertyMetadata[]): Promise<EasyFilterExpression[]>;
}
//# sourceMappingURL=FilterExpressionConverter.d.ts.map