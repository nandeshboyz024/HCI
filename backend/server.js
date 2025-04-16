// server.js
import express from "express";
import cors from "cors";
import adminRoutes from "./routes/adminRoutes.js";
import postalcodeRoutes from "./routes/postalcodeRoutes.js";
import schoolRoutes from "./routes/schoolRoutes.js";

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Mount routes
app.use("/", adminRoutes);
app.use("/",postalcodeRoutes);
app.use("/",schoolRoutes);

app.listen(5000, () => {
  console.log("Server is working on http://localhost:5000");
});
