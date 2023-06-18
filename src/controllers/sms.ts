import { Request, Response } from "express";
import { sendSMS } from "../services/notificationServices";

const sendSMSControler = async (req: Request, res: Response) => {

  try {

    await sendSMS("XYZ SMS notication service");

    res.status(200).json({
      status: "success",
      datail: "An SMS notification sent successfully",
    });

  } catch (error) {
    res.status(500).json({
      status: "error",
      code: "500",
      detail: "Error happened while sending SMS notification",
    });
  }
};

export default sendSMSControler;
