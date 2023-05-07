// prisma
import prisma from "../../../../lib/prisma";

const userResponseHandler = async (req, res) => {
  const { body, method } = req;

  switch (method) {
    case "POST":
      try {
        let payload = body;

        const sessionCreateResponse = await prisma.userResponse.create({
          data: payload,
        });

        if (!sessionCreateResponse)
          throw new Error("Could not create user response.");

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

    default:
      res.setHeader("Allow", ["GET"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
};

export default userResponseHandler;
