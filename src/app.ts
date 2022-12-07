import express from "express";
import "express-async-errors";
import { validationErrorMiddleware } from "./lib/middleware/validation";
import { initCorsMiddleware } from "./lib/middleware/cors";
import albumsRoutes from "./routes/albums";
import authRoutes from "./routes/auth";
import { passport } from "./lib/middleware/passport";
import { initSessionMiddleware } from "./lib/middleware/session";

const app = express();

app.use(initSessionMiddleware());
app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());
app.use(initCorsMiddleware());
app.use("/albums", albumsRoutes);
app.use("/auth", authRoutes);
app.use(validationErrorMiddleware);

export default app;
