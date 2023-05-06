import React, { useEffect } from "react";
//next
import { useRouter } from "next/router";

function UserAuth(WrappedComp) {
  console.log("===", WrappedComp);
  //router

  function Wrapper(props) {
    const router = useRouter();
    useEffect(() => {
      const userEmail = window.sessionStorage.getItem("quiz_user_email");
      if (!userEmail) router.push("/");
    }, [router]);
    return <WrappedComp {...props} />;
  }
  return Wrapper;
}

export default UserAuth;
