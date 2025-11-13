import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { RotateCcw, CheckCircle2, XCircle } from 'lucide-react';
import AnswerButton from './AnswerButton';
import questions from '../data/questions';

const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f5f4 0%, #e7e5e4 100%);
  padding: 2rem 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const QuizCard = styled.div`
  background: white;
  border-radius: 1.5rem;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  padding: 2.5rem;
  max-width: 42rem;
  width: 100%;

  @media (max-width: 640px) {
    padding: 1.75rem;
  }
`;

const ProgressWrapper = styled.div`
  margin-bottom: 2rem;
`;

const ProgressText = styled.p`
  font-size: 0.875rem;
  font-weight: 600;
  color: #57534e;
  margin-bottom: 0.5rem;
`;

const ProgressBarBg = styled.div`
  width: 100%;
  height: 0.5rem;
  background-color: #e7e5e4;
  border-radius: 9999px;
  overflow: hidden;
`;

const ProgressBarFill = styled.div`
  height: 100%;
  background: linear-gradient(90deg, #eab308 0%, #facc15 100%);
  border-radius: 9999px;
  transition: width 0.4s ease;
  width: ${props => props.$progress}%;
`;

const Question = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: #1c1917;
  margin-bottom: 2rem;
  line-height: 1.4;

  @media (max-width: 640px) {
    font-size: 1.25rem;
  }
`;

const OptionsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const FeedbackMessage = styled.div`
  padding: 1rem 1.25rem;
  border-radius: 0.75rem;
  margin-bottom: 1.5rem;
  font-weight: 600;
  background-color: ${props => props.$isCorrect ? '#dcfce7' : '#fee2e2'};
  color: ${props => props.$isCorrect ? '#15803d' : '#991b1b'};
  border: 2px solid ${props => props.$isCorrect ? '#22c55e' : '#ef4444'};
  animation: fadeIn 0.3s ease;

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const NextButton = styled.button`
  width: 100%;
  padding: 1rem 1.5rem;
  font-size: 1rem;
  font-weight: 600;
  color: #1c1917;
  background: linear-gradient(135deg, #fde047 0%, #facc15 100%);
  border: 2px solid #eab308;
  border-radius: 0.75rem;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

  &:hover {
    background: linear-gradient(135deg, #facc15 0%, #eab308 100%);
    box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);
    transform: translateY(-2px);
  }

  &:focus-visible {
    outline: 3px solid #fde047;
    outline-offset: 2px;
  }

  &:active {
    transform: translateY(0);
  }
`;

const ResultsContainer = styled.div`
  text-align: center;
`;

const ScoreTitle = styled.h2`
  font-size: 2rem;
  font-weight: 700;
  color: #1c1917;
  margin-bottom: 0.5rem;
`;

const ScoreText = styled.p`
  font-size: 1.25rem;
  color: #57534e;
  margin-bottom: 2rem;
`;

const SummaryList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
  text-align: left;
`;

const SummaryItem = styled.div`
  padding: 1rem 1.25rem;
  background-color: ${props => props.$isCorrect ? '#f0fdf4' : '#fef2f2'};
  border: 2px solid ${props => props.$isCorrect ? '#bbf7d0' : '#fecaca'};
  border-radius: 0.75rem;
`;

const SummaryQuestion = styled.p`
  font-weight: 600;
  color: #1c1917;
  margin-bottom: 0.5rem;
`;

const SummaryAnswer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: ${props => props.$isCorrect ? '#15803d' : '#991b1b'};
`;

const Quiz = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [isComplete, setIsComplete] = useState(false);

  const currentQuestion = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (isRevealed || isComplete) return;

      const key = e.key;
      if (key >= '1' && key <= '4') {
        const index = parseInt(key) - 1;
        if (index < currentQuestion.options.length) {
          handleAnswer(index);
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentIndex, isRevealed, isComplete]);

  const handleAnswer = (index) => {
    if (isRevealed) return;

    setSelectedIndex(index);
    setIsRevealed(true);

    const isCorrect = index === currentQuestion.correctIndex;
    if (isCorrect) {
      setScore(score + 1);
    }

    setAnswers([
      ...answers,
      {
        questionId: currentQuestion.id,
        question: currentQuestion.question,
        selectedIndex: index,
        selectedAnswer: currentQuestion.options[index],
        correctIndex: currentQuestion.correctIndex,
        correctAnswer: currentQuestion.options[currentQuestion.correctIndex],
        correct: isCorrect
      }
    ]);
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedIndex(null);
      setIsRevealed(false);
    } else {
      setIsComplete(true);
    }
  };

  const handleRetry = () => {
    setCurrentIndex(0);
    setSelectedIndex(null);
    setIsRevealed(false);
    setScore(0);
    setAnswers([]);
    setIsComplete(false);
  };

  if (isComplete) {
    return (
      <Container>
        <QuizCard>
          <ResultsContainer>
            <ScoreTitle>Quiz Complete!</ScoreTitle>
            <ScoreText>
              You got {score} out of {questions.length} correct
            </ScoreText>

            <SummaryList role="region" aria-label="Quiz summary">
              {answers.map((answer, index) => (
                <SummaryItem key={index} $isCorrect={answer.correct}>
                  <SummaryQuestion>
                    Q{index + 1}: {answer.question}
                  </SummaryQuestion>
                  <SummaryAnswer $isCorrect={answer.correct}>
                    {answer.correct ? (
                      <CheckCircle2 size={16} />
                    ) : (
                      <XCircle size={16} />
                    )}
                    <span>
                      Your answer: {answer.selectedAnswer}
                      {!answer.correct && ` • Correct: ${answer.correctAnswer}`}
                    </span>
                  </SummaryAnswer>
                </SummaryItem>
              ))}
            </SummaryList>

            <NextButton onClick={handleRetry}>
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                <RotateCcw size={20} />
                Retry Quiz
              </span>
            </NextButton>
          </ResultsContainer>
        </QuizCard>
      </Container>
    );
  }

  return (
    <Container>
      <QuizCard>
        <ProgressWrapper>
          <ProgressText>
            Question {currentIndex + 1} of {questions.length}
          </ProgressText>
          <ProgressBarBg>
            <ProgressBarFill $progress={progress} role="progressbar" aria-valuenow={progress} aria-valuemin="0" aria-valuemax="100" />
          </ProgressBarBg>
        </ProgressWrapper>

        <Question>{currentQuestion.question}</Question>

        <OptionsContainer>
          {currentQuestion.options.map((option, index) => (
            <AnswerButton
              key={index}
              option={option}
              isSelected={selectedIndex === index}
              isCorrect={index === currentQuestion.correctIndex}
              isRevealed={isRevealed}
              onClick={() => handleAnswer(index)}
              disabled={isRevealed}
            />
          ))}
        </OptionsContainer>

        {isRevealed && (
          <>
            <FeedbackMessage
              $isCorrect={selectedIndex === currentQuestion.correctIndex}
              role="alert"
              aria-live="polite"
            >
              {selectedIndex === currentQuestion.correctIndex
                ? 'Correct!'
                : `Incorrect — correct is ${currentQuestion.options[currentQuestion.correctIndex]}`}
            </FeedbackMessage>

            <NextButton onClick={handleNext} autoFocus>
              {currentIndex < questions.length - 1 ? 'Next Question' : 'See Results'}
            </NextButton>
          </>
        )}
      </QuizCard>
    </Container>
  );
};

export default Quiz;
