// prisma
import prisma from "../../../../../lib/prisma";

const sessionUpdateHandler = async (req, res) => {
  const { body, method } = req;
  const { session_otp } = req.query;
  switch (method) {
    case "GET":
      try {
        let payload = body;

        const sessionUpdateResponse = await prisma.session.findFirst({
          where: { session_otp: session_otp },
        });

        if (!sessionUpdateResponse) throw new Error("Could not find session.");

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
      res.setHeader("Allow", ["GET"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
};

export default sessionUpdateHandler;
