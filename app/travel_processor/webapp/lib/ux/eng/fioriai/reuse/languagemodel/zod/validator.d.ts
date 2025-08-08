declare module "ux/eng/fioriai/reuse/languagemodel/zod/validator" {
    import { ValidationFunction } from "ux/eng/fioriai/reuse/languagemodel/JsonValidator";
    import { z } from "zod";
    /**
     * Validates a JSON object using a Zod schema.
     *
     * @template T The expected type of the JSON object.
     * @param schema The Zod schema to use for validation.
     * @returns The validation function.
     */
    function validateWithZodSchema<T>(schema: z.ZodType<T>): ValidationFunction<T>;
}
//# sourceMappingURL=validator.d.ts.map