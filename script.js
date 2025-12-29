// Backend URL (Render)
const backendBaseUrl = "https://new-backend-5dc3.onrender.com";

// DOM elements (chat UI)
const classLevelSelect = document.getElementById("classLevel");
const subjectSelect = document.getElementById("subject");
const chapterSelect = document.getElementById("chapter");
const questionInput = document.getElementById("questionInput");
const sendBtn = document.getElementById("sendBtn");
const chatWindow = document.getElementById("chatWindow");

// Optional: simple form elements (if you still have a basic form)
const questionForm = document.getElementById("questionForm");
const responseDiv = document.getElementById("response");

// Same chapter lists as backend
const CHAPTERS = {
    "Telugu": ["కథలు", "కవిత్వం", "వ్యాకరణం"],
    "English": ["Prose", "Poetry", "Grammar"],
    "Hindi": ["गद्य", "पद्य", "వ్యాకరణ"],
    "Mathematics": ["Real Numbers", "Polynomials", "Quadratic Equations", "Triangles"],
    "Science": [
        "Chemical Reactions",
        "Life Processes",
        "Control & Coordination",
        "Light (Reflection & Refraction, Human Eye)",
        "Electricity (Current, Potential, Circuits)",
        "Magnetic Effects of Electric Current",
        "Sources of Energy"
    ],
    "Social Studies": [
        "Nationalism in India",
        "Industrialization",
        "Citizenship"
    ]
};

function populateChapters() {
  const subject = subjectSelect.value;
  chapterSelect.innerHTML = "";
  CHAPTERS[subject].forEach(ch => {
    const opt = document.createElement("option");
    opt.value = ch;
    opt.textContent = ch;
    chapterSelect.appendChild(opt);
  });
}

subjectSelect.addEventListener("change", populateChapters);
// Initial population
populateChapters();

function appendMessage(role, text, meta) {
  const row = document.createElement("div");
  row.classList.add("message-row", role);

  const bubble = document.createElement("div");
  bubble.classList.add("message-bubble");

  if (role === "bot" && meta) {
    const metaDiv = document.createElement("div");
    metaDiv.classList.add("meta-text");
    metaDiv.textContent = `${meta.class_level} • ${meta.subject} • ${meta.chapter}`;
    bubble.appendChild(metaDiv);
  }

  const p = document.createElement("div");
  p.innerText = text;
  bubble.appendChild(p);

  row.appendChild(bubble);
  chatWindow.appendChild(row);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

async function sendQuestion() {
  const question = questionInput.value.trim();
  if (!question) return;

  const classLevel = classLevelSelect.value;
  const subject = subjectSelect.value;
  const chapter = chapterSelect.value;

  // User message
  appendMessage("user", question);

  // Clear input & disable while waiting
  questionInput.value = "";
  questionInput.disabled = true;
  sendBtn.disabled = true;
  sendBtn.textContent = "Thinking...";

  try {
    const response = await fetch(`${backendBaseUrl}/api/ask`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        class_level: classLevel,
        subject: subject,
        chapter: chapter,
        question: question
      })
    });

    if (!response.ok) {
      let errMsg = "Something went wrong.";
      try {
        const errData = await response.json();
        if (errData.detail) errMsg = errData.detail;
      } catch (_) {}
      appendMessage("bot", `Error: ${errMsg}`);
      if (responseDiv) responseDiv.innerText = `Error: ${errMsg}`;
    } else {
      const data = await response.json();
      appendMessage("bot", data.answer, data.meta);
      if (responseDiv) responseDiv.innerText = data.answer || "No answer.";
    }
  } catch (err) {
    console.error(err);
    appendMessage("bot", "Network error. Please try again.");
    if (responseDiv) responseDiv.innerText = "Error contacting server. Please try again.";
  } finally {
    questionInput.disabled = false;
    sendBtn.disabled = false;
    sendBtn.textContent = "Ask";
    questionInput.focus();
  }
}

// Chat UI events
sendBtn.addEventListener("click", sendQuestion);
questionInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    sendQuestion();
  }
});

// Optional: support a simple form submit (if present)
if (questionForm) {
  questionForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    // Reuse the chat sendQuestion logic
    await sendQuestion();
  });
}

