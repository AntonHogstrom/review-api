import express from "express";
import ReviewsControll from "./reviews.controller.js";

const router = express.Router();

//API routes for reviews
router
  .route("/")
  .get(ReviewsControll.apiGetReviews)
  .post(ReviewsControll.apiPostReviews)
  .put(ReviewsControll.apiUpdateReviews)
  .delete(ReviewsControll.apiDeleteReviews);

export default router;
