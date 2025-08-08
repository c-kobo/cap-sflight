"use strict";

sap.ui.define([], function () {
  "use strict";

  /**
   * Parse the value as an integer.
   *
   * @param value Value to parse
   * @param min Lower bound
   * @param max Upper bound
   * @returns Parsed value as an integer, or undefined if the value is not a number
   */
  function integer(value, min, max) {
    const num = Math.trunc(Number(value));
    return isNaN(num) ? undefined : Math.min(Math.max(num, min), max);
  }

  /**
   * Parse the value as a boolean.
   *
   * Falsy values are parsed to false. Apart from the boolean false value, these are most importantly 0 and the empty string.
   * other values are considered true, except for the strings "false" and "0" (which are treated as if they were a
   * boolean or a number, respectively).
   *
   * @param value Value to parse
   * @returns Parsed value as a boolean
   */
  function boolean(value) {
    return value === "false" || value === "0" ? false : !!value;
  }

  /**
   * Parse the value as a number.
   *
   * @param value Value to parse
   * @returns Parsed value as a number, or undefined if the value is not a number
   */
  function float(value) {
    const num = Number(value);
    return isNaN(num) ? undefined : num;
  }

  /**
   * Parse the value as a date.
   *
   * @param value Value to parse
   * @returns Parsed value as a Date object, or undefined if the value is not a valid date
   */
  function date(value) {
    if (typeof value === "boolean" || value === "") {
      return undefined;
    }
    const num = Number(value);
    const val = !isNaN(num) ? new Date(num) : new Date(value);
    if (!isNaN(val.getTime())) {
      val.setUTCHours(0, 0, 0, 0);
      return new Date(val);
    }
    return undefined;
  }

  /**
   * Parse the value into date and time.
   *
   * @param value Value to parse
   * @returns Parsed value as a Date object, or undefined if the value is not a valid date
   */
  function dateTime(value) {
    if (typeof value === "boolean" || value === "") {
      return undefined;
    }
    const num = Number(value);
    if (!isNaN(num)) {
      return new Date(num);
    }
    const dateValue = new Date(value);
    return isNaN(dateValue.getTime()) ? undefined : dateValue;
  }

  /**
   * Parse the value as a time.
   *
   * @param value Value to parse
   * @returns Parsed value as a Date object with the date part set to 1970-01-01 and the time part set to the parsed time, or
   *          undefined if the value is not a valid time
   */
  function time(value) {
    if (typeof value === "boolean" || value === "") {
      return undefined;
    }
    const num = Number(value);
    const val = isNaN(num) ? new Date(value) : new Date(num);
    if (!isNaN(val.getTime())) {
      // parsed successfully
      val.setUTCFullYear(1970, 0, 1);
      return new Date(val);
    } else {
      // try to parse as time string
      const [hr, min, sec] = value.toString().split(":").map(Number);

      // split the sec into seconds and milliseconds
      const s = isNaN(sec) ? 0 : Math.trunc(sec);
      const ms = isNaN(sec) ? 0 : Math.trunc((sec - s) * 1000);
      const timeValue = new Date(0);
      timeValue.setUTCHours(hr, min, s, ms);
      return isNaN(timeValue.getTime()) ? undefined : timeValue;
    }
  }
  /**
   * Parse the value according to the EDM type
   *
   * @param edmType EDM type
   * @param value Value to parse
   * @returns Parsed value
   */
  function parseValue(edmType, value) {
    switch (edmType) {
      case "Edm.Boolean":
        // Binary-valued logic
        return boolean(value);
      case "Edm.Byte":
        // Unsigned 8-bit integer
        return integer(value, 0, 2 ** 8 - 1);
      case "Edm.SByte":
        // Signed 8-bit integer
        return integer(value, -(2 ** 7), 2 ** 7 - 1);
      case "Edm.Int16":
        // Signed 16-bit integer
        return integer(value, -(2 ** 15), 2 ** 15 - 1);
      case "Edm.Int32":
        // Signed 32-bit integer
        return integer(value, -(2 ** 31), 2 ** 31 - 1);
      case "Edm.Int64":
        // Signed 64-bit integer
        return integer(value, -(2 ** 63), 2 ** 63 - 1);
      case "Edm.Decimal": // Numeric values with fixed precision and scale
      case "Edm.Single": // Floating-point number with 7 digits precision
      case "Edm.Double":
        // Floating-point number with 15 digits precision
        return float(value);
      case "Edm.Date":
        // Date without a time-zone offset
        return date(value);
      case "Edm.DateTime": // (OData 2.0) Date and time with a time-zone offset
      case "Edm.DateTimeOffset":
        // Date and time with a time-zone offset, no leap seconds
        return dateTime(value);
      case "Edm.TimeOfDay":
        // Clock time 00:00:00.0000000 through 23:59:59.9999999
        return time(value);
      case "Edm.String": // Fixed-length or variable-length sequence of UTF-8 characters
      default:
        // everything else is treated as string
        return String(value);
    }
  }
  return parseValue;
});
//# sourceMappingURL=parseValue-dbg.js.map
