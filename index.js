import express from "express";
import dotenv from "dotenv";
import marvelRoutes from "./routes/marvelRoutes.js";
import indexRoutes from "./routes/index.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use("/", marvelRoutes);
app.use("/", indexRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
