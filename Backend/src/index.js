import "dotenv/config";

import app from "./app.js";
import connectDB from "./db/index.js";

const PORT = process.env.PORT || 5000;

// connect DB first, then start server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
});
