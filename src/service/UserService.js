import admin from "firebase-admin";
import { db, auth } from "../config/database.js";
import { signInWithEmailAndPassword } from "firebase/auth";
import User from "../models/User.js";
import RequiredField from "../utils/RequiredField.js";

class UserService {

  static async register(userData) {
    try {

      RequiredField(userData.fullname, "Full Name");
      RequiredField(userData.email, "Email");
      RequiredField(userData.password, "Password");
      RequiredField(userData.role, "Role");

      if (userData.password.length < 8) {
        throw new Error("Password must be at least 8 characters or longer");
      }

      const userRecord = await admin.auth().createUser({
        displayName: userData.fullname,
        email: userData.email,
        password: userData.password
      });

      const user = new User(
        userRecord.uid,
        userData.fullname,
        userData.email,
        userData.role
      );

      await db
        .collection("users")
        .doc(user.user_id)
        .set(user.toFirestore());

      return {
        message: "User registered successfully",
        user
      };

    } catch (error) {
      console.error("Register Error:", error);
      throw error;
    }
  }

  static async login(userData) {
    try {

      RequiredField(userData.email, "Email");
      RequiredField(userData.password, "Password");

      const userCredential = await signInWithEmailAndPassword(
        auth,
        userData.email,
        userData.password
      );

      const firebaseUser = userCredential.user;

      const userDoc = await db
        .collection("users")
        .doc(firebaseUser.uid)
        .get();

      if (!userDoc.exists) {
        throw new Error("User not found");
      }

      return {
        message: "Login successful",
        user: {
          uid: firebaseUser.uid,
          token: await firebaseUser.getIdToken(),
          ...userDoc.data()
        }
      };

    } catch (error) {
      throw new Error(error.message);
    }
  }

  static async getUserById(userId) {
    try {
      RequiredField(userId, "User ID");
      const userDoc = await db
        .collection("users")
        .doc(userId)
        .get();
      if (!userDoc.exists) {
        throw new Error("User not found");
      }
      return {
        message: "User retrieved successfully",
        user: userDoc.data()
      };
    } catch (error) {
      throw new Error(error.message);
    }
  }

  static async getAllUsers() {
    try {
      const getUser = await db.collection("users").get();
      const users = [];
      getUser.forEach(doc => {
        users.push({ user_id: doc.id, ...doc.data() });
      });
      return {
        message: "Users retrieved successfully",
        users: users
      };
    } catch (error) {
      throw new Error(error.message);
    }
  }
}

export default UserService;