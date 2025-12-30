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
    const CHAPTERS = {

    "English": [
        // First Flight (Prose)
        "A Letter to God",
        "Nelson Mandela: Long Walk to Freedom",
        "Two Stories about Flying",
        "From the Diary of Anne Frank",
        "The Hundred Dresses – I",
        "The Hundred Dresses – II",
        "Glimpses of India",
        "Mijbil the Otter",
        "Madam Rides the Bus",
        "The Sermon at Benares",
        "The Proposal",

        // Poetry
        "Dust of Snow",
        "Fire and Ice",
        "A Tiger in the Zoo",
        "How to Tell Wild Animals",
        "The Ball Poem",
        "Amanda!",
        "Animals",
        "The Trees",
        "Fog",
        "The Tale of Custard the Dragon",
        "For Anne Gregory",

        // Grammar
        "Grammar"
    ],

    "Hindi": [
        // Kshitij
        "सूरदास के पद",
        "राम-लक्ष्मण-परशुराम संवाद",
        "आत्मकथ्य",
        "उत्साह",
        "अट नहीं रही है",
        "तोप",
        "कर चले हम फ़िदा",
        "आत्मत्राण",

        // Kritika
        "माता का आँचल",
        "जॉर्ज पंचम की नाक",
        "साना-साना हाथ जोड़ि",
        "एही ठैयाँ झुलनी हेरानी हो राम!",
        "मैं क्यों लिखता हूँ",

        // Grammar
        "व्याकरण"
    ],

    "Mathematics": [
        "Real Numbers",
        "Polynomials",
        "Pair of Linear Equations in Two Variables",
        "Quadratic Equations",
        "Arithmetic Progressions",
        "Triangles",
        "Coordinate Geometry",
        "Trigonometry",
        "Applications of Trigonometry",
        "Circles",
        "Constructions",
        "Areas Related to Circles",
        "Surface Areas and Volumes",
        "Statistics",
        "Probability"
    ],

    "Science": [
        "Chemical Reactions and Equations",
        "Acids, Bases and Salts",
        "Metals and Non-metals",
        "Carbon and its Compounds",
        "Life Processes",
        "Control and Coordination",
        "How do Organisms Reproduce",
        "Heredity and Evolution",
        "Light – Reflection and Refraction",
        "The Human Eye and the Colourful World",
        "Electricity",
        "Magnetic Effects of Electric Current",
        "Our Environment",
        "Management of Natural Resources"
    ],

    "Social Science": [
        // History
        "The Rise of Nationalism in Europe",
        "Nationalism in India",
        "The Making of a Global World",
        "The Age of Industrialisation",
        "Print Culture and the Modern World",

        // Geography
        "Resources and Development",
        "Forest and Wildlife Resources",
        "Water Resources",
        "Agriculture",
        "Minerals and Energy Resources",
        "Manufacturing Industries",
        "Lifelines of National Economy",

        // Civics
        "Power Sharing",
        "Federalism",
        "Democracy and Diversity",
        "Gender, Religion and Caste",
        "Popular Struggles and Movements",
        "Political Parties",
        "Outcomes of Democracy",

        // Economics
        "Development",
        "Sectors of the Indian Economy",
        "Money and Credit",
        "Globalisation and the Indian Economy",
        "Consumer Rights"
    ],

        "Telugu": [
    "Supplementary Reader",
    "Grammar (వ్యాకరణం)",
    "Reading Comprehension",
    "Writing Skills"
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





