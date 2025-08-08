import Model from "sap/ui/model/Model";
import { ModelVersion } from "./types";

/**
 * Get the model version of the given model.
 *
 * @param model The model to get the version for
 * @returns The model version
 */
export function getModelVersion(model: Model): ModelVersion {
    return model.getMetadata().getName() as ModelVersion;
}
