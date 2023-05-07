import React, { useEffect, useContext, useState } from "react";
//auth hoc
import UserAuth from "../hoc/userAuth";
// global const
import { quizAdminKey } from "../constants/globalConstants";
//next
import { useRouter } from "next/router";
//uuid
import { v4 as uuid4 } from "uuid";
// api routes
import * as pscaleAPI from "../constants/node-api";

function QuestionCreate() {
  //router
  const router = useRouter();

  //local state
  const [questionData, setQuestionData] = useState({
    content: "",
    options: [
      { id: uuid4(), content: "" },
      { id: uuid4(), content: "" },
      { id: uuid4(), content: "" },
      { id: uuid4(), content: "" },
    ],
    answer: "",
  });

  useEffect(() => {
    const savedAdminKey = window.sessionStorage.getItem("admin_key");
    if (savedAdminKey != quizAdminKey) router.push("/404");
  }, [router]);

  const handleSubmit = (event) => {
    event.preventDefault();
    let payload = {
      body: questionData,
    };
    fetch(pscaleAPI.QUESTION_ENDPOINT, {
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
        setQuestionData({
          content: "",
          options: [
            { id: uuid4(), content: "" },
            { id: uuid4(), content: "" },
            { id: uuid4(), content: "" },
            { id: uuid4(), content: "" },
          ],
          answer: "",
        });
      })
      .catch((err) => {
        // Catch and display errors
      });
  };

  return (
    <>
      <div className="my-6 w-full flex flex-col justify-center">
        <div className="text-center font-semibold text-2xl">
          Question Create
        </div>
        <form className="w-4/5 mx-auto mt-8" onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              className="block text-gray-700 font-bold mb-2"
              htmlFor="name"
            >
              Question
            </label>
            <input
              className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="name"
              type="text"
              placeholder="Question"
              value={questionData.content}
              onChange={(event) =>
                setQuestionData((prevState) => {
                  let question = { ...prevState };
                  question.content = event.target.value;
                  return question;
                })
              }
            />
          </div>
          <div className="flex flex-col gap-2">
            {questionData?.options?.map((option, index) => {
              return (
                <div key={option.id} className="flex items-center mb-2">
                  <input
                    type="radio"
                    name="correct_answer"
                    value={option.id}
                    checked={questionData.answer == option.id}
                    onChange={() =>
                      setQuestionData((prevState) => {
                        let question = { ...prevState };
                        question.answer = option.id;
                        return question;
                      })
                    }
                    className="mr-2"
                  />

                  <div className="mr-2 my-4 w-full border border-solid rounded border-gray-500">
                    <input
                      type="text"
                      value={option.content}
                      onChange={(event) =>
                        setQuestionData((prevState) => {
                          let question = { ...prevState };
                          question.options[index].content = event.target.value;
                          return question;
                        })
                      }
                      className="mr-2 w-full border-gray-300 rounded-md  outline-none"
                    />
                  </div>
                </div>
              );
            })}
          </div>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            Submit
          </button>
        </form>
      </div>
    </>
  );
}

export default UserAuth(QuestionCreate);
