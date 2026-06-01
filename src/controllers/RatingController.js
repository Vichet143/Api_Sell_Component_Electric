import RatingService from '../service/RatingService.js';

class RatingController {

  static async createRating(req, res) {
    try {
      const ratingData ={
        user_id: req.user?.user_id,
        product_id: req.body.product_id,
        numReviews: req.body.numReviews,
        totalRating: req.body.totalRating
      }
      const result = await RatingService.addRating(ratingData);
      res.status(201).json(result);
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }
}

export default RatingController;