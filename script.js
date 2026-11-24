/* =========================================================
   Kahootrix — script.js
   Vanilla JS: data, state, game engine, UI, persistence
   ========================================================= */
'use strict';

/* ---------------------------------------------------------
   1. DATA — categories, difficulties, questions, achievements
   --------------------------------------------------------- */
const CATEGORIES = [
  { id: 'general',   name: 'General Knowledge', icon: '🧠', desc: 'A bit of everything to warm up your brain.', c1: '#8b5cf6', c2: '#22d3ee' },
  { id: 'science',   name: 'Science',           icon: '🔬', desc: 'Atoms, planets, cells and the laws of nature.', c1: '#22d3ee', c2: '#3b82f6' },
  { id: 'tech',      name: 'Technology',        icon: '💻', desc: 'Computers, code, gadgets and the internet.', c1: '#3b82f6', c2: '#8b5cf6' },
  { id: 'history',   name: 'History',           icon: '🏛️', desc: 'Empires, revolutions and legendary figures.', c1: '#f59e0b', c2: '#ec4899' },
  { id: 'geography', name: 'Geography',         icon: '🌍', desc: 'Capitals, rivers, mountains and continents.', c1: '#22c55e', c2: '#22d3ee' },
  { id: 'sports',    name: 'Sports',            icon: '⚽', desc: 'Champions, records and iconic moments.', c1: '#ef4444', c2: '#f59e0b' },
  { id: 'entertainment', name: 'Entertainment', icon: '🎬', desc: 'Movies, music, TV and pop culture.', c1: '#ec4899', c2: '#8b5cf6' },
  { id: 'math',      name: 'Mathematics',       icon: '➗', desc: 'Numbers, logic and mental arithmetic.', c1: '#06b6d4', c2: '#6366f1' }
];

const DIFFICULTIES = {
  easy:   { label: 'Easy',   points: 10, time: 20, xp: 1.5 },
  medium: { label: 'Medium', points: 20, time: 15, xp: 2.5 },
  hard:   { label: 'Hard',   points: 30, time: 10, xp: 5 }
};

const QUESTIONS_PER_QUIZ = 10;

