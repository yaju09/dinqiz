// prisma
import { prismaClient } from "../../../../lib/prisma";

const sessionCreateHandler = async (req, res) => {
  const { body, method } = req;
  console.log("===================body", body);
  switch (method) {
    case "POST":
      try {
        let payload = body;
        console.log("=====payload", payload.is_completed);
        const sessionCreateResponse = await prismaClient.session.create({
          data: payload,
        });

        if (!sessionCreateResponse)
          throw new Error("Could not create pscale session.");

        res.status(200).json({
          status: "success",
          data: sessionCreateResponse,
        });
      } catch (error) {
        console.log("======error", error);
        res
          .status(400)
          .json({ status: "error", code: error.code, message: error.message });
      }
      break;

    default:
      res.setHeader("Allow", ["GET"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
};

export default sessionCreateHandler;
