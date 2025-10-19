import React from 'react';
import './QuestionCard.css';

const QuestionCard = ({ question, showHint, onAnswer }) => {
  if (!question) return <p>Question not found.</p>;

  return (
    <div className="question-box">
      <h2>{question.text}</h2>

      {showHint && (
        <p className="hint">Hint: {question.hint}</p>
      )}

      <div className="options-column">
        {question.options.map((opt, i) => (
          <button
            key={i}
            onClick={() => onAnswer(opt === question.answer)}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuestionCard;
