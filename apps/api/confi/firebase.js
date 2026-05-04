// config/firebase.js
const fs = require("node:fs");
const path = require("node:path");
const admin = require("firebase-admin");
require("dotenv").config();

function getServiceAccountFromEnv() {
  const { FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY } = process.env;
  if (!FIREBASE_PROJECT_ID || !FIREBASE_CLIENT_EMAIL || !FIREBASE_PRIVATE_KEY) {
    return null;
  }

  return {
    projectId: FIREBASE_PROJECT_ID,
    clientEmail: FIREBASE_CLIENT_EMAIL,
    privateKey: FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
  };
}

function getServiceAccount() {
  const fromEnvVars = getServiceAccountFromEnv();
  if (fromEnvVars) return fromEnvVars;

  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    return JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
  }

  const keyPath = path.join(__dirname, "serviceAccountKey.json");
  if (fs.existsSync(keyPath)) {
    return require("./serviceAccountKey.json");
  }

  throw new Error(
    "Firebase credentials are missing. Set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY or FIREBASE_SERVICE_ACCOUNT."
  );
}

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(getServiceAccount()),
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  });
}

const db = admin.firestore();

module.exports = { admin, db };
