// prisma
import { prismaClient } from "../../../../lib/prisma";

const sessionCreateHandler = async (req, res) => {
  const { body, method } = req;

  switch (method) {
    case "POST":
      try {
        let payload = body;

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
        res
          .status(400)
          .json({ status: "error", code: error.code, message: error.message });
      }
      break;

    case "GET":
      try {
        const sessionResponse = await prismaClient.session.findFirst({
          where: {
            is_completed: false,
          },
        });

        if (!sessionResponse) throw new Error("Could not find session.");

        res.status(200).json({
          status: "success",
          data: sessionResponse,
        });
      } catch (error) {
        res
          .status(400)
          .json({ status: "error", code: error.code, message: error.message });
      }
      break;

    default:
      res.setHeader("Allow", ["GET", "POST"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
};

export default sessionCreateHandler;