/* Each question: q = text, o = options (FIRST option is the correct one, positions are shuffled at runtime), d = difficulty */
const QUESTIONS = {
  general: [
    { q: 'How many days are there in a leap year?', o: ['366', '365', '364', '367'], d: 'easy' },
    { q: 'What color do you get by mixing blue and yellow?', o: ['Green', 'Purple', 'Orange', 'Brown'], d: 'easy' },
    { q: 'How many continents are there on Earth?', o: ['7', '5', '6', '8'], d: 'easy' },
    { q: 'Which is the largest mammal in the world?', o: ['Blue whale', 'African elephant', 'Giraffe', 'Great white shark'], d: 'easy' },
    { q: 'What is the currency of Japan?', o: ['Yen', 'Won', 'Yuan', 'Ringgit'], d: 'medium' },
    { q: 'How many strings does a standard guitar have?', o: ['6', '4', '5', '8'], d: 'medium' },
    { q: 'Which language has the most native speakers worldwide?', o: ['Mandarin Chinese', 'English', 'Spanish', 'Hindi'], d: 'medium' },
    { q: 'What is the hardest natural substance on Earth?', o: ['Diamond', 'Quartz', 'Titanium', 'Graphite'], d: 'medium' },
    { q: 'Which planet is known as the "Morning Star"?', o: ['Venus', 'Mars', 'Mercury', 'Jupiter'], d: 'hard' },
    { q: 'What is the smallest country in the world by area?', o: ['Vatican City', 'Monaco', 'San Marino', 'Liechtenstein'], d: 'hard' },
    { q: 'How many bones are in the adult human body?', o: ['206', '201', '212', '196'], d: 'hard' },
    { q: 'Which gas makes up most of Earth\'s atmosphere?', o: ['Nitrogen', 'Oxygen', 'Carbon dioxide', 'Argon'], d: 'easy' },
    { q: 'What is the only metal that is liquid at room temperature?', o: ['Mercury', 'Gallium', 'Cesium', 'Bromine'], d: 'medium' },
    { q: 'Which number is both a perfect square and a perfect cube?', o: ['64', '36', '81', '100'], d: 'hard' },
    { q: 'What is the probability of rolling a sum of 12 with two standard dice?', o: ['1/36', '1/12', '1/18', '1/6'], d: 'hard' }
  ],
  science: [
    { q: 'What is the chemical symbol for water?', o: ['H₂O', 'CO₂', 'O₂', 'NaCl'], d: 'easy' },
    { q: 'Which planet is closest to the Sun?', o: ['Mercury', 'Venus', 'Earth', 'Mars'], d: 'easy' },
    { q: 'What force keeps us on the ground?', o: ['Gravity', 'Magnetism', 'Friction', 'Inertia'], d: 'easy' },
    { q: 'What gas do plants absorb from the air?', o: ['Carbon dioxide', 'Oxygen', 'Nitrogen', 'Hydrogen'], d: 'easy' },
    { q: 'What is the powerhouse of the cell?', o: ['Mitochondria', 'Nucleus', 'Ribosome', 'Chloroplast'], d: 'medium' },
    { q: 'What is the speed of light in a vacuum (approx.)?', o: ['300,000 km/s', '150,000 km/s', '1,000,000 km/s', '30,000 km/s'], d: 'medium' },
    { q: 'What is the atomic number of carbon?', o: ['6', '12', '8', '14'], d: 'medium' },
    { q: 'Which blood type is the universal donor?', o: ['O negative', 'AB positive', 'A positive', 'B negative'], d: 'medium' },
    { q: 'What particle has a negative electric charge?', o: ['Electron', 'Proton', 'Neutron', 'Photon'], d: 'medium' },
    { q: 'What is the most abundant element in the universe?', o: ['Hydrogen', 'Helium', 'Oxygen', 'Carbon'], d: 'hard' },
    { q: 'What is the pH value of pure water?', o: ['7', '0', '14', '5'], d: 'hard' },
    { q: 'Which scientist proposed the three laws of motion?', o: ['Isaac Newton', 'Albert Einstein', 'Galileo Galilei', 'Niels Bohr'], d: 'hard' },
    { q: 'Which organelle modifies, sorts and packages proteins?', o: ['Golgi apparatus', 'Lysosome', 'Vacuole', 'Centrosome'], d: 'medium' },
    { q: 'What is the Chandrasekhar limit associated with?', o: ['The maximum mass of a stable white dwarf', 'The speed of expanding galaxies', 'The age of the universe', 'The temperature of the Sun'], d: 'hard' },
    { q: 'Which type of bond involves the sharing of electron pairs?', o: ['Covalent bond', 'Ionic bond', 'Hydrogen bond', 'Metallic bond'], d: 'hard' }
  ],
  tech: [
    { q: 'What does "WWW" stand for?', o: ['World Wide Web', 'World Web Wide', 'Wide World Web', 'Web World Wide'], d: 'easy' },
    { q: 'Which company makes the iPhone?', o: ['Apple', 'Samsung', 'Google', 'Microsoft'], d: 'easy' },
    { q: 'What does "CPU" stand for?', o: ['Central Processing Unit', 'Computer Personal Unit', 'Central Program Utility', 'Core Processing Unit'], d: 'easy' },
    { q: 'Which of these is a web browser?', o: ['Firefox', 'Photoshop', 'Excel', 'Linux'], d: 'easy' },
    { q: 'What language is primarily used to style web pages?', o: ['CSS', 'HTML', 'Python', 'SQL'], d: 'medium' },
    { q: 'How many bits are in one byte?', o: ['8', '4', '16', '32'], d: 'medium' },
    { q: 'Who co-founded Microsoft with Bill Gates?', o: ['Paul Allen', 'Steve Jobs', 'Steve Wozniak', 'Larry Page'], d: 'medium' },
    { q: 'What does "HTTP" stand for?', o: ['HyperText Transfer Protocol', 'High Transfer Text Protocol', 'HyperText Transmission Process', 'Home Tool Transfer Protocol'], d: 'medium' },
    { q: 'What year was the first iPhone released?', o: ['2007', '2005', '2009', '2010'], d: 'hard' },
    { q: 'Which programming language was created by Guido van Rossum?', o: ['Python', 'Java', 'Ruby', 'C++'], d: 'hard' },
    { q: 'What does "RAM" stand for?', o: ['Random Access Memory', 'Read Access Memory', 'Rapid Access Module', 'Run All Memory'], d: 'easy' },
    { q: 'What is the name of the first electronic general-purpose computer?', o: ['ENIAC', 'UNIVAC', 'Colossus', 'Apple I'], d: 'hard' },
    { q: 'What does an API primarily define?', o: ['How software components communicate', 'How a processor is manufactured', 'How images are compressed', 'How passwords are encrypted'], d: 'medium' },
    { q: 'In computational complexity, what class contains problems verifiable in polynomial time?', o: ['NP', 'P only', 'EXPTIME', 'Undecidable'], d: 'hard' },
    { q: 'Which data structure uses last-in, first-out ordering?', o: ['Stack', 'Queue', 'Heap', 'Graph'], d: 'hard' }
  ],
  history: [
    { q: 'Who was the first President of the United States?', o: ['George Washington', 'Thomas Jefferson', 'Abraham Lincoln', 'John Adams'], d: 'easy' },
    { q: 'In which year did World War II end?', o: ['1945', '1939', '1944', '1950'], d: 'easy' },
    { q: 'The Great Wall is located in which country?', o: ['China', 'India', 'Japan', 'Mongolia'], d: 'easy' },
    { q: 'Who painted the Mona Lisa?', o: ['Leonardo da Vinci', 'Michelangelo', 'Raphael', 'Donatello'], d: 'easy' },
    { q: 'Which ancient civilization built the pyramids of Giza?', o: ['Egyptians', 'Romans', 'Greeks', 'Mayans'], d: 'medium' },
    { q: 'Who was the first man to walk on the Moon?', o: ['Neil Armstrong', 'Buzz Aldrin', 'Yuri Gagarin', 'Michael Collins'], d: 'medium' },
    { q: 'The Titanic sank in which year?', o: ['1912', '1905', '1920', '1898'], d: 'medium' },
    { q: 'Which empire was ruled by Julius Caesar?', o: ['Roman Empire', 'Ottoman Empire', 'Persian Empire', 'Mongol Empire'], d: 'medium' },
    { q: 'In what year did the Berlin Wall fall?', o: ['1989', '1991', '1985', '1979'], d: 'hard' },
    { q: 'Who was the first female Prime Minister of the United Kingdom?', o: ['Margaret Thatcher', 'Theresa May', 'Queen Victoria', 'Indira Gandhi'], d: 'hard' },
    { q: 'The Magna Carta was signed in which year?', o: ['1215', '1066', '1492', '1348'], d: 'hard' },
    { q: 'Which war was fought between the North and South regions of the United States?', o: ['American Civil War', 'Revolutionary War', 'War of 1812', 'Mexican-American War'], d: 'easy' },
    { q: 'The Renaissance began in which country?', o: ['Italy', 'France', 'England', 'Spain'], d: 'medium' },
    { q: 'Which treaty formally ended World War I between Germany and the Allies?', o: ['Treaty of Versailles', 'Treaty of Tordesillas', 'Treaty of Utrecht', 'Treaty of Paris'], d: 'hard' },
    { q: 'Which civilization developed cuneiform writing?', o: ['Sumerians', 'Romans', 'Aztecs', 'Vikings'], d: 'hard' }
  ],
  geography: [
    { q: 'What is the capital of France?', o: ['Paris', 'Lyon', 'Marseille', 'Nice'], d: 'easy' },
    { q: 'Which is the largest ocean on Earth?', o: ['Pacific Ocean', 'Atlantic Ocean', 'Indian Ocean', 'Arctic Ocean'], d: 'easy' },
    { q: 'Which continent is Brazil located in?', o: ['South America', 'North America', 'Africa', 'Europe'], d: 'easy' },
    { q: 'What is the longest river in the world?', o: ['Nile', 'Amazon', 'Yangtze', 'Mississippi'], d: 'medium' },
    { q: 'What is the capital of Australia?', o: ['Canberra', 'Sydney', 'Melbourne', 'Perth'], d: 'medium' },
    { q: 'Which desert is the largest hot desert in the world?', o: ['Sahara', 'Gobi', 'Kalahari', 'Arabian'], d: 'medium' },
    { q: 'Mount Everest lies on the border of Nepal and which country?', o: ['China', 'India', 'Bhutan', 'Pakistan'], d: 'medium' },
    { q: 'Which country has the most natural lakes?', o: ['Canada', 'Russia', 'USA', 'Finland'], d: 'hard' },
    { q: 'What is the capital of Canada?', o: ['Ottawa', 'Toronto', 'Vancouver', 'Montreal'], d: 'hard' },
    { q: 'Which African country has the largest population?', o: ['Nigeria', 'Egypt', 'Ethiopia', 'South Africa'], d: 'hard' },
    { q: 'Which country is known as the Land of the Rising Sun?', o: ['Japan', 'China', 'Thailand', 'South Korea'], d: 'easy' },
    { q: 'What is the smallest continent by land area?', o: ['Australia', 'Europe', 'Antarctica', 'South America'], d: 'medium' },
    { q: 'What is the imaginary line at 0° longitude called?', o: ['Prime Meridian', 'Equator', 'International Date Line', 'Tropic of Cancer'], d: 'medium' },
    { q: 'Which country contains the greatest number of time zones, including overseas territories?', o: ['France', 'Russia', 'United States', 'China'], d: 'hard' },
    { q: 'Which lake is the deepest freshwater lake in the world?', o: ['Lake Baikal', 'Lake Superior', 'Lake Victoria', 'Lake Tanganyika'], d: 'hard' }
  ],
  sports: [
    { q: 'How many players are on a soccer team on the field?', o: ['11', '9', '10', '12'], d: 'easy' },
    { q: 'In which sport would you perform a slam dunk?', o: ['Basketball', 'Volleyball', 'Tennis', 'Baseball'], d: 'easy' },
    { q: 'How often are the Summer Olympic Games held?', o: ['Every 4 years', 'Every 2 years', 'Every 5 years', 'Every year'], d: 'easy' },
    { q: 'What sport is played at Wimbledon?', o: ['Tennis', 'Golf', 'Cricket', 'Rugby'], d: 'easy' },
    { q: 'How many rings are on the Olympic flag?', o: ['5', '4', '6', '7'], d: 'medium' },
    { q: 'Which country won the first FIFA World Cup in 1930?', o: ['Uruguay', 'Brazil', 'Argentina', 'Italy'], d: 'medium' },
    { q: 'In golf, what is the term for one stroke under par?', o: ['Birdie', 'Eagle', 'Bogey', 'Albatross'], d: 'medium' },
    { q: 'How long is a marathon?', o: ['42.195 km', '40 km', '45 km', '50 km'], d: 'medium' },
    { q: 'Which boxer was known as "The Greatest"?', o: ['Muhammad Ali', 'Mike Tyson', 'Joe Frazier', 'George Foreman'], d: 'hard' },
    { q: 'Which country has won the most FIFA World Cups?', o: ['Brazil', 'Germany', 'Italy', 'Argentina'], d: 'hard' },
    { q: 'How many points is a touchdown worth in American football?', o: ['6', '7', '3', '5'], d: 'hard' },
    { q: 'What is the maximum score in a single frame of ten-pin bowling?', o: ['30', '10', '20', '50'], d: 'hard' },
    { q: 'In tennis, what is a score of 40–40 called?', o: ['Deuce', 'Advantage', 'Love', 'Break point'], d: 'medium' },
    { q: 'Which chess piece can move in an L-shape?', o: ['Knight', 'Bishop', 'Rook', 'Queen'], d: 'hard' },
    { q: 'In baseball, what is a perfect game?', o: ['A game where no opposing batter reaches base', 'A game with no strikeouts', 'A game won by exactly one run', 'A game lasting nine innings'], d: 'hard' }
  ],
  entertainment: [
    { q: 'Who played Iron Man in the Marvel Cinematic Universe?', o: ['Robert Downey Jr.', 'Chris Evans', 'Chris Hemsworth', 'Mark Ruffalo'], d: 'easy' },
    { q: 'Which movie features the song "Let It Go"?', o: ['Frozen', 'Moana', 'Tangled', 'Encanto'], d: 'easy' },
    { q: 'What is the name of Harry Potter\'s owl?', o: ['Hedwig', 'Errol', 'Crookshanks', 'Scabbers'], d: 'easy' },
    { q: 'Who is known as the "King of Pop"?', o: ['Michael Jackson', 'Elvis Presley', 'Prince', 'Justin Timberlake'], d: 'easy' },
    { q: 'Which band released the album "Abbey Road"?', o: ['The Beatles', 'The Rolling Stones', 'Queen', 'Pink Floyd'], d: 'medium' },
    { q: 'In "The Lion King", what is Simba\'s father\'s name?', o: ['Mufasa', 'Scar', 'Rafiki', 'Zazu'], d: 'medium' },
    { q: 'Which TV series features the fictional continent of Westeros?', o: ['Game of Thrones', 'The Witcher', 'Vikings', 'The Mandalorian'], d: 'medium' },
    { q: 'Who directed the movie "Jurassic Park" (1993)?', o: ['Steven Spielberg', 'James Cameron', 'George Lucas', 'Ridley Scott'], d: 'medium' },
    { q: 'Which film won the first ever Academy Award for Best Picture?', o: ['Wings', 'Sunrise', 'Metropolis', 'The Jazz Singer'], d: 'hard' },
    { q: 'What is the highest-grossing film of all time (unadjusted)?', o: ['Avatar', 'Avengers: Endgame', 'Titanic', 'Star Wars: The Force Awakens'], d: 'hard' },
    { q: 'Which artist painted "The Starry Night"?', o: ['Vincent van Gogh', 'Claude Monet', 'Pablo Picasso', 'Salvador Dalí'], d: 'hard' },
    { q: 'Which video game character is a plumber from the Mushroom Kingdom?', o: ['Mario', 'Sonic', 'Link', 'Kirby'], d: 'easy' },
    { q: 'Which film technique uses a sequence of still images to create the illusion of movement?', o: ['Animation', 'Dubbing', 'Montage', 'Foley'], d: 'medium' },
    { q: 'Who composed the orchestral suite The Planets?', o: ['Gustav Holst', 'Claude Debussy', 'Igor Stravinsky', 'Richard Wagner'], d: 'hard' },
    { q: 'Which director is known for the film Rashomon?', o: ['Akira Kurosawa', 'Federico Fellini', 'Ingmar Bergman', 'Alfred Hitchcock'], d: 'hard' }
  ],
  math: [
    { q: 'What is 7 × 8?', o: ['56', '54', '64', '48'], d: 'easy' },
    { q: 'What is the square root of 81?', o: ['9', '8', '7', '11'], d: 'easy' },
    { q: 'How many sides does a hexagon have?', o: ['6', '5', '7', '8'], d: 'easy' },
    { q: 'What is 15% of 200?', o: ['30', '25', '35', '20'], d: 'easy' },
    { q: 'What is the value of π (pi) to two decimal places?', o: ['3.14', '3.41', '3.12', '3.16'], d: 'medium' },
    { q: 'What is the next prime number after 13?', o: ['17', '15', '19', '21'], d: 'medium' },
    { q: 'What is 12² (12 squared)?', o: ['144', '124', '142', '164'], d: 'medium' },
    { q: 'How many degrees are in the interior angles of a triangle?', o: ['180', '360', '90', '270'], d: 'medium' },
    { q: 'What is 2 to the power of 10?', o: ['1024', '512', '2048', '100'], d: 'hard' },
    { q: 'What is the derivative of x²?', o: ['2x', 'x', 'x²', '2'], d: 'hard' },
    { q: 'What is the sum of the first 10 positive integers?', o: ['55', '50', '45', '60'], d: 'hard' },
    { q: 'What is 0.25 expressed as a fraction?', o: ['1/4', '1/2', '1/5', '2/5'], d: 'easy' },
    { q: 'What is the median of 3, 7, 9, 12 and 15?', o: ['9', '7', '12', '10'], d: 'medium' },
    { q: 'What is the value of the integral of 1/x from 1 to e?', o: ['1', 'e', '0', '1/e'], d: 'hard' },
    { q: 'What is the determinant of the 2×2 identity matrix?', o: ['1', '0', '2', '-1'], d: 'hard' }
  ]
};

