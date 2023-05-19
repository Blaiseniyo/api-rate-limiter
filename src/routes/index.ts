import express from "express";
import emailRoutes from "./sendEmailRoutes";
import sendSMSControler from "./sendSMSRoutes";

const routes = express.Router();

routes.use("/email", emailRoutes);
routes.use("/sms", sendSMSControler);

export default routes;
