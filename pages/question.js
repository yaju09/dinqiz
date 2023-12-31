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

function Question() {
  //router
  const router = useRouter();

  //global context
  const { currentUserId } = useContext(GlobalContext);

  //local states
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [remainingTime, setRemainingTime] = useState(questionDurationInSeconds);
  const [questionData, setQuestionData] = useState([]);
  const [currentSessionId, setCurrentSessionId] = useState(null);

  // to get the current session id from session storage and set it in local state
  useEffect(() => {
    const sessionId = window.sessionStorage.getItem("sessionId");
    if (!sessionId) return;
    setCurrentSessionId(parseInt(sessionId));
  }, []);

  // To run the timer, to change question and to redirect to end page if no more questions are there.
  useEffect(() => {
    const session_otp = window.sessionStorage.getItem("session_otp");
    if (!session_otp) return;
    const interval = setInterval(() => {
      fetch(pscaleAPI.SESSION_WITH_OTP_ENDPOINT(session_otp), {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      })
        .then((response) => {
          if (response.status == 200) {
            return response.json();
          }
        })
        .then((response) => {
          if (currentQuestionIndex < response.data.current_question_index) {
            setCurrentQuestionIndex(response.data.current_question_index);
            setRemainingTime(questionDurationInSeconds);
          }
          if (response.data.is_completed) {
            router.push("/end");
            // clearTimeout(timer);
            clearInterval(interval);
          }
        })
        .catch((err) => {
          // Catch and display errors
        });
      setRemainingTime((prevRemainingTime) => {
        return prevRemainingTime - 1 >= 0 ? prevRemainingTime - 1 : 0;
      });
    }, 1000);

    return () => {
      // clearTimeout(timer);
      clearInterval(interval);
    };
  }, [currentQuestionIndex, remainingTime, router, questionData.length]);

  //fetch all questions from planet scale
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

  // handler to submit the response of user
  const responseSubmitHandler = useCallback(
    (userAnswer) => {
      const question = questionData[currentQuestionIndex];

      if (!currentSessionId || !currentUserId || !question || !userAnswer)
        return;

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
          <div className="mt-4 flex justify-center gap-4 content-center">
            <Clock className="w-10 h-10" />
            <div className="text-2xl flex items-center">
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
                remainingTime={remainingTime}
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
