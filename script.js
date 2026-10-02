// ---------- Quotes ----------
const QUOTES = [
  "Small steps every day add up to big results.",
  "Start where you are, use what you have, do what you can.",
  "You don't have to be perfect to make progress.",
  "One finished task beats ten perfect plans.",
  "Focus on the next right thing.",
  "Done is better than perfect.",
  "Progress, not perfection.",
  "The secret of getting ahead is getting started.",
  "Today's effort is tomorrow's momentum.",
  "Discipline is choosing what you want most over what you want now.",
  "Take it one task at a time, and keep going.",
  "Every checkmark is a small victory. Collect them."
];
let lastQuote = -1;
function showQuote(){
  let i;
  do { i = Math.floor(Math.random() * QUOTES.length); } while (i === lastQuote && QUOTES.length > 1);
  lastQuote = i;
  document.getElementById("quote").textContent = QUOTES[i];
}

// ---------- Storage (guarded) ----------
function load(key, fallback){
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; }
  catch (e) { return fallback; }
}
function save(key, val){
  try { localStorage.setItem(key, JSON.stringify(val)); } catch (e) {}
}

// ---------- State ----------
let tasks = load("todo:tasks", []);
const root = document.documentElement;
const themeBtn = document.getElementById("theme");

// ---------- Theme ----------
function currentTheme(){
  const set = root.getAttribute("data-theme");
  if (set) return set;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}
function applyTheme(t){
  root.setAttribute("data-theme", t);
  themeBtn.textContent = t === "dark" ? "Light mode" : "Dark mode";
}
const savedTheme = load("todo:theme", null);
applyTheme(savedTheme || currentTheme());
themeBtn.addEventListener("click", () => {
  const next = currentTheme() === "dark" ? "light" : "dark";
  applyTheme(next);
  save("todo:theme", next);
});

// ---------- Rendering ----------
const list = document.getElementById("list");
const count = document.getElementById("count");
const trashIcon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14M10 11v6M14 11v6"/></svg>';

function render(){
  list.innerHTML = "";
  const open = tasks.filter(t => !t.done).length;
  count.textContent = tasks.length ? open + " of " + tasks.length + " left to do" : "";
  if (!tasks.length){
    const p = document.createElement("li");
    p.className = "empty";
    p.style.cssText = "display:block;border:0;background:none";
    p.textContent = "No tasks yet. Add your first one above.";
    list.appendChild(p);
    return;
  }
  tasks.forEach(t => {
    const li = document.createElement("li");
    if (t.done) li.className = "done";

    const text = document.createElement("span");
    text.textContent = t.text;

    const fin = document.createElement("button");
    fin.className = "finish";
    fin.textContent = t.done ? "Finished" : "Finish";
    fin.addEventListener("click", () => toggle(t.id));

    const del = document.createElement("button");
    del.className = "del";
    del.setAttribute("aria-label", "Delete task: " + t.text);
    del.innerHTML = trashIcon;
    del.addEventListener("click", () => remove(t.id));

    li.append(text, fin, del);
    list.appendChild(li);
  });
}

// ---------- Actions ----------
function addTask(){
  const input = document.getElementById("input");
  const text = input.value.trim();
  if (!text) { input.focus(); return; }
  tasks.unshift({ id: Date.now() + Math.random(), text, done: false });
  input.value = "";
  save("todo:tasks", tasks);
  render(); showQuote();
}
function toggle(id){
  const t = tasks.find(x => x.id === id);
  if (t) t.done = !t.done;
  save("todo:tasks", tasks);
  render();
  if (t && t.done) showQuote();
}
function remove(id){
  tasks = tasks.filter(x => x.id !== id);
  save("todo:tasks", tasks);
  render();
}

document.getElementById("addBtn").addEventListener("click", addTask);
document.getElementById("input").addEventListener("keydown", e => { if (e.key === "Enter") addTask(); });

showQuote();
render();
