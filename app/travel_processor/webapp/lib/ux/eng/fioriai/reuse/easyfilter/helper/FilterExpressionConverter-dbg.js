"use strict";

sap.ui.define(["sap/ui/model/FilterOperator", "ux/eng/fioriai/reuse/common/log", "ux/eng/fioriai/reuse/easyfilter/helper/codeList", "ux/eng/fioriai/reuse/easyfilter/helper/parseValue", "ux/eng/fioriai/reuse/easyfilter/schemas/FilterSchema"], function (FilterOperator, __Log, __ux_eng_fioriai_reuse_easyfilter_helper_codeList, __parseValue, __ux_eng_fioriai_reuse_easyfilter_schemas_FilterSchema) {
  "use strict";

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule && typeof obj.default !== "undefined" ? obj.default : obj;
  }
  const Log = _interopRequireDefault(__Log);
  const getCodeLists = __ux_eng_fioriai_reuse_easyfilter_helper_codeList["getCodeLists"];
  const isCodeListInitialized = __ux_eng_fioriai_reuse_easyfilter_helper_codeList["isCodeListInitialized"];
  const parseValue = _interopRequireDefault(__parseValue);
  const isComparisonPredicate = __ux_eng_fioriai_reuse_easyfilter_schemas_FilterSchema["isComparisonPredicate"];
  const isComparisonPredicateWithUnit = __ux_eng_fioriai_reuse_easyfilter_schemas_FilterSchema["isComparisonPredicateWithUnit"];
  const isRangePredicate = __ux_eng_fioriai_reuse_easyfilter_schemas_FilterSchema["isRangePredicate"];
  const isRangePredicateWithUnit = __ux_eng_fioriai_reuse_easyfilter_schemas_FilterSchema["isRangePredicateWithUnit"];
  const isSetMembershipPredicate = __ux_eng_fioriai_reuse_easyfilter_schemas_FilterSchema["isSetMembershipPredicate"];
  function isValid(field, valueToValidate) {
    if (isCodeListInitialized(field.codeList) && !field.codeList.some(({
      value
    }) => value === valueToValidate)) {
      Log.warning(`Value '${valueToValidate.toString()}' is not valid for field '${field.name}'`);
      return false;
    }
    return true;
  }
  function equals(a, b) {
    if (a instanceof Date && b instanceof Date) {
      return a.getTime() === b.getTime();
    }
    return a === b;
  }

  /**
   * Create an EasyFilterExpression.
   *
   * @param field The field to create the expression for
   * @param operator The operator of the expression
   * @param value The value of the expression
   * @returns The created expression
   */
  function expression(field, operator, value) {
    const values = Array.isArray(value) ? value : [value];
    return {
      name: field.name,
      operator,
      values
    };
  }

  /**
   * Create an EasyFilterExpression for a substring operator.
   *
   * @param field The field to create the expression for
   * @param operator The operator of the expression
   * @param value The value of the expression. If the value is not a string, no expression is created.
   * @returns The created expression or an empty array if the value is not a string
   */
  function substringExpression(field, operator, value) {
    if (typeof value === "string") {
      // remove single asterisks at the beginning and end of the value string (the operator already implies the wildcard)
      if (value.startsWith("*")) {
        value = value.slice(1);
      }
      if (value.endsWith("*")) {
        value = value.slice(0, -1);
      }
      return [expression(field, operator, value)];
    }
    return [];
  }

  /**
   * Convert a comparison predicate into an array of EasyFilterExpressions.
   *
   * @param field The field the predicate is for
   * @param predicate The comparison predicate to convert
   * @returns The corresponding EasyFilterExpressions
   */
  function processComparisonPredicate(field, predicate) {
    const [operator, rawValue] = predicate;

    // parse the value
    const value = parseValue(field.dataType, rawValue);
    if (value === undefined) {
      // no valid value, skip
      return [];
    }
    switch (operator) {
      case "$eq":
        if (isValid(field, value)) {
          return [expression(field, FilterOperator.EQ, value)];
        }
        return [];
      case "$ne":
        {
          // If there is a code list for the field, invert $ne to $eq based on the code list
          if (isCodeListInitialized(field.codeList)) {
            return field.codeList.filter(entry => entry.value !== value).flatMap(entry => processComparisonPredicate(field, ["$eq", entry.value]));
          }
          return [expression(field, FilterOperator.NE, value)];
        }
      case "$gt":
        if (isValid(field, value)) {
          return [expression(field, FilterOperator.GT, value)];
        }
        return [];
      case "$gte":
        if (isValid(field, value)) {
          return [expression(field, FilterOperator.GE, value)];
        }
        return [];
      case "$lt":
        if (isValid(field, value)) {
          return [expression(field, FilterOperator.LT, value)];
        }
        return [];
      case "$lte":
        if (isValid(field, value)) {
          return [expression(field, FilterOperator.LE, value)];
        }
        return [];
      case "$contains":
        return substringExpression(field, FilterOperator.Contains, value);
      case "$startsWith":
        return substringExpression(field, FilterOperator.StartsWith, value);
      case "$endsWith":
        return substringExpression(field, FilterOperator.EndsWith, value);
      case "$notContains":
        return substringExpression(field, FilterOperator.NotContains, value);
      case "$notStartsWith":
        return substringExpression(field, FilterOperator.NotStartsWith, value);
      case "$notEndsWith":
        return substringExpression(field, FilterOperator.NotEndsWith, value);
    }
  }

  /**
   * Convert a comparison predicate with a unit into an array of EasyFilterExpressions.
   *
   * @param field The field the predicate is for
   * @param predicate The comparison predicate to convert
   * @param unitField The field that represents the unit
   * @returns The corresponding EasyFilterExpressions
   */
  function processComparisonPredicateWithUnit(field, predicate, unitField) {
    const [operator, rawValue, unit] = predicate;

    // it might happen that we run into this function although there is no unit field. For instance, the user input might
    // have looked as if the value had a unit when it actually didn't. In this case, we drop the unit and only process
    // the comparison.
    if (!unitField) {
      return processComparisonPredicate(field, [operator, rawValue]);
    }
    const unitExpression = processComparisonPredicate(unitField, ["$eq", unit]);

    // parse the value
    const value = parseValue(field.dataType, rawValue);
    if (value === undefined) {
      // no valid value, skip
      return [];
    }
    switch (operator) {
      case "$eq":
        return [expression(field, FilterOperator.EQ, value), ...unitExpression];
      case "$ne":
        return [expression(field, FilterOperator.NE, value), ...unitExpression];
      case "$gt":
        return [expression(field, FilterOperator.GT, value), ...unitExpression];
      case "$gte":
        return [expression(field, FilterOperator.GE, value), ...unitExpression];
      case "$lt":
        return [expression(field, FilterOperator.LT, value), ...unitExpression];
      case "$lte":
        return [expression(field, FilterOperator.LE, value), ...unitExpression];
    }
  }

  /**
   * Convert a range predicate into an array of EasyFilterExpressions.
   *
   * @param field The field the predicate is for
   * @param predicate The range predicate to convert
   * @returns The corresponding EasyFilterExpressions
   */
  function processRangePredicate(field, predicate) {
    const [operator, rawValue1, rawValue2] = predicate;

    // parse the values
    const value1 = parseValue(field.dataType, rawValue1);
    const value2 = parseValue(field.dataType, rawValue2);
    if (value1 === undefined && value2 === undefined) {
      // no valid values, skip
      return [];
    }
    const value1Valid = value1 !== undefined && isValid(field, value1);
    const value2Valid = value2 !== undefined && isValid(field, value2);
    switch (operator) {
      case "$between":
        if (!value1Valid) {
          // lower bound is missing, convert to "less than or equal to the upper bound"
          return processComparisonPredicate(field, ["$lte", rawValue2]);
        }
        if (!value2Valid) {
          // upper bound is missing, convert to "greater than or equal to the lower bound"
          return processComparisonPredicate(field, ["$gte", rawValue1]);
        }
        if (equals(value1, value2)) {
          // lower and upper bound are the same, convert to equality
          return processComparisonPredicate(field, ["$eq", rawValue1]);
        }
        return [{
          name: field.name,
          operator: FilterOperator.BT,
          values: [value1, value2] // types of value1 and value2 are guaranteed to be the same
        }];
      case "$notBetween":
        if (!value1Valid) {
          // lower bound is missing, convert to "greater than the upper bound
          return processComparisonPredicate(field, ["$gt", rawValue2]);
        }
        if (!value2Valid) {
          // upper bound is missing, convert to "less than the lower bound"
          return processComparisonPredicate(field, ["$lt", rawValue1]);
        }
        if (equals(value1, value2)) {
          // lower and upper bound are the same, convert to inequality
          return processComparisonPredicate(field, ["$ne", rawValue1]);
        }
        return [{
          name: field.name,
          operator: FilterOperator.NB,
          values: [value1, value2] // types of value1 and value2 are guaranteed to be the same
        }];
    }
  }

  /**
   * Convert a set membership predicate into an array of EasyFilterExpressions.
   *
   * @param field The field the predicate is for
   * @param predicate The set membership predicate to convert
   * @returns The corresponding EasyFilterExpressions
   */
  function processSetMembershipPredicate(field, predicate) {
    const [operator, ...rawValues] = predicate;

    // parse the values
    const values = rawValues.map(rawValue => parseValue(field.dataType, rawValue));
    switch (operator) {
      case "$in":
        return rawValues.flatMap(value => processComparisonPredicate(field, ["$eq", value]));
      case "$nin":
        {
          // If there is a code list for the field, invert $nin to $in based on the code list
          if (isCodeListInitialized(field.codeList)) {
            const inverseSelection = field.codeList.filter(entry => !values.includes(entry.value)).map(entry => entry.value);
            return processSetMembershipPredicate(field, ["$in", ...inverseSelection]);
          }
          return rawValues.flatMap(value => processComparisonPredicate(field, ["$ne", value]));
        }
    }
  }

  /**
   * Convert a range predicate with a unit into an array of EasyFilterExpressions.
   *
   * @param field The field the predicate is for
   * @param predicate The range predicate to convert
   * @param unitField The field that represents the unit
   * @returns The corresponding EasyFilterExpressions
   */
  function processRangePredicateWithUnit(field, predicate, unitField) {
    const [operator, rawValue1, unit1, rawValue2, unit2] = predicate;

    // it might happen that we run into this function although there is no unit field. For instance, the user input might
    // have looked as if the value had a unit when it actually didn't. In this case, we drop the unit and only process
    // the comparison.
    if (!unitField) {
      return processRangePredicate(field, [operator, rawValue1, rawValue2]);
    }
    const unitExpression = processSetMembershipPredicate(unitField, ["$in", unit1, unit2]);

    // parse the values
    const value1 = parseValue(field.dataType, rawValue1);
    const value2 = parseValue(field.dataType, rawValue2);
    if (value1 === undefined && value2 === undefined) {
      // no valid values, skip the values, but keep the unit expression
      return [...unitExpression];
    }
    switch (operator) {
      case "$between":
        if (value1 === undefined) {
          // lower bound is missing, convert to "less than or equal to the upper bound"
          return [...processComparisonPredicate(field, ["$lte", rawValue2]), ...unitExpression];
        }
        if (value2 === undefined) {
          // upper bound is missing, convert to "greater than or equal to the lower bound"
          return [...processComparisonPredicate(field, ["$gte", rawValue1]), ...unitExpression];
        }
        if (equals(value1, value2)) {
          // lower and upper bound are the same, convert to equality
          return [...processComparisonPredicate(field, ["$eq", rawValue1]), ...unitExpression];
        }
        return [{
          name: field.name,
          operator: FilterOperator.BT,
          values: [value1, value2] // types of value1 and value2 are guaranteed to be the same
        }, ...unitExpression];
      case "$notBetween":
        if (value1 === undefined) {
          // lower bound is missing, convert to "greater than the upper bound"
          return [...processComparisonPredicate(field, ["$gt", rawValue2]), ...unitExpression];
        }
        if (value2 === undefined) {
          // upper bound is missing, convert to "less than the lower bound"
          return [...processComparisonPredicate(field, ["$lt", rawValue1]), ...unitExpression];
        }
        if (equals(value1, value2)) {
          // lower and upper bound are the same, convert to inequality
          return [...processComparisonPredicate(field, ["$ne", rawValue1]), ...unitExpression];
        }
        return [{
          name: field.name,
          operator: FilterOperator.NB,
          values: [value1, value2] // types of value1 and value2 are guaranteed to be the same
        }, ...unitExpression];
    }
  }

  /**
   * Add expressions to an accumulator array.
   *
   * If an expression with the same name and operator already exists in the accumulator, the values are merged.
   *
   * @param acc The accumulator array
   * @param expressions The expressions to add
   */
  function addExpressions(acc, expressions) {
    // for each expression to push, check if there is one with the same name and operator already in the array. If so, merge the values
    for (const expr of expressions) {
      // BT/NB expressions cannot be merged
      if (expr.operator === FilterOperator.BT || expr.operator === FilterOperator.NB) {
        acc.push(expr);
        continue;
      }
      const existingExpression = acc.find(e => e.name === expr.name && e.operator === expr.operator);
      if (existingExpression) {
        existingExpression.values = [...new Set([...existingExpression.values, ...expr.values])]; // value parsing ensures that all the values are of the same type
      } else {
        acc.push(expr);
      }
    }
  }
  function fieldDictionary(metadata) {
    const dictionary = metadata.reduce((acc, field) => {
      acc[field.name] = field;
      return acc;
    }, {});
    return name => name !== undefined ? dictionary[name] : undefined;
  }

  /**
   * Get the fields for which code lists must be initialized in order to convert the filter.
   *
   * This includes all fields for which there are filter predicates, as well as their unit fields (if any).
   *
   * @param filter The filter object
   * @param getFieldByName A function that returns the field metadata for a given field name
   * @returns The fields for which code lists must be initialized
   */
  function getFieldsToRequest(filter, getFieldByName) {
    return Object.keys(filter).flatMap(fieldName => {
      const field = getFieldByName(fieldName);
      if (!field) {
        Log.warning(`Field '${fieldName}' is unknown. Skipping.`);
        return [];
      }
      const fields = [field];
      if (field.unit) {
        const unitField = getFieldByName(field.unit);
        if (unitField) {
          fields.push(unitField);
        } else {
          Log.warning(`Unit field '${field.unit}' is unknown. Skipping.`);
        }
      }
      return fields;
    });
  }

  /**
   * Converts a filter object into an array of EasyFilterExpressions.
   *
   * @param filter The filter object to convert
   * @param metadata The metadata of the properties
   * @returns The converted filter
   */
  async function convertFilter(filter, metadata) {
    const result = [];
    const getFieldByName = fieldDictionary(metadata);

    // Make sure the code lists of all involved fields are initialized before converting the predicates. Doing this
    // here ensures that the code lists are only fetched once per field, and that the conversion of the predicates can
    // be done synchronously.
    // We need the code lists for all the fields for which there are filter predicates, as well as their unit fields (if any).
    const fieldsToRequest = getFieldsToRequest(filter, getFieldByName);
    await getCodeLists(fieldsToRequest);

    // From here on, conversion is done synchronously

    for (const [fieldName, predicates] of Object.entries(filter)) {
      const field = getFieldByName(fieldName);
      if (!field) {
        continue;
      }
      for (const predicate of predicates) {
        if (isComparisonPredicate(predicate)) {
          addExpressions(result, processComparisonPredicate(field, predicate));
        } else if (isComparisonPredicateWithUnit(predicate)) {
          const unitField = getFieldByName(field.unit);
          addExpressions(result, processComparisonPredicateWithUnit(field, predicate, unitField));
        } else if (isRangePredicate(predicate)) {
          addExpressions(result, processRangePredicate(field, predicate));
        } else if (isRangePredicateWithUnit(predicate)) {
          const unitField = getFieldByName(field.unit);
          addExpressions(result, processRangePredicateWithUnit(field, predicate, unitField));
        } else if (isSetMembershipPredicate(predicate)) {
          addExpressions(result, processSetMembershipPredicate(field, predicate));
        } else {
          Log.error(`Unknown expression type: ${JSON.stringify(predicate)}. Skipping.`);
        }
      }
    }

    // sort the expressions by field name and operator to ensure a consistent order
    return result.sort((a, b) => a.name.localeCompare(b.name) || a.operator.localeCompare(b.operator));
  }
  var __exports = {
    __esModule: true
  };
  __exports.convertFilter = convertFilter;
  return __exports;
});
//# sourceMappingURL=FilterExpressionConverter-dbg.js.map
