import { useCallback, useEffect, useState, useContext } from "react";
//next
import { useRouter } from "next/router";
import React from "react";
// global const
import {
  quizAdminKey,
  questionDurationInSeconds,
} from "../constants/globalConstants";
// global context
import { GlobalContext } from "../components/utils/globalContext";
// api routes
import * as pscaleAPI from "../constants/node-api";
// component
import TopNavLayout from "../components/TopNavLayout";

function ScoreBoard() {
  //router
  const router = useRouter();
  //global context
  const { currentSessionId } = useContext(GlobalContext);

  //local states
  const [questionData, setQuestionData] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [loading, setLoading] = useState(false);

  const [leaderBoard, setLeaderBoard] = useState({});

  const pointsByRank = React.useMemo(() => {
    return {
      1: 5,
      2: 3,
      3: 1,
    }
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
            router.push("/end");
          }
        })
        .catch((err) => {
          setLoading(false);
          // Catch and display errors
        });
    },
    [router, currentSessionId]
  );

  function onNextHandler() {
    if (!questionData?.length) return;

    const maxIndex = questionData.length - 1;
    if (currentQuestionIndex < maxIndex) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      questionIndexHandler(currentQuestionIndex + 1, false);
    } else if (currentQuestionIndex >= maxIndex) {
      questionIndexHandler(currentQuestionIndex, true);
    }
  }

  const onAnswered = useCallback((session_id, question_id) => {
    if (!session_id || !question_id) {
      return;
    }

    fetch(pscaleAPI.FILTERED_USER_RESPONSE_ENDPOINT(session_id, question_id), {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => {
        if (response.status == 200) {
          return response.json();
        }
      })
      .then((response) => {
        let data = response.data;

        data.forEach((row, index) => {
          if (row.user_id in leaderBoard) {
            setLeaderBoard((prev) => {
              let t = { ...prev };
              if (t[row.user_id]['question_ids']?.includes(question_id)) {
                return t;
              }

              t[row.user_id]['score'] += index + 1 > 3 ? 0 : pointsByRank[index + 1]
              t[row.user_id]['question_ids'].push(question_id);
              return t;
            })
          } else {
            setLeaderBoard((prev) => {
              let t = { ...prev };
              t[row.user_id] = {
                'name': row.user.username,
                'email': row.user.email,
                'score': index + 1 > 3 ? 0 : pointsByRank[index + 1],
                'question_ids': [question_id]
              };
              return t;
            })
          }
        })
      })


      .catch((err) => {
        // Catch and display errors
      });
  }, [leaderBoard, pointsByRank]);



  useEffect(() => {
    if (!questionData?.length) {
      return;
    }

    const interval = setInterval(() => {
      onAnswered(currentSessionId, questionData[currentQuestionIndex].id)
    }, 10000);
    const clearance = setTimeout(function () { clearInterval(interval); clearTimeout(clearance); }, questionDurationInSeconds * 5000);

  }, [currentQuestionIndex, currentSessionId, onAnswered, questionData]);



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
          className="w-2/5 flex justify-center m-auto py-2 px-4 border border-transparent text-xl font-semibold font bg-green-500 rounded-xl"
        >
          {loading ? "Loading..." : "Next"}
        </button>
        <p></p>
        <table>
          <thead>
            <tr>
              <th>User</th>
              <th>email</th>
              <th>Score</th>
            </tr>
          </thead>
          <tbody>
            {
              Object.values(leaderBoard)
                .map(item => (<tr key={item.email}>
                  <td>{item.name}</td>
                  <td>{item.email}</td>
                  <td>{item.score}</td>
                </tr>))
            }
          </tbody>
        </table>
      </div>
    </TopNavLayout>
  );
}
export default ScoreBoard;
