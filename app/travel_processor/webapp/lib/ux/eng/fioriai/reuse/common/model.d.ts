declare module "ux/eng/fioriai/reuse/common/model" {
    import Model from "sap/ui/model/Model";
    import { ModelVersion } from "ux/eng/fioriai/reuse/common/types";
    /**
     * Get the model version of the given model.
     *
     * @param model The model to get the version for
     * @returns The model version
     */
    function getModelVersion(model: Model): ModelVersion;
}
//# sourceMappingURL=model.d.ts.map