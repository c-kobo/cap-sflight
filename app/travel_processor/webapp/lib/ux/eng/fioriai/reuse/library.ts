import Lib from "sap/ui/core/Lib";
import { summarize as _summarize, SummarizeOptions } from "./summary/SmartSummary";

/**
 * Fiori AI reuse library.
 */
Lib.init({
    name: "ux.eng.fioriai.reuse",
    version: "${project.version}",
    dependencies: [
        // keep in sync with the ui5.yaml and .library files. Do not list lazy dependencies here, else they will be loaded eagerly
        "sap.ui.core",
        "sap.m"
    ],
    noLibraryCSS: false // if no CSS is provided, you can disable the library.css load here
});

/**
 * Start smart summarize.
 *
 * @param options options for summarize, e.g. the view.
 * @deprecated Use `summarize` from `ux/eng/fioriai/reuse/summary/SmartSummary` instead.
 */
export async function summarize(options: SummarizeOptions): Promise<void> {
    return _summarize(options);
}
