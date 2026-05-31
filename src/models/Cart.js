
class Cart {
 
  constructor({ userId, cartItems }) {
    this.userId = userId;
    this.cartItems = cartItems;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  toFirestore() {
    return {
      userId: this.userId,
      cartItems: this.cartItems,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}

export default Cart;