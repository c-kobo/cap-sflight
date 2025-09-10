const cds = require("@sap/cds");
const path = require("path");

module.exports = async () => {
    // Load both schema and service model from plugin folder
    const schemaPath = path.join(__dirname, "db", "schema.cds");
    const servicePath = path.join(__dirname, "fioriaiservice.cds");
    const model = await cds.load([schemaPath, servicePath]);
    cds.model = model;

	// Register handler for the summarize action on the v0001 service
	const { OrchestrationClient } = await import("@sap-ai-sdk/orchestration");
	const { PromptTemplatesApi } = await import("@sap-ai-sdk/prompt-registry");
	const scenarioId = "AIU_SUMMARIZATION";

	cds.on("serving", (service) => {
		if (service.name === "com.sap.gateway.srvd.aiu_ui_prompt.v0001") {
			service.on("summarize", async (req) => {
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
					for (let i = 0; i < Math.max(versionA.length, versionB.length); i++) {
						const a = versionA[i] || 0;
						const b = versionB[i] || 0;
						if (b !== a) return b - a;
					}
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
		}
	});
};