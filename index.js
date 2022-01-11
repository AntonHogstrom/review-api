import app from "./server.js";
import mongodb from "mongodb";
import dotenv from "dotenv";
import ReviewsDAO from "./dao/reviewsDAO.js";

// Load environment variables.
//DB Settings, etc.
dotenv.config();

const MongoClient = mongodb.MongoClient;

//Alternative port
const port = process.env.PORT || 8000;

//Connect to database
MongoClient.connect(process.env.RESTREVIEWS_DB_URI, {
  useNewUrlParser: true,
  wtimeoutMS: 10000,
})
  .catch((err) => {
    console.log(err.stack);
    process.exit(1);
  })
  .then(async (client) => {
    //Start server
    await ReviewsDAO.connectDB(client);
    app.listen(port, () => {
      console.log(`Listening on port ${port}`);
    });
  });
