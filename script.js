// ---------------- Backend URL ----------------
// Option 1 (simple – recommended for now)
const API_BASE_URL = "https://new-backend-5dc3.onrender.com";

// Option 2 (Vercel env var – advanced)
// const API_BASE_URL = import.meta.env.VITE_API_URL;


// ---------------- Chapters ----------------
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

// ---------------- DOM Elements ----------------
const subjectSelect = document.getElementById("subject");
const chapterSelect = document.getElementById("chapter");
const questionInput = document.getElementById("question");
const askBtn = document.getElementById("ask");
const chat = document.getElementById("chat");

// ---------------- Update Chapters ----------------
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

// ---------------- Ask Question ----------------
async function askQuestion() {
    const question = questionInput.value.trim();
    if (!question) return;

    const subject = subjectSelect.value;
    const chapter = chapterSelect.value;

    // Add user message
    addMessage("user", question);

    // Reset input
    questionInput.value = "";
    askBtn.disabled = true;
    askBtn.textContent = "ఆలోచిస్తోంది...";

    try {
        const response = await fetch(`${API_BASE_URL}/api/ask`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                class_level: "10",
                subject,
                chapter,
                question
            })
        });

        // ✅ Read response ONLY ONCE
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.detail || "Server error");
        }

        addMessage("ai", data.answer, data.meta || null);

    } catch (error) {
        console.error("❌ API Error:", error);
        addMessage("ai", "⚠️ Server error. Please try again.");
    } finally {
        askBtn.disabled = false;
        askBtn.textContent = "ప్రశ్న విసురు / Ask";
    }
}

// ---------------- Add Message ----------------
function addMessage(sender, text, meta = null) {
    const div = document.createElement("div");
    div.className = `message ${sender}`;

    // AI message with safe meta handling
    if (
        sender === "ai" &&
        meta &&
        meta.subject &&
        meta.chapter
    ) {
        div.innerHTML = `
            <div class="meta">${meta.subject} • ${meta.chapter}</div>
            <div class="text">${formatAIText(text)}</div>
        `;
    } else {
        div.innerHTML = `
            <div class="text">${formatAIText(text)}</div>
        `;
    }

    chat.appendChild(div);
    chat.scrollTop = chat.scrollHeight;
}

// ---------------- Format AI Text ----------------
// Converts line breaks into paragraphs for clean spacing
function formatAIText(text) {
    if (!text) return "";

    return text
        .split("\n\n")
        .map(p => `<p>${p.trim()}</p>`)
        .join("");
}

// ---------------- Events ----------------
askBtn.addEventListener("click", askQuestion);

questionInput.addEventListener("keydown", e => {
    if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        askQuestion();
    }
});
