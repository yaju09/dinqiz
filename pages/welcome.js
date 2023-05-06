import React, { useContext, useState, useEffect } from "react";
//router
import { useRouter } from "next/router";
// component
import TopNavLayout from "../components/TopNavLayout";
// global context
import { GlobalContext } from "../components/utils/globalContext";
// api routes
import * as pscaleAPI from "../constants/node-api";
//helpers
import { questionData } from "../components/utils/staticQuestionData";
//auth hoc
import UserAuth from "../hoc/userAuth";
// global const
import { quizAdminKey } from "../constants/globalConstants";

function Welcome() {
  //router
  const router = useRouter();

  //global context
  const { userName, setCurrentSessionId } = useContext(GlobalContext);

  //local state
  const [adminKey, setAdminKey] = useState("");

  useEffect(() => {
    const savedAdminKey = window.sessionStorage.getItem("admin_key");
    if (savedAdminKey) {
      setAdminKey(savedAdminKey);
    }
  }, []);

  function routeChangeHandler() {
    let payload = {};
    if (questionData?.length > 0) {
      payload = {
        current_question_index: 0,
      };
    }
    fetch(pscaleAPI.SESSION_ENDPOINT, {
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
  }

  return (
    <>
      <TopNavLayout>
        <div className="w-full h-screen flex flex-col align-middle">
          <div className="h-2/3 flex flex-col justify-center align-middle">
            <div className="text-2xl font-semibold text-center">
              {`Hello ${userName}, Welcome to ML Quiz`}
            </div>
            {quizAdminKey == adminKey && (
              <div className="my-6 flex justify-center">
                <button
                  onClick={routeChangeHandler}
                  className="py-2 px-4 border-0 bg-orange-400 rounded-xl"
                >
                  Start Quiz
                </button>
              </div>
            )}
          </div>
        </div>
      </TopNavLayout>
    </>
  );
}

export default UserAuth(Welcome);
