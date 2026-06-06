import PaymentService from '../service/PaymentService.js';

class PaymentController {
  static async createPayment(req, res) {
    try {
      const paymentData = {
        user_id: req.user?.user_id,
        order_id: req.body.order_id,
        amount: req.body.amount,
      };
      const result = await PaymentService.createPayment(paymentData);
      res.status(201).json(result);
    } catch (error) {
      const details = error.details || null;
      res.status(400).json({ success: false, message: error.message, details });
    }
  }

  static async getPaymentById(req, res) {
    try {
      const { paymentId } = req.query;
      const result = await PaymentService.getPaymentById(paymentId);
      res.status(200).json(result);
    } catch (error) {
      const details = error.details || null;
      res.status(404).json({ success: false, message: error.message, details });
    }
  }
}

export default PaymentController;