import express from "express";
import "express-async-errors";
import { validationErrorMiddleware } from "./lib/middleware/validation";
import { initCorsMiddleware } from "./lib/middleware/cors";
import albumsRoutes from "./routes/albums";

const app = express();

app.use(express.json());
app.use(initCorsMiddleware());
app.use("/albums", albumsRoutes);
app.use(validationErrorMiddleware);

export default app;