const ACHIEVEMENTS = [
  { id: 'first_game',  icon: '🎮', name: 'First Quest',     desc: 'Complete your first quiz',       check: s => s.games >= 1 },
  { id: 'perfect',     icon: '💯', name: 'Perfectionist',   desc: 'Score 100% in a quiz',           check: (s, r) => r && r.correct === r.total },
  { id: 'streak5',     icon: '🔥', name: 'On Fire',         desc: 'Get a 5-answer streak',          check: s => s.bestStreak >= 5 },
  { id: 'streak10',    icon: '☄️', name: 'Unstoppable',     desc: 'Get a 10-answer streak',         check: s => s.bestStreak >= 10 },
  { id: 'speedster',   icon: '⚡', name: 'Speedster',       desc: 'Answer correctly in under 3s',   check: (s, r) => r && r.fastAnswer },
  { id: 'hard_win',    icon: '💀', name: 'Hard Mode Hero',  desc: 'Score 70%+ on Hard',             check: (s, r) => r && r.difficulty === 'hard' && r.correct / r.total >= 0.7 },
  { id: 'games10',     icon: '🏅', name: 'Veteran',         desc: 'Play 10 quizzes',                check: s => s.games >= 10 },
  { id: 'correct100',  icon: '🧠', name: 'Big Brain',       desc: 'Answer 100 questions correctly', check: s => s.totalCorrect >= 100 },
  { id: 'explorer',    icon: '🧭', name: 'Explorer',        desc: 'Play every category',            check: s => CATEGORIES.every(c => s.categoriesPlayed.includes(c.id)) },
  { id: 'daily',       icon: '🗓️', name: 'Daily Devotee',   desc: 'Complete a Daily Challenge',     check: (s, r) => r && r.mode === 'daily' },
  { id: 'level5',      icon: '⭐', name: 'Rising Star',     desc: 'Reach level 5',                  check: s => levelFromXP(s.xp).level >= 5 },
  { id: 'score300',    icon: '👑', name: 'Royalty',         desc: 'Score 300+ in one quiz',         check: (s, r) => r && r.score >= 300 }
];

