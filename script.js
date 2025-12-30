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
    "Telugu": ["దేశభక్తిు", 
               "సత్యం", 
               "మన సంస్కృతి",
               "జగదీశ చంద్రబోస్",
               "మానవతా విలువలు",
               "అతిథి దేవోభవ",
               "దేశగౌరవం",
               "మాతృభాష",
               "శాంతి సందేశం",
               "జాతీయ గీతం",
               "మన జీవన లక్ష్యం",
               "వ్యాకరణం"],
    
    "English": ["A Reading Lesson", 
                "Attitude is Altitude", 
                "Every Success Story is also a Story of Great Failure",
                "Mahatma Gandhi – Pusher of Salt Satyagraha",
                "The Journey",
                "Another Woman",
                "Jagadish Chandra Bose",
                "The Never–Never Nest",
                "My Childhood",
                "Where the Mind is Without Fear",
                "The Song of the Rain",
                "Once Upon a Time",
                "Not Just a Teacher, but a Friend",
                "The Tale of Custard the Dragon",
                "Grammar"
                
               ],
    
    "Hindi": ["ईदगाह", 
              "नेताजी का चश्माय", 
              "डायरी का एक पन्ना",
              "अपना-अपना भाग्य",
              "संकल्प शक्ति",
              "सूरदास के पद",
              "रहीम के दोहे",
              "कबीर के दोहे",
              "देशप्रेम",
              "मेघ आए",
              "व्याकरण"],
    
    "Mathematics": [
        "Real numbers",
        "Sets",
        "Polynomials",
        "Pair of Linear Equations in Two Variables",
        "Quadratic Equations",
        "Arithmetic Progressions",
        "Coordinate Geometry",
        "Similar Triangles",
        "Mensuration",
        "Probability",
        "Statistics",
        "Trigonometry and applications",
        "Circle geometry & tangents"
        ],
    
    "Science": [
        "Heat and Temperature",
        "Human Eye & Colourful World",
        "Light: Reflection & Refraction",
        "Electric Current and Magnetism",
        "Classification of Elements (Periodic Table)",
        "Chemical Reactions",
        "Acids, Bases & Salts",
        "Carbon & its Compounds",
        "Nutrition",
        "Respiration",
        "Transportation",
        "Excretion",
        "Coordination in Plants & Animals",
        "Reproduction",
        "Heredity",
        "Environment & Natural Resources"
         ],
    
    "Social Studies": [
        "World between wars",
        "National liberation movements",
        "National movement in India",
        "Making of independent India’s constitution",
        "Post-independence politics",
        "Relief features of India",
        "Climate",
        "People & Migration",
        "Food security",
        "Sustainable development",
        "Citizen and government (Civics)",
        
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



