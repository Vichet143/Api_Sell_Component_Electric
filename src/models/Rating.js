
class Rating {
  constructor(product_id, averageRating,numReviews,totalRating) {;
    this.product_id = product_id;
    this.averageRating = averageRating;
    this.numReviews = numReviews;
    this.totalRating = totalRating;
  }

  toFirestore() {
    return {
      product_id: this.product_id,
      averageRating: this.averageRating,
      numReviews: this.numReviews,
      totalRating: this.totalRating
    }
  }
}

export default Rating;