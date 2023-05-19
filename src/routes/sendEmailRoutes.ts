import express from "express";
import sendEmailControler from "../controllers/email";

const routes = express.Router();


routes.post("/",sendEmailControler)

export default routes
