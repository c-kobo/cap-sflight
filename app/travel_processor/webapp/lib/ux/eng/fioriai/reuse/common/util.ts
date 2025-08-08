/**
 * Converts an object into an array of `{ name, value }` objects.
 *
 * @template T The type of the input object.
 * @param obj The object to convert.
 * @returns An array where each element represents a property of the original object as a `{ name, value }` object.
 */
export function objectToNameValueObject<T extends Record<string, T[keyof T]>>(
    obj: T
): { name: keyof T; value: T[keyof T] }[] {
    return Object.entries(obj).map(([name, value]) => ({ name, value }));
}
