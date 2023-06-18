import { Request, Response } from "express";
import { sendEmail } from "../services/notificationServices";

const sendEmailControler = async (req: Request, res: Response) => {

  try {

    await sendEmail("XYZ notication service");

    res.status(200).json({
      status: "success",
      datail: "An email notification sent successfully",
    });
  } catch (error) {
    res.status(500).json({
        status: "error",
        code: "500",
        detail: "Error happened while sending email notification"
    });
  }
};

export default sendEmailControler;
