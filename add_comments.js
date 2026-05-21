const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'apps/api/src');

const replacements = [
  {
    file: 'controllers/diagnose.controller.js',
    replaces: [
      {
        find: 'async function submitDiagnosis(req, res) {',
        replace: '/**\n * POST /api/v1/diagnose\n * Submit a leaf image for AI disease diagnosis.\n * @param {Object} req - The Express request object containing the image file\n * @param {Object} res - The Express response object\n * @returns {Promise<Object>} JSON containing the diagnosis results\n */\nasync function submitDiagnosis(req, res) {'
      },
      {
        find: 'async function getHistory(req, res) {',
        replace: '/**\n * GET /api/v1/diagnose/history\n * Get the authenticated farmer\'s diagnosis history.\n * @param {Object} req - The Express request object\n * @param {Object} res - The Express response object\n * @returns {Promise<Object>} JSON containing the diagnosis history\n */\nasync function getHistory(req, res) {'
      },
      {
        find: 'async function getSingleDiagnosis(req, res) {',
        replace: '/**\n * GET /api/v1/diagnose/:id\n * Get a single diagnosis result.\n * @param {Object} req - The Express request object\n * @param {Object} res - The Express response object\n * @returns {Promise<Object>} JSON containing the requested diagnosis\n */\nasync function getSingleDiagnosis(req, res) {'
      },
      {
        find: 'async function removeDiagnosis(req, res) {',
        replace: '/**\n * DELETE /api/v1/diagnose/:id\n * Delete a diagnosis record.\n * @param {Object} req - The Express request object\n * @param {Object} res - The Express response object\n * @returns {Promise<Object>} JSON confirming successful deletion\n */\nasync function removeDiagnosis(req, res) {'
      }
    ]
  },
  {
    file: 'controllers/mqttController.js',
    replaces: [
      {
        find: 'function getLatest(req, res) {',
        replace: '/**\n * GET /api/latest\n * Returns the most recent sensor reading.\n * @param {Object} req - The Express request object\n * @param {Object} res - The Express response object\n * @returns {Object} JSON containing the latest sensor reading data\n */\nfunction getLatest(req, res) {'
      },
      {
        find: 'function getHistory(req, res) {',
        replace: '/**\n * GET /api/history\n * Returns the rolling array of the last 50 readings.\n * @param {Object} req - The Express request object\n * @param {Object} res - The Express response object\n * @returns {Object} JSON containing the history of sensor readings\n */\nfunction getHistory(req, res) {'
      },
      {
        find: 'function controlPump(req, res) {',
        replace: '/**\n * POST /api/pump\n * Sends a pump control command (ON/OFF) via MQTT.\n * @param {Object} req - The Express request object containing the state\n * @param {Object} res - The Express response object\n * @returns {Object} JSON confirming the command was sent\n */\nfunction controlPump(req, res) {'
      },
      {
        find: 'function getStatus(req, res) {',
        replace: '/**\n * GET /api/status\n * Returns health status, MQTT connection, and uptime.\n * @param {Object} req - The Express request object\n * @param {Object} res - The Express response object\n * @returns {Object} JSON containing the system status\n */\nfunction getStatus(req, res) {'
      }
    ]
  },
  {
    file: 'services/diagnose.service.js',
    replaces: [
      {
        find: 'async function createDiagnosis(userId, imageBuffer, mimeType, originalName, cropType) {',
        replace: '/**\n * Creates a new diagnosis using Roboflow.\n * @param {string} userId - The ID of the user requesting the diagnosis\n * @param {Buffer} imageBuffer - The image data\n * @param {string} mimeType - The MIME type of the image\n * @param {string} originalName - The original filename\n * @param {string} cropType - The type of crop\n * @returns {Promise<Object>} The newly created diagnosis object\n */\nasync function createDiagnosis(userId, imageBuffer, mimeType, originalName, cropType) {'
      },
      {
        find: 'async function getDiagnosisHistory(userId) {',
        replace: '/**\n * Retrieves mock history\n * @param {string} userId - The ID of the user\n * @returns {Promise<Array>} Array of past diagnosis records\n */\nasync function getDiagnosisHistory(userId) {'
      },
      {
        find: 'async function getDiagnosisById(userId, diagnosisId) {',
        replace: '/**\n * Retrieves a single mock diagnosis\n * @param {string} userId - The ID of the user\n * @param {string} diagnosisId - The ID of the diagnosis\n * @returns {Promise<Object>} The requested diagnosis record\n */\nasync function getDiagnosisById(userId, diagnosisId) {'
      },
      {
        find: 'async function deleteDiagnosis(userId, diagnosisId) {',
        replace: '/**\n * Mocks deleting a diagnosis\n * @param {string} userId - The ID of the user\n * @param {string} diagnosisId - The ID of the diagnosis\n * @returns {Promise<boolean>} True if successful\n */\nasync function deleteDiagnosis(userId, diagnosisId) {'
      }
    ]
  },
  {
    file: 'services/sensor-analysis.service.js',
    replaces: [
      {
        find: 'function buildSensorAnalysisPrompt({ temperature, humidity, soilMoisture, cropType }) {',
        replace: '/**\n * Build the prompt (kept for backward compatibility and testing)\n * @param {Object} reading - Sensor reading data containing temperature, humidity, soilMoisture, cropType\n * @returns {string} The formatted prompt string\n */\nfunction buildSensorAnalysisPrompt({ temperature, humidity, soilMoisture, cropType }) {'
      },
      {
        find: 'function parseSensorAnalysisResponse(rawText) {',
        replace: '/**\n * Validate response schema (kept for testing)\n * @param {string} rawText - The JSON string to parse\n * @returns {Object} The parsed and validated response object\n */\nfunction parseSensorAnalysisResponse(rawText) {'
      },
      {
        find: 'async function analyzeSensorData(reading) {',
        replace: '/**\n * Analyze farm sensor readings using localized rules.\n * Does not make external LLM calls. Fully free.\n * @param {Object} reading - The sensor reading object\n * @returns {Promise<Object>} The analysis result including recommendations and alerts\n */\nasync function analyzeSensorData(reading) {'
      }
    ]
  },
  {
    file: 'services/mqttService.js',
    replaces: [
      {
        find: 'function generateRecommendation(soilMoisture, temperature, humidity) {',
        replace: '/**\n * Rules engine to calculate agricultural recommendation strings\n * @param {number} soilMoisture - Soil moisture percentage\n * @param {number} temperature - Temperature in Celsius\n * @param {number} humidity - Humidity percentage\n * @returns {string} A string containing farming recommendations\n */\nfunction generateRecommendation(soilMoisture, temperature, humidity) {'
      },
      {
        find: 'function initialize() {',
        replace: '/**\n * Initialize MQTT Client connection and subscriptions\n * @returns {void}\n */\nfunction initialize() {'
      },
      {
        find: 'function getLatestReading() {',
        replace: '/**\n * Get the latest sensor reading\n * @returns {Object|null} The most recent sensor reading from the history buffer\n */\nfunction getLatestReading() {'
      },
      {
        find: 'function getHistory() {',
        replace: '/**\n * Get all readings in the rolling history buffer\n * @returns {Array} Array of past sensor readings\n */\nfunction getHistory() {'
      },
      {
        find: 'function setPumpState(state) {',
        replace: '/**\n * Publish pump control state (ON or OFF)\n * @param {string} state - The desired state ("ON" or "OFF")\n * @returns {void}\n */\nfunction setPumpState(state) {'
      },
      {
        find: 'function getStatus() {',
        replace: '/**\n * Get MQTT status, server uptime, etc.\n * @returns {Object} Server and MQTT status information\n */\nfunction getStatus() {'
      }
    ]
  },
  {
    file: 'services/roboflowService.js',
    replaces: [
      {
        find: 'async function predictImage(imageBuffer, mimeType) {',
        replace: '/**\n * Predict crop disease from an image buffer using Roboflow API\n * @param {Buffer} imageBuffer - Raw image data\n * @param {string} mimeType - Image MIME type (e.g. "image/jpeg")\n * @returns {Promise<object>} Structured diagnosis result\n */\nasync function predictImage(imageBuffer, mimeType) {'
      },
      {
        find: 'function parseRoboflowResult(result) {',
        replace: '/**\n * Parse and validate predictions array from Roboflow JSON response\n * @param {Object} result - The raw JSON result from Roboflow\n * @returns {Object} Structured diagnosis matching local disease database\n */\nfunction parseRoboflowResult(result) {'
      }
    ]
  }
];

