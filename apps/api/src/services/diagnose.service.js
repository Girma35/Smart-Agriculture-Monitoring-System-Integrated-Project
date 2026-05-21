// services/diagnose.service.js
// Mock service: AI diagnosis via Roboflow (no database storage)
const { diagnoseCropDisease } = require("./ai.service");

/**
 * Creates a new diagnosis using Roboflow.
 * @param {string} userId - The ID of the user requesting the diagnosis
 * @param {Buffer} imageBuffer - The image data
 * @param {string} mimeType - The MIME type of the image
 * @param {string} originalName - The original filename
 * @param {string} cropType - The type of crop
 * @returns {Promise<Object>} The newly created diagnosis object
 */
async function createDiagnosis(userId, imageBuffer, mimeType, originalName, cropType) {
  // 1. Mock image URL
  const imageUrl = "https://storage.googleapis.com/mock-bucket/mock-leaf-image.jpg";

  // 2. Run AI diagnosis (utilizes Roboflow)
  const aiResult = await diagnoseCropDisease(imageBuffer, mimeType, cropType);

  // 3. Build mock diagnosis document
  const diagnosisData = {
    ...aiResult,
    imageUrl,
    userId,
    createdAt: new Date().toISOString(),
  };

  const diagnosisId = "mock-diag-" + Date.now();

  return { diagnosisId, ...diagnosisData };
}

/**
 * Retrieves mock history
 * @param {string} userId - The ID of the user
 * @returns {Promise<Array>} Array of past diagnosis records
 */
async function getDiagnosisHistory(userId) {
  return [
    {
      diagnosisId: "mock-diag-12345",
      isHealthy: false,
      disease: "Common Rust",
      confidence: 0.89,
      severity: "high",
      remedy: "Apply copper-based fungicides immediately. Remove and destroy severely affected leaves.",
      prevention: "Plant rust-resistant crop hybrids, practice crop rotation, and avoid overhead sprinkler watering.",
      description: "Detected symptoms of 'Common Rust' on the crop leaf (Confidence: 89.0%).",
      imageUrl: "https://storage.googleapis.com/mock-bucket/mock-leaf-image.jpg",
      userId,
      createdAt: new Date().toISOString()
    }
  ];
}

/**
 * Retrieves a single mock diagnosis
 * @param {string} userId - The ID of the user
 * @param {string} diagnosisId - The ID of the diagnosis
 * @returns {Promise<Object>} The requested diagnosis record
 */
async function getDiagnosisById(userId, diagnosisId) {
  return {
    diagnosisId,
    isHealthy: false,
    disease: "Common Rust",
    confidence: 0.89,
    severity: "high",
    remedy: "Apply copper-based fungicides immediately. Remove and destroy severely affected leaves.",
    prevention: "Plant rust-resistant crop hybrids, practice crop rotation, and avoid overhead sprinkler watering.",
    description: "Detected symptoms of 'Common Rust' on the crop leaf (Confidence: 89.0%).",
    imageUrl: "https://storage.googleapis.com/mock-bucket/mock-leaf-image.jpg",
    userId,
    createdAt: new Date().toISOString()
  };
}

/**
 * Mocks deleting a diagnosis
 * @param {string} userId - The ID of the user
 * @param {string} diagnosisId - The ID of the diagnosis
 * @returns {Promise<boolean>} True if successful
 */
async function deleteDiagnosis(userId, diagnosisId) {
  return true;
}

module.exports = {
  createDiagnosis,
  getDiagnosisHistory,
  getDiagnosisById,
  deleteDiagnosis,
};
