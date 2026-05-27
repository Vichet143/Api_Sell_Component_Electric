import "dotenv/config";
import admin from "firebase-admin";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import serviceAccount from "./sell-electric-firebase-adminsdk-fbsvc-56892b7753.json" with { type: "json" };

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://sell-electric-default-rtdb.asia-southeast1.firebasedatabase.app"
});

const firebaseConfig = {
  apiKey: process.env.API_KEY,
  authDomain: process.env.AUTH_DOMAIN,
  projectId: process.env.PROJECT_ID,
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const db = admin.firestore();

export default admin;