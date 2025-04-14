// server.js
import express from "express";
import cors from "cors";
import adminRoutes from "./routes/adminRoutes.js";

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Mount routes
app.use("/", adminRoutes);

app.listen(5000, () => {
  console.log("Server is working on http://localhost:5000");
});
