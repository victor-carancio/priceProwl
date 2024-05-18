import express from "express";
import "express-async-errors";
import gamesRoutes from "./routes/game.route";
import dotenv from "dotenv";
import errorHandlerMiddleware from "./middlewares/errorHandler";
import notFound from "./middlewares/notFound";
dotenv.config();

const app = express();

// app.set("trust proxy",1);
app.use(express.json());

app.use("/api/v1", gamesRoutes);

app.use(errorHandlerMiddleware);
app.use(notFound);

export default app;
