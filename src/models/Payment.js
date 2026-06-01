
class Payment{
  constructor(payment_id, order_id, amount, payment_method,qr_code,qr_expiration,qr_md5,currency, payment_status, payment_date = new Date()){
    this.payment_id = payment_id;
    this.order_id = order_id;
    this.amount = amount;
    this.payment_method = payment_method;
    this.qr_code = qr_code;
    this.qr_expiration = qr_expiration;
    this.qr_md5 = qr_md5;
    this.currency = currency;
    this.payment_status = payment_status;
    this.payment_date = payment_date;
  }

  toFirestore(){
    return {
      order_id: this.order_id,
      amount: this.amount,
      payment_method: this.payment_method,
      qr_code: this.qr_code,
      qr_expiration: this.qr_expiration,
      qr_md5: this.qr_md5,
      currency: this.currency,
      payment_status: this.payment_status,
      payment_date: this.payment_date
    }
  }
}