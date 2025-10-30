// --- DOM REFERENCES ---
const startScreen = document.getElementById('start-screen');
const quizScreen = document.getElementById('quiz-screen');
const endScreen = document.getElementById('end-screen');
const startButton = document.getElementById('start-button');
const restartButton = document.getElementById('restart-button');
const questionText = document.getElementById('question-text');
const optionsContainer = document.getElementById('options-container');
const scoreText = document.getElementById('score-text');
const healthDisplay = document.getElementById('health-display');
const goldDisplay = document.getElementById('gold-display');
const progressBar = document.getElementById('progress-bar');
const monsterName = document.getElementById('monster-name');
const endTitle = document.getElementById('end-title');
const endMessage = document.getElementById('end-message');
const endScoreLabel = document.getElementById('end-score-label');

// --- GAME VARIABLES ---
let currentQuestionIndex = 0;
let gold = 0;
let health = 0;
const MAX_HEALTH = 3;
let questions = [];

// --- LISTA DE MONSTROS (DESAFIOS) ---
const monsterList = [
    "Slime de Alceno", "Gosma de Alcano", "Vulto de Haleto", "Espectro do Benzeno",
    "Mago de Álcool", "Diabrete do Éter", "Bugbear da Cetona", "Goblin do Aldeído",
    "Gárgula do Ácido", "Zumbi da Amina", "Esqueleto de Nitrila", "Troll de Tiól",
    "Lich da Amida", "Elemental do Éster", "Dragão de Sulfona"
];

// --- BANCO DE PERGUNTAS (Baseado no PDF e CORRIGIDO) ---
function loadQuestions() {
    questions = [
        {
            question: "Qual a fórmula geral dos Alcanos (parafinas)?",
            options: ["C<sub>n</sub>H<sub>2n+2</sub>", "C<sub>n</sub>H<sub>2n</sub>", "C<sub>n</sub>H<sub>2n-2</sub>", "C<sub>n</sub>H<sub>2n-1</sub>"],
            correctAnswer: "C<sub>n</sub>H<sub>2n+2</sub>"
        },
        {
            question: "O Benzeno, Naftaleno e Antraceno são exemplos de qual tipo de Hidrocarboneto?",
            options: ["Alifáticos", "Alicíclicos", "Aromáticos", "Alcinos"],
            correctAnswer: "Aromáticos"
        },
        {
            question: "Como é classificada a função orgânica com a fórmula geral R-X (onde X = F, Cl, Br, I)?",
            options: ["Álcool", "Haleto de Alquilo", "Amina", "Éter"],
            correctAnswer: "Haleto de Alquilo"
        },
        {
            question: "A fórmula R-OH, onde 'R' é um grupo alquila, representa qual função oxigenada?",
            options: ["Fenol", "Éster", "Álcool", "Aldeído"],
            correctAnswer: "Álcool"
        },
        {
            question: "Qual função oxigenada possui um grupo carbonila (C=O) na ponta de uma cadeia (ligado a um H)?",
            options: ["Cetona", "Aldeído", "Ácido Carboxílico", "Éter"],
            correctAnswer: "Aldeído"
        },
        {
            question: "Qual função oxigenada possui um grupo carbonila (C=O) entre dois carbonos (R-C(=O)-R')?",
            options: ["Cetona", "Aldeído", "Éster", "Álcool"],
            correctAnswer: "Cetona"
        },
        {
            question: "Qual função é representada pela estrutura R-C(=O)OH?",
            options: ["Éster", "Anidrido", "Ácido Carboxílico", "Álcool"],
            correctAnswer: "Ácido Carboxílico"
        },
        {
            question: "A qual grande grupo de funções orgânicas pertencem as Aminas (R-NH<sub>2</sub>)?",
            options: ["Funções Sulfuradas", "Funções Oxigenadas", "Funções Nitrogenadas", "Haletos Orgânicos"],
            correctAnswer: "Funções Nitrogenadas"
        },
        {
            question: "A fórmula R-C≡N representa qual função nitrogenada?",
            options: ["Nitrila", "Imina", "Hidrazona", "Amina Secundária"],
            correctAnswer: "Nitrila"
        },
        {
            question: "Nas funções sulfuradas, o prefixo 'tio-' é usado para substituir Oxigênio por qual elemento?",
            options: ["Nitrogênio", "Flúor", "Enxofre", "Carbono"],
            correctAnswer: "Enxofre"
        },
        {
            question: "Qual função sulfurada é análoga ao álcool (R-OH) e é representada por R-SH?",
            options: ["Tióis (ou Mercaptanas)", "Tioéteres (ou Sulfetos)", "Dissulfetos", "Sulfonas"],
            correctAnswer: "Tióis (ou Mercaptanas)"
        },
        {
            question: "A função R-S-R' é conhecida como:",
            options: ["Dissulfeto", "Tioacetal", "Tiól", "Tioéter (ou Sulfeto)"],
            correctAnswer: "Tioéter (ou Sulfeto)"
        },
        {
            question: "Qual é o nome da função mista (R-C(=O)-N)?",
            options: ["Amida", "Amina", "Imida", "Lactona"],
            correctAnswer: "Amida"
        },
        {
            question: "Na molécula da Vanilina (pág. 17), quais funções estão presentes?",
            options: ["Álcool, Cetona e Éter", "Fenol, Aldeído e Éter", "Ácido Carboxílico e Álcool", "Fenol e Cetona"],
            correctAnswer: "Fenol, Aldeído e Éter"
        },
        {
            question: "Quais funções estão presentes na molécula do Aspartame (pág. 18)?",
            options: ["Amina, Amida, Éster e Ácido Carboxílico", "Álcool, Cetona, Éter e Amina", "Éter, Álcool, Amida e Fenol", "Nitrila, Fenol, Éster e Amina"],
            correctAnswer: "Amina, Amida, Éster e Ácido Carboxílico"
        }
    ];
}

