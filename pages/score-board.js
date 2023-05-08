import { useCallback, useEffect, useState, useContext } from "react";
//next
import { useRouter } from "next/router";
import React from "react";
// global const
import {
  quizAdminKey,
  questionDurationInSeconds,
} from "../constants/globalConstants";
// api routes
import * as pscaleAPI from "../constants/node-api";
// component
import TopNavLayout from "../components/TopNavLayout";

function ScoreBoard() {
  //router
  const router = useRouter();

  //local states
  const [questionData, setQuestionData] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const [isQuizEnded, setIsQuizEnded] = useState(false);

  const [leaderBoard, setLeaderBoard] = useState({});

  const pointsByRank = React.useMemo(() => {
    return {
      1: 5,
      2: 3,
      3: 1,
    };
  }, []);

  // to get the current session id from session storage and set it in local state
  useEffect(() => {
    const sessionId = window.sessionStorage.getItem("sessionId");
    if (!sessionId) return;
    setCurrentSessionId(parseInt(sessionId));
  }, []);

  //get all questions data
  useEffect(() => {
    fetch(pscaleAPI.QUESTION_ENDPOINT, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => {
        if (response.status == 200) {
          return response.json();
        }
      })
      .then((response) => {
        setQuestionData(response.data);
      })
      .catch((err) => {
        // Catch and display errors
      });
  }, []);

  //for admin only to update currentQuestionIndex
  const questionIndexHandler = useCallback(
    (questionIndex, isCompleted) => {
      setLoading(true);
      let payload = {};
      if (isCompleted) {
        payload = {
          is_completed: isCompleted,
        };
      } else {
        payload = {
          current_question_index: questionIndex,
        };
      }

      fetch(pscaleAPI.SESSION_UPDATE_ENDPOINT(currentSessionId), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
        .then((response) => {
          if (response.status == 200) {
            return response.json();
          }
        })
        .then((response) => {
          setLoading(false);
          if (response.data.is_completed) {
            setIsQuizEnded(true);
          }
        })
        .catch((err) => {
          setLoading(false);
          // Catch and display errors
        });
    },
    [currentSessionId]
  );

  // to update the current question index if there are more questions to come else change the in_completed status of session to true.
  const onNextHandler = useCallback(() => {
    if (!questionData?.length) return;

    const maxIndex = questionData.length - 1;
    if (currentQuestionIndex < maxIndex) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      questionIndexHandler(currentQuestionIndex + 1, false);
    } else if (currentQuestionIndex >= maxIndex) {
      questionIndexHandler(currentQuestionIndex, true);
    }
  }, [currentQuestionIndex, questionData.length, questionIndexHandler]);

  useEffect(() => {
    if (!questionData?.length) {
      return;
    }
    function onAnswered(session_id, question_id) {
      if (!session_id || !question_id) {
        return;
      }
      fetch(
        pscaleAPI.FILTERED_USER_RESPONSE_ENDPOINT(session_id, question_id),
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      )
        .then((response) => {
          if (response.status == 200) {
            return response.json();
          }
        })
        .then((response) => {
          let data = response.data;
          let scoreBoard = { ...leaderBoard };
          data.forEach((row, index) => {
            if (row.user_id in leaderBoard) {
              if (
                scoreBoard[row.user_id]["question_ids"]?.includes(question_id)
              )
                return;

              scoreBoard[row.user_id]["score"] +=
                index + 1 > 3 ? 0 : pointsByRank[index + 1];
              scoreBoard[row.user_id]["question_ids"].push(question_id);
            } else {
              scoreBoard[row.user_id] = {
                name: row.user.username,
                email: row.user.email,
                score: index + 1 > 3 ? 0 : pointsByRank[index + 1],
                question_ids: [question_id],
              };
            }
          });
          setLeaderBoard(scoreBoard);
        })

        .catch((err) => {
          // Catch and display errors
        });
    }
    const interval = setInterval(() => {
      onAnswered(currentSessionId, questionData[currentQuestionIndex].id);
    }, 10000);
    const clearance = setTimeout(function () {
      clearInterval(interval);
      clearTimeout(clearance);
    }, questionDurationInSeconds * 5000);
    return () => {
      clearInterval(interval);
      clearTimeout(clearance);
    };
  }, [
    currentQuestionIndex,
    currentSessionId,
    leaderBoard,
    pointsByRank,
    questionData,
  ]);

  // if user is not admin then redirect the user to 404 page
  useEffect(() => {
    const savedAdminKey = window.sessionStorage.getItem("admin_key");
    if (savedAdminKey != quizAdminKey) router.push("/404");
  }, [router]);

  return (
    <TopNavLayout>
      <div>
        <div className="my-4 text-center text-2xl font-semibold">
          ScoreBoard
        </div>
        ;
        <button
          onClick={onNextHandler}
          className={`w-2/5 flex justify-center m-auto py-2 px-4 border border-transparent text-xl font-semibold font ${
            isQuizEnded ? "bg-red-500" : "bg-green-500"
          } rounded-xl`}
          disabled={loading || isQuizEnded}
        >
          {isQuizEnded
            ? "Quiz Ended"
            : loading
            ? "Loading..."
            : "Next Question"}
        </button>
        <p></p>
        <br></br>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
            width: "100%",
          }}
        >
          <table style={{ border: "1px solid", width: "80%" }}>
            <thead>
              <tr style={{ border: "1px solid" }}>
                <th style={{ border: "1px solid" }}>User</th>
                <th style={{ border: "1px solid" }}>email</th>
                <th style={{ border: "1px solid" }}>Score</th>
              </tr>
            </thead>
            <tbody>
              {Object.values(leaderBoard).map((item) => (
                <tr key={item.email}>
                  <td style={{ border: "1px solid" }}>{item.name}</td>
                  <td style={{ border: "1px solid" }}>{item.email}</td>
                  <td style={{ border: "1px solid" }}>{item.score}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </TopNavLayout>
  );
}
export default ScoreBoard;
