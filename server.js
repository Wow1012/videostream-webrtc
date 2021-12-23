// const express = require("express");
// const connectDB = require("./config/db");
// const path = require("path");
// const cors = require("cors");

// const app = express();
// app.use(cors());

// // Connect Database
// connectDB();

// // Init Middleware
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// // Define Routes
// app.use("/api/users", require("./routes/api/users"));
// app.use("/api/streamers", require("./routes/api/streamers"));
// app.use("/api/auth", require("./routes/api/auth"));
// app.use("/api/upload", require("./routes/api/upload"));
// app.use("/api/broadcasters", require("./routes/api/broadcasters"));
// app.use("/api/setting", require("./routes/api/setting"));

// //SERVING IMAGES
// app.use("/logo", express.static("logo"));
// app.use("/images", express.static("images"));

// // Serve static assets in production
// if (process.env.NODE_ENV === "production") {
//   // Set static folder
//   app.use(express.static("client/build"));

//   app.get("*", (req, res) => {
//     res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
//   });
// }

// const Broadcaster = require("./models/Broadcaster");

// const PORT = process.env.PORT || 5000;

// app.listen(PORT, async () => {
//   console.log(`Server started on port ${PORT}`);
//   await Broadcaster.deleteMany();
// });

const express = require("express");
const connectDB = require("./config/db");
const path = require("path");
const cors = require("cors");
const https = require("https");
const fs = require("fs");

const app = express();
app.use(cors());

// Connect Database
connectDB();

// Init Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Define Routes
app.use("/api/users", require("./routes/api/users"));
app.use("/api/streamers", require("./routes/api/streamers"));
app.use("/api/auth", require("./routes/api/auth"));
app.use("/api/upload", require("./routes/api/upload"));
app.use("/api/broadcasters", require("./routes/api/broadcasters"));
app.use("/api/setting", require("./routes/api/setting"));
app.use("/api/watchingtime", require("./routes/api/watchingtime"));
app.use("/api/videopay", require("./routes/api/videopay"));
app.use("/api/detailedpay", require("./routes/api/detailedpay"));
app.use("/api/payment", require("./routes/api/payment"));

//SERVING IMAGES
app.use("/logo", express.static("logo"));
app.use("/images", express.static("images"));
app.use("/upload", express.static("upload"));

// Serve static assets in production
if (process.env.NODE_ENV === "production") {
  // Set static folder
  app.use(express.static("client/build"));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

const Broadcaster = require("./models/Broadcaster");

const PORT = process.env.PORT || 5000;

const options = {
  key: fs.readFileSync("HTTPS_Permissions/key.pem"),
  cert: fs.readFileSync("HTTPS_Permissions/cert.pem"),
};

const server = https.createServer(options, app);

app.get("/", (req, res) => {
  res.send("Server is up and running");
});

server.listen(PORT, async () => {
  console.log(`Server started on port ${PORT}`);
  await Broadcaster.deleteMany();
});