/* ---------------------------------------------------------
   2. STATE & PERSISTENCE
   --------------------------------------------------------- */
const STORAGE_KEY = 'kahootrix_v1';

const defaultState = () => ({
  name: '',
  settings: { sound: true, theme: 'dark' },
  stats: { games: 0, totalCorrect: 0, totalQuestions: 0, bestStreak: 0, highScore: 0, xp: 0, categoriesPlayed: [] },
  achievements: [],
  leaderboard: [],   // { name, score, category, difficulty, date }
  dailyDone: ''      // date string of last completed daily challenge
});

let state = loadState();

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY) || localStorage.getItem('triviaQuest_v1');
    if (!raw) return defaultState();
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return defaultState();
    const fresh = defaultState();
    const stats = { ...fresh.stats, ...(parsed.stats || {}) };
    stats.games = Math.max(0, Number(stats.games) || 0);
    stats.totalCorrect = Math.max(0, Number(stats.totalCorrect) || 0);
    stats.totalQuestions = Math.max(0, Number(stats.totalQuestions) || 0);
    stats.bestStreak = Math.max(0, Number(stats.bestStreak) || 0);
    stats.highScore = Math.max(0, Number(stats.highScore) || 0);
    stats.xp = Math.max(0, Number(stats.xp) || 0);
    stats.categoriesPlayed = Array.isArray(stats.categoriesPlayed)
      ? stats.categoriesPlayed.filter(id => CATEGORIES.some(c => c.id === id))
      : [];
    const leaderboard = Array.isArray(parsed.leaderboard) ? parsed.leaderboard.filter(isValidScore) : [];
    return {
      ...fresh,
      ...parsed,
      name: typeof parsed.name === 'string' ? parsed.name.trim().slice(0, 16) : '',
      settings: {
        sound: parsed.settings?.sound !== false,
        theme: parsed.settings?.theme === 'light' ? 'light' : 'dark'
      },
      stats,
      achievements: Array.isArray(parsed.achievements) ? parsed.achievements.filter(id => ACHIEVEMENTS.some(a => a.id === id)) : [],
      leaderboard: leaderboard.sort((a, b) => Number(b.score) - Number(a.score)).slice(0, 50),
      dailyDone: typeof parsed.dailyDone === 'string' ? parsed.dailyDone : ''
    };
  } catch { return defaultState(); }
}
function isValidScore(score) {
  return score && typeof score === 'object' && typeof score.name === 'string' && Number.isFinite(Number(score.score))
    && DIFFICULTIES[score.difficulty] && (CATEGORIES.some(c => c.id === score.category) || ['daily', 'random'].includes(score.mode));
}
function saveState() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch { toast('Progress could not be saved in this browser.'); }
}

/* Level progression: 100 XP per level, increasing by 50 each level */
function levelFromXP(xp) {
  let level = 1, need = 100, remaining = xp;
  while (remaining >= need) { remaining -= need; level++; need += 50; }
  return { level, current: remaining, need };
}

/* ---------------------------------------------------------
   3. QUIZ RUNTIME STATE
   --------------------------------------------------------- */
const quiz = {
  active: false, paused: false, mode: 'standard', // standard | daily | random
  category: 'general', difficulty: 'easy',
  questions: [], index: 0, score: 0, correct: 0, streak: 0, bestStreak: 0,
  timeLeft: 0, timerId: null, questionStart: 0, totalTime: 0, startTime: 0,
  hintUsed: false, fiftyUsed: false, answered: false, fastAnswer: false,
  review: [], nextTimeout: null
};
let setup = { category: 'general', difficulty: 'easy' };

/* ---------------------------------------------------------
   4. DOM HELPERS
   --------------------------------------------------------- */
const $ = id => document.getElementById(id);
const shuffle = arr => { const a = [...arr]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };

let toastTimer;
function toast(msg) {
  const t = $('toast'); t.textContent = msg; t.classList.add('show');
  clearTimeout(toastTimer); toastTimer = setTimeout(() => t.classList.remove('show'), 2600);
}

/* ---------------------------------------------------------
   5. SOUND (Web Audio API — no external files)
   --------------------------------------------------------- */
let audioCtx;
function playTone(freqs, type = 'sine', dur = 0.15, gap = 0.08) {
  if (!state.settings.sound) return;
  try {
    audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
    freqs.forEach((f, i) => {
      const osc = audioCtx.createOscillator(), g = audioCtx.createGain();
      osc.type = type; osc.frequency.value = f;
      const t = audioCtx.currentTime + i * gap;
      g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.2, t + 0.01);
      g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      osc.connect(g).connect(audioCtx.destination); osc.start(t); osc.stop(t + dur + 0.02);
    });
  } catch { /* audio not supported */ }
}
const SFX = {
  correct: () => playTone([523, 659, 784], 'triangle', 0.18, 0.09),
  wrong:   () => playTone([220, 180], 'sawtooth', 0.25, 0.12),
  click:   () => playTone([880], 'sine', 0.06),
  tick:    () => playTone([1200], 'square', 0.04),
  start:   () => playTone([440, 554, 659, 880], 'triangle', 0.2, 0.1),
  win:     () => playTone([523, 659, 784, 1047, 1319], 'triangle', 0.3, 0.12),
  timeout: () => playTone([300, 200, 150], 'sawtooth', 0.3, 0.15)
};

/* ---------------------------------------------------------
   6. NAVIGATION
   --------------------------------------------------------- */
let pendingNav = null;
let countdownTimer = null;
let countdownToken = 0;

function cancelCountdown() {
  countdownToken++;
  clearTimeout(countdownTimer);
  countdownTimer = null;
}

function showScreen(id) {
  const screen = $('screen-' + id);
  if (!screen) return;
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  screen.classList.add('active');
  document.querySelectorAll('.nav-link').forEach(l => l.classList.toggle('active', l.dataset.nav === id));
  $('nav').classList.remove('open');
  window.scrollTo({ top: 0, behavior: 'smooth' });
  if (id === 'home') renderHome();
  if (id === 'leaderboard') renderLeaderboard();
  if (id === 'profile') renderProfile();
  if (id === 'setup') renderSetup();
}
function navigate(id) {
  if (!quiz.active && $('screen-countdown').classList.contains('active')) {
    cancelCountdown();
    showScreen(id);
    return;
  }
  if (quiz.active && id !== 'quiz') {
    pendingNav = id; pauseQuiz(true); $('confirmModal').classList.add('show'); return;
  }
  showScreen(id);
}
document.querySelectorAll('[data-nav]').forEach(el => el.addEventListener('click', e => { e.preventDefault(); SFX.click(); navigate(el.dataset.nav); }));
$('menuBtn').addEventListener('click', () => $('nav').classList.toggle('open'));
$('confirmStay').addEventListener('click', () => { $('confirmModal').classList.remove('show'); pendingNav = null; if (quiz.active) resumeQuiz(); });
$('confirmLeave').addEventListener('click', () => { $('confirmModal').classList.remove('show'); endQuizEarly(); showScreen(pendingNav || 'home'); pendingNav = null; });
window.addEventListener('beforeunload', e => { if (quiz.active) { e.preventDefault(); e.returnValue = ''; } });

