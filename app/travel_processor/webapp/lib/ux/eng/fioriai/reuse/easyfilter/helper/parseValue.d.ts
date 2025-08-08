declare module "ux/eng/fioriai/reuse/easyfilter/helper/parseValue" {
    import { Value } from "ux/eng/fioriai/reuse/easyfilter/schemas/FilterSchema";
    /**
     * Parse the value as an integer.
     *
     * @param value Value to parse
     * @param min Lower bound
     * @param max Upper bound
     * @returns Parsed value as an integer, or undefined if the value is not a number
     */
    function integer(value: Value, min: number, max: number): number | undefined;
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
    function boolean(value: Value): boolean;
    /**
     * Parse the value as a number.
     *
     * @param value Value to parse
     * @returns Parsed value as a number, or undefined if the value is not a number
     */
    function float(value: Value): number;
    /**
     * Parse the value as a date.
     *
     * @param value Value to parse
     * @returns Parsed value as a Date object, or undefined if the value is not a valid date
     */
    function date(value: Value): Date;
    /**
     * Parse the value into date and time.
     *
     * @param value Value to parse
     * @returns Parsed value as a Date object, or undefined if the value is not a valid date
     */
    function dateTime(value: boolean | string | number): Date;
    /**
     * Parse the value as a time.
     *
     * @param value Value to parse
     * @returns Parsed value as a Date object with the date part set to 1970-01-01 and the time part set to the parsed time, or
     *          undefined if the value is not a valid time
     */
    function time(value: Value): Date;
    type ParsedValue = string | number | boolean | Date;
    /**
     * Parse the value according to the EDM type
     *
     * @param edmType EDM type
     * @param value Value to parse
     * @returns Parsed value
     */
    export default function parseValue(edmType: string | undefined, value: boolean | string | number): ParsedValue | undefined;
}
//# sourceMappingURL=parseValue.d.ts.map