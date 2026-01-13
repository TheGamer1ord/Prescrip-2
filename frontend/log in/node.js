// app.js
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// Routes
app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "login.html"));
});

app.post("/login", (req, res) => {
  const { username, password } = req.body;

  // Demo authentication (replace with database + hashing)
  if (username === "admin" && password === "1234") {
    res.send("Login successful ✅");
  } else {
    res.send("Invalid username or password ❌");
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/login`);
});

/*
Directory structure:

project-folder/
│── app.js
│── public/
│   └── login.html
*/
