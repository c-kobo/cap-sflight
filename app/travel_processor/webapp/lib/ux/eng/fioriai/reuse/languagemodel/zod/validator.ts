import { error, success } from "ux/eng/fioriai/reuse/common/result";
import { ValidationFunction } from "ux/eng/fioriai/reuse/languagemodel/JsonValidator";
import { z } from "zod";

/**
 * Validates a JSON object using a Zod schema.
 *
 * @template T The expected type of the JSON object.
 * @param schema The Zod schema to use for validation.
 * @returns The validation function.
 */
export function validateWithZodSchema<T>(schema: z.ZodType<T>): ValidationFunction<T> {
    return async function validate(json) {
        const result = await schema.safeParseAsync(json);
        if (!result.success) {
            return error(
                result.error.issues
                    .map(({ path, message }) => {
                        const pathString = path.map((key) => `[${JSON.stringify(key)}]`).join("");
                        return `${pathString}: ${message}`;
                    })
                    .join(", ")
            );
        }
        return success(result.data);
    };
}