/* ---------------------------------------------------------
   7. SETTINGS: theme, sound, name
   --------------------------------------------------------- */
function applySettings() {
  document.documentElement.dataset.theme = state.settings.theme;
  $('themeToggle').textContent = state.settings.theme === 'dark' ? '🌙' : '☀️';
  $('soundToggle').textContent = state.settings.sound ? '🔊' : '🔇';
}
$('themeToggle').addEventListener('click', () => { state.settings.theme = state.settings.theme === 'dark' ? 'light' : 'dark'; saveState(); applySettings(); SFX.click(); });
$('soundToggle').addEventListener('click', () => { state.settings.sound = !state.settings.sound; saveState(); applySettings(); SFX.click(); toast(state.settings.sound ? '🔊 Sound on' : '🔇 Sound off'); });

function openNameModal() { $('nameInput').value = state.name; $('nameModal').classList.add('show'); setTimeout(() => $('nameInput').focus(), 50); }
function saveName() {
  const v = $('nameInput').value.trim().slice(0, 16);
  state.name = v || 'Player'; saveState();
  $('nameModal').classList.remove('show'); renderPlayerChip(); toast(`Welcome, ${state.name}! 🎉`);
}
$('saveNameBtn').addEventListener('click', saveName);
$('nameInput').addEventListener('keydown', e => { if (e.key === 'Enter') saveName(); });
$('playerChip').addEventListener('click', openNameModal);
$('playerChip').addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') openNameModal(); });
$('changeNameBtn').addEventListener('click', openNameModal);

function renderPlayerChip() {
  const initial = (state.name || '?').charAt(0).toUpperCase();
  $('playerAvatar').textContent = initial;
  $('playerNameDisplay').textContent = state.name || 'Player';
  $('playerLevel').textContent = levelFromXP(state.stats.xp).level;
}

/* ---------------------------------------------------------
   8. RENDER: HOME, SETUP, LEADERBOARD, PROFILE
   --------------------------------------------------------- */
function categoryCard(cat, selectable) {
  const count = QUESTIONS[cat.id].length;
  return `<button class="cat-card ${selectable && setup.category === cat.id ? 'active' : ''}" data-cat="${cat.id}" style="--c1:${cat.c1};--c2:${cat.c2}">
    <div class="cat-icon">${cat.icon}</div>
    <h3>${cat.name}</h3><p>${cat.desc}</p>
    <div class="cat-meta">${count} questions • Easy / Medium / Hard</div></button>`;
}
function renderHome() {
  $('homeCategories').innerHTML = CATEGORIES.map(c => categoryCard(c, false)).join('');
  $('homeCategories').querySelectorAll('.cat-card').forEach(b => b.addEventListener('click', () => { setup.category = b.dataset.cat; SFX.click(); showScreen('setup'); }));
  $('statQuestions').textContent = Object.values(QUESTIONS).reduce((n, a) => n + a.length, 0);
  $('statBest').textContent = state.stats.highScore;
  renderLbList($('homeLeaderboard'), state.leaderboard.slice(0, 5));
  const today = todayKey();
  $('dailyText').textContent = state.dailyDone === today
    ? '✅ You have completed today\'s challenge. Come back tomorrow for a new one!'
    : '10 mixed questions, the same for everyone today. One attempt per day!';
  $('dailyBtn2').disabled = state.dailyDone === today;
  $('dailyBtn2').textContent = state.dailyDone === today ? 'Completed Today' : "Start Today's Challenge";
}
function renderSetup() {
  $('setupCategories').innerHTML = CATEGORIES.map(c => categoryCard(c, true)).join('');
  $('setupCategories').querySelectorAll('.cat-card').forEach(b => b.addEventListener('click', () => {
    setup.category = b.dataset.cat; SFX.click();
    $('setupCategories').querySelectorAll('.cat-card').forEach(x => x.classList.toggle('active', x.dataset.cat === setup.category));
    updateSetupSummary();
  }));
  document.querySelectorAll('.diff-btn').forEach(b => b.classList.toggle('active', b.dataset.diff === setup.difficulty));
  updateSetupSummary();
}
function updateSetupSummary() {
  const cat = CATEGORIES.find(c => c.id === setup.category);
  $('setupSummary').textContent = `${cat.name} • ${DIFFICULTIES[setup.difficulty].label}`;
}
document.querySelectorAll('.diff-btn').forEach(b => b.addEventListener('click', () => {
  setup.difficulty = b.dataset.diff; SFX.click();
  document.querySelectorAll('.diff-btn').forEach(x => x.classList.toggle('active', x === b));
  updateSetupSummary();
}));
$('startQuizBtn').addEventListener('click', () => startQuiz('standard', setup.category, setup.difficulty));

function renderLbList(el, items) {
  if (!items.length) {
    el.innerHTML = `<li class="lb-empty"><strong>No scores yet!</strong>Be the first to play a quiz and claim the top spot. 🏆</li>`; return;
  }
  const medals = ['🥇', '🥈', '🥉'];
  el.innerHTML = items.map((s, i) => {
    const cat = CATEGORIES.find(c => c.id === s.category);
    const label = s.mode === 'daily' ? 'Daily Challenge' : s.mode === 'random' ? 'Random Mode' : (cat ? cat.name : 'Quiz');
    const difficulty = DIFFICULTIES[s.difficulty] ? DIFFICULTIES[s.difficulty].label : 'Mixed';
    return `<li class="lb-item ${s.name === state.name ? 'me' : ''}" style="animation-delay:${i * 0.05}s">
      <span class="lb-rank ${i === 0 ? 'gold' : ''}">${i < 3 ? medals[i] : '#' + (i + 1)}</span>
      <span class="lb-name">${escapeHtml(s.name)}<small>${label} • ${difficulty} • ${escapeHtml(s.date || '')}</small></span>
      <span class="lb-score">${s.score}</span></li>`;
  }).join('');
}
function escapeHtml(str) { return String(str).replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m])); }

function renderLeaderboard() {
  const filter = $('lbFilter');
  if (filter.options.length === 1) {
    CATEGORIES.forEach(c => filter.insertAdjacentHTML('beforeend', `<option value="${c.id}">${c.name}</option>`));
    filter.insertAdjacentHTML('beforeend', `<option value="daily">Daily Challenge</option><option value="random">Random Mode</option>`);
  }
  const f = filter.value;
  const items = state.leaderboard.filter(s => f === 'all' || s.category === f || s.mode === f).slice(0, 20);
  renderLbList($('fullLeaderboard'), items);
}
$('lbFilter').addEventListener('change', renderLeaderboard);
$('clearLbBtn').addEventListener('click', () => {
  if (!state.leaderboard.length) return toast('Leaderboard is already empty.');
  if (confirm('Clear all local leaderboard scores?')) { state.leaderboard = []; saveState(); renderLeaderboard(); toast('Leaderboard cleared.'); }
});

