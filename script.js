<<<<<<< HEAD
=======
// ---------- Contador de uso (Firebase) ----------
// Os valores abaixo (apiKey, authDomain, etc.) NÃO são senhas nem segredos — é o
// "endereço público" do seu projeto Firebase, seguro para ficar no código do navegador.
// A proteção de verdade vem das Regras de Segurança do Firestore (veja o guia que te enviei),
// que só permitem incrementar o campo "opens" em +1 por vez, e bloqueiam qualquer outra
// leitura/escrita. Troque os valores abaixo pelos do SEU projeto Firebase.
const FIREBASE_CONFIG = {
  apiKey: "AIzaSyB62XIW-_iWeXXWhllZWqhitslTOMc52r4",
  authDomain: "contador-9cb70.firebaseapp.com",
  projectId: "contador-9cb70",
  storageBucket: "contador-9cb70.firebasestorage.app",
  messagingSenderId: "294466613653",
  appId: "1:294466613653:web:b6ad8e8601b6e3d8e2069c",
};
const USAGE_DOC_PATH = { collection: "stats", doc: "usage" };
const USAGE_COUNTED_KEY = "meutreino_open_counted_v1";

function usageCounterConfigured() {
  return (
    FIREBASE_CONFIG.apiKey &&
    FIREBASE_CONFIG.apiKey.indexOf("SUA_API_KEY") === -1
  );
}

let usageDb = null;
function initUsageCounter() {
  if (!usageCounterConfigured()) return; // ainda não configurado — não faz nada, app funciona normal
  try {
    if (!firebase.apps.length) firebase.initializeApp(FIREBASE_CONFIG);
    usageDb = firebase.firestore();
  } catch (e) {
    console.warn(
      "Firebase indisponível, contador de uso desativado nesta sessão",
      e,
    );
    return;
  }
  loadUsageCount();
  trackOpenIfNeeded();
}
async function loadUsageCount() {
  if (!usageDb) return;
  try {
    const snap = await usageDb
      .collection(USAGE_DOC_PATH.collection)
      .doc(USAGE_DOC_PATH.doc)
      .get();
    const wrap = document.getElementById("usage-count-wrap");
    const text = document.getElementById("usage-count-text");
    if (snap.exists && wrap && text) {
      const n = snap.data().opens || 0;
      text.textContent =
        n.toLocaleString("pt-BR") +
        (n === 1 ? " pessoa usando" : " pessoas usando");
      wrap.style.display = "flex";
    }
  } catch (e) {
    console.warn("Não foi possível carregar o contador de uso", e);
  }
}
async function trackOpenIfNeeded() {
  if (!usageDb) return;
  try {
    // Conta no máximo 1 vez por aparelho/navegador — evita inflar o número sozinho
    if (localStorage.getItem(USAGE_COUNTED_KEY)) return;
    await usageDb
      .collection(USAGE_DOC_PATH.collection)
      .doc(USAGE_DOC_PATH.doc)
      .update({
        opens: firebase.firestore.FieldValue.increment(1),
      });
    localStorage.setItem(USAGE_COUNTED_KEY, "1");
    loadUsageCount();
  } catch (e) {
    // Falha silenciosa: sem internet, doc ainda não criado, ou regra bloqueou — o app continua normal
    console.warn("Não foi possível registrar abertura", e);
  }
}

>>>>>>> 4aebd99 (mudança)
// ---------- Data ----------
const DEFAULT_WORKOUTS = {
  A: [
    {
      id: "a1",
      name: "Agachamento (livre ou leg press)",
      series: 3,
      reps: "8-10",
    },
    { id: "a2", name: "Supino reto", series: 3, reps: "8-10" },
    { id: "a3", name: "Remada curvada ou puxada", series: 3, reps: "8-10" },
    { id: "a4", name: "Desenvolvimento de ombro", series: 3, reps: "10-12" },
    { id: "a5", name: "Panturrilha", series: 3, reps: "15" },
    { id: "a6", name: "Prancha", series: 3, reps: "30-45s" },
  ],
  B: [
    { id: "b1", name: "Levantamento terra ou stiff", series: 3, reps: "8-10" },
    {
      id: "b2",
      name: "Supino inclinado ou crucifixo",
      series: 3,
      reps: "10-12",
    },
    { id: "b3", name: "Puxada frontal ou barra fixa", series: 3, reps: "8-10" },
    { id: "b4", name: "Elevação lateral", series: 3, reps: "12-15" },
    { id: "b5", name: "Rosca direta", series: 3, reps: "10-12" },
    { id: "b6", name: "Tríceps (corda ou testa)", series: 3, reps: "10-12" },
    { id: "b7", name: "Abdominal", series: 3, reps: "15-20" },
  ],
};

