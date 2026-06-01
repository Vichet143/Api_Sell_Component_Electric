import { db } from '../config/database.js';
import RequiredField from '../utils/RequiredField.js';
import Rating from '../models/Rating.js';

class RatingService {

  static async addRating(ratingData) {
    try {
      RequiredField(ratingData.user_id, "User ID");
      RequiredField(ratingData.product_id, "Product ID");

      const numReviews = Number(ratingData.numReviews);
      const totalRating = Number(ratingData.totalRating);
      const averageRating = numReviews === 0 ? 0 : Number((totalRating / numReviews).toFixed(2));

      const rating = new Rating(
        ratingData.product_id,
        averageRating,
        numReviews,
        totalRating.toFixed(0,2)
      );

      const ratingRef = db.collection("ratings");
      const ratingSnapshot = await ratingRef
        .where("product_id", "==", rating.product_id)
        .get();

      if (!ratingSnapshot.empty) {
        const existingDoc = ratingSnapshot.docs[0];
        const existingRating = existingDoc.data();
        const updatedNumReviews = Number(existingRating.numReviews || 0) + Number(rating.numReviews || 0);
        const updatedTotalRating = Number(existingRating.totalRating || 0) + Number(rating.totalRating || 0);
        const updatedAverageRating = updatedNumReviews === 0 ? 0 : Number((updatedTotalRating / updatedNumReviews).toFixed(2));

        await ratingRef.doc(existingDoc.id).update({
          averageRating: updatedAverageRating,
          numReviews: updatedNumReviews,
          totalRating: updatedTotalRating,
        });

        const updatedDoc = await ratingRef.doc(existingDoc.id).get();
        return {
          success: true,
          message: "Rating updated successfully",
          rating: {
            rating_id: updatedDoc.id,
            ...updatedDoc.data()
          }
        };
      } else {
        const newRatingRef = await ratingRef.add(rating.toFirestore());
        const newRatingDoc = await newRatingRef.get();
        return {
          success: true,
          message: "Rating added successfully",
          rating: {
            rating_id: newRatingDoc.id,
            ...newRatingDoc.data()
          }
        };
      }
    } catch (error) {
      throw new Error(error.message, "Failed to add rating");
    }
  }
}

export default RatingService;