import CartService from "../service/CartService.js";


class CartController {
  static async addToCart(req, res) {
    try {
      const productId = req.query.productId;
      const userId = req.user?.user_id;

      if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const addedCart = await CartService.addToCart(productId, userId);
      res.status(200).json(addedCart);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async getCartByUserId(req, res) {
    try {
      const userId =  req.user?.user_id;
      if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      const cart = await CartService.getCartByUserId(userId);
      res.status(200).json(cart);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async removeFromCart(req, res) {
    try {
      const productId = req.query.productId;
      const userId = req.user?.user_id;
      if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      const updatedCart = await CartService.removeFromCart(productId, userId);
      res.status(200).json(updatedCart);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async updateQuantity(req, res) {
    try {
      const productId = req.query.productId;
      const userId = req.user?.user_id;
      const quantity = Number(req.body.quantity);

      if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      if (!Number.isFinite(quantity) || quantity <= 0) {
        return res.status(400).json({ error: "Quantity must be a positive number" });
      }

      const updatedCart = await CartService.updateQuantity(productId, userId, quantity);
      res.status(200).json(updatedCart);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

export default CartController;