const DEFAULT_PRETREINO_ITEMS = [
  {
    id: "p1",
    time: "06:00",
    label: "Beber água",
    detail: "1-2 copos assim que acordar",
  },
  {
    id: "p2",
    time: "06:02",
    label: "Vestir roupa de treino",
    detail: "Roupa e itens separados na noite anterior",
  },
  {
    id: "p3",
    time: "06:05",
    label: "Lanche rápido",
    detail: "Banana, castanhas ou café — nada pesado",
  },
  {
    id: "p4",
    time: "06:12",
    label: "Banheiro / higiene",
    detail: "Ir ao banheiro e escovar os dentes",
  },
  {
    id: "p5",
    time: "06:18",
    label: "Alongamento dinâmico",
    detail: "2-3 min de mobilidade leve",
  },
  {
    id: "p6",
    time: "06:25",
    label: "Saída para a academia",
    detail: "Conferir garrafinha, toalha, fone, chave",
  },
];

const WEEKDAYS = ["DOM", "SEG", "TER", "QUA", "QUI", "SEX", "SÁB"];

// ---------- Storage helpers ----------
const STORE_KEY = "meutreino_state_v1";
function loadState() {
  let s = null;
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (raw) s = JSON.parse(raw);
  } catch (e) {
    console.warn("storage read failed", e);
  }
  if (!s)
    s = {
      checklist: {},
      checklistDate: null,
      lastWorkout: null,
      logs: [],
      installDismissed: false,
    };
  if (!s.workouts) s.workouts = JSON.parse(JSON.stringify(DEFAULT_WORKOUTS));
  if (!s.pretreino)
    s.pretreino = JSON.parse(JSON.stringify(DEFAULT_PRETREINO_ITEMS));
<<<<<<< HEAD
  if (!s.trainDows) s.trainDows = [1, 3, 5]; // Seg, Qua, Sex
  if (!s.workoutOrder) s.workoutOrder = Object.keys(s.workouts).sort();
=======
  if (!s.workoutOrder) s.workoutOrder = Object.keys(s.workouts).sort();
  if (!s.daySchedule) {
    // Migra de versões antigas (trainDows + ciclo automático) para um treino fixo por dia
    s.daySchedule = {
      0: null,
      1: null,
      2: null,
      3: null,
      4: null,
      5: null,
      6: null,
    };
    const order = s.workoutOrder.length ? s.workoutOrder : ["A", "B"];
    const dows = (s.trainDows || [1, 3, 5]).slice().sort((a, b) => a - b);
    dows.forEach((dow, i) => {
      s.daySchedule[dow] = order[i % order.length];
    });
  }
>>>>>>> 4aebd99 (mudança)
  return s;
}
function generateId() {
  return "x" + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}
function saveState() {
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify(state));
  } catch (e) {
    console.warn("storage write failed", e);
  }
}
let state = loadState();

function todayStr() {
  const d = new Date();
  return (
    d.getFullYear() +
    "-" +
    String(d.getMonth() + 1).padStart(2, "0") +
    "-" +
    String(d.getDate()).padStart(2, "0")
  );
}
function todayLabel() {
  const d = new Date();
  return (
    WEEKDAYS[d.getDay()] +
    " · " +
    String(d.getDate()).padStart(2, "0") +
    "/" +
    String(d.getMonth() + 1).padStart(2, "0")
  );
}

// reset checklist if it's a new day
if (state.checklistDate !== todayStr()) {
  state.checklist = {};
  state.checklistDate = todayStr();
  saveState();
}

// ---------- Navigation ----------
function switchScreen(name) {
  document
    .querySelectorAll(".screen")
    .forEach((s) => s.classList.remove("active"));
  document.getElementById("screen-" + name).classList.add("active");
  document
    .querySelectorAll(".nav-btn")
    .forEach((b) => b.classList.toggle("active", b.dataset.screen === name));
  window.scrollTo(0, 0);
}
function goToWorkoutFromHome() {
  switchScreen("workout");
  document
    .querySelectorAll(".nav-btn")
    .forEach((b) =>
      b.classList.toggle("active", b.dataset.screen === "workout"),
    );
}

// ---------- Manage mode ----------
let manageModePretreino = false;
let manageModeWorkout = false;
function toggleManageMode(scope) {
  if (scope === "pretreino") {
    manageModePretreino = !manageModePretreino;
    document
      .getElementById("pretreino-manage-btn")
      .classList.toggle("active", manageModePretreino);
    renderChecklist(
      "pretreino-checklist",
      "pre-progress-fill",
      "pre-progress-label",
    );
  } else {
    manageModeWorkout = !manageModeWorkout;
    document
      .getElementById("workout-manage-btn")
      .classList.toggle("active", manageModeWorkout);
    renderTabs();
    renderExerciseList();
  }
}

