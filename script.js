// ---------------- Backend URL ----------------
const API_BASE_URL = "https://new-backend-5dc3.onrender.com";

// ---------------- DOM Elements (MATCH HTML) ----------------
const subjectSelect = document.getElementById("subject");
const chapterSelect = document.getElementById("chapter");
const questionInput = document.getElementById("question");
const askBtn = document.getElementById("ask");
const chat = document.getElementById("chat");

// ---------------- Chapters (MUST MATCH BACKEND) ----------------
const CHAPTERS = {
    "Telugu": ["కథలు", "కవిత్వం", "వ్యాకరణం"],
    "English": ["Prose", "Poetry", "Grammar"],
    "Hindi": ["गद्य", "पद्य", "వ్యాకరణ"],
    "Mathematics": [
        "Real Numbers",
        "Polynomials",
        "Quadratic Equations",
        "Triangles"
    ],
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

// ---------------- Populate Chapters ----------------
function updateChapters() {
    const subject = subjectSelect.value;
    chapterSelect.innerHTML = "";

    if (!CHAPTERS[subject]) return;

    CHAPTERS[subject].forEach(ch => {
        const option = document.createElement("option");
        option.value = ch;
        option.textContent = ch;
        chapterSelect.appendChild(option);
    });
}

subjectSelect.addEventListener("change", updateChapters);
updateChapters(); // initial load

// ---------------- Add Message ----------------
function addMessage(sender, text, meta = null) {
    const div = document.createElement("div");
    div.className = `message ${sender}`;

    if (sender === "ai" && meta) {
        div.innerHTML = `
            <div class="meta">
                ${meta.class_level} • ${meta.subject} • ${meta.chapter}
            </div>
            <div class="text">${text}</div>
        `;
    } else {
        div.innerHTML = `<div class="text">${text}</div>`;
    }

    chat.appendChild(div);
    chat.scrollTop = chat.scrollHeight;
}

// ---------------- Ask Question ----------------
async function askQuestion() {
    const question = questionInput.value.trim();
    if (!question) return;

    const subject = subjectSelect.value;
    const chapter = chapterSelect.value;

    // User message
    addMessage("user", question);

    // Reset input
    questionInput.value = "";
    askBtn.disabled = true;
    askBtn.textContent = "ఆలోచిస్తోంది...";

    try {
        const response = await fetch(`${API_BASE_URL}/api/ask`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Cache-Control": "no-store"
            },
            body: JSON.stringify({
                class_level: "10",
                subject,
                chapter,
                question
            })
        });

        if (!response.ok) {
            const err = await response.json();
            throw new Error(err.detail || "Server error");
        }

        const data = await response.json();
        addMessage("ai", data.answer, data.meta);

    } catch (error) {
        console.error(error);
        addMessage("ai", "⚠️ Server error. Please try again.");
    } finally {
        askBtn.disabled = false;
        askBtn.textContent = "ప్రశ్న విసురు / Ask";
    }
}

// ---------------- Events ----------------
askBtn.addEventListener("click", askQuestion);

questionInput.addEventListener("keydown", e => {
    if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        askQuestion();
    }
});
