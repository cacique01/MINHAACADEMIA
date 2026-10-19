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

// ---------- Data ----------
const DEFAULT_WORKOUTS = {
  A: [],
  B: [],
};
const LEGACY_DEFAULT_WORKOUT_EXERCISE_IDS = {
  A: ["a1", "a2", "a3", "a4", "a5", "a6"],
  B: ["b1", "b2", "b3", "b4", "b5", "b6", "b7"],
};

const DEFAULT_PREDEFINED_EXERCISES = [
  {
    id: "catalogo-agachamento",
    name: "Agachamento ",
    series: 3,
    reps: "8-10",
    gifUrl: "videos/agachamento.mp4",
    description: ``,
  },{
    id: "catalogo-cadeira-abdutora",
    name: "Cadeira abdutora",
    series: 3,
    reps: "8-10",
    gifUrl: "videos/cadeira-abdutora.mp4",
    description: ``
  },{
    id: "catalogo-cadeira-adutora",
    name: "Cadeira adutora",
    series: 3,
    reps: "8-10",
    gifUrl: "videos/cadeira-adutora.mp4",
    description: ``
  },{
    id: "catalogo-cadeira-extensora",
    name: "Cadeira extensora",
    series: 3,
    reps: "8-10",
    gifUrl: "videos/cadeira-extensora.mp4",
    description: ``
  },{
    id: "catalogo-crucifixo",
    name: "Crucifixo",
    series: 3,
    reps: "8-10",
    gifUrl: "videos/crucifixo.mp4",
    description: ``
  },{
    id: "catalogo-elevacao-lateral-halteres",
    name: "Elevação Lateral de Ombro",
    series: 3,
    reps: "8-10",
    gifUrl: "videos/elevacao-lateral-hateres.mp4",
    description: ``
  },{
    id: "catalogo-elevacao-panturrilha-sentado",
    name: "Elevação de Panturrilha Sentado",
    series: 3,
    reps: "8-10",
    gifUrl: "videos/elevacao-panturrilha-sentado.mp4",
    description: ``
  },{
    id: "catalogo-hiperextensao-lombar",
    name: "Hiperextensão Lombar",
    series: 3,
    reps: "8-10",
    gifUrl: "videos/hiperextensao-lombar.mp4",
    description: ``
  },{
    id: "catalogo-leg-press-horizontal",
    name: "Leg Press Horizontal",
    series: 3,
    reps: "8-10",
    gifUrl: "videos/leg-press-horizontal.mp4",
    description: ``
  },{
    id: "catalogo-mesa-flexora",
    name: "Mesa flexora",
    series: 3,
    reps: "8-10",
    gifUrl: "videos/mesa-flexora.mp4",
    description: ``
  },{
    id: "catalogo-ombro-halteres",
    name: "Desenvolvimento de ombro sentado",
    series: 3,
    reps: "8-10",
    gifUrl: "videos/ombro-halteres.mp4",
    description: ``
  },{
    id: "catalogo-panturrilha-em-pe",
    name: "Elevação de Panturrilha em Pé",
    series: 3,
    reps: "8-10",
    gifUrl: "videos/panturrilha-em-pe.mp4",
    description: ``
  },{
    id: "catalogo-panturrilha-maquina",
    name: "Elevação de Panturrilha na Máquina",
    series: 3,
    reps: "8-10",
    gifUrl: "videos/panturrilha-maquina.mp4",
    description: ``
  },{
    id: "catalogo-puxada-alta",
    name: "Puxada Alta",
    series: 3,
    reps: "8-10",
    gifUrl: "videos/puxada-alta.mp4",
    description: ``
  },{
    id: "catalogo-remada-alta",
    name: "Remada Alta",
    series: 3,
    reps: "8-10",
    gifUrl: "videos/remada-alta.gif",
    description: ``
  },{
    id: "catalogo-remada-baixa-maquina",
    name: "Remada Baixa na Máquina",
    series: 3,
    reps: "8-10",
    gifUrl: "videos/remada-baixa-maquina.mp4",
    description: ``
  },{
    id: "catalogo-rosca-concentrada",
    name: "Rosca Concentrada",
    series: 3,
    reps: "8-10",
    gifUrl: "videos/rosca-concentrada.mp4",
    description: ``
  },{
    id: "catalogo-rosca-direta",
    name: "Rosca Direta",
    series: 3,
    reps: "8-10",
    gifUrl: "videos/rosca-direta.mp4",
    description: ``
  },{
    id: "catalogo-rosca-martelo",
    name: "Rosca pegada Martelo",
    series: 3,
    reps: "8-10",
    gifUrl: "videos/rosca-martelo.mp4",
    description: ``
  },{
    id: "catalogo-rosca-punho",
    name: "Rosca Punho",
    series: 3,
    reps: "8-10",
    gifUrl: "videos/rosca-punho.mp4",
    description: ``
  },{
    id: "catalogo-supino-declinado",
    name: "Supino Declinado",
    series: 3,
    reps: "8-10",
    gifUrl: "videos/supino-declinado.mp4",
    description: ``
  },{
    id: "catalogo-supino-inclinado",
    name: "Supino Inclinado",
    series: 3,
    reps: "8-10",
    gifUrl: "videos/supino-inclinado.mp4",
    description: ``
  },{
    id: "catalogo-supino-reto",
    name: "Supino Reto",
    series: 3,
    reps: "8-10",
    gifUrl: "videos/supino-reto.mp4",
    description: ``
  },{
    id: "catalogo-triceps-francesa",
    name: "Tríceps Francesa",
    series: 3,
    reps: "8-10",
    gifUrl: "videos/triceps-frances.mp4",
    description: ``
  },{
    id: "catalogo-triceps-inverso",
    name: "Tricéps Inverso",
    series: 3,
    reps: "8-10",
    gifUrl: "videos/triceps-inverso.mp4",
    description: ``
  },{
    id: "catalogo-triceps",
    name: "Tricéps na Polia",
    series: 3,
    reps: "8-10",
    gifUrl: "videos/triceps.mp4",
    description: ``
  },
];

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