// ---------- Checklist rendering (shared render fn, two containers) ----------
function renderChecklist(containerId, fillId, labelId) {
  const container = document.getElementById(containerId);
  const isPretreinoScreen = containerId === "pretreino-checklist";
  const manage = isPretreinoScreen && manageModePretreino;
  container.innerHTML = "";
  let doneCount = 0;
  state.pretreino.forEach((item) => {
    const isDone = !!state.checklist[item.id];
    if (isDone) doneCount++;
    const el = document.createElement("div");
    el.className =
      "check-item" + (isDone ? " done" : "") + (manage ? " manage-mode" : "");
    if (manage) {
      el.innerHTML = `
        <div class="check-text">
          <div class="check-time">${item.time || ""}</div>
          <div class="check-label">${item.label}</div>
          <div class="check-detail">${item.detail || ""}</div>
        </div>
        <div class="item-actions">
          <div class="icon-btn edit"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg></div>
          <div class="icon-btn delete"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0l-1 14a2 2 0 01-2 2H7a2 2 0 01-2-2L4 6h16z"/></svg></div>
        </div>
      `;
      el.querySelector(".icon-btn.edit").onclick = (ev) => {
        ev.stopPropagation();
        openModal("pretreino", item.id);
      };
      el.querySelector(".icon-btn.delete").onclick = (ev) => {
        ev.stopPropagation();
        confirmDeletePretreino(item.id);
      };
    } else {
      el.innerHTML = `
        <div class="check-box">
          <svg viewBox="0 0 24 24" fill="none" stroke="#0A0A0A" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
        </div>
        <div class="check-text">
          <div class="check-time">${item.time || ""}</div>
          <div class="check-label">${item.label}</div>
          <div class="check-detail">${item.detail || ""}</div>
        </div>
      `;
      el.onclick = () => {
        state.checklist[item.id] = !state.checklist[item.id];
        saveState();
        renderChecklist(
          "home-checklist",
          "home-progress-fill",
          "home-progress-label",
        );
        renderChecklist(
          "pretreino-checklist",
          "pre-progress-fill",
          "pre-progress-label",
        );
      };
    }
    container.appendChild(el);
  });
  if (manage) {
    const addEl = document.createElement("div");
    addEl.className = "add-card";
    addEl.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg> Adicionar item`;
    addEl.onclick = () => openModal("pretreino", null);
    container.appendChild(addEl);
  }
  const total = state.pretreino.length || 1;
  const pct = Math.round((doneCount / total) * 100);
  document.getElementById(fillId).style.width = pct + "%";
  document.getElementById(labelId).textContent =
    doneCount +
    " de " +
    state.pretreino.length +
    " concluído" +
    (doneCount === 1 ? "" : "s");
}
function resetChecklist() {
  state.checklist = {};
  saveState();
  renderChecklist(
    "home-checklist",
    "home-progress-fill",
    "home-progress-label",
  );
  renderChecklist(
    "pretreino-checklist",
    "pre-progress-fill",
    "pre-progress-label",
  );
  showToast("Checklist reiniciada");
}
function confirmDeletePretreino(id) {
  state.pretreino = state.pretreino.filter((i) => i.id !== id);
  delete state.checklist[id];
  saveState();
  renderChecklist(
    "home-checklist",
    "home-progress-fill",
    "home-progress-label",
  );
  renderChecklist(
    "pretreino-checklist",
    "pre-progress-fill",
    "pre-progress-label",
  );
  showToast("Item removido");
}

// ---------- Week grid ----------
function renderWeekGrid() {
  const grid = document.getElementById("week-grid");
  grid.innerHTML = "";
  const today = new Date();
  const todayDow = today.getDay();
  // Monday-start week
  const mondayOffset = todayDow === 0 ? -6 : 1 - todayDow;
  const monday = new Date(today);
  monday.setDate(today.getDate() + mondayOffset);

<<<<<<< HEAD
  const nextTag = getNextWorkoutTag();
  // Assign workout tags cycling through state.workoutOrder across the user's chosen training days
  const trainDows = state.trainDows.slice().sort();
  let tag = nextTag;
  const tagsForWeek = {};
=======
>>>>>>> 4aebd99 (mudança)
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    const dow = d.getDay();
<<<<<<< HEAD
    if (trainDows.includes(dow)) {
      tagsForWeek[i] = tag;
      tag = nextInOrder(tag);
    }
  }
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    const isToday = d.toDateString() === today.toDateString();
    const dayTag = tagsForWeek[i];
=======
    const isToday = d.toDateString() === today.toDateString();
    const dayTag = state.daySchedule[dow];
>>>>>>> 4aebd99 (mudança)
    const el = document.createElement("div");
    el.className =
      "week-day" +
      (dayTag ? " " + tagParityClass(dayTag) : "") +
      (isToday ? " today" : "");
<<<<<<< HEAD
    el.innerHTML = `<div class="dow">${WEEKDAYS[d.getDay()]}</div><div class="tag">${dayTag ? dayTag : "—"}</div>`;
=======
    el.innerHTML = `<div class="dow">${WEEKDAYS[dow]}</div><div class="tag">${dayTag ? dayTag : "—"}</div>`;
>>>>>>> 4aebd99 (mudança)
    grid.appendChild(el);
  }
}

// ---------- Workout tabs (dynamic) ----------
let activeWorkoutTag = "A";
<<<<<<< HEAD
function nextInOrder(tag) {
  const order = state.workoutOrder;
  const idx = order.indexOf(tag);
  if (idx === -1) return order[0];
  return order[(idx + 1) % order.length];
}
=======
>>>>>>> 4aebd99 (mudança)
function tagParityClass(tag) {
  const idx = state.workoutOrder.indexOf(tag);
  return idx % 2 === 0 ? "a" : "b";
}
<<<<<<< HEAD
function getNextWorkoutTag() {
  if (!state.lastWorkout || !state.workoutOrder.includes(state.lastWorkout))
    return state.workoutOrder[0];
  return nextInOrder(state.lastWorkout);
=======
// Retorna o treino marcado para hoje. Se hoje for descanso, procura o próximo
// dia com treino marcado nos próximos 7 dias; se nada estiver marcado, cai no primeiro treino da lista.
function getNextWorkoutTag() {
  const todayDow = new Date().getDay();
  for (let i = 0; i < 7; i++) {
    const dow = (todayDow + i) % 7;
    const tag = state.daySchedule[dow];
    if (tag && state.workoutOrder.includes(tag)) return tag;
  }
  return state.workoutOrder[0];
}
function isRestDayToday() {
  const todayDow = new Date().getDay();
  const tag = state.daySchedule[todayDow];
  return !tag || !state.workoutOrder.includes(tag);
>>>>>>> 4aebd99 (mudança)
}
function nextWorkoutLetter() {
  const alphabet = "ABCDEFGHIJ";
  for (const letter of alphabet) {
    if (!state.workoutOrder.includes(letter)) return letter;
  }
  return "W" + (state.workoutOrder.length + 1);
}
function renderTabs() {
  const row = document.getElementById("tabs-row");
  row.innerHTML = "";
  state.workoutOrder.forEach((tag) => {
    const wrap = document.createElement("div");
    wrap.className = "tab-pill-wrap";
    const pill = document.createElement("div");
    pill.className = "tab-pill" + (tag === activeWorkoutTag ? " active" : "");
    pill.dataset.workout = tag;
    pill.textContent = "Treino " + tag;
    pill.onclick = () => setWorkoutTab(tag);
    wrap.appendChild(pill);
    if (manageModeWorkout && state.workoutOrder.length > 1) {
      const del = document.createElement("div");
      del.className = "tab-del";
      del.innerHTML =
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>';
      del.onclick = (ev) => {
        ev.stopPropagation();
        confirmDeleteWorkoutTag(tag);
      };
      wrap.appendChild(del);
    }
    row.appendChild(wrap);
  });
  if (manageModeWorkout) {
    const addBtn = document.createElement("div");
    addBtn.className = "tab-add";
    addBtn.innerHTML =
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>';
    addBtn.onclick = addWorkoutTag;
    row.appendChild(addBtn);
  }
}
function addWorkoutTag() {
  const letter = nextWorkoutLetter();
  state.workouts[letter] = [];
  state.workoutOrder.push(letter);
  saveState();
  activeWorkoutTag = letter;
  renderTabs();
  renderExerciseList();
  showToast("Treino " + letter + " criado — adicione as atividades");
}
function confirmDeleteWorkoutTag(tag) {
  if (state.workoutOrder.length <= 1) {
    showToast("Mantenha pelo menos um treino");
    return;
  }
  delete state.workouts[tag];
  state.workoutOrder = state.workoutOrder.filter((t) => t !== tag);
  if (activeWorkoutTag === tag) activeWorkoutTag = state.workoutOrder[0];
  if (state.lastWorkout === tag) state.lastWorkout = null;
<<<<<<< HEAD
=======
  Object.keys(state.daySchedule).forEach((dow) => {
    if (state.daySchedule[dow] === tag) state.daySchedule[dow] = null;
  });
>>>>>>> 4aebd99 (mudança)
  saveState();
  renderTabs();
  renderExerciseList();
  updateHeroCard();
  renderWeekGrid();
  renderProgressSelect();
  showToast("Treino " + tag + " removido");
}
function setWorkoutTab(tag) {
  activeWorkoutTag = tag;
  renderTabs();
  renderExerciseList();
}
function getLastLoad(exId) {
  const entries = state.logs.filter((l) => l.exId === exId);
  if (!entries.length) return null;
  return entries[entries.length - 1];
}
function renderExerciseList() {
  const list = document.getElementById("exercise-list");
  list.innerHTML = "";
  const exercises = state.workouts[activeWorkoutTag];
  exercises.forEach((ex) => {
    const last = getLastLoad(ex.id);
    const inputId = "load-" + ex.id;
    const el = document.createElement("div");
    el.className = "exercise-card" + (manageModeWorkout ? " manage-mode" : "");
    if (manageModeWorkout) {
      el.innerHTML = `
        <div class="exercise-head">
          <div>
            <div class="exercise-name">${ex.name}</div>
            <div class="exercise-meta" style="margin-top:4px;">${ex.series}x${ex.reps}</div>
          </div>
          <div class="item-actions">
            <div class="icon-btn edit"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg></div>
            <div class="icon-btn delete"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0l-1 14a2 2 0 01-2 2H7a2 2 0 01-2-2L4 6h16z"/></svg></div>
          </div>
        </div>
      `;
      el.querySelector(".icon-btn.edit").onclick = (ev) => {
        ev.stopPropagation();
        openModal("exercise", ex.id, activeWorkoutTag);
      };
      el.querySelector(".icon-btn.delete").onclick = (ev) => {
        ev.stopPropagation();
        confirmDeleteExercise(ex.id);
      };
    } else {
      el.innerHTML = `
        <div class="exercise-head">
          <div class="exercise-name">${ex.name}</div>
          <div class="exercise-meta">${ex.series}x${ex.reps}</div>
        </div>
        <div class="exercise-row">
          <button class="step-btn" onclick="stepLoad('${inputId}', -2.5)">−</button>
          <div class="load-input-wrap">
            <input type="number" inputmode="decimal" id="${inputId}" placeholder="0" value="${last ? last.kg : ""}">
            <span>kg</span>
          </div>
          <button class="step-btn" onclick="stepLoad('${inputId}', 2.5)">+</button>
        </div>
        ${last ? `<div class="last-load">Última carga: <b>${last.kg} kg</b> em ${formatDate(last.date)}</div>` : `<div class="last-load">Ainda sem registro</div>`}
      `;
    }
    list.appendChild(el);
  });
  if (manageModeWorkout) {
    const addEl = document.createElement("div");
    addEl.className = "add-card";
    addEl.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg> Adicionar atividade`;
    addEl.onclick = () => openModal("exercise", null, activeWorkoutTag);
    list.appendChild(addEl);
  }
}
function confirmDeleteExercise(id) {
  state.workoutOrder.forEach((tag) => {
    state.workouts[tag] = state.workouts[tag].filter((e) => e.id !== id);
  });
  saveState();
  renderExerciseList();
  updateHeroCard();
  renderProgressSelect();
  showToast("Atividade removida");
}
function stepLoad(inputId, delta) {
  const input = document.getElementById(inputId);
  let val = parseFloat(input.value) || 0;
  val = Math.max(0, val + delta);
  input.value = val % 1 === 0 ? val : val.toFixed(1);
}
function finishWorkout() {
  const exercises = state.workouts[activeWorkoutTag];
  const today = todayStr();
  let loggedCount = 0;
  exercises.forEach((ex) => {
    const input = document.getElementById("load-" + ex.id);
    const val = parseFloat(input.value);
    if (!isNaN(val) && val > 0) {
      state.logs.push({
        exId: ex.id,
        exName: ex.name,
        workout: activeWorkoutTag,
        kg: val,
        date: today,
      });
      loggedCount++;
    }
  });
  state.lastWorkout = activeWorkoutTag;
  saveState();
  renderHome();
  renderWeekGrid();
  renderProgressSelect();
  if (loggedCount > 0) {
    showToast(
      "Treino " +
        activeWorkoutTag +
        " concluído! " +
        loggedCount +
        " cargas registradas.",
    );
  } else {
    showToast("Treino " + activeWorkoutTag + " marcado como concluído.");
  }
  switchScreen("home");
}

