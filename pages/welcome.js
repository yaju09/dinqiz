import React, { useContext, useState, useEffect, useCallback } from "react";
//router
import { useRouter } from "next/router";
// component
import TopNavLayout from "../components/TopNavLayout";
// global context
import { GlobalContext } from "../components/utils/globalContext";
// api routes
import * as pscaleAPI from "../constants/node-api";
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
  const [loader, setLoader] = useState(false);
  const [sessionOTP, setSessionOTP] = useState(null);

  useEffect(() => {
    const savedAdminKey = window.sessionStorage.getItem("admin_key");
    if (savedAdminKey) {
      setAdminKey(savedAdminKey);
    }
  }, []);

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

  // for non admin only
  useEffect(() => {
    const savedAdminKey = window.sessionStorage.getItem("admin_key");
    if (quizAdminKey == savedAdminKey) return;
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
          if (response.data.is_completed === false) {
            clearInterval(interval);
            setCurrentSessionId(response.data.id);
            router.push("/question");
          }
        })
        .catch((err) => {
          // Catch and display errors
        });
    }, 2000);
  }, [router, adminKey, setCurrentSessionId]);

  //for admin only
  const routeChangeHandler = useCallback(() => {
    if (!sessionOTP) {
      alert("Please provide session OTP");
      return;
    }
    let payload = {};

    payload = {
      current_question_index: 0,
      session_otp: sessionOTP,
    };
    setLoader(true);
    fetch(pscaleAPI.SESSION_ENDPOINT, {
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
        setCurrentSessionId(response.data.id);
        setLoader(false);
        router.push("/score-board");
      })
      .catch((err) => {
        setLoader(false);

        // Catch and display errors
      });
  }, [router, sessionOTP, setCurrentSessionId]);

  return (
    <>
      <TopNavLayout>
        <div className="w-full h-screen flex flex-col align-middle">
          <div className="h-2/3 flex flex-col justify-center align-middle">
            <div className="text-2xl font-semibold text-center">
              {`Hello ${userName}, Welcome to ML Quiz`}
            </div>
            {quizAdminKey == adminKey && (
              <>
                <div className="mt-4 flex flex-col justify-center items-center">
                  <div className="text-lg">Session OTP</div>
                  <div className="w-2/5 border border-solid rounded border-gray-500">
                    <input
                      className=" border-gray-300 rounded-md  outline-none"
                      type="text"
                      value={sessionOTP}
                      required
                      onChange={(event) => setSessionOTP(event.target.value)}
                    />
                  </div>
                </div>

                <div className="my-6 flex justify-center">
                  <button
                    onClick={routeChangeHandler}
                    className="py-2 px-4 border-0 bg-blue-500 rounded-xl"
                  >
                    {`${loader ? "Starting..." : "Start Quiz"}`}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </TopNavLayout>
    </>
  );
}

export default UserAuth(Welcome);
