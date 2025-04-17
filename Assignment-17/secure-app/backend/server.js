const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const csurf = require("csurf");
const cookieParser = require("cookie-parser");

dotenv.config();
const app = express();

// ✅ Middleware
app.use(express.json()); // Must be before CSRF middleware
app.use(cookieParser()); // Required for CSRF protection

// ✅ FIX: Allow CORS for Frontend
app.use(cors({
    origin: "http://localhost:3000",  
    credentials: true, // Allows sending cookies/session
}));

app.use(helmet()); // Secure HTTP headers

// ✅ CSRF Protection
const csrfProtection = csurf({ cookie: true });

// ✅ Apply CSRF protection only to specific routes
app.use("/api", csrfProtection);

// ✅ Allow frontend to fetch CSRF token
app.get("/api/csrf-token", (req, res) => {
    res.json({ csrfToken: req.csrfToken() });
});

// ✅ Rate Limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100, 
    message: "Too many requests, please try again later."
});
app.use("/api/auth", limiter);

// ✅ MongoDB connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.log(err));

// ✅ Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/posts", require("./routes/posts"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
