import { BakongKHQR, IndividualInfo, khqrData } from "bakong-khqr";
import dotenv from "dotenv";
dotenv.config();
import RequiredField from "../utils/RequiredField.js";
import { db } from "../config/database.js";
import Payment from "../models/Payment.js";
import QRCode from "qrcode";
import fs from "fs";
import axios from "axios";
import OrderService from "./OrderService.js";

class PaymentService {
  static async createPayment(paymentData) {
    try {
      RequiredField(paymentData.user_id, "User ID");
      RequiredField(paymentData.amount, "Amount");

      const paymentMethod = 'bakong_khqr';
      const paymentStatus = 'pending';

      const individualInfo = new IndividualInfo(
        process.env.BAKONG_ACCOUNT_ID,
        process.env.BAKONG_ACCOUNT_NAME,
        process.env.BAKONG_MERCHANT_ID,
        "Phnom Penh",
        khqrData.currency.khr,
        paymentData.amount
      );

      const khqr = new BakongKHQR();
      const expirationTimestamp = Date.now() + 30 * 60 * 1000;
      const amount = Number(paymentData.amount);

      individualInfo.amount = amount;
      individualInfo.currency = khqrData.currency.khr;
      individualInfo.expirationTimestamp = expirationTimestamp;

      const response = khqr.generateIndividual(individualInfo);

      console.log(JSON.stringify(response, null, 2));

      const qrData = response?.data;
      const qrCode = qrData.qr;
      const qrMd5 = qrData.md5;

      const qrString = response?.data?.qr;

      QRCode.toDataURL(qrString, (err, url) => {
        if (err) throw err;

        const base64Data = url.replace(/^data:image\/png;base64,/, "");

        fs.writeFileSync("qr.png", base64Data, "base64");

        console.log("QR code saved as qr.png");
      });

      const payment = new Payment(
        null,
        paymentData.order_id,
        paymentData.amount,
        paymentMethod,
        qrCode,
        expirationTimestamp,
        qrMd5,
        khqrData.currency.khr,
        paymentStatus,
        paymentData.payment_date || new Date()
      );
      const paymentRef = await db.collection("payments").add(payment.toFirestore());
      await paymentRef.update({ payment_id: paymentRef.id });
      const paymentDoc = await paymentRef.get();
      return {
        success: true,
        message: "Payment created successfully",
        payment: {
          payment_id: paymentRef.id,
          ...paymentDoc.data()
        }
      };
    } catch (error) {
      throw new Error(error.message, "Fail to create payment");
    }
  }

  static async checkPayment(md5, token) {
    try {
      const res = await axios.post(
        `${process.env.BAKONG_API_BASE}/check_transaction_by_md5`,
        { md5 },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      return res.data;
    } catch (err) {
      console.log("Bakong error:", err.response?.data || err.message);
      throw err;
    }
  }

  static isWorkerRunning = false;

  static async startPaymentWorker() {
    setInterval(async () => {
      if (PaymentService.isWorkerRunning) return;

      PaymentService.isWorkerRunning = true;

      try {
        const token = process.env.BAKONG_TOKEN;

        const snapshot = await db
          .collection("payments")
          .where("payment_status", "==", "pending")
          .get();

        if (snapshot.empty) {
          PaymentService.isWorkerRunning = false;
          return;
        }

        for (const doc of snapshot.docs) {
          const payment = doc.data();

          if (!payment.qr_md5) continue;

            if (payment.expirationTimestamp < Date.now()) {

            await doc.ref.update({
              payment_status: "expired",
            });
            const pid = payment.order_id;
            if (!pid) {
              console.warn('No payment id available to update product status for doc', doc.id);
            } else {
              OrderService.updatePaymentStatus(pid, "expired");
            }
            continue;
          }

          try {
            const result = await PaymentService.checkPayment(
              payment.qr_md5,
              token
            );

            if (result?.responseMessage === "Success") {
              await doc.ref.update({
                payment_status: "paid",
                paid_at: new Date(),
                raw_response: result,
              });
              const pid = payment.order_id;
              if (!pid) {
                console.warn('No payment id available to update product status for doc', doc.id);
              } else {
                OrderService.updatePaymentStatus(pid, "paid");
              }
            }
          } catch (err) {
            console.error("Check failed:", doc.id, err.message);
          }
        }
      } catch (err) {
        console.error("Worker error:", err.message);
      }

      PaymentService.isWorkerRunning = false;
    }, 5000);
  }

  static async getPaymentById(paymentId) {
    try {
      const paymentRef = db.collection("payments").doc(paymentId);
      const paymentDoc = await paymentRef.get();
      if (!paymentDoc.exists) {
        throw new Error("Payment not found");
      }
      return {
        success: true,
        payment: {
          payment_id: paymentDoc.id,
           ...paymentDoc.data()
         }
      };
    } catch (error) {
      throw new Error(error.message, "Fail to retrieve payment");
    }
  }
}

export default PaymentService;