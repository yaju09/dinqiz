// prisma
import prisma from "../../../../../lib/prisma";

const questionHandler = async (req, res) => {
  const { body, method } = req;
  const { question_id } = req.query;
  switch (method) {
    case "POST":
      try {
        let payload = body;

        const questionUpdateResponse = await prisma.question.update({
          where: { id: parseInt(question_id) },
          data: payload,
        });

        if (!questionUpdateResponse)
          throw new Error("Could not update question.");

        res.status(200).json({
          status: "success",
          data: questionUpdateResponse,
        });
      } catch (error) {
        res
          .status(400)
          .json({ status: "error", code: error.code, message: error.message });
      }
      break;

    case "GET":
      try {
        const questionResponse = await prisma.question.findUnique({
          where: { id: parseInt(question_id) },
        });

        if (!questionResponse) throw new Error("Could not find question.");

        res.status(200).json({
          status: "success",
          data: questionResponse,
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

export default questionHandler;
