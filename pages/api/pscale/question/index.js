// prisma
import prisma from "../../../../lib/prisma";

const sessionCreateHandler = async (req, res) => {
  const { body, method } = req;

  switch (method) {
    case "POST":
      try {
        let payload = body;

        const questionCreateResponse = await prisma.question.create({
          data: payload,
        });

        if (!questionCreateResponse)
          throw new Error("Could not create question.");

        res.status(200).json({
          status: "success",
          data: questionCreateResponse,
        });
      } catch (error) {
        res
          .status(400)
          .json({ status: "error", code: error.code, message: error.message });
      }
      break;

    case "GET":
      try {
        const allQuestions = await prisma.question.findMany();

        if (!allQuestions) throw new Error("Could not find questions.");

        res.status(200).json({
          status: "success",
          data: allQuestions,
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