// Historico de treinos e cargas, para mostrar progresso ao longo do tempo
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
  if (!s.trainDows) s.trainDows = [1, 3, 5]; // Seg, Qua, Sex
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
if (!Array.isArray(state.predefinedExercises))
  state.predefinedExercises = [];
let catalogDefaultsChanged = false;
const existingPredefinedIds = new Set(
  state.predefinedExercises.map((exercise) => exercise.id),
);
DEFAULT_PREDEFINED_EXERCISES.forEach((exercise) => {
  if (!existingPredefinedIds.has(exercise.id)) {
    state.predefinedExercises.push({ ...exercise });
    catalogDefaultsChanged = true;
  }
});
let workoutNamesChanged = false;

if (
  !state.workoutNames ||
  typeof state.workoutNames !== "object" ||
  Array.isArray(state.workoutNames)
) {
  state.workoutNames = {};
  workoutNamesChanged = true;
}
state.workoutOrder.forEach((tag, index) => {
  if (!state.workoutNames[tag]) {
    state.workoutNames[tag] = "Treino " + (index + 1);
    workoutNamesChanged = true;
  }
});
let defaultWorkoutExercisesCleared = false;
if (!state.defaultWorkoutExercisesCleared) {
  Object.entries(LEGACY_DEFAULT_WORKOUT_EXERCISE_IDS).forEach(
    ([tag, exerciseIds]) => {
      const exerciseIdSet = new Set(exerciseIds);
      state.workouts[tag] = (state.workouts[tag] || []).filter(
        (exercise) => !exerciseIdSet.has(exercise.id),
      );
    },
  );
  state.defaultWorkoutExercisesCleared = true;
  defaultWorkoutExercisesCleared = true;
}
let catalogStateChanged = false;
state.workoutOrder.forEach((tag) => {
  state.workouts[tag] = (state.workouts[tag] || []).map((exercise) => {
    let predefined = state.predefinedExercises.find(
      (item) => item.id === exercise.id,
    );
    if (!predefined) {
      predefined = {
        ...exercise,
        gifUrl: exercise.gifUrl || "",
        description: exercise.description || "",
      };
      state.predefinedExercises.push(predefined);
      catalogStateChanged = true;
    } else {
      if (predefined.gifUrl === undefined) {
        predefined.gifUrl = "";
        catalogStateChanged = true;
      }
      if (predefined.description === undefined) {
        predefined.description = "";
        catalogStateChanged = true;
      }
    }
    return { ...predefined };
  });
});
if (
  workoutNamesChanged ||
  catalogDefaultsChanged ||
  defaultWorkoutExercisesCleared ||
  catalogStateChanged
)
  saveState();

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
  document.body.classList.toggle("exercise-detail-open", name === "exercise");
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
    document.getElementById("workout-manage-hint").hidden =
      !manageModeWorkout;
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

  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    const dow = d.getDay();
    const isToday = d.toDateString() === today.toDateString();
    const dayTag = state.daySchedule[dow];
    const el = document.createElement("div");
    el.className =
      "week-day" +
      (dayTag ? " " + tagParityClass(dayTag) : "") +
      (isToday ? " today" : "");
    el.innerHTML = `<div class="dow">${WEEKDAYS[dow]}</div><div class="tag">${dayTag ? escapeHtml(getWorkoutName(dayTag)) : "—"}</div>`;
    grid.appendChild(el);
  }
}

