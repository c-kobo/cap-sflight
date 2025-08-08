import Ui5Element from "sap/ui/core/Element";
import View from "sap/ui/core/mvc/View";
import Context from "sap/ui/model/Context";

export type Direction = "DOWN" | "UP";
export type ModelVersion = "sap.ui.model.odata.v4.ODataModel" | "sap.ui.model.odata.v2.ODataModel";

export type SectionTree = {
    sectionID: string;
    sectionName: string;
    selected: boolean;
    nodes: SectionTree[];
};

export interface SummarizationModel {
    summaryValues: {
        showLoading: boolean;
        isFailed: boolean;
        isShareAvailable: boolean;
        summaryValue: string;
        showAiNotice: boolean;
        richTextEditConfig: object[];
        thumbsUpClicked: boolean;
        thumbsDownClicked: boolean;
        allowSummaryInteraction: boolean;
    };
    //recursive type consisting of text and subsequent nodes
    sections: {
        partiallySelected: boolean;
        allSelected: boolean;
        busyState: boolean;
        selectCount: number;
        totalCount: number;
        sectionTree: SectionTree[];
        excludedNodes: string[];
    };
    view: View;
}

export interface ElementsWithHeadings {
    element: Element;
    heading: string;
}

type PropertyName = string;

export interface BaseColumn {
    columnId: string;
    label?: string;
    property: PropertyName | PropertyName[];
}

export interface CurrencyColumn extends BaseColumn {
    type: "Currency";
    unitProperty: string;
}

export interface NumberColumn extends BaseColumn {
    type: "Number";
    unitProperty?: string;
}

export interface DateColumn extends BaseColumn {
    type: "Date";
}

export interface DateTimeOffsetColumn extends BaseColumn {
    type: "DateTime";
}
export interface BooleanColumn extends BaseColumn {
    type: "Boolean";
}

export interface StringColumn extends BaseColumn {
    type: "String";
    template: string;
}
export interface TypeSpecificTextResult {
    text: string;
    elementProcessed: boolean;
}

export type ColumnSchema =
    | CurrencyColumn
    | NumberColumn
    | DateColumn
    | DateTimeOffsetColumn
    | BooleanColumn
    | StringColumn;
export type TableRowDataValue = string | number | boolean | Date | null;
export type TableRowData = { [property: PropertyName]: TableRowDataValue | TableRowData | Context };
export type TypeSpecificTextHandlerResult =
    | Promise<TypeSpecificTextResult | undefined>
    | TypeSpecificTextResult
    | undefined;
export type TypeSpecificTextHandler = (element: Ui5Element) => TypeSpecificTextHandlerResult;
export interface ExportSettings {
    workbook: {
        columns: ColumnSchema[];
    };
}