// ---------- Home ----------
function updateHeroCard() {
  const nextTag = getNextWorkoutTag();
<<<<<<< HEAD
  document.getElementById("home-workout-title").innerHTML =
    'TREINO <span class="accent">' + nextTag + "</span>";
  const count = (state.workouts[nextTag] || []).length;
  document.getElementById("home-workout-sub").textContent =
    "Full body · " + count + " exercícios · foco em força e hipertrofia";
=======
  const restToday = isRestDayToday();
  const eyebrow = document.getElementById("home-hero-eyebrow");
  const ctaText = document.getElementById("home-hero-cta-text");
  if (restToday) {
    eyebrow.textContent = "HOJE É DESCANSO";
    document.getElementById("home-workout-title").innerHTML =
      'DIA DE <span class="accent">DESCANSO</span>';
    const nextInfo = nextScheduledDayLabel();
    document.getElementById("home-workout-sub").textContent = nextInfo
      ? "Próximo treino: " + nextInfo
      : 'Nenhum treino marcado — toque em "Editar dias" para programar sua semana.';
    ctaText.textContent = "Ver treinos";
  } else {
    eyebrow.textContent = "TREINO DE HOJE";
    document.getElementById("home-workout-title").innerHTML =
      'TREINO <span class="accent">' + nextTag + "</span>";
    const count = (state.workouts[nextTag] || []).length;
    document.getElementById("home-workout-sub").textContent =
      "Full body · " + count + " exercícios · foco em força e hipertrofia";
    ctaText.textContent = "Iniciar treino";
  }
}
function nextScheduledDayLabel() {
  const todayDow = new Date().getDay();
  for (let i = 1; i <= 7; i++) {
    const dow = (todayDow + i) % 7;
    const tag = state.daySchedule[dow];
    if (tag && state.workoutOrder.includes(tag)) {
      return "Treino " + tag + " · " + WEEKDAYS[dow];
    }
  }
  return null;
>>>>>>> 4aebd99 (mudança)
}
function renderHome() {
  updateHeroCard();
  activeWorkoutTag = getNextWorkoutTag();
  renderTabs();
  renderExerciseList();
}

