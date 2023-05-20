import React, { useEffect, useState } from "react";
//auth hoc
import UserAuth from "../../hoc/userAuth";
//next
import { useRouter } from "next/router";
// global const
import { quizAdminKey } from "../../constants/globalConstants";
// api routes
import * as pscaleAPI from "../../constants/node-api";
//components
import TopNavLayout from "/components/TopNavLayout";
//icons
import LeftArrow from "/icons/leftArrow";

function UpdateQuestions() {
  //router
  const router = useRouter();
  const question_id = +router.query.question_id;

  //local states
  const [questionData, setQuestionData] = useState(null);

  //if not admin then redirect to 404
  useEffect(() => {
    const savedAdminKey = window.sessionStorage.getItem("admin_key");
    if (savedAdminKey != quizAdminKey) router.push("/404");
  }, [router]);

  useEffect(() => {
    if (!question_id) return;
    fetch(pscaleAPI.QUESTION_WITH_ID_ENDPOINT(question_id), {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => {
        if (response.status == 200) {
          return response.json();
        }
      })
      .then((response) => {
        setQuestionData(response.data);
      })
      .catch((err) => {
        // Catch and display errors
      });
  }, [router, question_id]);

  const handleSubmit = (event) => {
    if (!questionData?.body?.answer) {
      alert("Please select correct option.");
      return;
    }
    event.preventDefault();
    fetch(pscaleAPI.QUESTION_WITH_ID_ENDPOINT(question_id), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(questionData),
    })
      .then((response) => {
        if (response.status == 200) {
          router.push("/all-questions");
        }
      })
      .catch((err) => {
        // Catch and display errors
      });
  };

  return (
    <>
      <TopNavLayout>
        <div
          className="m-2 flex items-center gap-2 cursor-pointer"
          onClick={() => router.back()}
        >
          <LeftArrow className="h-6" />
          <span>Go Back</span>
        </div>
        <div className="my-6 w-full flex flex-col justify-center">
          <div className="text-center font-semibold text-2xl">
            Question Update
          </div>
          {questionData && (
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
                  value={questionData.body.content}
                  onChange={(event) =>
                    setQuestionData((prevState) => {
                      let question = { ...prevState };
                      question.body.content = event.target.value;
                      return question;
                    })
                  }
                />
              </div>
              <div className="flex flex-col gap-2">
                {questionData.body.options.map((option, index) => {
                  return (
                    <div key={option.id} className="flex items-center mb-2">
                      <input
                        type="radio"
                        name="correct_answer"
                        value={option.id}
                        checked={questionData.body.answer == option.id}
                        onChange={() =>
                          setQuestionData((prevState) => {
                            let question = { ...prevState };
                            question.body.answer = option.id;
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
                              question.body.options[index].content =
                                event.target.value;
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
          )}
        </div>
      </TopNavLayout>
    </>
  );
}

export default UserAuth(UpdateQuestions);
