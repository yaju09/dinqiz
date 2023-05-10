// prisma
import prisma from "../../../../../../lib/prisma";

const questionDataHandler = async (req, res) => {
  const { body, method } = req;
  const { session_id, question_id } = req.query;
  switch (method) {
    case "GET":
      try {
        const responseData = await prisma.userResponse.findMany({
          where: {
            session_id: parseInt(session_id),
            question_id: parseInt(question_id),
            is_correct: true,
          },
          include: {
            user: true,
          },
          orderBy: {
            createdAt: "asc",
          },
        });

        if (!responseData)
          throw new Error("Could not find question for the session.");
        // considering only the first correct answer of a user
        const filteredResponses = [];
        responseData.forEach((response) => {
          if (
            !filteredResponses.some(
              (responseData) => response.user_id == responseData.user_id
            )
          ) {
            filteredResponses.push(response);
          }
        });
        res.status(200).json({
          status: "success",
          data: filteredResponses,
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

export default questionDataHandler;
