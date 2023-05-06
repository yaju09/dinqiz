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

  return (
    <>
      <TopNavLayout>
        <div className="w-full h-screen flex flex-col align-middle">
          <div className="h-2/3 flex flex-col justify-center align-middle">
            <div className="text-2xl font-semibold text-center">
              {`Hello ${userName}, ML quiz has ended`}
            </div>
            <div className="my-6 text-2xl font-semibold flex justify-center">
              Thank you
            </div>
          </div>
        </div>
      </TopNavLayout>
    </>
  );
}

export default Welcome;