function renderProfile() {
  const lv = levelFromXP(state.stats.xp);
  $('profileAvatar').textContent = (state.name || '?').charAt(0).toUpperCase();
  $('profileName').textContent = state.name || 'Player';
  $('pLevel').textContent = lv.level; $('pXPText').textContent = `${lv.current} / ${lv.need} XP`;
  requestAnimationFrame(() => $('pXPFill').style.width = (lv.current / lv.need * 100) + '%');
  $('pGames').textContent = state.stats.games; $('pBest').textContent = state.stats.highScore;
  $('pCorrect').textContent = state.stats.totalCorrect; $('pStreak').textContent = state.stats.bestStreak;
  $('achCount').textContent = `${state.achievements.length} / ${ACHIEVEMENTS.length}`;
  $('achievementsGrid').innerHTML = ACHIEVEMENTS.map(a => `<div class="ach ${state.achievements.includes(a.id) ? 'unlocked' : 'locked'}" title="${a.desc}">
    <span class="ach-icon">${a.icon}</span><strong>${a.name}</strong><small>${a.desc}</small></div>`).join('');
}
$('resetProgressBtn').addEventListener('click', () => {
  if (confirm('Reset ALL progress, scores and achievements? This cannot be undone.')) {
    const name = state.name, settings = state.settings;
    state = defaultState(); state.name = name; state.settings = settings; saveState();
    renderProfile(); renderPlayerChip(); toast('Progress reset.');
  }
});

/* ---------------------------------------------------------
   9. QUESTION SELECTION
   --------------------------------------------------------- */
function todayKey() { return new Date().toISOString().slice(0, 10); }
/* Deterministic PRNG so the Daily Challenge is identical for the whole day */
function seededRandom(seed) { let s = seed; return () => { s = (s * 9301 + 49297) % 233280; return s / 233280; }; }

function pickQuestions(categoryId, difficulty) {
  const pool = QUESTIONS[categoryId].map(q => ({ ...q, category: categoryId }));
  const fallbackOrder = {
    easy: ['medium', 'hard'],
    medium: ['easy', 'hard'],
    hard: ['medium', 'easy']
  };
  return [difficulty, ...fallbackOrder[difficulty]]
    .flatMap(level => shuffle(pool.filter(q => q.d === level)))
    .slice(0, QUESTIONS_PER_QUIZ);
}
function pickRandomQuestions() {
  const all = CATEGORIES.flatMap(c => QUESTIONS[c.id].map(q => ({ ...q, category: c.id })));
  return shuffle(all).slice(0, QUESTIONS_PER_QUIZ);
}
function pickDailyQuestions() {
  const seed = parseInt(todayKey().replace(/-/g, ''), 10);
  const rnd = seededRandom(seed);
  const all = CATEGORIES.flatMap(c => QUESTIONS[c.id].map(q => ({ ...q, category: c.id })));
  const arr = [...all];
  for (let i = arr.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [arr[i], arr[j]] = [arr[j], arr[i]]; }
  return arr.slice(0, QUESTIONS_PER_QUIZ);
}

/* ---------------------------------------------------------
   10. QUIZ ENGINE
   --------------------------------------------------------- */
function startQuiz(mode, categoryId, difficulty) {
  clearInterval(quiz.timerId); clearTimeout(quiz.nextTimeout);
  cancelCountdown();
  SFX.start();
  quiz.mode = mode; quiz.category = categoryId; quiz.difficulty = difficulty;
  quiz.questions = (mode === 'daily' ? pickDailyQuestions() : mode === 'random' ? pickRandomQuestions() : pickQuestions(categoryId, difficulty))
    .map(q => ({ ...q, answers: shuffle(q.o), correct: q.o[0] })); // randomize answer positions
  Object.assign(quiz, { index: 0, score: 0, correct: 0, streak: 0, bestStreak: 0, totalTime: 0, hintUsed: false, fiftyUsed: false, review: [], fastAnswer: false, paused: false });
  $('hintBtn').disabled = false; $('fiftyBtn').disabled = false;
  $('quizScore').textContent = '0'; $('quizStreak').textContent = '🔥 0';
  const label = mode === 'daily' ? 'Daily Challenge' : mode === 'random' ? 'Random Mode' : CATEGORIES.find(c => c.id === categoryId).name;
  $('quizCategoryTag').textContent = label;
  $('quizDiffTag').textContent = DIFFICULTIES[difficulty].label; $('quizDiffTag').className = 'tag diff ' + difficulty;
  runCountdown(() => { quiz.active = true; quiz.startTime = Date.now(); showScreen('quiz'); loadQuestion(); });
}

function runCountdown(cb) {
  cancelCountdown();
  const token = countdownToken;
  showScreen('countdown');
  const el = $('countdownNumber'), steps = ['3', '2', '1', 'GO!'];
  let i = 0;
  const tick = () => {
    if (token !== countdownToken) return;
    el.textContent = steps[i]; el.style.animation = 'none'; void el.offsetWidth; el.style.animation = '';
    $('countdownLabel').textContent = i < 3 ? 'Get ready…' : 'Good luck!';
    SFX.tick(); i++;
    if (i < steps.length) countdownTimer = setTimeout(tick, 900);
    else countdownTimer = setTimeout(() => {
      if (token !== countdownToken) return;
      countdownTimer = null;
      cb();
    }, 700);
  };
  tick();
}

function loadQuestion() {
  const q = quiz.questions[quiz.index], total = quiz.questions.length, diff = DIFFICULTIES[quiz.difficulty];
  quiz.answered = false;
  $('questionCounter').textContent = `Question ${quiz.index + 1} of ${total}`;
  $('progressFill').style.width = ((quiz.index + 1) / total * 100) + '%';
  const card = $('questionCard'); card.style.animation = 'none'; void card.offsetWidth; card.style.animation = '';
  $('questionText').textContent = q.q;
  $('feedback').textContent = ''; $('feedback').className = 'feedback';
  $('answers').innerHTML = q.answers.map((a, i) => `<button class="answer-btn" data-answer="${escapeHtml(a)}" style="animation-delay:${i * 0.07}s"><span class="key">${'ABCD'[i]}</span><span>${escapeHtml(a)}</span></button>`).join('');
  $('answers').querySelectorAll('.answer-btn').forEach(b => b.addEventListener('click', () => selectAnswer(b)));
  // timer
  quiz.timeLeft = diff.time; quiz.questionStart = Date.now();
  updateTimerUI();
  clearInterval(quiz.timerId);
  quiz.timerId = setInterval(() => {
    if (quiz.paused) return;
    quiz.timeLeft--; updateTimerUI();
    if (quiz.timeLeft <= 5 && quiz.timeLeft > 0) SFX.tick();
    if (quiz.timeLeft <= 0) { clearInterval(quiz.timerId); timeOut(); }
  }, 1000);
}
function updateTimerUI() {
  const total = DIFFICULTIES[quiz.difficulty].time, circ = 106.8;
  $('timerText').textContent = quiz.timeLeft;
  $('timerCircle').style.strokeDashoffset = circ * (1 - quiz.timeLeft / total);
  $('timerWrap').classList.toggle('warn', quiz.timeLeft <= 5);
}

