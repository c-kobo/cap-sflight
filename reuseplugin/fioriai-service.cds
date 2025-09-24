namespace com.sap.gateway.srvd.aiu_ui_prompt;
@path: '/sap/opu/odata4/sap/aiu_ui_prompt/srvd/sap/aiu_ui_prompt/0001'
service v0001 {
  // Define the entity set for the summarization
  entity Summarization {
    key ID : UUID;
    content : LargeString;
    summary : LargeString;
    languageCode : String(12);
    createdAt : Timestamp;
    createdBy : String(255);
  }
  actions {
    action summarize(_it : many $self not null,
                    content : String(200000) not null,
                    languageCode : String(12) not null) returns LargeString not null;
  };
}