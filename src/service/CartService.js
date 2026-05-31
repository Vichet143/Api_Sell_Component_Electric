
import Cart from "../models/Cart.js";
import {db} from "../config/database.js";
import RequiredField from "../utils/RequiredField.js";

const roundPrice = (value) => Math.round((Number(value) || 0) * 100) / 100;

class CartService {
  static async addToCart(productId, userId) {
    try {

      RequiredField(productId, "Product ID");
      RequiredField(userId, "User ID");
      
      const productDoc = await db.collection("products").doc(productId).get();
      if (!productDoc.exists) {
        throw new Error("Product not found");
      }
      const productData = productDoc.data();
      const cartRef = db.collection("carts").doc(userId);
      const cartDoc = await cartRef.get();
      const existingCartData = cartDoc.exists ? cartDoc.data() : null;
      const existingItems = existingCartData?.cartItems || [];
      const existingItemIndex = existingItems.findIndex((item) => item.productId === productId);

      let totalPrice = 0;
      for (const item of existingItems) {
        totalPrice += Number(item.price) || 0;
      }

      if (existingItemIndex >= 0) {
        const existing = existingItems[existingItemIndex];
        existing.quantity += 1;
        existing.unitPrice = roundPrice(existing.unitPrice ?? existing.price ?? productData.price ?? 0);
        existing.price = roundPrice(existing.unitPrice * existing.quantity);
        // existing.totalAmount = roundPrice(existing.totalAmount + existing.price);
      } else {
        existingItems.push({
          productId,
          quantity: 1,
          product_name: productData.product_name,
          unitPrice: roundPrice(productData.price ?? 0),
          price: roundPrice(productData.price ?? 0),
          product_image: productData.image_url,
        });
      }

      const cart = new Cart({
        userId,
        cartItems: {existingItems, totalPrice: roundPrice(totalPrice)},
      });

      await cartRef.set(cart.toFirestore(), { merge: true });
      const updatedCartDoc = await cartRef.get();
      return {
        success: true,
        message: "Product added to cart successfully",
        cart: {
          cart_id: cartRef.id,
          ...updatedCartDoc.data(),
        }
      };

    } catch (error) {
      throw new Error(error.message, "Fail to add product to cart");
    }
  }

  static async getCartByUserId(userId) {
    try {
      RequiredField(userId, "User ID");
      const cartQuery = db.collection("carts").where("userId", "==", userId);
      const cartSnapshot = await cartQuery.get();
      const cartDoc = cartSnapshot.docs[0];

      if (!cartDoc) {
        return {
          success: true,
          message: "Cart is empty",
          cart: null
        };
      }
      return {
        success: true,
        message: "Cart retrieved successfully",
        cart: {
          cart_id: cartDoc.id,
          ...cartDoc.data()
        }
      };
    } catch (error) {
      throw new Error(error.message, "Fail to retrieve cart");
    }
  }

  static async removeFromCart(productId, userId) {
    try {
      RequiredField(productId, "Product ID");
      RequiredField(userId, "User ID");
      const cartRef = db.collection("carts").doc(userId);
      const cartDoc = await cartRef.get();
      if (!cartDoc.exists) {
        throw new Error("Cart not found");
      }
      const cartData = cartDoc.data();
      const updatedCartItems = cartData.cartItems.filter(item => item.productId !== productId);
      await cartRef.update({ cartItems: updatedCartItems });
      const updatedCartDoc = await cartRef.get();
      return {
        success: true,
        message: "Product removed from cart successfully"
      };
    } catch (error) {
      throw new Error(error.message, "Fail to remove product from cart");
    }
  }

  static async updateQuantity(productId, userId, quantity) {
    try {
      RequiredField(productId, "Product ID");
      RequiredField(userId, "User ID");
      RequiredField(quantity, "Quantity");
      const cartRef = db.collection("carts").doc(userId);
      const cartDoc = await cartRef.get();
      if (!cartDoc.exists) {
        throw new Error("Cart not found");
      }
      const cartData = cartDoc.data();
      const updatedCartItems = cartData.cartItems.map(item => {
        if (item.productId === productId) {
          const currentQuantity = Number(item.quantity);
          const unitPrice = Number(item.unitPrice ?? ((Number(item.price) || 0) / currentQuantity) ?? 0);
          const safeUnitPrice = Number.isFinite(unitPrice) ? roundPrice(unitPrice) : 0;
          return {
            ...item,
            quantity,
            unitPrice: safeUnitPrice,
            price: roundPrice(safeUnitPrice * quantity)
          };
        }
        return item;
      });
      await cartRef.update({ cartItems: updatedCartItems });
      const updatedCartDoc = await cartRef.get();
      const responseCartItems = (updatedCartDoc.data().cartItems || []).map((item) => ({
        productId: item.productId,
        product_name: item.product_name,
        quantity: item.quantity,
        price: roundPrice(item.price),
        product_image: item.product_image
      }));
      return {
        success: true,
        message: "Cart updated successfully",
        cart: {
          cart_id: cartRef.id,
          ...updatedCartDoc.data(),
          cartItems: responseCartItems
        }
      };
    } catch (error) {
      throw new Error(error.message, "Fail to update cart");
    }
  }
}

export default CartService;