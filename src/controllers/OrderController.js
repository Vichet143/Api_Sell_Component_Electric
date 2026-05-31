import OrederService from "../service/OrderService.js";


class OrderController {
  static async placeOrder(req, res) {
    try {
      const userId = req.user?.user_id;
      if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      const order = await OrederService.createOrder({
        ...req.body,
        user_id: userId,
      });
      res.status(201).json(order);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async getOrderByUserId(req, res) {
    try {
      const userId = req.user?.user_id;
      if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      const orders = await OrederService.getOrdersByUserId(userId);
      res.status(200).json(orders);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

export default OrderController;