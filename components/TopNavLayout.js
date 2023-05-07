import React, { useState, useEffect } from "react";
//next
import { useRouter } from "next/router";
import Link from "next/link";
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
    router.push("/");
  }

  return (
    <div className="w-full h-screen">
      <div className="h-16 flex gap-4 justify-end items-center bg-gray-400">
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
      {children}
    </div>
  );
}

export default TopNavLayout;
