import dotenv from "dotenv";
dotenv.config();
import express from "express";
import { initApp } from "./src/Utils/initapp.js";

const app = express();
app.set("caseSensitive", true);
initApp(app, express);
