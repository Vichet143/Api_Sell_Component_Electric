class Order {
  constructor(userId,products,totalPrice,shippingAddress,orderDate,order_status = "pending",payment_status = "pending") 
  {
    this.userId = userId;
    this.products = products;
    this.totalPrice = totalPrice;
    this.shippingAddress = shippingAddress;
    this.orderDate = orderDate;
    this.order_status = order_status;
    this.payment_status = payment_status;
  }

  toFirestore() {
    return {
      userId: this.userId,
      products: this.products,
      totalPrice: this.totalPrice,
      shippingAddress: this.shippingAddress,
      orderDate: this.orderDate,
      order_status: this.order_status,
      payment_status: this.payment_status
    };
  }
}

export default Order;