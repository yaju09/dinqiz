import React, { useState, useEffect } from "react";
//next
import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";
// global const
import { quizAdminKey } from "../constants/globalConstants";

function TopNavLayout({ children }) {
  //router
  const router = useRouter();

  //local state
  const [adminKey, setAdminKey] = useState("");

  useEffect(() => {
    const savedAdminKey = window.sessionStorage.getItem("admin_key");
    if (savedAdminKey) {
      setAdminKey(savedAdminKey);
    }
  }, []);

  function signOutHandler() {
    window.sessionStorage.removeItem("admin_key");
    window.sessionStorage.removeItem("quiz_user_email");
    window.sessionStorage.removeItem("session_otp");
    router.push("/");
  }

  return (
    <div className="w-full h-screen">
      <div className="h-20 w-full flex items-center justify-between bg-yellow-50 border-solid border-b-2 border-yellow-400">
        <div className="ml-2 h-20">
          <Image src="/static/logo.png" alt="Logo" width={90} height={100} />
        </div>
        <div className="flex gap-4 justify-end items-center">
          {quizAdminKey == adminKey && (
            <Link href={"/all-questions"}>
              <div className="px-2 h-full flex items-center text-lg font-semibold">
                All Questions
              </div>
            </Link>
          )}
          {quizAdminKey == adminKey && (
            <Link href={"/question-create"}>
              <div className="px-2 h-full flex items-center text-lg font-semibold">
                Upload Questions
              </div>
            </Link>
          )}
          <div
            onClick={signOutHandler}
            className="mr-2 px-2 h-full flex items-center text-lg font-semibold cursor-pointer"
          >
            Sign out
          </div>
        </div>
      </div>
      {children}
    </div>
  );
}

export default TopNavLayout;
