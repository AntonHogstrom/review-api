import express from "express";
import ReviewDAO from "../dao/reviewsDAO.js";

export default class ReviewsController {
  //GET REQUEST with filters
  //gameTitle(search), author(exact), gameGenre(search), reviewId(exact)
  static async apiGetReviews(req, res, next) {
    const reviewsPerPage = req.query.reviewsPerPage
      ? parseInt(req.query.reviewsPerPage, 10)
      : 6;
    const page = req.query.page ? parseInt(req.query.page) : 0;

    //filters
    let filters = {};
    if (req.query.gameTitle) {
      filters.gameTitle = req.query.gameTitle;
    } else if (req.query.author) {
      filters.author = req.query.author;
    } else if (req.query.gameGenre) {
      filters.gameGenre = req.query.gameGenre;
    } else if (req.query._id) {
      filters._id = req.query._id;
    }

    const { reviewList, totalReviews } = await ReviewDAO.getReviews({
      filters,
      page,
      reviewsPerPage,
    });

    //define response keys with values
    let response = {
      reviews: reviewList,
      page: page,
      filters: filters,
      per_page: reviewsPerPage,
      total_reviews: totalReviews,
    };
    res.json(response);
  }

  //POST REQUEST
  static async apiPostReviews(req, res, next) {
    try {
      //id generated by mongoDB
      const gameTitle = req.body.gameTitle;
      const gameGenre = req.body.gameGenre;
      const reviewTitle = req.body.reviewTitle;
      const review = req.body.review;
      const reviewRating = req.body.reviewRating;
      const author = req.body.author;
      const reviewDate = new Date();

      //create review with data
      const response = await ReviewDAO.addReview(
        gameTitle,
        gameGenre,
        reviewTitle,
        review,
        reviewRating,
        author,
        reviewDate
      );
      res.status(200).json({ message: "Review added successfuly" });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  //PUT REQUEST
  static async apiUpdateReviews(req, res, next) {
    try {
      const reviewId = req.body.reviewId;
      const gameTitle = req.body.gameTitle;
      const gameGenre = req.body.gameGenre;
      const reviewTitle = req.body.reviewTitle;
      const review = req.body.review;
      const reviewRating = req.body.reviewRating;

      //update review with data
      const response = await ReviewDAO.updateReview(
        reviewId,
        gameTitle,
        gameGenre,
        reviewTitle,
        review,
        reviewRating
      );

      res.status(200).json({ message: "Review updated successfuly" });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  //DELETE REQUEST
  static async apiDeleteReviews(req, res, next) {
    try {
      const reviewId = req.query.id;
      const response = await ReviewDAO.deleteReview(reviewId);
      res.status(200).json({ message: "Review deleted successfuly" });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
}
