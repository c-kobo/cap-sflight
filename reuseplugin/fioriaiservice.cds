using {schema as my} from './db/schema.cds';
namespace com.sap.gateway.srvd.aiu_ui_prompt;
@path: '/sap/opu/odata4/sap/aiu_ui_prompt/srvd/sap/aiu_ui_prompt/0001'
service v0001 {
  entity Summarization as
    projection on my.API_FIORIAI.Summarization {
      ID,
      SAP__Messages
    } actions {
      action summarize(_it : many $self not null,
                       content : String(200000) not null,
                       languageCode : String(12) not null) returns LargeString not null;
    };
}
