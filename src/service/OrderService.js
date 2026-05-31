import {db} from "../config/database.js";
import RequiredField from "../utils/RequiredField.js";
import Order from "../models/Order.js";
import Cart from "../models/Cart.js";

class OrderService {
  static async createOrder(orderData) {
    try {
      RequiredField(orderData.user_id, "User ID");

      const cartDoc = await db.collection("carts").doc(orderData.user_id).get();
      if (!cartDoc.exists) {
        throw new Error("Cart not found for user");
      }
      const order = new Order(
        orderData.user_id,
        cartDoc.data().cartItems.existingItems,
        cartDoc.data().cartItems.totalPrice,
        orderData.shipping_address,
        new Date()
      );
      const orderRef = await db.collection("orders").add(order.toFirestore());
      const orderDoc = await orderRef.get();
      return {
        success: true,
        message: "Order created successfully",
        order: {
          order_id: orderRef.id,
            ...orderDoc.data()
        }
      };
    } catch (error) {
      throw new Error(error.message, "Fail to create order");
    }
  }

  static async getOrdersByUserId(userId) {
    try {
      RequiredField(userId, "User ID");
      const orderQuery = db.collection("orders").where("userId", "==", userId);
      const orderSnapshot = await orderQuery.get();
      if (orderSnapshot.empty) {
        return {
          success: true,
          message: "No orders found for user",
          orders: []
        };
      }

      const orders = [];
      orderSnapshot.forEach(doc => orders.push({ order_id: doc.id, ...doc.data() }));

      return {
        success: true,
        message: "Orders retrieved successfully",
        orders
      };
    } catch (error) {
      throw new Error(error.message, "Fail to retrieve orders");
    }
  }
}

export default OrderService;