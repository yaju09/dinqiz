// prisma
import prisma from "../../../../../../lib/prisma";

const questionDataHandler = async (req, res) => {
    const { body, method } = req;
    const { session_id, question_id } = req.query;
    switch (method) {
        case "GET":
            try {

                const questionData = await prisma.userResponse.findMany({
                    where: {
                        session_id: parseInt(session_id),
                        question_id: parseInt(question_id),
                        is_correct: true,
                    },
                    include: {
                        user,
                    },
                    orderBy: {
                        createdAt: "asc"
                    },
                });

                if (!questionData)
                    throw new Error("Could not find question for the session.");

                res.status(200).json({
                    status: "success",
                    data: questionData,
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
