import Switch from "sap/m/Switch";
import type MTable from "sap/m/Table";
import type SmartTable from "sap/ui/comp/smarttable/SmartTable";
import Element from "sap/ui/core/Element";
import type MDCTable from "sap/ui/mdc/Table";
import type UITable from "sap/ui/table/Table";
import Log from "ux/eng/fioriai/reuse/common/log";
import type { TypeSpecificTextHandler, TypeSpecificTextHandlerResult } from "../types";
import * as tableExtraction from "./table";

/**
 * Map to handle UI5 type specific texts that are added to the summarization.
 * Access is done through a map UI5 metadata name -> type specific text function with:
 *
 * @param element The UI5 element.
 * @returns - Additional text to be added to the summarization, undefined if no additional text exists.
 */
const typeSpecificTextMap = new Map<string, TypeSpecificTextHandler>([
    // Higher level table types mdc and smart table contain lower level table types.
    // Complete handling of the table content depends on the export column schema availability, and child nodes are skipped only then.
    ["sap.ui.mdc.Table", (element: Element) => tableExtraction.mdcTableText(element as MDCTable)],
    ["sap.ui.comp.smarttable.SmartTable", (element: Element) => tableExtraction.smartTableText(element as SmartTable)],
    ["sap.m.Table", (element: Element) => tableExtraction.mTableText(element as MTable)],
    ["sap.ui.table.Table", (element: Element) => tableExtraction.uiTableText(element as UITable)],
    [
        "sap.m.Switch",
        (element: Element) => ({
            text: (element as Switch).getState()
                ? (element as Switch).getCustomTextOn()
                : (element as Switch).getCustomTextOff(),
            elementProcessed: true
        })
    ]
]);

/**
 * Returns the type specific text handler for the given UI5 element if exists.
 *
 * @param element UI5 element
 * @returns type specific text handler if exists, otherwise undefined
 */
export function getTypeSpecificTextHandler(element: Element): TypeSpecificTextHandler | undefined {
    const metadataName = element?.getMetadata()?.getName();
    const typeSpecificTextHandler = typeSpecificTextMap.get(metadataName);
    if (typeof typeSpecificTextHandler === "function") {
        return (element: Element): TypeSpecificTextHandlerResult => {
            try {
                return typeSpecificTextHandler(element);
            } catch (error) {
                Log.warning(
                    `Error in when handling specific text for ${element.getId()} (${metadataName})`,
                    error as Error
                );
            }
        };
    }
}
