import React, { useContext } from "react";
//router
import { useRouter } from "next/router";
// component
import TopNavLayout from "../components/TopNavLayout";
// global context
import { GlobalContext } from "../components/utils/globalContext";

function Welcome() {
  //router
  const router = useRouter();

  //global context
  const { userName, setUserName } = useContext(GlobalContext);
  function routeChangeHandler() {
    router.push("/question");
  }

  return (
    <>
      <TopNavLayout>
        <div className="w-full h-screen flex flex-col align-middle">
          <div className="h-2/3 flex flex-col justify-center align-middle">
            <div className="text-2xl font-semibold text-center">
              {`Hello ${userName}, Welcome to ML Quiz`}
            </div>
            <div className="my-6 flex justify-center">
              <button
                onClick={routeChangeHandler}
                className="py-2 px-4 border-0 bg-orange-400 rounded-xl"
              >
                Start Quiz
              </button>
            </div>
          </div>
        </div>
      </TopNavLayout>
    </>
  );
}

export default Welcome;