function selectAnswer(btn) {
  if (quiz.answered || quiz.paused) return;
  quiz.answered = true; clearInterval(quiz.timerId);
  const q = quiz.questions[quiz.index], chosen = btn.dataset.answer, isCorrect = chosen === q.correct;
  const elapsed = (Date.now() - quiz.questionStart) / 1000; quiz.totalTime += elapsed;
  const diff = DIFFICULTIES[quiz.difficulty];
  let earned = 0;
  document.querySelectorAll('.answer-btn').forEach(b => {
    b.disabled = true;
    if (b.dataset.answer === q.correct) b.classList.add('correct');
    else if (b === btn) b.classList.add('wrong'); else b.classList.add('dim');
  });
  if (isCorrect) {
    quiz.correct++; quiz.streak++; quiz.bestStreak = Math.max(quiz.bestStreak, quiz.streak);
    const bonus = Math.round((quiz.timeLeft / diff.time) * diff.points * 0.5); // time bonus up to 50% of base
    const streakBonus = quiz.streak >= 3 ? 5 : 0;
    earned = diff.points + bonus + streakBonus; quiz.score += earned;
    if (elapsed < 3) quiz.fastAnswer = true;
    $('feedback').textContent = `✅ Correct! +${diff.points} pts${bonus ? ` +${bonus} time bonus` : ''}${streakBonus ? ` +${streakBonus} streak` : ''}`;
    $('feedback').className = 'feedback good'; SFX.correct();
    const pop = document.createElement('div'); pop.className = 'points-pop'; pop.textContent = `+${earned}`; $('questionCard').appendChild(pop); setTimeout(() => pop.remove(), 1000);
  } else {
    quiz.streak = 0;
    $('feedback').textContent = `❌ Wrong! The correct answer is "${q.correct}".`;
    $('feedback').className = 'feedback bad'; SFX.wrong();
    $('questionCard').classList.add('shake'); setTimeout(() => $('questionCard').classList.remove('shake'), 400);
  }
  $('quizScore').textContent = quiz.score; $('quizStreak').textContent = `🔥 ${quiz.streak}`;
  $('quizScore').classList.add('bump'); setTimeout(() => $('quizScore').classList.remove('bump'), 400);
  quiz.review.push({ q: q.q, chosen, correct: q.correct, isCorrect, time: elapsed.toFixed(1) });
  quiz.nextTimeout = setTimeout(nextQuestion, 1800);
}
function timeOut() {
  if (quiz.answered) return;
  quiz.answered = true; quiz.streak = 0; quiz.totalTime += DIFFICULTIES[quiz.difficulty].time;
  const q = quiz.questions[quiz.index];
  document.querySelectorAll('.answer-btn').forEach(b => { b.disabled = true; if (b.dataset.answer === q.correct) b.classList.add('correct'); else b.classList.add('dim'); });
  $('feedback').textContent = `⏰ Time's up! The answer was "${q.correct}".`; $('feedback').className = 'feedback bad';
  $('quizStreak').textContent = '🔥 0'; SFX.timeout();
  quiz.review.push({ q: q.q, chosen: null, correct: q.correct, isCorrect: false, time: '—' });
  quiz.nextTimeout = setTimeout(nextQuestion, 1800);
}
function nextQuestion() {
  quiz.index++;
  if (quiz.index >= quiz.questions.length) finishQuiz(); else loadQuestion();
}

/* Lifelines */
function removeWrong(n) {
  const q = quiz.questions[quiz.index];
  const wrong = shuffle([...document.querySelectorAll('.answer-btn')].filter(b => b.dataset.answer !== q.correct && !b.classList.contains('faded')));
  wrong.slice(0, n).forEach(b => { b.classList.add('faded'); b.disabled = true; });
}
$('hintBtn').addEventListener('click', () => {
  if (quiz.hintUsed || quiz.answered || quiz.paused) return;
  quiz.hintUsed = true; $('hintBtn').disabled = true; removeWrong(1); SFX.click(); toast('💡 One wrong answer removed!');
});
$('fiftyBtn').addEventListener('click', () => {
  if (quiz.fiftyUsed || quiz.answered || quiz.paused) return;
  quiz.fiftyUsed = true; $('fiftyBtn').disabled = true; removeWrong(2); SFX.click(); toast('➗ 50:50 used — two answers removed!');
});

/* Pause / Resume / Quit */
function pauseQuiz(silent) {
  if (!quiz.active || quiz.paused) return;
  quiz.paused = true; quiz.pausedAt = Date.now();
  if (quiz.answered && quiz.nextTimeout) { clearTimeout(quiz.nextTimeout); }
  if (!silent) $('pauseOverlay').classList.add('show');
}
function resumeQuiz() {
  if (!quiz.paused) return;
  quiz.paused = false; $('pauseOverlay').classList.remove('show');
  quiz.questionStart += Date.now() - quiz.pausedAt; // exclude pause time from answer time
  if (quiz.answered) quiz.nextTimeout = setTimeout(nextQuestion, 800);
}
$('pauseBtn').addEventListener('click', () => { SFX.click(); pauseQuiz(false); });
$('resumeBtn').addEventListener('click', () => { SFX.click(); resumeQuiz(); });
$('pauseQuitBtn').addEventListener('click', () => { $('pauseOverlay').classList.remove('show'); pendingNav = 'home'; $('confirmModal').classList.add('show'); });
$('quitBtn').addEventListener('click', () => navigate('home'));
function endQuizEarly() { clearInterval(quiz.timerId); clearTimeout(quiz.nextTimeout); quiz.active = false; quiz.paused = false; $('pauseOverlay').classList.remove('show'); }

/* Keyboard shortcuts: A-D / 1-4 to answer, P to pause */
document.addEventListener('keydown', e => {
  if (!quiz.active || !$('screen-quiz').classList.contains('active')) return;
  const k = e.key.toLowerCase();
  const idx = 'abcd'.indexOf(k) !== -1 ? 'abcd'.indexOf(k) : '1234'.indexOf(k);
  if (idx !== -1 && !quiz.paused) { const b = document.querySelectorAll('.answer-btn')[idx]; if (b && !b.disabled) b.click(); }
  if (k === 'p') quiz.paused ? resumeQuiz() : pauseQuiz(false);
});

/* ---------------------------------------------------------
   11. FINISH, SCORING, RESULTS
   --------------------------------------------------------- */
