import express from "express";
import cors from "cors";
import reviews from "./api/reviews.route.js";

// Create Express server
const app = express();

// Express configuration
app.use(cors());
app.use(express.json());

app.use("/api/reviews", reviews);
app.use("*", (req, res) => res.status(404).json({ message: "Not Found" }));

export default app;