// ---------- Progress ----------
function renderProgressSelect() {
  const sel = document.getElementById("progress-exercise-select");
  const allExercises = state.workoutOrder.flatMap(
    (tag) => state.workouts[tag] || [],
  );
  const prevVal = sel.value;
  sel.innerHTML = "";
  allExercises.forEach((ex) => {
    const opt = document.createElement("option");
    opt.value = ex.id;
    opt.textContent = ex.name;
    sel.appendChild(opt);
  });
  if (prevVal && allExercises.some((e) => e.id === prevVal))
    sel.value = prevVal;
  renderProgressChart();
}
function formatDate(dstr) {
  const [y, m, d] = dstr.split("-");
  return d + "/" + m;
}
function renderProgressChart() {
  const sel = document.getElementById("progress-exercise-select");
  const exId = sel.value;
  const entries = state.logs.filter((l) => l.exId === exId);
  const chartContainer = document.getElementById("chart-container");
  const historyContainer = document.getElementById("history-container");

  if (!entries.length) {
    chartContainer.innerHTML =
      '<div class="empty-state">Sem registros ainda.<br>Conclua um treino para começar a ver sua evolução.</div>';
    historyContainer.innerHTML = "";
    return;
  }

  const w = 400,
    h = 140,
    pad = 24;
  const kgs = entries.map((e) => e.kg);
  const minKg = Math.min(...kgs) * 0.9;
  const maxKg = Math.max(...kgs) * 1.1;
  const range = maxKg - minKg || 1;
  const stepX = entries.length > 1 ? (w - pad * 2) / (entries.length - 1) : 0;

  const points = entries.map((e, i) => {
    const x = pad + i * stepX;
    const y = h - pad - ((e.kg - minKg) / range) * (h - pad * 2);
    return [x, y];
  });
  const pathD = points
    .map(
      (p, i) => (i === 0 ? "M" : "L") + p[0].toFixed(1) + " " + p[1].toFixed(1),
    )
    .join(" ");
  const areaD =
    pathD +
    ` L ${points[points.length - 1][0].toFixed(1)} ${h - pad} L ${points[0][0].toFixed(1)} ${h - pad} Z`;

  const dots = points
    .map(
      (p, i) =>
        `<circle cx="${p[0].toFixed(1)}" cy="${p[1].toFixed(1)}" r="4" fill="#FF6A00" stroke="#0A0A0A" stroke-width="1.5"/>`,
    )
    .join("");
  const lastLabel = `<text x="${points[points.length - 1][0].toFixed(1)}" y="${(points[points.length - 1][1] - 10).toFixed(1)}" fill="#FFFFFF" font-size="13" font-weight="700" text-anchor="middle" font-family="Inter, sans-serif">${entries[entries.length - 1].kg}kg</text>`;

  chartContainer.innerHTML = `
    <svg viewBox="0 0 ${w} ${h}" style="width:100%;height:${h}px;overflow:visible;">
      <defs>
        <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#FF6A00" stop-opacity="0.35"/>
          <stop offset="100%" stop-color="#FF6A00" stop-opacity="0"/>
        </linearGradient>
      </defs>
      <path d="${areaD}" fill="url(#areaGrad)"/>
      <path d="${pathD}" fill="none" stroke="#FF6A00" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
      ${dots}
      ${lastLabel}
    </svg>
  `;

  const rows = entries
    .slice()
    .reverse()
    .map(
      (e) => `
    <tr><td>${formatDate(e.date)}</td><td>Treino ${e.workout}</td><td style="text-align:right;font-weight:700;">${e.kg} kg</td></tr>
  `,
    )
    .join("");
  historyContainer.innerHTML = `
    <table class="history-table">
      <thead><tr><th>Data</th><th>Treino</th><th style="text-align:right;">Carga</th></tr></thead>
      <tbody>${rows}</tbody>
    </table>
  `;
}

