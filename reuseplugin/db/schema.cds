namespace schema;

//@cds.external : true
type API_FIORIAI.AIU_D_INSFILTERRES_FILTER {
  name          : LargeString not null;
  propertylabel : LargeString not null;
  operator      : LargeString not null;
  values        : many API_FIORIAI.AIU_D_INSFILTERRES_VALUES not null;
};
//@cds.external : true
type API_FIORIAI.AIU_D_SafFromInputResponse {
  appDescription : LargeString not null;
  chipID         : LargeString not null;
  configuration  : LargeString not null;
  iconUrl        : LargeString not null;
  subTitle       : LargeString not null;
  tileType       : LargeString not null;
  title          : LargeString not null;
};
//@cds.external : true
type API_FIORIAI.AIU_D_INSFILTERRES_TOKENS {
  top          : LargeString not null;
  app          : API_FIORIAI.AIU_D_INSFILTERRES_APP not null;
  appwithlabel : API_FIORIAI.AIU_D_INSFILTERRES_APPLABEL not null;
  filters      : many API_FIORIAI.AIU_D_INSFILTERRES_FILTER not null;
  orders       : many API_FIORIAI.AIU_D_INSFILTERRES_ORDER not null;
  selects      : many API_FIORIAI.AIU_D_INSFILTERRES_SELECT not null;
  topwithlabel : API_FIORIAI.AIU_D_INSFILTERRES_TOP not null;
};
//@cds.external : true
type API_FIORIAI.AIU_D_INSFILTERRES_TOP {
  toplabel : LargeString not null;
  value    : LargeString not null;
};
//@cds.external : true
type API_FIORIAI.AIU_D_INSFILTERRES_VALUES {
  value : LargeString not null;
};
//@cds.external : true
type API_FIORIAI.AIU_D_INSFILTERRES_APP {
  name : LargeString not null;
};
//@cds.external : true
type API_FIORIAI.AIU_D_INSFILTERRES_APPLABEL {
  name     : LargeString not null;
  applabel : LargeString not null;
};
//@cds.external : true
type API_FIORIAI.AIU_D_INSFILTERRES_ORDER {
  name          : LargeString not null;
  propertylabel : LargeString not null;
  operator      : LargeString not null;
  operatorlabel : LargeString not null;
};
//@cds.external : true
type API_FIORIAI.AIU_D_INSFILTERRES_SELECT {
  name          : LargeString not null;
  propertylabel : LargeString not null;
};
//@cds.external : true
type API_FIORIAI.SAP__Message {
  code              : LargeString not null;
  message           : LargeString not null;
  target            : LargeString;
  additionalTargets : many LargeString not null;
  transition        : Boolean not null;
  @odata.Type: 'Edm.Byte'
  numericSeverity   : Integer not null;
  longtextUrl       : LargeString;
};
//@cds.external : true
@cds.persistence.skip                                        : true
@Common.Label                                                : 'Smart Summarization Projection View'
//@Common.Messages : SAP__Messages
@Capabilities.SearchRestrictions.Searchable                  : false
@Capabilities.InsertRestrictions.Insertable                  : false
@Capabilities.DeleteRestrictions.Deletable                   : false
@Capabilities.UpdateRestrictions.Updatable                   : false
@Capabilities.UpdateRestrictions.QueryOptions.SelectSupported: true
entity API_FIORIAI.Summarization {
      @Core.Computed         : true
      @Common.IsDigitSequence: true
  key ID            : String(1) not null;
      SAP__Messages : many API_FIORIAI.SAP__Message not null;
} actions {
  action summarize(_it : many $self not null,
                   content : String(200000) not null,
                   languageCode : String(12) not null) returns LargeString not null;
};
