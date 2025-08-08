"use strict";

sap.ui.define(["ux/eng/fioriai/reuse/thirdparty/zod"], function (__zod) {
  "use strict";

  const z = __zod["z"];
  const value = z.union([z.string(), z.number(), z.boolean()]);
  const unit = z.string();

  /**
   * A comparison predicate.
   *
   * Comparisons are somewhat loose, allowing for comparisons between different types. For example ["$contains", 1] is valid. This keeps the schema simple.
   */
  const comparisonPredicate = z.tuple([z.enum(["$eq", "$ne", "$gt", "$gte", "$lt", "$lte", "$contains", "$startsWith", "$endsWith", "$notContains", "$notStartsWith", "$notEndsWith"]), value]);

  /**
   * A range predicate.
   *
   * The first value is the lower bound and the second value is the upper bound. The bounds are inclusive.
   */
  const rangePredicate = z.tuple([z.enum(["$between", "$notBetween"]), value, value]);

  /**
   * A set membership predicate.
   */
  const setMembershipPredicate = z.tuple([z.enum(["$in", "$nin"])]).rest(value);

  /**
   * A comparison predicate with a unit.
   */
  const comparisonPredicateWithUnit = z.tuple([z.enum(["$eq", "$ne", "$gt", "$gte", "$lt", "$lte"]), value, unit]);

  /**
   * A range predicate with a unit.
   *
   * The first value is the lower bound with its unit, the second value is the upper bound with its unit. The bounds are inclusive.
   */
  const rangePredicateWithUnit = z.tuple([z.enum(["$between", "$notBetween"]), value, unit, value, unit]);

  /**
   * A predicate.
   */
  const predicate = z.union([comparisonPredicate, comparisonPredicateWithUnit, rangePredicate, rangePredicateWithUnit, setMembershipPredicate]);

  /**
   * A filter.
   */
  const Filter = z.record(z.string(), predicate.array());

  /**
   * A filter scoped to a specific collection (e.g., entity set). Combines the filter definition with the collection it targets.
   */
  const CollectionFilter = z.object({
    collection: z.string(),
    filter: Filter
  });
  /**
   * Check if a predicate is a comparison predicate.
   *
   * @param p The predicate to check
   * @returns `true` if the predicate is a comparison predicate, `false` otherwise
   */
  function isComparisonPredicate(p) {
    return p[0] in comparisonPredicate.items[0].enum && p.length === 2;
  }

  /**
   * Check if a predicate is a comparison predicate with a unit.
   *
   * @param p The predicate to check
   * @returns `true` if the predicate is a comparison predicate with a unit, `false` otherwise
   */
  function isComparisonPredicateWithUnit(p) {
    return p[0] in comparisonPredicate.items[0].enum && p.length === 3;
  }

  /**
   * Check if a predicate is a range predicate.
   *
   * @param p The predicate to check
   * @returns `true` if the predicate is a range predicate, `false` otherwise
   */
  function isRangePredicate(p) {
    return p[0] in rangePredicate.items[0].enum && p.length === 3;
  }

  /**
   * Check if a predicate is a range predicate with a unit.
   *
   * @param p The predicate to check
   * @returns `true` if the predicate is a range predicate with a unit, `false` otherwise
   */
  function isRangePredicateWithUnit(p) {
    return p[0] in rangePredicate.items[0].enum && p.length === 5;
  }

  /**
   * Check if a predicate is a set membership predicate.
   *
   * @param p The predicate to check
   * @returns `true` if the predicate is a set membership predicate, `false` otherwise
   */
  function isSetMembershipPredicate(p) {
    return p[0] in setMembershipPredicate.items[0].enum;
  }
  var __exports = {
    __esModule: true
  };
  __exports.Filter = Filter;
  __exports.CollectionFilter = CollectionFilter;
  __exports.isComparisonPredicate = isComparisonPredicate;
  __exports.isComparisonPredicateWithUnit = isComparisonPredicateWithUnit;
  __exports.isRangePredicate = isRangePredicate;
  __exports.isRangePredicateWithUnit = isRangePredicateWithUnit;
  __exports.isSetMembershipPredicate = isSetMembershipPredicate;
  return __exports;
});
//# sourceMappingURL=FilterSchema-dbg.js.map