// ---------- Workout tabs (dynamic) ----------
let activeWorkoutTag = "A";
function tagParityClass(tag) {
  const idx = state.workoutOrder.indexOf(tag);
  return idx % 2 === 0 ? "a" : "b";
}
function getWorkoutName(tag) {
  return state.workoutNames[tag] || "Treino " + tag;
}
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
    pill.textContent = getWorkoutName(tag);
    pill.onclick = () => setWorkoutTab(tag);
    wrap.appendChild(pill);
    if (manageModeWorkout) {
      const edit = document.createElement("button");
      edit.type = "button";
      edit.className = "workout-type-edit";
      edit.setAttribute("aria-label", "Editar " + getWorkoutName(tag));
      edit.innerHTML =
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>';
      edit.onclick = (event) => {
        event.stopPropagation();
        openModal("workoutType", tag);
      };
      wrap.appendChild(edit);
      if (state.workoutOrder.length > 1) {
        const del = document.createElement("button");
        del.type = "button";
        del.className = "tab-del";
        del.setAttribute("aria-label", "Excluir " + getWorkoutName(tag));
        del.innerHTML =
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>';
        del.onclick = (event) => {
          event.stopPropagation();
          confirmDeleteWorkoutTag(tag);
        };
        wrap.appendChild(del);
      }
    }
    row.appendChild(wrap);
  });
  if (manageModeWorkout) {
    const addBtn = document.createElement("div");
    addBtn.className = "tab-add";
    addBtn.innerHTML =
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>';
    addBtn.setAttribute("role", "button");
    addBtn.setAttribute("aria-label", "Criar tipo de treino");
    addBtn.onclick = () => openModal("workoutType", null);
    row.appendChild(addBtn);
  }
}
function confirmDeleteWorkoutTag(tag) { // remove um treino da lista, mas só se houver mais de um treino
  if (state.workoutOrder.length <= 1) { // impede que o usuário delete o último treino, para evitar inconsistências
    showToast("Mantenha pelo menos um treino"); // mostra um aviso de erro
    return;
  }
  const workoutName = getWorkoutName(tag);
  delete state.workouts[tag];
  state.workoutOrder = state.workoutOrder.filter((t) => t !== tag); // remove o treino da ordem
  if (activeWorkoutTag === tag) activeWorkoutTag = state.workoutOrder[0];
  if (state.lastWorkout === tag) state.lastWorkout = null;
  Object.keys(state.daySchedule).forEach((dow) => {
    if (state.daySchedule[dow] === tag) state.daySchedule[dow] = null; // remove o treino da programação semanal
  });
  saveState(); // salva o estado atualizado
  renderTabs();
  renderExerciseList();
  updateHeroCard();
  renderWeekGrid();
  renderProgressSelect();
  showToast(workoutName + " removido");
}
function setWorkoutTab(tag) { // muda o treino ativo para o selecionado e atualiza a lista de exercícios
  activeWorkoutTag = tag; // marca o treino ativo
  renderTabs();
  renderExerciseList();
}
function getLastLoad(exId) {
  const entries = state.logs.filter((l) => l.exId === exId);
  if (!entries.length) return null;
  return entries[entries.length - 1];
}
function getLogValue(log) {
  return Number.isFinite(log.value) ? log.value : log.kg;
}
function getLogUnit(log) {
  return log.unit || "kg";
}
function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };
    return entities[character];
  });
}
function isTimedExercise(exercise) {
  return /\b(corrida|caminhada|bike|bicicleta|natação|natacao|elíptico|eliptico|escada)\b/i.test(
    exercise.name,
  );
}
function hasExerciseLogToday(exId, workoutTag) {
  return state.logs.some(
    (log) =>
      log.exId === exId &&
      log.workout === workoutTag &&
      log.date === todayStr(),
  );
}
function renderExerciseList() {
  const list = document.getElementById("exercise-list"); // pega o container da lista de exercícios
  list.innerHTML = ""; // limpa a lista antes de renderizar
  const exercises = state.workouts[activeWorkoutTag] || [];
  if (!exercises.length) {
    const empty = document.createElement("div");
    empty.className = "empty-state";
    empty.textContent = manageModeWorkout
      ? "Escolha um exercício do catálogo abaixo para adicioná-lo a este treino."
      : "Este treino ainda não tem exercícios. Toque em “Tipos de treino” para adicionar um exercício do catálogo.";
    list.appendChild(empty);
  }
  exercises.forEach((ex) => {
    const last = getLastLoad(ex.id);
    const el = document.createElement("div");
    el.className =
      "exercise-card" + (manageModeWorkout ? " manage-mode" : "");
    el.innerHTML = `
        <div class="exercise-head">
          <div class="exercise-name">${escapeHtml(ex.name)}</div>
          <div class="exercise-meta">${escapeHtml(ex.series)}x${escapeHtml(ex.reps)}</div>
        </div>
        <div class="exercise-row">
          <span class="exercise-open-hint">${hasExerciseLogToday(ex.id, activeWorkoutTag) ? "Concluído hoje · " : "Toque para registrar · "}${last ? `${getLogValue(last)} ${getLogUnit(last) === "min" ? "min" : "kg"} · ${formatDate(last.date)}` : "sem registros"}</span>
        </div>
      `;
    if (manageModeWorkout) {
      const removeButton = document.createElement("button");
      removeButton.type = "button";
      removeButton.className = "catalog-delete-btn exercise-remove-btn";
      removeButton.textContent = "Remover deste treino";
      removeButton.onclick = () =>
        removeExerciseFromWorkout(ex.id, activeWorkoutTag);
      el.appendChild(removeButton);
    } else {
      el.setAttribute("role", "button");
      el.setAttribute("tabindex", "0");
      el.onclick = () => openExerciseDetail(ex.id, activeWorkoutTag);
      el.onkeydown = (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          openExerciseDetail(ex.id, activeWorkoutTag);
        }
      };
    }
    list.appendChild(el);
  });
  if (manageModeWorkout) {
    const addEl = document.createElement("div");
    addEl.className = "add-card";
    addEl.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg> Escolher exercício pré-definido`;
    addEl.onclick = openExercisePicker;
    list.appendChild(addEl);
  }
  renderTimerExerciseSelect();
}
function removeExerciseFromWorkout(exId, workoutTag) {
  const workout = state.workouts[workoutTag];
  const exercise = workout?.find((item) => item.id === exId);
  if (!exercise) {
    showToast("Esse exercício não está mais neste treino");
    return;
  }
  if (
    !window.confirm(
      "Remover " + exercise.name + " de " + getWorkoutName(workoutTag) + "?",
    )
  )
    return;
  state.workouts[workoutTag] = workout.filter((item) => item.id !== exId);
  saveState();
  renderExerciseList();
  updateHeroCard();
  renderProgressSelect();
  showToast(exercise.name + " removido deste treino");
}
let currentExercise = null;
function openExerciseDetail(exId, workoutTag) {
  const exercise = (state.workouts[workoutTag] || []).find((item) => item.id === exId);
  if (!exercise) {
    showToast("Não foi possível encontrar esse exercício");
    return;
  }
  currentExercise = { exId, workoutTag };
  const last = getLastLoad(exId);
  const exerciseImage = document.querySelector(".exercise-detail-image");
  const exerciseVideo = document.querySelector(".exercise-detail-video");
  const gifUrl = getSafeGifUrl(exercise.gifUrl);
  const fallbackImage = "4929985-training-icon-on-white-linear-style-vetor.jpg";
  exerciseVideo.pause();
  exerciseVideo.removeAttribute("src");
  exerciseVideo.hidden = true;
  exerciseVideo.onerror = null;
  exerciseImage.hidden = false;
  if (gifUrl && isVideoMediaUrl(gifUrl)) {
    exerciseImage.hidden = true;
    exerciseVideo.muted = true;
    exerciseVideo.autoplay = true;
    exerciseVideo.onerror = () => {
      exerciseVideo.onerror = null;
      exerciseVideo.pause();
      exerciseVideo.hidden = true;
      exerciseImage.hidden = false;
      exerciseImage.src = fallbackImage;
    };
    exerciseVideo.src = gifUrl;
    exerciseVideo.hidden = false;
    exerciseVideo.load();
  } else {
    exerciseImage.src = gifUrl || fallbackImage;
    exerciseImage.onerror = () => {
      exerciseImage.onerror = null;
      exerciseImage.src = fallbackImage;
    };
  }
  document.getElementById("exercise-detail-workout").textContent =
    getWorkoutName(workoutTag).toLocaleUpperCase("pt-BR");
  document.getElementById("exercise-detail-title").textContent = exercise.name;
  exerciseImage.alt = "Execução do exercício " + exercise.name;
  exerciseVideo.setAttribute("aria-label", "Vídeo de execução de " + exercise.name);
  document.getElementById("exercise-detail-description").textContent =
    exercise.description || "Instruções de execução ainda não cadastradas.";
  document.getElementById("exercise-detail-meta").textContent =
    exercise.series + " séries · " + exercise.reps + " repetições";
  document.getElementById("exercise-metric").value = last
    ? getLogUnit(last)
    : isTimedExercise(exercise)
      ? "min"
      : "kg";
  document.getElementById("exercise-value").value = "";
  document.getElementById("exercise-detail-last-load").textContent = last
    ? "Último registro: " +
      getLogValue(last) +
      " " +
      (getLogUnit(last) === "min" ? "min" : "kg") +
      " · " +
      formatDate(last.date)
    : "Ainda sem registro para este exercício.";
  updateExerciseMetric();
  switchScreen("exercise");
}
function updateExerciseMetric() {
  const unit = document.getElementById("exercise-metric").value;
  const isDuration = unit === "min";
  document.getElementById("exercise-value-label").textContent = isDuration
    ? "Duração realizada"
    : "Carga utilizada";
  document.getElementById("exercise-value-unit").textContent = isDuration
    ? "min"
    : "kg";
  document.getElementById("exercise-value").placeholder = isDuration
    ? "Ex: 30"
    : "Ex: 20";
}
function closeExerciseDetail() {
  currentExercise = null;
  switchScreen("workout");
}
function completeCurrentExercise() {
  if (!currentExercise) {
    showToast("Nenhum exercício está aberto");
    return;
  }
  const exercise = (state.workouts[currentExercise.workoutTag] || []).find(
    (item) => item.id === currentExercise.exId,
  );
  if (!exercise) {
    closeExerciseDetail();
    showToast("Esse exercício não está mais disponível");
    return;
  }
  const value = Number(document.getElementById("exercise-value").value);
  if (!Number.isFinite(value) || value <= 0) {
    showToast("Informe uma carga ou duração válida");
    return;
  }
  const unit = document.getElementById("exercise-metric").value;
  const log = {
    exId: exercise.id,
    exName: exercise.name,
    workout: currentExercise.workoutTag,
    value,
    unit,
    date: todayStr(),
  };
  const existingLogIndex = state.logs.findIndex(
    (entry) =>
      entry.exId === exercise.id &&
      entry.workout === currentExercise.workoutTag &&
      entry.date === log.date,
  );
  if (existingLogIndex >= 0) state.logs[existingLogIndex] = log;
  else state.logs.push(log);
  const completedExercise = exercise.name;
  saveState();
  renderExerciseList();
  renderProgressSelect();
  closeExerciseDetail();
  showToast(completedExercise + " concluído");
}

// ---------- Workout timer ----------
let workoutTimer = {
  intervalId: null,
  durationMs: 0,
  elapsedMs: 0,
  startedAt: null,
  running: false,
  completed: false,
  exerciseName: "",
};
function updateTimerNotificationButton() {
  const button = document.getElementById("timer-notification-btn");
  if (!button) return;
  if (!window.isSecureContext || typeof Notification === "undefined") {
    if (!button.hidden) button.hidden = true;
    return;
  }
  const label =
    Notification.permission === "granted"
      ? "Notificações ativadas"
      : Notification.permission === "denied"
        ? "Notificações bloqueadas no navegador"
        : "Ativar notificações ao terminar";
  if (button.hidden) button.hidden = false;
  button.disabled = Notification.permission !== "default";
  if (button.textContent !== label) button.textContent = label;
}
async function enableWorkoutTimerNotifications() {
  if (!window.isSecureContext || typeof Notification === "undefined") {
    showToast("Notificações não são compatíveis com este navegador");
    updateTimerNotificationButton();
    return;
  }
  try {
    await Notification.requestPermission();
    updateTimerNotificationButton();
    if (Notification.permission === "granted") {
      showToast("Notificações ativadas");
    } else if (Notification.permission === "denied") {
      showToast("Notificações bloqueadas nas configurações do navegador");
    }
  } catch (error) {
    console.warn("Não foi possível ativar as notificações do temporizador", error);
    showToast("Não foi possível ativar as notificações");
  }
}
function notifyWorkoutTimerCompleted() {
  const exerciseName = workoutTimer.exerciseName;
  const message = exerciseName
    ? exerciseName + ": tempo concluído!"
    : "Tempo do temporizador concluído!";
  showToast(message);
  if (typeof navigator.vibrate === "function") navigator.vibrate([250, 100, 250]);
  if (typeof Notification === "undefined" || Notification.permission !== "granted") {
    return;
  }
  try {
    const notification = new Notification("Temporizador concluído", {
      body: message,
      tag: "workout-timer",
    });
    notification.onclick = () => {
      window.focus();
      notification.close();
    };
  } catch (error) {
    console.warn("Não foi possível exibir a notificação do temporizador", error);
  }
}
function renderTimerExerciseSelect() {
  const select = document.getElementById("timer-exercise-select");
  if (!select) return;
  const selectedId = select.value;
  select.innerHTML = "";
  let exerciseCount = 0;
  state.workoutOrder.forEach((tag) => {
    const exercises = state.workouts[tag] || [];
    if (!exercises.length) return;
    const group = document.createElement("optgroup");
    group.label = getWorkoutName(tag);
    exercises.forEach((exercise) => {
      const option = document.createElement("option");
      option.value = exercise.id;
      option.textContent = exercise.name;
      group.appendChild(option);
      exerciseCount++;
    });
    select.appendChild(group);
  });
  if (!exerciseCount) {
    const option = document.createElement("option");
    option.value = "";
    option.textContent = "Adicione um exercício primeiro";
    select.appendChild(option);
    select.disabled = true;
  } else {
    select.disabled = workoutTimer.durationMs > 0;
    select.value =
      selectedId &&
      Array.from(select.options).some((option) => option.value === selectedId)
        ? selectedId
        : select.options[0].value;
  }
  updateWorkoutTimerDisplay();
}
function formatTimerTime(milliseconds, roundUp = false) {
  const totalSeconds = Math.max(
    0,
    roundUp
      ? Math.ceil(milliseconds / 1000)
      : Math.floor(milliseconds / 1000),
  );
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const pad = (value) => String(value).padStart(2, "0");
  return hours > 0
    ? pad(hours) + ":" + pad(minutes) + ":" + pad(seconds)
    : pad(minutes) + ":" + pad(seconds);
}
function getConfiguredWorkoutTimerDuration() {
  const minutes = Number(document.getElementById("timer-minutes").value);
  const seconds = Number(document.getElementById("timer-seconds").value);
  if (
    !Number.isInteger(minutes) ||
    minutes < 0 ||
    minutes > 1439 ||
    !Number.isInteger(seconds) ||
    seconds < 0 ||
    seconds > 59
  ) {
    return 0;
  }
  return (minutes * 60 + seconds) * 1000;
}
function updateWorkoutTimerDisplay() {
  updateTimerNotificationButton();
  const displayDurationMs =
    workoutTimer.durationMs || getConfiguredWorkoutTimerDuration();
  const elapsedMs = workoutTimer.running
    ? Math.min(
        displayDurationMs,
        workoutTimer.elapsedMs + (Date.now() - workoutTimer.startedAt),
      )
    : workoutTimer.elapsedMs;
  const remainingMs = Math.max(0, displayDurationMs - elapsedMs);
  document.getElementById("timer-elapsed").textContent =
    formatTimerTime(elapsedMs);
  document.getElementById("timer-remaining").textContent =
    formatTimerTime(remainingMs, true);
  const progress =
    displayDurationMs > 0
      ? Math.min(100, (elapsedMs / displayDurationMs) * 100)
      : 0;
  document
    .getElementById("timer-clock")
    .style.setProperty("--timer-progress", progress + "%");
  document.getElementById("timer-clock").setAttribute(
    "aria-label",
    "Tempo restante " + formatTimerTime(remainingMs, true),
  );

  const startButton = document.getElementById("timer-start-btn");
  const resetButton = document.getElementById("timer-reset-btn");
  const locked = workoutTimer.durationMs > 0;
  document.getElementById("timer-exercise-select").disabled =
    locked || document.getElementById("timer-exercise-select").options.length === 0;
  document.getElementById("timer-minutes").disabled = locked;
  document.getElementById("timer-seconds").disabled = locked;
  startButton.disabled = workoutTimer.completed;
  startButton.textContent = workoutTimer.running
    ? "Pausar"
    : workoutTimer.durationMs > 0
      ? "Continuar"
      : "Iniciar timer";
  resetButton.disabled = !locked;
  document.getElementById("timer-status").textContent = workoutTimer.completed
    ? "Tempo concluído!"
    : workoutTimer.running
      ? "Timer em andamento"
      : locked
        ? "Timer pausado"
        : "Pronto para começar";
}
function tickWorkoutTimer() {
  if (!workoutTimer.running || workoutTimer.completed) return;
  const elapsedMs =
    workoutTimer.elapsedMs + (Date.now() - workoutTimer.startedAt);
  if (elapsedMs >= workoutTimer.durationMs) {
    workoutTimer.elapsedMs = workoutTimer.durationMs;
    workoutTimer.running = false;
    workoutTimer.completed = true;
    workoutTimer.startedAt = null;
    clearInterval(workoutTimer.intervalId);
    workoutTimer.intervalId = null;
    notifyWorkoutTimerCompleted();
  }
  updateWorkoutTimerDisplay();
}
function toggleWorkoutTimer() {
  if (workoutTimer.running) {
    const elapsedMs =
      workoutTimer.elapsedMs + (Date.now() - workoutTimer.startedAt);
    if (elapsedMs >= workoutTimer.durationMs) {
      tickWorkoutTimer();
      return;
    }
    workoutTimer.elapsedMs = elapsedMs;
    workoutTimer.startedAt = null;
    workoutTimer.running = false;
    clearInterval(workoutTimer.intervalId);
    workoutTimer.intervalId = null;
    updateWorkoutTimerDisplay();
    return;
  }
  if (workoutTimer.completed) return;
  if (workoutTimer.durationMs === 0) {
    const exerciseId = document.getElementById("timer-exercise-select").value;
    const minutes = Number(document.getElementById("timer-minutes").value);
    const seconds = Number(document.getElementById("timer-seconds").value);
    if (!exerciseId) {
      showToast("Selecione um exercício");
      return;
    }
    if (
      !Number.isInteger(minutes) ||
      minutes < 0 ||
      minutes > 1439 ||
      !Number.isInteger(seconds) ||
      seconds < 0 ||
      seconds > 59 ||
      minutes * 60 + seconds <= 0
    ) {
      showToast("Informe um tempo entre 1 segundo e 24 horas");
      return;
    }
    workoutTimer.durationMs = (minutes * 60 + seconds) * 1000;
    workoutTimer.exerciseName =
      document.getElementById("timer-exercise-select").selectedOptions[0]
        ?.textContent || "";
  }
  workoutTimer.startedAt = Date.now();
  workoutTimer.running = true;
  workoutTimer.intervalId = setInterval(tickWorkoutTimer, 200);
  updateWorkoutTimerDisplay();
}
function resetWorkoutTimer() {
  clearInterval(workoutTimer.intervalId);
  workoutTimer = {
    intervalId: null,
    durationMs: 0,
    elapsedMs: 0,
    startedAt: null,
    running: false,
    completed: false,
    exerciseName: "",
  };
  updateWorkoutTimerDisplay();
}
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "visible" && workoutTimer.running) {
    tickWorkoutTimer();
  }
});
function openExercisePicker() {
  renderExercisePicker();
  document.getElementById("exercise-picker-overlay").classList.add("show");
}
function renderExercisePicker() {
  const select = document.getElementById("exercise-picker-select");
  const hint = document.getElementById("exercise-picker-hint");
  const addButton = document.getElementById("exercise-picker-add");
  const assignedIds = new Set(
    (state.workouts[activeWorkoutTag] || []).map((exercise) => exercise.id),
  );
  const available = state.predefinedExercises.filter(
    (exercise) => !assignedIds.has(exercise.id),
  );
  select.innerHTML = "";
  available.forEach((exercise) => {
    const option = document.createElement("option");
    option.value = exercise.id;
    option.textContent =
      exercise.name + " · " + exercise.series + "x" + exercise.reps;
    select.appendChild(option);
  });
  const noExercises = state.predefinedExercises.length === 0;
  const allAssigned = !noExercises && available.length === 0;
  if (noExercises || allAssigned) {
    const option = document.createElement("option");
    option.value = "";
    option.textContent = noExercises
      ? "Nenhum exercício cadastrado"
      : "Todos os exercícios já estão neste treino";
    select.appendChild(option);
  }
  select.disabled = available.length === 0;
  addButton.disabled = available.length === 0;
  hint.textContent = noExercises
    ? "Cadastre exercícios no catálogo Pré-definidos antes de adicioná-los ao treino."
    : allAssigned
      ? "Este treino já contém todos os exercícios do catálogo."
      : "Os dados, séries e repetições vêm do catálogo Pré-definidos.";
}
function closeExercisePicker() {
  document.getElementById("exercise-picker-overlay").classList.remove("show");
}
function addPredefinedExerciseToWorkout() {
  const exerciseId = document.getElementById("exercise-picker-select").value;
  const predefined = state.predefinedExercises.find(
    (exercise) => exercise.id === exerciseId,
  );
  if (!predefined) {
    showToast("Selecione um exercício pré-definido");
    return;
  }
  const workout = state.workouts[activeWorkoutTag];
  if (workout.some((exercise) => exercise.id === predefined.id)) {
    showToast("Esse exercício já está neste treino");
    renderExercisePicker();
    return;
  }
  workout.push({ ...predefined });
  saveState();
  renderExerciseList();
  updateHeroCard();
  renderProgressSelect();
  closeExercisePicker();
  showToast(
    predefined.name + " adicionado a " + getWorkoutName(activeWorkoutTag),
  );
}
function getSafeGifUrl(value) {
  if (!value) return "";
  try {
    const url = new URL(value, document.baseURI);
    if (url.protocol !== "https:" && url.protocol !== "http:") return "";
    if (
      ["localhost", "127.0.0.1", "::1"].includes(url.hostname) &&
      url.pathname.startsWith("/videos/")
    ) {
      return new URL(
        url.pathname.slice(1) + url.search + url.hash,
        document.baseURI,
      ).href;
    }
    return url.href;
  } catch (error) {
    return "";
  }
}
function isVideoMediaUrl(value) {
  return /\.(mp4|m4v|webm|ogv|mov)$/i.test(new URL(value).pathname);
}
function renderPredefinedExercises() {
  const container = document.getElementById("predefined-exercise-list");
  if (!container) return;
  container.innerHTML = "";
  if (!state.predefinedExercises.length) {
    const empty = document.createElement("div");
    empty.className = "empty-state";
    empty.textContent =
      "O catálogo está vazio. Toque em “Novo exercício” para começar a cadastrar exercícios.";
    container.appendChild(empty);
    return;
  }
  state.predefinedExercises.forEach((exercise) => {
    const card = document.createElement("article");
    card.className = "predefined-exercise-card";
    const safeUrl = getSafeGifUrl(exercise.gifUrl);
    const isVideo = Boolean(safeUrl && isVideoMediaUrl(safeUrl));
    const preview = document.createElement(isVideo ? "video" : "img");
    preview.className = isVideo
      ? "predefined-exercise-video"
      : "predefined-exercise-gif";
    preview.setAttribute(
      "aria-label",
      (isVideo ? "Vídeo" : "GIF") + " de execução de " + exercise.name,
    );
    if (isVideo) {
      preview.muted = true;
      preview.loop = true;
      preview.autoplay = true;
      preview.playsInline = true;
      preview.preload = "none";
    } else {
      preview.alt = "GIF de execução de " + exercise.name;
      preview.loading = "lazy";
    }
    const gifPlaceholder = document.createElement("div");
    gifPlaceholder.className = "predefined-gif-placeholder";
    gifPlaceholder.textContent = "Mídia do exercício não cadastrada.";
    gifPlaceholder.hidden = Boolean(safeUrl);
    if (safeUrl) {
      preview.onerror = () => {
        preview.hidden = true;
        gifPlaceholder.textContent =
          "Não foi possível carregar a mídia do exercício.";
        gifPlaceholder.hidden = false;
      };
      preview.src = safeUrl;
      preview.hidden = false;
    } else {
      preview.hidden = true;
    }
    const content = document.createElement("div");
    content.className = "predefined-exercise-content";
    const heading = document.createElement("div");
    heading.className = "predefined-exercise-heading";
    const title = document.createElement("div");
    title.className = "exercise-name";
    title.textContent = exercise.name;
    const meta = document.createElement("div");
    meta.className = "exercise-meta";
    meta.textContent = exercise.series + "x" + exercise.reps;
    heading.append(title, meta);
    const description = document.createElement("p");
    description.className = "predefined-exercise-description";
    description.textContent =
      exercise.description || "Adicione uma instrução curta de execução.";
    const actions = document.createElement("div");
    actions.className = "predefined-exercise-actions";
    const editButton = document.createElement("button");
    editButton.type = "button";
    editButton.className = "btn-secondary";
    editButton.textContent = "Editar";
    editButton.onclick = () => openModal("predefined", exercise.id);
    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.className = "catalog-delete-btn";
    deleteButton.textContent = "Excluir do catálogo";
    deleteButton.onclick = () => deletePredefinedExercise(exercise.id);
    actions.append(editButton, deleteButton);
    content.append(heading, description, actions);
    card.append(preview, gifPlaceholder, content);
    container.appendChild(card);
  });
}
function deletePredefinedExercise(id) {
  const exercise = state.predefinedExercises.find((item) => item.id === id);
  if (!exercise) return;
  if (
    !window.confirm(
      "Excluir " +
        exercise.name +
        " do catálogo e de todos os treinos em que foi adicionado?",
    )
  )
    return;
  state.predefinedExercises = state.predefinedExercises.filter(
    (item) => item.id !== id,
  );
  state.workoutOrder.forEach((tag) => {
    state.workouts[tag] = (state.workouts[tag] || []).filter(
      (item) => item.id !== id,
    );
  });
  saveState();
  renderPredefinedExercises();
  renderExerciseList();
  updateHeroCard();
  renderProgressSelect();
  showToast(exercise.name + " removido do catálogo e dos treinos");
}
// ---------- Home ----------
function updateHeroCard() {
  const nextTag = getNextWorkoutTag();
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
    document.getElementById("home-workout-title").textContent =
      getWorkoutName(nextTag);
    const count = (state.workouts[nextTag] || []).length;
    document.getElementById("home-workout-sub").textContent =
      count + (count === 1 ? " exercício" : " exercícios");
    ctaText.textContent = "Iniciar treino";
  }
}
function nextScheduledDayLabel() {
  const todayDow = new Date().getDay();
  for (let i = 1; i <= 7; i++) {
    const dow = (todayDow + i) % 7;
    const tag = state.daySchedule[dow];
    if (tag && state.workoutOrder.includes(tag)) {
      return getWorkoutName(tag) + " · " + WEEKDAYS[dow];
    }
  }
  return null;
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
  const exerciseEntries = state.logs.filter((l) => l.exId === exId);
  const chartContainer = document.getElementById("chart-container");
  const historyContainer = document.getElementById("history-container");

  if (!exerciseEntries.length) {
    chartContainer.innerHTML =
      '<div class="empty-state">Sem registros ainda.<br>Conclua um treino para começar a ver sua evolução.</div>';
    historyContainer.innerHTML = "";
    return;
  }

  const unit = getLogUnit(exerciseEntries[exerciseEntries.length - 1]);
  const entries = exerciseEntries.filter((entry) => getLogUnit(entry) === unit);
  const w = 400,
    h = 140,
    pad = 24;
  const values = entries.map(getLogValue);
  const minValue = Math.min(...values) * 0.9;
  const maxValue = Math.max(...values) * 1.1;
  const range = maxValue - minValue || 1;
  const stepX = entries.length > 1 ? (w - pad * 2) / (entries.length - 1) : 0;

  const points = entries.map((e, i) => {
    const x = pad + i * stepX;
    const y =
      h - pad - ((getLogValue(e) - minValue) / range) * (h - pad * 2);
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
  const unitLabel = unit === "min" ? "min" : "kg";
  document.getElementById("chart-title").textContent =
    unit === "min" ? "Tempo ao longo do tempo (min)" : "Carga ao longo do tempo (kg)";
  const lastLabel = `<text x="${points[points.length - 1][0].toFixed(1)}" y="${(points[points.length - 1][1] - 10).toFixed(1)}" fill="#FFFFFF" font-size="13" font-weight="700" text-anchor="middle" font-family="Inter, sans-serif">${getLogValue(entries[entries.length - 1])}${unitLabel}</text>`;
    // Renderiza o gráfico de evolução com SVG
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
    <tr><td>${formatDate(e.date)}</td><td>${escapeHtml(getWorkoutName(e.workout))}</td><td style="text-align:right;font-weight:700;">${getLogValue(e)} ${unitLabel}</td></tr>
  `,
    )
    .join("");
  historyContainer.innerHTML = `
    <table class="history-table">
      <thead><tr><th>Data</th><th>Treino</th><th style="text-align:right;">${unit === "min" ? "Tempo" : "Carga"}</th></tr></thead>
      <tbody>${rows}</tbody>
    </table>
  `;
}

