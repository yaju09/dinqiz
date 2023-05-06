import React, { useEffect, useState, useCallback, useContext } from "react";
//next
import Head from "next/head";
import { useRouter } from "next/router";
// helpers
import { questionData } from "../components/utils/staticQuestionData";
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
  const { currentUserId, currentSessionId } = useContext(GlobalContext);

  //local states
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [remainingTime, setRemainingTime] = useState(questionDurationInSeconds);

  // To run the timer, to change question and to redirect to end page if no more questions are there.
  useEffect(() => {
    const timer = setTimeout(() => {
      const maxIndex = questionData.length - 1;
      if (currentQuestionIndex < maxIndex) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else if (currentQuestionIndex >= maxIndex) {
        router.push("/end");
      }

      setRemainingTime(questionDurationInSeconds);
    }, remainingTime * 1000);

    const interval = setInterval(() => {
      setRemainingTime((prevRemainingTime) => prevRemainingTime - 1);
    }, 1000);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [currentQuestionIndex, remainingTime, router]);

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
      let payload = {
        user_id: currentUserId,
        session_id: currentSessionId,
        question_id: questionData[currentQuestionIndex].sr,
        response: { answer: userAnswer },
        is_correct:
          userAnswer == questionData[currentQuestionIndex].answer
            ? true
            : false,
      };

      fetch(pscaleAPI.USER_RESPONSE_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
        .then((response) => {
          console.log("====data", response);
          if (response.status == 200) {
            return response.json();
          }
        })
        .then((response) => {
          console.log("====data", response);
          setCurrentSessionId(response.data.id);
          router.push("/question");
        })
        .catch((err) => {
          console.log("===err", err);
          // Catch and display errors
        });
    },
    [currentQuestionIndex, currentSessionId, currentUserId, router]
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

          <div className="w-full flex justify-center items-center">
            <QuestionBody
              question={questionData[currentQuestionIndex]}
              responseSubmitHandler={responseSubmitHandler}
            />
          </div>
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
