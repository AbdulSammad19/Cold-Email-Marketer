const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();

// mongo db connection
mongoose
  .connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connection is successfull");
  })
  .catch((err) => {
    console.log("mongodb connection error");
  });

// import routes
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");

// App middlewares
app.use(morgan("dev"));
app.use(bodyParser.json());
// app.use(cors())
if ((process.env.NODE_ENV = "developement")) {
  app.use(
    cors({
      origin: process.env.CLIENT_URL,
    })
  );
}
// middleware
app.use("/api", authRoutes);
app.use("/api", userRoutes);

const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`Server is running on port ${port} `);
});
