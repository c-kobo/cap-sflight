declare module "ux/eng/fioriai/reuse/easyfilter/schemas/FilterSchema" {
    import { z } from "zod";
    const value: any;
    const unit: any;
    /**
     * A comparison predicate.
     *
     * Comparisons are somewhat loose, allowing for comparisons between different types. For example ["$contains", 1] is valid. This keeps the schema simple.
     */
    const comparisonPredicate: any;
    /**
     * A range predicate.
     *
     * The first value is the lower bound and the second value is the upper bound. The bounds are inclusive.
     */
    const rangePredicate: any;
    /**
     * A set membership predicate.
     */
    const setMembershipPredicate: any;
    /**
     * A comparison predicate with a unit.
     */
    const comparisonPredicateWithUnit: any;
    /**
     * A range predicate with a unit.
     *
     * The first value is the lower bound with its unit, the second value is the upper bound with its unit. The bounds are inclusive.
     */
    const rangePredicateWithUnit: any;
    /**
     * A predicate.
     */
    const predicate: any;
    /**
     * A filter.
     */
    const Filter: any;
    /**
     * A filter scoped to a specific collection (e.g., entity set). Combines the filter definition with the collection it targets.
     */
    const CollectionFilter: any;
    type CollectionFilter = z.infer<typeof CollectionFilter>;
    type Value = z.infer<typeof value>;
    type ComparisonPredicate = z.infer<typeof comparisonPredicate>;
    type ComparisonPredicateWithUnit = z.infer<typeof comparisonPredicateWithUnit>;
    type RangePredicate = z.infer<typeof rangePredicate>;
    type RangePredicateWithUnit = z.infer<typeof rangePredicateWithUnit>;
    type SetMembershipPredicate = z.infer<typeof setMembershipPredicate>;
    type Predicate = z.infer<typeof predicate>;
    type Filter = z.infer<typeof Filter>;
    /**
     * Check if a predicate is a comparison predicate.
     *
     * @param p The predicate to check
     * @returns `true` if the predicate is a comparison predicate, `false` otherwise
     */
    function isComparisonPredicate(p: Predicate): p is ComparisonPredicate;
    /**
     * Check if a predicate is a comparison predicate with a unit.
     *
     * @param p The predicate to check
     * @returns `true` if the predicate is a comparison predicate with a unit, `false` otherwise
     */
    function isComparisonPredicateWithUnit(p: Predicate): p is ComparisonPredicateWithUnit;
    /**
     * Check if a predicate is a range predicate.
     *
     * @param p The predicate to check
     * @returns `true` if the predicate is a range predicate, `false` otherwise
     */
    function isRangePredicate(p: Predicate): p is RangePredicate;
    /**
     * Check if a predicate is a range predicate with a unit.
     *
     * @param p The predicate to check
     * @returns `true` if the predicate is a range predicate with a unit, `false` otherwise
     */
    function isRangePredicateWithUnit(p: Predicate): p is RangePredicateWithUnit;
    /**
     * Check if a predicate is a set membership predicate.
     *
     * @param p The predicate to check
     * @returns `true` if the predicate is a set membership predicate, `false` otherwise
     */
    function isSetMembershipPredicate(p: Predicate): p is SetMembershipPredicate;
}
//# sourceMappingURL=FilterSchema.d.ts.map