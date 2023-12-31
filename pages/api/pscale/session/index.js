// prisma
import prisma from "../../../../lib/prisma";

const sessionCreateHandler = async (req, res) => {
  const { body, method } = req;

  switch (method) {
    case "POST":
      try {
        let payload = body;
        console.log("======node", payload.session_otp);
        const sessionCreateResponse = await prisma.session.create({
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
        const sessionResponse = await prisma.session.findFirst({
          orderBy: {
            id: "desc",
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
