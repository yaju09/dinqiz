import React, { useState } from "react";

function QuestionBody({
  question,
  responseSubmitHandler,
  srNo,
  remainingTime,
}) {
  //local states
  const [userAnswer, setUserAnswer] = useState(null);

  function userAnswerHandler(optionId) {
    setUserAnswer(optionId);
    responseSubmitHandler(optionId);
  }

  return (
    <div className="w-4/5">
      <div className="my-8 flex gap-2 text-2xl font-semibold">
        <div>{`${srNo}.`}</div>
        <div>{question.content}</div>
      </div>
      {question.options.map((option, index) => {
        return (
          <div
            onClick={() => remainingTime && userAnswerHandler(option.id)}
            key={option.id}
            className={`my-4 px-4 py-4 text-lg border border-solid rounded ${
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
