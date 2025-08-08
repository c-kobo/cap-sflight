declare module "ux/eng/fioriai/reuse/summary/types" {
    import Ui5Element from "sap/ui/core/Element";
    import View from "sap/ui/core/mvc/View";
    import Context from "sap/ui/model/Context";
    type Direction = "DOWN" | "UP";
    type ModelVersion = "sap.ui.model.odata.v4.ODataModel" | "sap.ui.model.odata.v2.ODataModel";
    type SectionTree = {
        sectionID: string;
        sectionName: string;
        selected: boolean;
        nodes: SectionTree[];
    };
    interface SummarizationModel {
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
    interface ElementsWithHeadings {
        element: Element;
        heading: string;
    }
    type PropertyName = string;
    interface BaseColumn {
        columnId: string;
        label?: string;
        property: PropertyName | PropertyName[];
    }
    interface CurrencyColumn extends BaseColumn {
        type: "Currency";
        unitProperty: string;
    }
    interface NumberColumn extends BaseColumn {
        type: "Number";
        unitProperty?: string;
    }
    interface DateColumn extends BaseColumn {
        type: "Date";
    }
    interface DateTimeOffsetColumn extends BaseColumn {
        type: "DateTime";
    }
    interface BooleanColumn extends BaseColumn {
        type: "Boolean";
    }
    interface StringColumn extends BaseColumn {
        type: "String";
        template: string;
    }
    interface TypeSpecificTextResult {
        text: string;
        elementProcessed: boolean;
    }
    type ColumnSchema = CurrencyColumn | NumberColumn | DateColumn | DateTimeOffsetColumn | BooleanColumn | StringColumn;
    type TableRowDataValue = string | number | boolean | Date | null;
    type TableRowData = {
        [property: PropertyName]: TableRowDataValue | TableRowData | Context;
    };
    type TypeSpecificTextHandlerResult = Promise<TypeSpecificTextResult | undefined> | TypeSpecificTextResult | undefined;
    type TypeSpecificTextHandler = (element: Ui5Element) => TypeSpecificTextHandlerResult;
    interface ExportSettings {
        workbook: {
            columns: ColumnSchema[];
        };
    }
}
//# sourceMappingURL=types.d.ts.map