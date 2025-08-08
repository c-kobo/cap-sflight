/**
 * Name of a placeholder in a prompt template.
 */
export type TemplateParameterName = `ISLM_${string}`;

/**
 * A prompt message.
 *
 * This is a message that can be sent to the AI model to prompt it for a response. The message does not contain the full
 * content, but rather a template name and parameters to insert into the template.
 */
export type PromptMessage = {
    /** The role of the message */
    role: "system" | "user" | "assistant";

    /** Prompt template name */
    template: string;

    /** Parameters to insert into the template by replacing placeholders of the same name. */
    parameters?: Record<TemplateParameterName, string>;
};
