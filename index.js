require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cors());

app.use("/users", require("./routes/userRoutes"));
app.use("/properties", require("./routes/propertyRoutes"));
app.use("/vehicles", require("./routes/vehicleRoutes"));

const mongoURI = process.env.MONGOURI;
mongoose
  .connect(mongoURI, {
    useNewUrlParser: true,
    useFindAndModify: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("mongodb connected successfully");
  })
  .catch((err) => {
    console.log(err, "failed to connect");
  });

const PORT = 8000;

// process.env.PORT ||

app.listen(PORT, () => {
  console.log(`server listening on port ${PORT}`);
});
