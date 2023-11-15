const mongoose = require("mongoose");
require("dotenv").config();

exports.connect = () => {
  mongoose
    .connect(process.env.DATABASE_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => console.log("Database is Connected"))
    .catch((err) => {
        console.log("Database connection failed", err);
        process.exit(1);
    });
};
