document.addEventListener('DOMContentLoaded', () => {
    const quizSelectionScreen = document.getElementById('quiz-selection-screen');
    const quizScreen = document.getElementById('quiz-screen');
    const resultScreen = document.getElementById('result-screen');

    const quizListContainer = document.getElementById('quiz-list');
    const nextBtn = document.getElementById('next-btn');
    const restartBtn = document.getElementById('restart-btn');
    const backToQuizzesBtn = document.getElementById('back-to-quizzes-btn');

    const questionNumberEl = document.getElementById('question-number');
    const totalQuestionsEl = document.getElementById('total-questions');
    const questionTextEl = document.getElementById('question-text');
    const optionsContainer = document.getElementById('options-container');
    const scoreEl = document.getElementById('score');
    const progressBar = document.getElementById('progress-bar');
    const explanationContainer = document.getElementById('explanation-container');
    const explanationTextEl = document.getElementById('explanation-text');

    const finalScoreEl = document.getElementById('final-score');
    const finalTotalEl = document.getElementById('final-total');
    const wrongAnswersListEl = document.getElementById('wrong-answers-list');
    const noWrongAnswersEl = document.getElementById('no-wrong-answers');
    const reviewContainer = document.getElementById('review-container');

    let currentQuestionIndex = 0;
    let score = 0;
    let wrongAnswers = [];
    let quizData = [];
    let shuffledQuizData = [];

    function initializeQuizzes() {
        quizManifest.forEach((quiz, index) => {
            const button = document.createElement('button');
            button.textContent = quiz.name;
            button.classList.add('w-full', 'bg-white', 'p-4', 'rounded-lg', 'shadow-md', 'text-left', 'hover:bg-indigo-50', 'transition-colors');
            button.dataset.quizIndex = index;
            button.addEventListener('click', selectQuiz);
            quizListContainer.appendChild(button);
        });
    }

    function selectQuiz(e) {
        const quizIndex = e.target.dataset.quizIndex;
        const selectedQuiz = quizManifest[quizIndex];
        quizData = window[selectedQuiz.variableName];
        
        document.getElementById('quiz-title').textContent = selectedQuiz.name;
        quizSelectionScreen.classList.add('hidden');
        startQuiz();
    }

    function startQuiz() {
        resultScreen.classList.add('hidden');
        quizScreen.classList.remove('hidden');

        currentQuestionIndex = 0;
        score = 0;
        wrongAnswers = [];
        scoreEl.textContent = score;
        totalQuestionsEl.textContent = quizData.length;

        shuffledQuizData = [...quizData];
        shuffleArray(shuffledQuizData);
        showQuestion();
    }

    function showQuestion() {
        resetState();
        const currentQuestion = shuffledQuizData[currentQuestionIndex];
        questionNumberEl.textContent = currentQuestionIndex + 1;
        questionTextEl.textContent = currentQuestion.question;

        const shuffledOptions = [...currentQuestion.options];
        shuffleArray(shuffledOptions);

        shuffledOptions.forEach(option => {
            const button = document.createElement('button');
            button.innerText = option;
            button.classList.add('option-btn', 'p-4', 'border-2', 'border-slate-300', 'rounded-lg', 'text-left', 'w-full');
            button.addEventListener('click', selectAnswer);
            optionsContainer.appendChild(button);
        });
        updateProgressBar();
    }

    function resetState() {
        nextBtn.classList.add('hidden');
        explanationContainer.classList.add('hidden');
        while (optionsContainer.firstChild) {
            optionsContainer.removeChild(optionsContainer.firstChild);
        }
    }

    function selectAnswer(e) {
        const selectedBtn = e.target;
        const currentQuestion = shuffledQuizData[currentQuestionIndex];
        const isCorrect = selectedBtn.innerText === currentQuestion.answer;

        if (isCorrect) {
            score++;
            scoreEl.textContent = score;
            selectedBtn.classList.add('correct');
        } else {
            selectedBtn.classList.add('incorrect');
            wrongAnswers.push({
                question: currentQuestion.question,
                correctAnswer: currentQuestion.answer,
                yourAnswer: selectedBtn.innerText
            });
        }

        Array.from(optionsContainer.children).forEach(button => {
            if (button.innerText === currentQuestion.answer) {
                button.classList.add('correct');
            }
            button.disabled = true;
        });

        if (currentQuestion.explanation) {
            explanationTextEl.textContent = currentQuestion.explanation;
            explanationContainer.classList.remove('hidden');
        }

        nextBtn.classList.remove('hidden');
    }

    function showNextQuestion() {
        currentQuestionIndex++;
        if (currentQuestionIndex < shuffledQuizData.length) {
            showQuestion();
        } else {
            showResults();
        }
    }

    function updateProgressBar() {
        const progressPercentage = ((currentQuestionIndex + 1) / shuffledQuizData.length) * 100;
        progressBar.style.width = `${progressPercentage}%`;
    }

    function showResults() {
        quizScreen.classList.add('hidden');
        resultScreen.classList.remove('hidden');
        finalScoreEl.textContent = score;
        finalTotalEl.textContent = shuffledQuizData.length;

        wrongAnswersListEl.innerHTML = '';

        if (wrongAnswers.length === 0) {
            noWrongAnswersEl.classList.remove('hidden');
            reviewContainer.querySelector('h2').classList.add('hidden');
            reviewContainer.querySelector('p').classList.add('hidden');
        } else {
            noWrongAnswersEl.classList.add('hidden');
            reviewContainer.querySelector('h2').classList.remove('hidden');
            reviewContainer.querySelector('p').classList.remove('hidden');
            wrongAnswers.forEach(item => {
                const li = document.createElement('li');
                li.innerHTML = `
                    <p class="font-semibold">${item.question}</p>
                    <p class="text-sm text-red-600">Your answer: ${item.yourAnswer}</p>
                    <p class="text-sm text-green-600">Correct answer: ${item.correctAnswer}</p>
                `;
                wrongAnswersListEl.appendChild(li);
            });
        }
    }

    function backToQuizzes() {
        resultScreen.classList.add('hidden');
        quizSelectionScreen.classList.remove('hidden');
        quizListContainer.innerHTML = ''; 
        initializeQuizzes();
    }

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    nextBtn.addEventListener('click', showNextQuestion);
    restartBtn.addEventListener('click', backToQuizzes);
    backToQuizzesBtn.addEventListener('click', backToQuizzes);

    initializeQuizzes();
});