// Esse model guarda o estado do modal aberto, para que a função saveModal saiba o que salvar.
let modalState = { type: null, id: null, workoutTag: null };
let tempDaySchedule = {};
function openModal(type, id, workoutTag) { // tipos incluem pré-treino, exercício pré-definido, tipo de treino e programação semanal
  modalState = { type, id, workoutTag };
  const isEdit = !!id;
  document.getElementById("field-name-group").style.display = // esconde o campo de nome se for modal de dias da semana
    type === "weekdays" ? "none" : "block";
  document.getElementById("field-time-group").style.display =
    type === "pretreino" ? "block" : "none";
  document.getElementById("field-detail-group").style.display =
    type === "pretreino" ? "block" : "none";
  document.getElementById("field-exercise-row").style.display =
    type === "predefined" ? "flex" : "none";
  document.getElementById("field-gif-group").style.display =
    type === "predefined" ? "block" : "none";
  document.getElementById("field-description-group").style.display =
    type === "predefined" ? "block" : "none";
  document.getElementById("field-weekdays-group").style.display =
    type === "weekdays" ? "block" : "none";
  document.getElementById("field-gif-url").value = "";
  document.getElementById("field-description").value = "";
  document.getElementById("field-series").value = "";
  document.getElementById("field-reps").value = "";
  document.getElementById("field-name-label").textContent =
    type === "predefined"
      ? "Nome do exercício"
      : type === "workoutType"
        ? "Nome do tipo de treino"
        : "Nome";
  document.getElementById("modal-delete-btn").style.display =
    isEdit && (type === "pretreino" || type === "predefined")
      ? "block"
      : "none";

  if (type === "workoutType") {
    const workoutName = isEdit ? getWorkoutName(id) : "";
    document.getElementById("modal-title").textContent = isEdit
      ? "Editar tipo de treino"
      : "Novo tipo de treino";
    document.getElementById("field-name").value = workoutName;
    document.getElementById("field-name").placeholder = "Ex: Treino superior";
  } else if (type === "pretreino") {
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
  } else if (type === "predefined") {
    document.getElementById("modal-title").textContent = isEdit
      ? "Editar exercício pré-definido"
      : "Novo exercício pré-definido";
    const item = isEdit
      ? state.predefinedExercises.find((exercise) => exercise.id === id)
      : null;
    document.getElementById("field-name").value = item ? item.name : "";
    document.getElementById("field-series").value = item ? item.series : 3;
    document.getElementById("field-reps").value = item ? item.reps : "";
    document.getElementById("field-gif-url").value = item
      ? item.gifUrl || ""
      : "";
    document.getElementById("field-description").value = item
      ? item.description || ""
      : "";
    document.getElementById("field-name").placeholder =
      "Ex: Supino reto com barra";
  } else if (type === "weekdays") {
    document.getElementById("modal-title").textContent = "Treino de cada dia";
    tempDaySchedule = JSON.parse(JSON.stringify(state.daySchedule));
    renderDaySchedulePicker();
  }
  document.getElementById("modal-overlay").classList.add("show");
}
function openWeekdaysModal() {
  openModal("weekdays", null, null);
}
function renderDaySchedulePicker() {
  // Apenas desenha a grade a partir de tempDaySchedule — não reseta o valor
  // (o reset a partir de state.daySchedule acontece só ao abrir o modal, em openModal).
  const grid = document.getElementById("day-toggle-grid");
  grid.innerHTML = "";
  WEEKDAYS.forEach((label, dow) => {
    const el = document.createElement("div");
    const tag = tempDaySchedule[dow];
    el.className = "day-toggle" + (tag ? " " + tagParityClass(tag) : "");
    el.innerHTML = `<div class="dt-dow">${label}</div><div class="dt-tag">${tag ? escapeHtml(getWorkoutName(tag)) : "—"}</div>`;
    el.onclick = () => {
      const order = state.workoutOrder;
      const currentIdx = tag ? order.indexOf(tempDaySchedule[dow]) : -1;
      const nextIdx = currentIdx + 1;
      tempDaySchedule[dow] = nextIdx < order.length ? order[nextIdx] : null;
      renderDaySchedulePicker();
    };
    grid.appendChild(el);
  });
}
function closeModal() {
  document.getElementById("modal-overlay").classList.remove("show");
}
function saveModal() {
  const { type, id } = modalState;

  if (type === "weekdays") {
    state.daySchedule = tempDaySchedule;
    saveState();
    renderWeekGrid();
    renderHome();
    closeModal();
    showToast("Dias de treino atualizados");
    return;
  }

  const name = document.getElementById("field-name").value.trim();
  if (!name) {
    showToast("Digite um nome para continuar");
    return;
  }

  if (type === "workoutType") {
    const normalizedName = name.toLocaleLowerCase("pt-BR");
    const duplicateName = state.workoutOrder.some(
      (tag) =>
        tag !== id &&
        getWorkoutName(tag).toLocaleLowerCase("pt-BR") === normalizedName,
    );
    if (duplicateName) {
      showToast("Esse tipo de treino já existe");
      return;
    }
    let workoutTag = id;
    if (id) {
      state.workoutNames[id] = name;
    } else {
      workoutTag = generateId();
      state.workouts[workoutTag] = [];
      state.workoutNames[workoutTag] = name;
      state.workoutOrder.push(workoutTag);
      activeWorkoutTag = workoutTag;
    }
    saveState();
    renderTabs();
    renderExerciseList();
    updateHeroCard();
    renderWeekGrid();
    renderProgressSelect();
    closeModal();
    showToast(id ? "Tipo de treino atualizado" : "Tipo de treino criado");
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
  } else if (type === "predefined") {
    const series = Number(document.getElementById("field-series").value);
    const reps = document.getElementById("field-reps").value.trim();
    const gifUrlValue = document.getElementById("field-gif-url").value.trim();
    const gifUrl = getSafeGifUrl(gifUrlValue);
    const description = document
      .getElementById("field-description")
      .value.trim();
    if (!Number.isInteger(series) || series < 1) {
      showToast("Informe pelo menos 1 série");
      return;
    }
    if (!reps) {
      showToast("Informe as repetições");
      return;
    }
    if (gifUrlValue && !gifUrl) {
      showToast("Informe uma URL de GIF válida usando http ou https");
      return;
    }
    if (id) {
      const item = state.predefinedExercises.find(
        (exercise) => exercise.id === id,
      );
      if (!item) {
        showToast("Esse exercício não está mais no catálogo");
        closeModal();
        return;
      }
      Object.assign(item, { name, series, reps, gifUrl, description });
      state.workoutOrder.forEach((tag) => {
        state.workouts[tag] = (state.workouts[tag] || []).map((exercise) =>
          exercise.id === id ? { ...item } : exercise,
        );
      });
    } else {
      const newExercise = {
        id: generateId(),
        name,
        series,
        reps,
        gifUrl,
        description,
      };
      state.predefinedExercises.push(newExercise);
    }
    saveState();
    renderPredefinedExercises();
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
  } else if (type === "predefined") {
    deletePredefinedExercise(id);
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
renderPredefinedExercises();
renderProgressSelect();
initUsageCounter();
