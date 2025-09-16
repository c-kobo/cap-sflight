const cds = require("@sap/cds");
const path = require("path");
const fs = require("fs");
const { OrchestrationClient } = require("@sap-ai-sdk/orchestration");
const { PromptTemplatesApi } = require("@sap-ai-sdk/prompt-registry");

console.log('Fiori AI Plugin loading...');

const scenarioId = "AIU_SUMMARIZATION";

// Register CDS model extension
cds.on('loaded', (model) => {
    try {
        const serviceFilePath = path.join(__dirname, 'fioriaiservice.cds');
        
        if (fs.existsSync(serviceFilePath)) {
            const serviceContent = fs.readFileSync(serviceFilePath, 'utf8');
            const parsedService = cds.parse(serviceContent, serviceFilePath);
            model.definitions = { ...model.definitions, ...parsedService.definitions };
        }
        
    } catch (error) {
        console.error('Error loading Fiori AI plugin CDS files:', error);
    }
});

cds.on('served', () => {
    const service = cds.services['com.sap.gateway.srvd.aiu_ui_prompt.v0001'];
    if (!service) {
        console.error('Fiori AI service not found');
        return;
    }

    // Summarization odata handler
    service.on('summarize', 'Summarization', async (req) => {
        try {
            const { content, languageCode } = req.data || {};
            
            if (!content || !languageCode) {
                req.error(400, "Content and languageCode are required");
                return;
            }

            // Get prompt templates
            const templates = await PromptTemplatesApi.listPromptTemplates({
                scenario: scenarioId,
            }).execute();

            if (!templates || templates.count === 0) {
                req.error(404, `No prompt templates found for scenario: ${scenarioId}`);
                return;
            }

            // Sort templates by version and use the latest
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

            const latestTemplate = templates.resources[0];

            // Initialize orchestration client
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
                        name: latestTemplate.name,
                        scenario: scenarioId,
                        version: latestTemplate.version,
                    },
                },
            });

            // Call AI summarization
            const response = await orchestrationClient.chatCompletion({
                inputParams: {
                    summarizeData: content,
                    languageCode: languageCode,
                },
            });

            return response.getContent();
            
        } catch (error) {
            console.error('Error in summarization:', error);
            req.error(500, `Error processing summarization: ${error.message}`);
        }
    });
    
    console.log('Fiori AI Plugin initialized successfully');
});