// prisma
import { prismaClient } from "../../../../lib/prisma";

const userCreateHandler = async (req, res) => {
  const { body, method } = req;
  console.log("===================body", body);
  switch (method) {
    case "POST":
      try {
        let payload = body;
        console.log("=====payload", payload.is_completed);
        const userCreateResponse = await prismaClient.user.create({
          data: payload,
        });

        if (!userCreateResponse) throw new Error("Could not create user.");

        res.status(200).json({
          status: "success",
          data: userCreateResponse,
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

export default userCreateHandler;
