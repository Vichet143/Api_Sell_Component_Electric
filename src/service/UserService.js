import admin from "firebase-admin";
import { db, auth } from "../config/database.js";
import { signInWithEmailAndPassword, sendPasswordResetEmail, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import User from "../models/User.js";
import RequiredField from "../utils/RequiredField.js";
import nodemailer from "nodemailer";
import "dotenv/config";

const provider = new GoogleAuthProvider();
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
        success: true,
        message: "User registered successfully",
        user
      };

    } catch (error) {
      throw new Error({ success: false, message: error.message });
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
        success: true,
        message: "Login successful",
        user: {
          uid: firebaseUser.uid,
          token: await firebaseUser.getIdToken(),
          ...userDoc.data()
        }
      };

    } catch (error) {
      throw new Error({ success: false, message: error.message });
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
        success: true,
        message: "User retrieved successfully",
        user: userDoc.data()
      };
    } catch (error) {
      throw new Error({ success: false, message: error.message });
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
        success: true,
        message: "Users retrieved successfully",
        users: users
      };
    } catch (error) {
      throw new Error({ success: false, message: error.message });
    }
  }

  static async updateUser(userId, updateData) {
    try {
      RequiredField(userId, "User ID");
      const userRef = db.collection("users").doc(userId);
      const userDoc = await userRef.get();
      if (!userDoc.exists) {
        throw new Error({ success: false, message: "User not found" });
      }
      await userRef.update(updateData);
      return {
        success: true,
        message: "User updated successfully",
        user: { user_id: userId, ...updateData }
      };
    } catch (error) {
      throw new Error({ success: false, message: error.message });
    }
  }

  static async resetPassword(email) {
    if (!email) throw new Error("Email is required");

    const link = await admin.auth().generatePasswordResetLink(email);

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: "vichetchoub844@gmail.com",
      to: email,
      subject: "Reset Your Password",
      html: `
        <h3>Password Reset</h3>
        <p>Click the link below to reset your password:</p>
        <a href="${link}">Reset Password</a>
      `,
    });

    return {
      success: true,
      message: "Reset password email sent",
    };
  }
  static async googleLogin(decoded) {
    const userRef = db.collection("users").doc(decoded.uid);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      const newUser = {
        uid: decoded.uid,
        email: decoded.email,
        name: decoded.name || "",
        photoURL: decoded.picture || "",
        provider: decoded.firebase.sign_in_provider,
        createdAt: new Date(),
      };

      await userRef.set(newUser);

      return newUser;
    }

    return userDoc.data();
  }
}

export default UserService;