// prisma
import { prismaClient } from "../../../../../lib/prisma";

const sessionUpdateHandler = async (req, res) => {
  const { body, method } = req;
  const { session_id } = req.query;
  switch (method) {
    case "POST":
      try {
        let payload = body;

        const sessionUpdateResponse = await prismaClient.session.update({
          where: { id: parseInt(session_id) },
          data: payload,
        });

        if (!sessionUpdateResponse)
          throw new Error("Could not update session.");

        res.status(200).json({
          status: "success",
          data: sessionUpdateResponse,
        });
      } catch (error) {
        res
          .status(400)
          .json({ status: "error", code: error.code, message: error.message });
      }
      break;

    default:
      res.setHeader("Allow", ["POST"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
};

export default sessionUpdateHandler;
