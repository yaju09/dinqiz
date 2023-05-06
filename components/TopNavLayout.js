import React from "react";
//next
import { useRouter } from "next/router";

function TopNavLayout({ children }) {
  //router
  const router = useRouter();

  function signOutHandler() {
    router.push("/");
  }

  return (
    <div className="w-full h-screen">
      <div className="h-16 flex justify-end items-center bg-gray-400">
        <div
          onClick={signOutHandler}
          className="px-4 h-full flex items-center text-lg font-semibold cursor-pointer"
        >
          Sign out
        </div>
      </div>
      {children}
    </div>
  );
}

export default TopNavLayout;
