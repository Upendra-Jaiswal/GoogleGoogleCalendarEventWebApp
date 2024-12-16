import dotenv from "dotenv";
dotenv.config({});

import express from "express";
import { google } from "googleapis";
import dayjs from "dayjs";
import cors from "cors";
import mongoose from "mongoose";
import tokenRoutes from "./routes/tokenRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";

const app = express();
const PORT = 3001;

// MongoDB connection
mongoose.connect(process.env.MONGO_URI);

const allowedOrigins = "http://localhost:3000";

const corsOptions = {
  origin: allowedOrigins,
  methods: ["POST", "GET", "DELETE", "PUT"],
  credentials: true,
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));

app.use(express.json());

app.use("/google", tokenRoutes);
app.use("/eventApi", eventRoutes);

app.listen(PORT, () => {
  ////conso`listening at`, PORT);
});
