import React, { useState } from "react";

function QuestionBody({ question, responseSubmitHandler }) {
  //local states
  const [userAnswer, setUserAnswer] = useState(null);

  function userAnswerHandler(optionId) {
    setUserAnswer(optionId);
    responseSubmitHandler(optionId);
  }

  return (
    <div className="w-2/5">
      <div className="my-8 flex gap-2 text-xl font-semibold">
        <div>{`${question.sr}.`}</div>
        <div>{question.content}</div>
      </div>
      {question.options.map((option, index) => {
        return (
          <div
            onClick={() => userAnswerHandler(option.id)}
            key={option.id}
            className={`my-4 px-4 py-2 border border-solid rounded ${
              userAnswer === option.id
                ? "ring-2 ring-blue-300  ring-offset-1 outline outline-2 outline-[#1089ff] border-[#1089ff]"
                : "border-black"
            }`}
          >
            <div className="flex gap-4 cursor-pointer border-solid border-gray-400 hover:border-gray-500">
              <div>{`${"ABCDEFGHIJKLMNOPQRSTUVWXYZ"[index]}.`}</div>
              <div>{option.content}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default QuestionBody;
