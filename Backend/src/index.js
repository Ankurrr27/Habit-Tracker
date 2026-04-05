import "dotenv/config";
import cloudinary from "./config/cloudinary.js";
import app from "./app.js";
import connectDB from "./db/index.js";

const PORT = process.env.PORT || 5000;

// connect DB first, then start server
connectDB().then(() => {
  app.listen(PORT, "127.0.0.1", () => {
    console.log(`🚀 Server running on http://127.0.0.1:${PORT}`);
  });
});
