import React, { useEffect, useState } from "react";
//auth hoc
import UserAuth from "../hoc/userAuth";
//next
import { useRouter } from "next/router";
// global const
import { quizAdminKey } from "../constants/globalConstants";
// api routes
import * as pscaleAPI from "../constants/node-api";
//components
import TopNavLayout from "/components/TopNavLayout";
//icons
import LeftArrow from "../icons/leftArrow";

function AllQuestions() {
  //router
  const router = useRouter();
  //local states
  const [allQuestions, setAllQuestions] = useState([]);

  //if not admin then redirect to 404
  useEffect(() => {
    const savedAdminKey = window.sessionStorage.getItem("admin_key");
    if (savedAdminKey != quizAdminKey) router.push("/404");
  }, [router]);

  useEffect(() => {
    fetch(pscaleAPI.QUESTION_ENDPOINT, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => {
        if (response.status == 200) {
          return response.json();
        }
      })
      .then((response) => {
        setAllQuestions(response.data);
      })
      .catch((err) => {
        // Catch and display errors
      });
  }, [router]);

  function redirectHandler(question_id) {
    router.push(`/question-update/${question_id}`);
  }
  return (
    <TopNavLayout>
      <div
        className="m-2 flex items-center gap-2 cursor-pointer"
        onClick={() => router.back()}
      >
        <LeftArrow className="h-6" />
        <span>Go Back</span>
      </div>
      <div className="my-4 flex flex-col content-center">
        <div className="text-center font-semibold text-2xl">All Questions</div>
        {allQuestions.map((question, index) => {
          return (
            <div
              className="m-4 p-4 border border-solid border-gray-400 rounded  cursor-pointer"
              key={question.id}
              onClick={() => redirectHandler(question.id)}
            >
              <span>{index + 1}</span>
              {". "}
              {question.body.content}
            </div>
          );
        })}
      </div>
    </TopNavLayout>
  );
}

export default UserAuth(AllQuestions);
