import React, { useEffect, useState, useCallback, useContext } from "react";
//next
import Head from "next/head";
import { useRouter } from "next/router";
// components
import QuestionBody from "../components/QuestionBody";
import TopNavLayout from "../components/TopNavLayout";
//icon
import Clock from "../icons/clock";
// user auth
import UserAuth from "../hoc/userAuth";
// global const
import { questionDurationInSeconds } from "../constants/globalConstants";
// global context
import { GlobalContext } from "../components/utils/globalContext";
// api routes
import * as pscaleAPI from "../constants/node-api";
//hook
import useInterval from "../hooks/useInterval";

function Question() {
  //router
  const router = useRouter();

  //global context
  const { currentUserId, currentSessionId } = useContext(GlobalContext);

  //local states
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  console.log("===currentquestionindex", currentQuestionIndex);
  const [remainingTime, setRemainingTime] = useState(questionDurationInSeconds);
  const [questionData, setQuestionData] = useState([]);
  console.log("====question data", questionData);
  const [currentSession, setCurrentSession] = useState(null);
  // To run the timer, to change question and to redirect to end page if no more questions are there.
  useEffect(() => {
    const timer = setTimeout(() => {
      setRemainingTime(questionDurationInSeconds);
    }, remainingTime * 1000);

    const interval = setInterval(() => {
      fetch(pscaleAPI.SESSION_ENDPOINT, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      })
        .then((response) => {
          if (response.status == 200) {
            return response.json();
          }
        })
        .then((response) => {
          console.log("===response111", response.data.current_question_index);
          console.log("===curr question index222", currentQuestionIndex);
          console.log(
            "====333",
            currentQuestionIndex < response.data.current_question_index
          );
          console.log("====4444", response.data.is_completed);
          setCurrentQuestionIndex(currentQuestionIndex);
          setRemainingTime(questionDurationInSeconds);
          if (response.data.is_completed) {
            router.push("/end");
            clearTimeout(timer);
            clearInterval(interval);
          }
        })
        .catch((err) => {
          // Catch and display errors
        });
      setRemainingTime((prevRemainingTime) => prevRemainingTime - 1);
    }, 1000);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [currentQuestionIndex, remainingTime, router, questionData.length]);

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
  }, [router]);

  //browser back button has been disabled
  useEffect(() => {
    router.beforePopState(({ as }) => {
      if (as !== router.asPath) {
        history.forward();
        return false;
      }
      return true;
    });

    return () => {
      router.beforePopState(() => true);
    };
  }, [router]);

  const responseSubmitHandler = useCallback(
    (userAnswer) => {
      const question = questionData[currentQuestionIndex];
      let payload = {
        user_id: currentUserId,
        session_id: currentSessionId,
        question_id: question.id,
        response: { answer: userAnswer },
        is_correct: userAnswer == question.body.answer ? true : false,
      };

      fetch(pscaleAPI.USER_RESPONSE_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
        .then((response) => {
          if (response.status == 200) {
            return response.json();
          }
        })
        .then((response) => {})
        .catch((err) => {
          // Catch and display errors
        });
    },
    [currentQuestionIndex, currentSessionId, currentUserId, questionData]
  );

  return (
    <>
      <Head>Question Page</Head>
      <TopNavLayout>
        <div className="w-full flex flex-col content-center">
          <div className="mt-4 flex justify-center">
            <Clock className="w-8 h-6" />
            <div>
              {" "}
              {`00:${
                remainingTime > 9 ? remainingTime : "0" + String(remainingTime)
              }`}
            </div>
          </div>
          {questionData.length > 0 && (
            <div className="w-full flex justify-center items-center">
              <QuestionBody
                question={questionData[currentQuestionIndex].body}
                responseSubmitHandler={responseSubmitHandler}
                srNo={currentQuestionIndex + 1}
              />
            </div>
          )}

          {/* <div className="flex justify-center">
            <button className="py-2 mt-4 px-4 border-0 bg-orange-400 font-semibold rounded-xl">
              Submit
            </button>
          </div> */}
        </div>
      </TopNavLayout>
    </>
  );
}

export default UserAuth(Question);