for (const item of replacements) {
  const filePath = path.join(srcDir, item.file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  for (const rep of item.replaces) {
    // Basic replace: avoid double comments by checking if we already replaced it or if there is already a large comment block
    // We can just replace the function declaration with the commented version, first removing any previous basic docblock if needed
    // The previous docblocks are 3-4 lines above the function usually. We will just search and replace the function declaration for safety.
    
    // Some files already have comments above them. Let's just blindly replace the small comment block + function definition 
    // with our perfect one.
    
    // Instead of complex regex, let's try a simple replace. If there's an existing small comment right above, we might leave it.
    // Let's use regex to replace `/** ... */\nfunctionName` with our new one.
    
    const funcNameMatch = rep.find.match(/(?:async )?function ([a-zA-Z0-9_]+)/);
    if (funcNameMatch) {
      const funcName = funcNameMatch[1];
      // Match optional existing comment block before the function
      const regex = new RegExp(`(?:\\/\\*\\*[\\s\\S]*?\\*\\/\\s*)?` + rep.find.replace(/[.*+?^$\\{\\}()|[\\]\\\\]/g, '\\$&'));
      content = content.replace(regex, rep.replace);
    }
  }
  
  fs.writeFileSync(filePath, content);
  console.log(`Updated ${item.file}`);
}
