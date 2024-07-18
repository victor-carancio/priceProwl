import express from "express";
import "express-async-errors";
import bodyParser from "body-parser";
import gamesRoutes from "./routes/game.route";
import authRoutes from "./routes/auth.route";
import wishListRoutes from "./routes/wishList.route";
import dotenv from "dotenv";
import errorHandlerMiddleware from "./middlewares/errorHandler";
import notFound from "./middlewares/notFound";
import cookieParser from "cookie-parser";
import swaggerUi from "swagger-ui-express";
import swaggerSetup from "./docs/swaggeer";
import cors from "cors";
dotenv.config();
const app = express();

// app.set("trust proxy",1);
app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(bodyParser.json());

app.use("/documentation", swaggerUi.serve, swaggerUi.setup(swaggerSetup));

app.use("/api/v1/game", gamesRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/wishlist", wishListRoutes);

app.use(errorHandlerMiddleware);
app.use(notFound);

export default app;