function finishQuiz() {
  clearInterval(quiz.timerId); clearTimeout(quiz.nextTimeout); quiz.active = false; quiz.paused = false;
  const total = quiz.questions.length, wrong = total - quiz.correct;
  const accuracy = Math.round(quiz.correct / total * 100);
  const timeSpent = Math.round(quiz.totalTime);
  const xpEarned = Math.round(quiz.score * 0.5 * DIFFICULTIES[quiz.difficulty].xp) + quiz.correct * 2;
  const isHigh = quiz.score > state.stats.highScore && quiz.score > 0;

  // Update persistent stats
  const s = state.stats;
  s.games++; s.totalCorrect += quiz.correct; s.totalQuestions += total;
  s.bestStreak = Math.max(s.bestStreak, quiz.bestStreak); s.highScore = Math.max(s.highScore, quiz.score);
  const prevLevel = levelFromXP(s.xp).level; s.xp += xpEarned;
  if (quiz.mode === 'standard' && !s.categoriesPlayed.includes(quiz.category)) s.categoriesPlayed.push(quiz.category);
  if (quiz.mode === 'daily') state.dailyDone = todayKey();

  // Leaderboard entry
  if (quiz.score > 0) {
    state.leaderboard.push({ name: state.name || 'Player', score: quiz.score, category: quiz.category, mode: quiz.mode, difficulty: quiz.difficulty, date: new Date().toLocaleDateString() });
    state.leaderboard.sort((a, b) => b.score - a.score); state.leaderboard = state.leaderboard.slice(0, 50);
  }

  // Achievements
  const result = { correct: quiz.correct, total, difficulty: quiz.difficulty, score: quiz.score, mode: quiz.mode, fastAnswer: quiz.fastAnswer };
  const newly = ACHIEVEMENTS.filter(a => !state.achievements.includes(a.id) && a.check(s, result));
  newly.forEach(a => state.achievements.push(a.id));
  saveState(); renderPlayerChip();

  // Render results
  const rating = accuracy === 100 ? '⭐⭐⭐⭐⭐' : accuracy >= 80 ? '⭐⭐⭐⭐' : accuracy >= 60 ? '⭐⭐⭐' : accuracy >= 40 ? '⭐⭐' : '⭐';
  const name = state.name || 'Player';
  const message = accuracy === 100 ? `Flawless, ${name}! You're a true Trivia Master. 🧠👑`
    : accuracy >= 80 ? `Outstanding, ${name}! Your knowledge is seriously impressive. 🚀`
    : accuracy >= 60 ? `Great job, ${name}! A little more practice and you'll be unbeatable. 💪`
    : accuracy >= 40 ? `Nice effort, ${name}! Every quiz makes you sharper. Keep going! 🌱`
    : `Tough round, ${name} — but champions are made by trying again. You've got this! 🔥`;
  $('resultsLabel').textContent = quiz.mode === 'daily' ? 'Daily Challenge Complete!' : quiz.mode === 'random' ? 'Random Mode Complete!' : 'Quiz Complete!';
  animateNumber($('finalScore'), quiz.score);
  $('rating').textContent = rating; $('resultsMessage').textContent = message;
  $('newHigh').hidden = !isHigh;
  $('rCorrect').textContent = quiz.correct; $('rWrong').textContent = wrong; $('rAccuracy').textContent = accuracy + '%';
  $('rTime').textContent = timeSpent >= 60 ? `${Math.floor(timeSpent / 60)}m ${timeSpent % 60}s` : `${timeSpent}s`;
  $('rStreak').textContent = quiz.bestStreak; $('rXP').textContent = '+' + xpEarned;
  const lv = levelFromXP(s.xp);
  $('rLevel').textContent = lv.level; $('rXPText').textContent = `${lv.current} / ${lv.need} XP`;
  $('rXPFill').style.width = '0'; setTimeout(() => $('rXPFill').style.width = (lv.current / lv.need * 100) + '%', 300);
  $('newAchievements').innerHTML = newly.map(a => `<span class="ach-pill">${a.icon} Unlocked: ${a.name}</span>`).join('')
    + (lv.level > prevLevel ? `<span class="ach-pill">⬆️ Level Up! You reached Level ${lv.level}</span>` : '');
  showScreen('results');

  // Celebrations
  if (isHigh || accuracy >= 80) { SFX.win(); launchConfetti(isHigh ? 260 : 140); }
  else if (quiz.correct > 0) launchConfetti(60);
}
function animateNumber(el, target) {
  const start = performance.now(), dur = 1200;
  const step = now => { const p = Math.min((now - start) / dur, 1); el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3))); if (p < 1) requestAnimationFrame(step); };
  requestAnimationFrame(step);
}

/* Results actions */
$('playAgainBtn').addEventListener('click', () => {
  if (quiz.mode === 'daily') { toast('Daily Challenge is once per day — try another mode!'); showScreen('setup'); return; }
  startQuiz(quiz.mode, quiz.category, quiz.difficulty);
});
$('reviewBtn').addEventListener('click', () => {
  $('reviewList').innerHTML = quiz.review.map((r, i) => `<div class="glass review-item ${r.isCorrect ? '' : 'wrong'}" style="animation-delay:${i * 0.05}s">
    <h4>${i + 1}. ${escapeHtml(r.q)}</h4>
    ${r.chosen === null ? `<p class="skipped">⏰ No answer (time ran out)</p>` : `<p class="${r.isCorrect ? 'ok' : 'no'}">${r.isCorrect ? '✅' : '❌'} Your answer: ${escapeHtml(r.chosen)}</p>`}
    ${!r.isCorrect ? `<p class="ok">✔ Correct answer: ${escapeHtml(r.correct)}</p>` : ''}
    <p style="color:var(--muted)">⏱ ${r.time}${r.time !== '—' ? 's' : ''}</p></div>`).join('');
  showScreen('review');
});
$('reviewBackBtn').addEventListener('click', () => showScreen('results'));

/* Daily & Random modes */
function startDaily() {
  if (state.dailyDone === todayKey()) return toast('✅ You already completed today\'s challenge. Come back tomorrow!');
  startQuiz('daily', 'mixed', 'medium');
}
$('dailyBtn').addEventListener('click', startDaily);
$('dailyBtn2').addEventListener('click', startDaily);
$('randomBtn').addEventListener('click', () => { const d = ['easy', 'medium', 'hard'][Math.floor(Math.random() * 3)]; startQuiz('random', 'mixed', d); });

/* ---------------------------------------------------------
   12. CONFETTI & PARTICLES
   --------------------------------------------------------- */
const canvas = $('confetti'), ctx = canvas.getContext('2d');
let confetti = [], confettiRunning = false;
function resizeCanvas() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
window.addEventListener('resize', resizeCanvas); resizeCanvas();
function launchConfetti(count) {
  const colors = ['#8b5cf6', '#3b82f6', '#22d3ee', '#ec4899', '#facc15', '#22c55e'];
  for (let i = 0; i < count; i++) confetti.push({
    x: Math.random() * canvas.width, y: -20 - Math.random() * canvas.height * 0.5,
    w: 6 + Math.random() * 6, h: 8 + Math.random() * 8, color: colors[i % colors.length],
    vy: 2 + Math.random() * 3, vx: -1.5 + Math.random() * 3, rot: Math.random() * 360, vr: -5 + Math.random() * 10
  });
  if (!confettiRunning) { confettiRunning = true; requestAnimationFrame(drawConfetti); }
}
function drawConfetti() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  confetti.forEach(p => {
    p.y += p.vy; p.x += p.vx + Math.sin(p.y / 30); p.rot += p.vr;
    ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot * Math.PI / 180); ctx.fillStyle = p.color; ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h); ctx.restore();
  });
  confetti = confetti.filter(p => p.y < canvas.height + 30);
  if (confetti.length) requestAnimationFrame(drawConfetti); else { confettiRunning = false; ctx.clearRect(0, 0, canvas.width, canvas.height); }
}
/* Floating background particles */
(function spawnParticles() {
  const wrap = $('particles');
  for (let i = 0; i < 22; i++) {
    const s = document.createElement('span');
    const size = 3 + Math.random() * 5;
    s.style.cssText = `left:${Math.random() * 100}%;width:${size}px;height:${size}px;animation-duration:${12 + Math.random() * 16}s;animation-delay:-${Math.random() * 20}s;background:${['#22d3ee', '#8b5cf6', '#3b82f6'][i % 3]}`;
    wrap.appendChild(s);
  }
})();

/* ---------------------------------------------------------
   13. INIT
   --------------------------------------------------------- */
(function init() {
  applySettings(); renderPlayerChip(); renderHome();
  if (!state.name) openNameModal();
})();
