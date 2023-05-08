import React, { useEffect } from "react";
//next
import { useRouter } from "next/router";

function UserAuth(WrappedComp) {
  //router

  function Wrapper(props) {
    const router = useRouter();
    // if user email id is not there in session storage then always redirect user to registration page
    useEffect(() => {
      const userEmail = window.sessionStorage.getItem("quiz_user_email");
      if (!userEmail) router.push("/");
    }, [router]);
    return <WrappedComp {...props} />;
  }
  return Wrapper;
}

export default UserAuth;
