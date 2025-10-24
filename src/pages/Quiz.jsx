import React, { useState, useEffect, useCallback } from 'react'; 
import { useNavigate } from 'react-router-dom';
import rawQuestions from '../data/questions.json';
import QuestionCard from '../components/QuestionCard';
import { submitToGoogleForm } from '../utils/submitToGoogleForm';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Quiz.css';

const Quiz = () => {
  const [questions, setQuestions] = useState([]);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [answeredCount, setAnsweredCount] = useState(0);
  const [usedHint, setUsedHint] = useState(false);
  const [doubleActive, setDoubleActive] = useState(false);
  const [powerUsedThisQuestion, setPowerUsedThisQuestion] = useState(false);
  const [hintUsesLeft, setHintUsesLeft] = useState(5);
  const [timeLeft, setTimeLeft] = useState(1800);
  const [selectedPower, setSelectedPower] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const shuffled = [...rawQuestions].sort(() => 0.5 - Math.random()).slice(0, 25);
    setQuestions(shuffled);
  }, []);

  const finishQuiz = useCallback(() => {
    const alreadySubmitted = localStorage.getItem('submitted');
    if (alreadySubmitted) return;

    localStorage.setItem('finalScore', score);
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    submitToGoogleForm({ ...userInfo, score });
    localStorage.setItem('submitted', 'true');
    new Audio('/sounds/complete.mp3').play();
    navigate('/thankyou');
  }, [score, navigate]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          finishQuiz();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [finishQuiz]);

  useEffect(() => {
    if (answeredCount >= questions.length && questions.length > 0) {
      finishQuiz();
    }
  }, [answeredCount, questions.length, finishQuiz]);

  const formattedTime = `${Math.floor(timeLeft / 60)}:${String(timeLeft % 60).padStart(2, '0')}`;

  // ✅ Final fix: block rendering if quiz is done or index is out of bounds
  if (
    questions.length === 0 ||
    answeredCount >= questions.length ||
    index >= questions.length ||
    !questions[index]
  ) {
    return null;
  }

  const handlePower = (type) => {
    if (powerUsedThisQuestion) return;
    setSelectedPower(type);

    if (type === 'Hint') {
      if (hintUsesLeft <= 0) {
        toast.warn('No hints left!');
        return;
      }
      setUsedHint(true);
      setHintUsesLeft(prev => prev - 1);
      setScore(prev => prev - 1);
      toast.info('Hint used. -1 point');
    }

    if (type === 'Double') {
      setDoubleActive(true);
      toast.info('Double points activated!');
    }

    if (type === 'Swap') {
      if (answeredCount >= questions.length) {
        finishQuiz();
        return;
      }

      setIndex(prev => (prev + 1 < questions.length ? prev + 1 : prev));
      setAnsweredCount(prev => prev + 1);
      setUsedHint(false);
      setDoubleActive(false);
      setPowerUsedThisQuestion(true);
      setSelectedPower('Swap');
      toast.info('Question swapped! Now answer this one.');
      return;
    }

    setPowerUsedThisQuestion(true);
  };

  const handleAnswer = (isCorrect) => {
    const points = isCorrect ? (doubleActive ? 10 : 5) : 0;
    setScore(score + points);

    setUsedHint(false);
    setDoubleActive(false);
    setPowerUsedThisQuestion(false);
    setSelectedPower(null);

    setAnsweredCount(prev => prev + 1);

    if (index + 1 < questions.length) {
      setIndex(prev => prev + 1);
    }

    new Audio('/sounds/next.mp3').play();
  };

  return (
    <div className="quiz-container">
      <ToastContainer position="top-center" autoClose={2000} hideProgressBar />
      <div className="header-bar">
        <h1 className="event-title">ALGO HUNT</h1>
        <div className="status-bar">
          <span>Time Left: {formattedTime}</span>
          <span>Points per Question: 5</span>
          <span>Hints Remaining: {hintUsesLeft}</span>
        </div>
      </div>

      <div className="main-content">
        <div className="question-section">
          <h3>Question {answeredCount + 1} of {questions.length}</h3>
          <QuestionCard
            question={questions[index]}
            showHint={usedHint}
            onAnswer={handleAnswer}
          />
        </div>

        <div className="power-section">
          <h4>Power Cards</h4>
          <button
            onClick={() => handlePower('Hint')}
            disabled={powerUsedThisQuestion || hintUsesLeft === 0}
            className={selectedPower === 'Hint' ? 'glow' : ''}
          >
            Hint ({hintUsesLeft} left)
          </button>
          <button
            onClick={() => handlePower('Swap')}
            disabled={powerUsedThisQuestion}
            className={selectedPower === 'Swap' ? 'glow' : ''}
          >
            Swap
          </button>
          <button
            onClick={() => handlePower('Double')}
            disabled={powerUsedThisQuestion}
            className={selectedPower === 'Double' ? 'glow' : ''}
          >
            2X
          </button>
        </div>
      </div>
    </div>
  );
};

export default Quiz;
