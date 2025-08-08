import cds from '@sap/cds'
let OrchestrationClient;
let PromptTemplatesApi;
(async () => {
  ({ OrchestrationClient } = await import("@sap-ai-sdk/orchestration"));
  ({ PromptTemplatesApi } = await import("@sap-ai-sdk/prompt-registry"));
})();

// AI Prompt Service for summarization
export class v0001 extends cds.ApplicationService { 
  init() {
    const scenarioId = "AIU_SUMMARIZATION";

    this.on("summarize", async (req) => {
      const { content, languageCode } = req.data || {};
      if (!content || !languageCode) {
        return req.error(400, "Invalid request");
      }

      // check for template in prompt registry
      const templates = await PromptTemplatesApi.listPromptTemplates({
        scenario: scenarioId,
      }).execute();

      if (!templates || templates.count === 0) {
        return req.error(404, `No prompt templates found.`);
      }

      //sort templates by version (should be done by the API, but just in case)
      templates.resources.sort((a, b) => {
        const versionA = a.version.split('.').map(Number);
        const versionB = b.version.split('.').map(Number);
        //consider versions of different lengths, e.g. 1.0.0 vs 1.0
        for (let i = 0; i < Math.max(versionA.length, versionB.length); i++) {
          // if one version is shorter, pad it with zeros
          const a = versionA[i] || 0;
          const b = versionB[i] || 0;
          if (b !== a) return b - a;
        }
        // all parts are equal
        return 0;
      });

      const orchestrationClient = new OrchestrationClient({
        llm: {
          model_name: "gpt-4o",
          model_version: '2024-08-06',
          model_params: {
            max_tokens: 4096,
            temperature: 0.0,
            frequency_penalty: 0.1,
            presence_penalty: 0.1
          }
        },
        templating: {
          template_ref: {
            name: templates.resources[0].name,
            scenario: scenarioId,
            version: templates.resources[0].version,
          },
        },
      });

      const response = await orchestrationClient.chatCompletion({
        inputParams: {
          summarizeData: content,
          languageCode: languageCode,
        },
      });

      return response.getContent();
    });

    return super.init();
  }
}