// ---------- Modal (add/edit pretreino item, exercise, or weekdays) ----------
let modalState = { type: null, id: null, workoutTag: null };
<<<<<<< HEAD
let selectedDays = [];
=======
let tempDaySchedule = {};
>>>>>>> 4aebd99 (mudança)
function openModal(type, id, workoutTag) {
  modalState = { type, id, workoutTag };
  const isEdit = !!id;
  document.getElementById("field-name-group").style.display =
    type === "weekdays" ? "none" : "block";
  document.getElementById("field-time-group").style.display =
    type === "pretreino" ? "block" : "none";
  document.getElementById("field-detail-group").style.display =
    type === "pretreino" ? "block" : "none";
  document.getElementById("field-exercise-row").style.display =
    type === "exercise" ? "flex" : "none";
  document.getElementById("field-weekdays-group").style.display =
    type === "weekdays" ? "block" : "none";
  document.getElementById("field-name-label").textContent =
    type === "exercise" ? "Nome da atividade" : "Nome";
  document.getElementById("modal-delete-btn").style.display =
    isEdit && type !== "weekdays" ? "block" : "none";

  if (type === "pretreino") {
    document.getElementById("modal-title").textContent = isEdit
      ? "Editar item"
      : "Novo item pré-treino";
    const item = isEdit ? state.pretreino.find((i) => i.id === id) : null;
    document.getElementById("field-time").value = item ? item.time || "" : "";
    document.getElementById("field-name").value = item ? item.label : "";
    document.getElementById("field-detail").value = item
      ? item.detail || ""
      : "";
    document.getElementById("field-name").placeholder = "Ex: Tomar pré-treino";
  } else if (type === "exercise") {
    document.getElementById("modal-title").textContent = isEdit
      ? "Editar atividade"
      : "Nova atividade física";
    const item = isEdit
      ? state.workouts[workoutTag].find((e) => e.id === id)
      : null;
    document.getElementById("field-name").value = item ? item.name : "";
    document.getElementById("field-series").value = item ? item.series : 3;
    document.getElementById("field-reps").value = item ? item.reps : "";
    document.getElementById("field-name").placeholder =
      "Ex: Corrida leve, Natação...";
  } else if (type === "weekdays") {
<<<<<<< HEAD
    document.getElementById("modal-title").textContent =
      "Dias de treino na semana";
    renderDayToggles();
=======
    document.getElementById("modal-title").textContent = "Treino de cada dia";
    tempDaySchedule = JSON.parse(JSON.stringify(state.daySchedule));
    renderDaySchedulePicker();
>>>>>>> 4aebd99 (mudança)
  }
  document.getElementById("modal-overlay").classList.add("show");
}
function openWeekdaysModal() {
  openModal("weekdays", null, null);
}
<<<<<<< HEAD
function renderDayToggles() {
  selectedDays = [...state.trainDows];
=======
function renderDaySchedulePicker() {
  // Apenas desenha a grade a partir de tempDaySchedule — não reseta o valor
  // (o reset a partir de state.daySchedule acontece só ao abrir o modal, em openModal).
>>>>>>> 4aebd99 (mudança)
  const grid = document.getElementById("day-toggle-grid");
  grid.innerHTML = "";
  WEEKDAYS.forEach((label, dow) => {
    const el = document.createElement("div");
<<<<<<< HEAD
    el.className =
      "day-toggle" + (selectedDays.includes(dow) ? " selected" : "");
    el.textContent = label;
    el.onclick = () => {
      if (selectedDays.includes(dow)) {
        selectedDays = selectedDays.filter((d) => d !== dow);
      } else {
        selectedDays.push(dow);
      }
      el.classList.toggle("selected");
=======
    const tag = tempDaySchedule[dow];
    el.className = "day-toggle" + (tag ? " " + tagParityClass(tag) : "");
    el.innerHTML = `<div class="dt-dow">${label}</div><div class="dt-tag">${tag || "—"}</div>`;
    el.onclick = () => {
      const order = state.workoutOrder;
      const currentIdx = tag ? order.indexOf(tempDaySchedule[dow]) : -1;
      const nextIdx = currentIdx + 1;
      tempDaySchedule[dow] = nextIdx < order.length ? order[nextIdx] : null;
      renderDaySchedulePicker();
>>>>>>> 4aebd99 (mudança)
    };
    grid.appendChild(el);
  });
}
function closeModal() {
  document.getElementById("modal-overlay").classList.remove("show");
}
function saveModal() {
  const { type, id, workoutTag } = modalState;

  if (type === "weekdays") {
<<<<<<< HEAD
    if (selectedDays.length === 0) {
      showToast("Selecione ao menos um dia");
      return;
    }
    state.trainDows = selectedDays.slice().sort();
    saveState();
    renderWeekGrid();
=======
    state.daySchedule = tempDaySchedule;
    saveState();
    renderWeekGrid();
    renderHome();
>>>>>>> 4aebd99 (mudança)
    closeModal();
    showToast("Dias de treino atualizados");
    return;
  }

  const name = document.getElementById("field-name").value.trim();
  if (!name) {
    showToast("Digite um nome");
    return;
  }

  if (type === "pretreino") {
    const time = document.getElementById("field-time").value.trim();
    const detail = document.getElementById("field-detail").value.trim();
    if (id) {
      const item = state.pretreino.find((i) => i.id === id);
      item.time = time;
      item.label = name;
      item.detail = detail;
    } else {
      state.pretreino.push({ id: generateId(), time, label: name, detail });
    }
    saveState();
    renderChecklist(
      "home-checklist",
      "home-progress-fill",
      "home-progress-label",
    );
    renderChecklist(
      "pretreino-checklist",
      "pre-progress-fill",
      "pre-progress-label",
    );
  } else {
    const series = parseInt(document.getElementById("field-series").value) || 3;
    const reps = document.getElementById("field-reps").value.trim() || "10";
    if (id) {
      const item = state.workouts[workoutTag].find((e) => e.id === id);
      item.name = name;
      item.series = series;
      item.reps = reps;
    } else {
      state.workouts[workoutTag].push({ id: generateId(), name, series, reps });
    }
    saveState();
    renderExerciseList();
    updateHeroCard();
    renderProgressSelect();
  }
  closeModal();
  showToast("Salvo com sucesso");
}
function deleteModalItem() {
  const { type, id, workoutTag } = modalState;
  if (type === "pretreino") {
    confirmDeletePretreino(id);
  } else if (type === "exercise") {
    confirmDeleteExercise(id);
  }
  closeModal();
}

// ---------- Toast ----------
let toastTimer;
function showToast(msg) {
  const toast = document.getElementById("toast");
  toast.textContent = msg;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2200);
}

// ---------- Install banner (PWA) ----------
let deferredPrompt = null;
window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  deferredPrompt = e;
  document.getElementById("install-btn").style.display = "inline-block";
  if (!state.installDismissed)
    document.getElementById("install-banner").classList.add("show");
});
function tryInstall() {
  if (deferredPrompt) {
    deferredPrompt.prompt();
    deferredPrompt.userChoice.finally(() => {
      deferredPrompt = null;
      document.getElementById("install-banner").classList.remove("show");
    });
  }
}
function dismissInstallBanner() {
  document.getElementById("install-banner").classList.remove("show");
  state.installDismissed = true;
  saveState();
}
function isStandalone() {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    window.navigator.standalone === true
  );
}
function isiOS() {
  return /iphone|ipad|ipod/i.test(window.navigator.userAgent);
}
(function initInstallBanner() {
  if (isStandalone() || state.installDismissed) return;
  if (isiOS()) {
    document.getElementById("install-banner-text").textContent =
      'No Safari, toque no ícone de compartilhar e depois em "Adicionar à Tela de Início" para instalar.';
    document.getElementById("install-banner").classList.add("show");
  }
  // Android/Chrome banner is shown by the beforeinstallprompt listener above
})();

// ---------- Init ----------
document.getElementById("date-badge").textContent = todayLabel();
renderChecklist("home-checklist", "home-progress-fill", "home-progress-label");
renderChecklist(
  "pretreino-checklist",
  "pre-progress-fill",
  "pre-progress-label",
);
renderWeekGrid();
renderHome();
renderProgressSelect();
<<<<<<< HEAD
=======
initUsageCounter();
>>>>>>> 4aebd99 (mudança)
