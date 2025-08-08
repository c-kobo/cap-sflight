import { callAction, Value } from "ux/eng/fioriai/reuse/service/action";

const _callFioriAiAction = callAction.bind(null, "/sap/opu/odata4/sap/aiu_ui_prompt/srvd/sap/aiu_ui_prompt/0001/");

/**
 * Calls the Fiori AI action with the given parameters.
 *
 * @param args The parameters to pass to the action.
 * @returns The result of the action call.
 */
export const callFioriAiAction = _callFioriAiAction as <T extends Value>(
    ...args: Parameters<typeof _callFioriAiAction>
) => ReturnType<typeof callAction<T>>;

/**
 * Calls the Fiori AI action with the given parameters and a dynamic service URL prefix.
 *
 * @param serviceUrl The OData service URL prefix to use for the action call.
 * @param action The action to call. This must be a fully-qualified OData action name.
 * @param parameters Action parameters.
 * @returns The result of the action call.
 */
export function callFioriAiSummarizeAction<T extends Value>(
    serviceUrl: string,
    action: string,
    parameters?: { [name: string]: Value }
) {
    return callAction<T>(`/${serviceUrl}`, action, parameters);
}
