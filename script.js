const questions = [
  {
    id: 1,
    question: "Which country hosted the 2024 Summer Olympics?",
    options: ["France", "Japan", "USA", "Brazil"],
    correctIndex: 0
  },
  {
    id: 2,
    question: "Which tech company released the AI model 'Gemini' lineup in 2023–24?",
    options: ["Microsoft", "Google", "Meta", "Apple"],
    correctIndex: 1
  },
  {
    id: 3,
    question: "Which global event in 2024 led to major discussions on climate goals?",
    options: ["COP29", "G20 Summit", "COP28", "UNGA 2024"],
    correctIndex: 2
  },
  {
    id: 4,
    question: "Which country surpassed 1 billion smartphone users by 2024?",
    options: ["Indonesia", "India", "USA", "China"],
    correctIndex: 1
  },
  {
    id: 5,
    question: "Which popular electric car maker announced large-scale European expansion in 2024?",
    options: ["Rivian", "NIO", "Tesla", "Lucid"],
    correctIndex: 2
  }
];

class QuizApp {
  constructor() {
    this.currentIndex = 0;
    this.selectedIndex = null;
    this.isRevealed = false;
    this.score = 0;
    this.answers = [];
    this.currentQuestion = questions[this.currentIndex];

    this.initializeEventListeners();
    this.renderQuestion();
  }

  initializeEventListeners() {
    document.getElementById('nextButton').addEventListener('click', () => this.handleNext());
    document.getElementById('retryButton').addEventListener('click', () => this.handleRetry());
    window.addEventListener('keydown', (e) => this.handleKeyPress(e));
  }

  handleKeyPress(e) {
    if (this.isRevealed || this.isComplete) return;

    const key = e.key;
    if (key >= '1' && key <= '4') {
      const index = parseInt(key) - 1;
      if (index < this.currentQuestion.options.length) {
        this.handleAnswer(index);
      }
    }
  }

  renderQuestion() {
    const progress = ((this.currentIndex + 1) / questions.length) * 100;

    document.getElementById('progressText').textContent = `Question ${this.currentIndex + 1} of ${questions.length}`;
    const progressBar = document.getElementById('progressBar');
    progressBar.style.width = `${progress}%`;
    progressBar.setAttribute('aria-valuenow', Math.round(progress));

    document.getElementById('questionText').textContent = this.currentQuestion.question;

    const optionsContainer = document.getElementById('optionsContainer');
    optionsContainer.innerHTML = '';

    this.currentQuestion.options.forEach((option, index) => {
      const button = document.createElement('button');
      button.className = 'answer-button';
      button.setAttribute('aria-pressed', 'false');

      const span = document.createElement('span');
      span.textContent = option;

      button.appendChild(span);

      button.addEventListener('click', () => this.handleAnswer(index));

      optionsContainer.appendChild(button);
    });

    document.getElementById('feedbackMessage').style.display = 'none';
    document.getElementById('nextButton').style.display = 'none';
  }

  handleAnswer(index) {
    if (this.isRevealed) return;

    this.selectedIndex = index;
    this.isRevealed = true;

    const buttons = document.querySelectorAll('.answer-button');
    const isCorrect = index === this.currentQuestion.correctIndex;

    buttons.forEach((btn, i) => {
      btn.disabled = true;
      btn.classList.add('revealed');

      if (i === this.currentQuestion.correctIndex) {
        btn.classList.add('correct');
      }

      if (i === index && !isCorrect) {
        btn.classList.add('incorrect');
      }

      if (i === index) {
        btn.setAttribute('aria-pressed', 'true');
      }
    });

    if (isCorrect) {
      this.score++;
    }

    this.answers.push({
      questionId: this.currentQuestion.id,
      question: this.currentQuestion.question,
      selectedIndex: index,
      selectedAnswer: this.currentQuestion.options[index],
      correctIndex: this.currentQuestion.correctIndex,
      correctAnswer: this.currentQuestion.options[this.currentQuestion.correctIndex],
      correct: isCorrect
    });

    this.showFeedback(isCorrect);
    this.showNextButton();
  }

  showFeedback(isCorrect) {
    const feedbackMessage = document.getElementById('feedbackMessage');
    feedbackMessage.textContent = isCorrect
      ? 'Correct!'
      : `Incorrect — correct is ${this.currentQuestion.options[this.currentQuestion.correctIndex]}`;
    feedbackMessage.className = `feedback-message ${isCorrect ? 'correct' : 'incorrect'}`;
    feedbackMessage.style.display = 'block';
  }

  showNextButton() {
    const nextButton = document.getElementById('nextButton');
    nextButton.textContent = this.currentIndex < questions.length - 1 ? 'Next Question' : 'See Results';
    nextButton.style.display = 'block';
    nextButton.focus();
  }

  handleNext() {
    if (this.currentIndex < questions.length - 1) {
      this.currentIndex++;
      this.currentQuestion = questions[this.currentIndex];
      this.selectedIndex = null;
      this.isRevealed = false;
      this.renderQuestion();
    } else {
      this.showResults();
    }
  }

  showResults() {
    document.getElementById('quizView').classList.remove('active');
    document.getElementById('resultsView').classList.add('active');

    document.getElementById('scoreText').textContent = `You got ${this.score} out of ${questions.length} correct`;

    const summaryList = document.getElementById('summaryList');
    summaryList.innerHTML = '';

    this.answers.forEach((answer, index) => {
      const item = document.createElement('div');
      item.className = `summary-item ${answer.correct ? 'correct' : 'incorrect'}`;

      const question = document.createElement('p');
      question.className = 'summary-question';
      question.textContent = `Q${index + 1}: ${answer.question}`;

      const answerDiv = document.createElement('div');
      answerDiv.className = `summary-answer ${answer.correct ? 'correct' : 'incorrect'}`;

      const icon = document.createElement('svg');
      icon.setAttribute('viewBox', '0 0 24 24');
      icon.setAttribute('fill', 'none');
      icon.setAttribute('stroke', 'currentColor');

      if (answer.correct) {
        icon.setAttribute('d', 'M9 16.17L4.83 12m0 0L3.76 13.07M4.83 12L12 19.17m0 0L20.24 11m0 0L19.17 9.93');
        icon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>';
      } else {
        icon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l-2-2m0 0l-2-2m2 2l2-2m-2 2l-2 2m8-8a9 9 0 11-18 0 9 9 0 0118 0z"/>';
      }

      answerDiv.appendChild(icon);

      const text = document.createElement('span');
      text.textContent = `Your answer: ${answer.selectedAnswer}`;
      if (!answer.correct) {
        text.textContent += ` • Correct: ${answer.correctAnswer}`;
      }

      answerDiv.appendChild(text);
      item.appendChild(question);
      item.appendChild(answerDiv);
      summaryList.appendChild(item);
    });
  }

  handleRetry() {
    this.currentIndex = 0;
    this.selectedIndex = null;
    this.isRevealed = false;
    this.score = 0;
    this.answers = [];
    this.currentQuestion = questions[this.currentIndex];

    document.getElementById('resultsView').classList.remove('active');
    document.getElementById('quizView').classList.add('active');

    this.renderQuestion();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new QuizApp();
});
