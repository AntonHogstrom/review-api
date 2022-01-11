//DATA ACCESS OBJECT - REVIEWS
//==============================================================================


import mongodb from "mongodb";
const ObjectId = mongodb.ObjectId;

let reviews;

// class for communicating with the database and performing CRUD operations
export default class reviewsDAO {
  // connect to the database
  static async connectDB(connection) {
    if (reviews) {
      return;
    }
    try {
      reviews = await connection
        .db(process.env.RESTREVIEWS_NS)
        .collection("reviews");
    } catch (err) {
      console.error(`Error connecting to reviews DB-collection: ${err}`);
    }
  }
  // GET REQUEST with filters
  static async getReviews({
    //Default filters/settings
    filters = null,
    page = 0,
    reviewsPerPage = 6,
  } = {}) {
    let query;
    if (filters) {
      //if filters are defined
      if ("gameTitle" in filters) {
        query = { $text: { $search: filters["gameTitle"] } };
      } else if ("author" in filters) {
        query = { author: { $eq: filters["author"] } };
      } else if ("gameGenre" in filters) {
        query = { gameGenre: { $eq: filters["gameGenre"] } };
      } else if ("_id" in filters) {
        query = { _id: { $eq: ObjectId(filters["_id"]) } };
      }

      let cursor;

      try {
        //find reviews with filters, sort by date
        cursor = await reviews.find(query).sort({ reviewDate: -1 });
      } catch {
        console.error(`Error getting reviews: ${err}`);
        return { reviewList: [], totalReviews: 0 };
      }
      const displayCursor = cursor
        .limit(reviewsPerPage) //limit to reviewsPerPage
        .skip(page * reviewsPerPage); //skip to page * reviewsPerPage

      try {
        //get all reviews from cursor to array
        const reviewList = await displayCursor.toArray();
        const totalReviews = await reviews.countDocuments(query);
        return { reviewList, totalReviews };
      } catch {
        return { reviewList: [], totalReviews: 0 };
      }
    }
  }

  // POST REQUEST
  static async addReview(
    gameTitle,
    gameGenre,
    reviewTitle,
    review,
    reviewRating,
    author
  ) {
    try {
      //create new review with data
      const newReview = {
        gameTitle: gameTitle,
        gameGenre: gameGenre,
        reviewTitle: reviewTitle,
        review: review,
        reviewRating: reviewRating,
        author: author,
        reviewDate: new Date(),
      };

      return await reviews.insertOne(newReview);
    } catch (err) {
      console.error(`Error adding review: ${err}`);
      return { error: err };
    }
  }

  // PUT REQUEST
  static async updateReview(
    reviewId,
    gameTitle,
    gameGenre,
    reviewTitle,
    review,
    reviewRating
  ) {
    try {
      //update review with data
      const response = await reviews.updateOne(
        { _id: ObjectId(reviewId) },
        {
          $set: {
            gameTitle: gameTitle,
            gameGenre: gameGenre,
            reviewTitle: reviewTitle,
            review: review,
            reviewRating: reviewRating,
          },
        }
      );
      return response;
    } catch (err) {
      console.error(`Error updating review: ${err}`);
      return { error: err };
    }
  }

  // DELETE REQUEST
  static async deleteReview(reviewId) {
    try {
      //delete review
      const response = await reviews.deleteOne({
        _id: ObjectId(reviewId),
      });
      return response;
    } catch (err) {
      console.error(`Error deleting review: ${err}`);
      return { error: err };
    }
  }
}
