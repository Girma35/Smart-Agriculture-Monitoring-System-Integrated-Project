const fs = require('fs');
const path = require('path');

const apiPath = path.join(__dirname, 'apps/api');

const docs = [];

docs.push("=".repeat(50));
docs.push("SMART AGRICULTURE MONITORING SYSTEM - BACKEND DOCS");
docs.push("=".repeat(50));
docs.push("\nThis document contains a comprehensive overview of all backend functions, their purposes, parameters, and return values.\n");

// Add controllers
docs.push("## CONTROLLERS\n");
docs.push("### aiController.js");
docs.push("- `diagnose(req, res)`: Handles POST /api/v1/diagnose. Accepts a multipart/form-data upload with a leaf image and optional cropType. Returns a JSON diagnosis envelope with disease details, confidence, and remedies.");

docs.push("\n### diagnose.controller.js");
docs.push("- `submitDiagnosis(req, res)`: Handles POST /api/v1/diagnose. Submits a leaf image for AI disease diagnosis and saves the mock record.");
docs.push("- `getHistory(req, res)`: Handles GET /api/v1/diagnose/history. Retrieves the authenticated farmer's diagnosis history.");
docs.push("- `getSingleDiagnosis(req, res)`: Handles GET /api/v1/diagnose/:id. Retrieves a single diagnosis result by ID.");
docs.push("- `removeDiagnosis(req, res)`: Handles DELETE /api/v1/diagnose/:id. Deletes a specific diagnosis record.");

docs.push("\n### sensor-analysis.controller.js");
docs.push("- `analyzeSensors(req, res)`: Handles POST /api/v1/sensor-analysis. Accepts a JSON body with IoT sensor readings (temperature, humidity, soilMoisture, cropType) and returns AI-powered farming recommendations.");

docs.push("\n### mqttController.js");
docs.push("- `getLatest(req, res)`: Handles GET /api/latest. Returns the most recent sensor reading from MQTT.");
docs.push("- `getHistory(req, res)`: Handles GET /api/history. Returns the rolling array of the last 50 sensor readings.");
docs.push("- `controlPump(req, res)`: Handles POST /api/pump. Sends a pump control command (ON/OFF) via MQTT.");
docs.push("- `getStatus(req, res)`: Handles GET /api/status. Returns server health status, MQTT connection status, and uptime.");

// Add services
docs.push("\n\n## SERVICES\n");
docs.push("### aiService.js");
docs.push("- `analyzeImage(base64Image, mediaType, cropType)`: Analyzes a base64-encoded crop leaf image using the Roboflow Inference API. Returns a structured diagnosis JSON.");

docs.push("\n### ai.service.js");
docs.push("- `diagnoseCropDisease(imageBuffer, mimeType, cropType)`: Wrapper for Roboflow API to diagnose crop diseases from raw image buffer data.");

docs.push("\n### diagnose.service.js");
docs.push("- `createDiagnosis(userId, imageBuffer, mimeType, originalName, cropType)`: Creates a new mock diagnosis record after running AI diagnosis.");
docs.push("- `getDiagnosisHistory(userId)`: Retrieves a mocked array of past diagnoses for the user.");
docs.push("- `getDiagnosisById(userId, diagnosisId)`: Retrieves a single mocked diagnosis record by its ID.");
docs.push("- `deleteDiagnosis(userId, diagnosisId)`: Mocks the deletion of a diagnosis record.");

docs.push("\n### sensor-analysis.service.js");
docs.push("- `buildSensorAnalysisPrompt(reading)`: Builds a prompt string for LLM analysis based on sensor readings and ideal crop ranges.");
docs.push("- `parseSensorAnalysisResponse(rawText)`: Parses and validates the JSON response from an LLM.");
docs.push("- `analyzeSensorData(reading)`: Analyzes farm sensor readings using localized rules and returns recommendations, alerts, and status without external LLM calls.");

docs.push("\n### mqttService.js");
docs.push("- `generateRecommendation(soilMoisture, temperature, humidity)`: Rules engine to calculate agricultural recommendation strings based on sensor data.");
docs.push("- `initialize()`: Initializes the MQTT client connection and subscribes to data topics.");
docs.push("- `getLatestReading()`: Retrieves the latest sensor reading from the rolling history.");
docs.push("- `getHistory()`: Retrieves all readings in the rolling history buffer.");
docs.push("- `setPumpState(state)`: Publishes a pump control state (ON or OFF) to the control topic.");
docs.push("- `getStatus()`: Gets the MQTT connection status, server uptime, and timestamp.");

docs.push("\n### roboflowService.js");
docs.push("- `predictImage(imageBuffer, mimeType)`: Sends raw image data to the Roboflow Object Detection API and returns the structured diagnosis.");
docs.push("- `parseRoboflowResult(result)`: Parses and validates the predictions array from the Roboflow JSON response, matching against a local disease database.");

fs.writeFileSync(path.join(__dirname, 'back_docs.txt'), docs.join('\n'));
console.log('back_docs.txt created successfully.');