// --- EVENT LISTENERS ---
startButton.addEventListener('click', startGame);
restartButton.addEventListener('click', startGame);

// --- GAME LOGIC ---

// Inicia o Jogo
function startGame() {
    loadQuestions(); 
    
    currentQuestionIndex = 0;
    gold = 0;
    health = MAX_HEALTH;

    updateHealthBar();
    updateGoldDisplay();
    
    endScreen.classList.add('hide');
    startScreen.classList.add('hide');
    quizScreen.classList.remove('hide');

    showNextEncounter();
}

// Mostra o próximo "Monstro" (Pergunta)
function showNextEncounter() {
    resetState();

    // Se o jogador venceu todos os monstros
    if (currentQuestionIndex >= questions.length) {
        endGame(true); // Venceu
        return;
    }

    const question = questions[currentQuestionIndex];
    
    // Define o monstro e a pergunta
    monsterName.innerText = `Desafio ${currentQuestionIndex + 1}: O ${monsterList[currentQuestionIndex]}`;
    questionText.innerHTML = question.question; 
    
    let shuffledOptions = [...question.options].sort(() => Math.random() - 0.5);

    shuffledOptions.forEach(option => {
        const button = document.createElement('button');
        // *** ESTA É A CORREÇÃO DO BUG ***
        button.innerHTML = option; 
        button.classList.add('option-btn');
        button.addEventListener('click', selectAnswer);
        optionsContainer.appendChild(button);
    });

    updateProgressBar();
}

// Reseta o estado (limpa botões)
function resetState() {
    while (optionsContainer.firstChild) {
        optionsContainer.removeChild(optionsContainer.firstChild);
    }
}

// Processa a seleção da resposta ("Ataque")
function selectAnswer(e) {
    const selectedButton = e.target;
    // Compara usando innerHTML para garantir que o HTML seja lido corretamente
    const correct = selectedButton.innerHTML === questions[currentQuestionIndex].correctAnswer;

    Array.from(optionsContainer.children).forEach(button => {
        if (button.innerHTML === questions[currentQuestionIndex].correctAnswer) {
            button.classList.add('correct');
        }
        button.disabled = true; 
    });

    if (correct) {
        // Ganha uma quantidade fixa de ouro (pois não há mais tempo)
        let goldEarned = 100;
        gold += goldEarned;
        updateGoldDisplay();
        
        // Vai para a próxima pergunta
        currentQuestionIndex++;
        setTimeout(showNextEncounter, 1500); // Pausa de 1.5s
    } else {
        // Resposta errada
        selectedButton.classList.add('incorrect');
        takeDamage();
    }
}


// --- FUNÇÕES DO RPG ---

// Jogador toma dano
function takeDamage() {
    health--;
    updateHealthBar();
    
    // Animação de tomar dano
    document.body.classList.add('taking-damage');
    
    setTimeout(() => {
        document.body.classList.remove('taking-damage');
        
        if (health <= 0) {
            endGame(false); // Perdeu
        } else {
            // Sobreviveu, mas passa para a próxima pergunta
            currentQuestionIndex++;
            setTimeout(showNextEncounter, 1500);
        }
    }, 500); // Duração da animação "shake"
}

// Atualiza a barra de HP
function updateHealthBar() {
    const fullHeart = '❤️';
    const emptyHeart = '🖤';
    healthDisplay.innerText = "HP: " + fullHeart.repeat(health) + emptyHeart.repeat(MAX_HEALTH - health);
}

// Atualiza o Ouro
function updateGoldDisplay() {
    goldDisplay.innerText = `Ouro: ${gold}`;
}

// Atualiza a Barra de Progresso (Mapa)
function updateProgressBar() {
    const progressPercent = ((currentQuestionIndex) / questions.length) * 100;
    progressBar.style.width = `${progressPercent}%`;
}

// Finaliza o Jogo
function endGame(didWin) {
    quizScreen.classList.add('hide');
    endScreen.classList.remove('hide');

    if (didWin) {
        endScreen.className = 'win';
        endTitle.innerText = "Você Venceu!";
        endMessage.innerText = "Você derrotou todos os desafios e alcançou o Baú de Ouro!";
        endScoreLabel.innerText = "Ouro Total Encontrado:";
        scoreText.innerText = gold;
    } else {
        endScreen.className = 'lose';
        endTitle.innerText = "Game Over";
        endMessage.innerText = "Você foi derrotado e não alcançou o baú...";
        endScoreLabel.innerText = "Ouro recuperado:";
        scoreText.innerText = gold;
    }
}