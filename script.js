// ---------------- Backend URL ----------------
const API_BASE_URL = "https://new-backend-5dc3.onrender.com";

// ---------------- DOM Elements ----------------
const subjectSelect = document.getElementById("subject");
const chapterSelect = document.getElementById("chapter");
const questionInput = document.getElementById("question");
const askBtn = document.getElementById("ask");
const chat = document.getElementById("chat");

const fileInput = document.getElementById("file-upload");
const previewContainer = document.getElementById("image-preview");

// ---------------- Chapters ----------------
const CHAPTERS = {
    Telugu: [
        "Supplementary Reader",
        "Grammar (వ్యాకరణం)",
        "Reading Comprehension",
        "Writing Skills"
    ],

    English: [
        "Supplementary Reader",
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
        "Grammar"
    ],

    Hindi: [
        "सूरदास के पद",
        "राम-लक्ष्मण-परशुराम संवाद",
        "आत्मकथ्य",
        "उत्साह",
        "अट नहीं रही है",
        "तोप",
        "कर चले हम फ़िदा",
        "आत्मत्राण",
        "माता का आँचल",
        "जॉर्ज पंचम की नाक",
        "साना-साना हाथ जोड़ि",
        "एही ठैयाँ झुलनी हेरानी हो राम!",
        "मैं क्यों लिखता हूँ",
        "व्याकरण"
    ],

    Mathematics: [
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

    Science: [
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

    "Social Studies": [
        "The Rise of Nationalism in Europe",
        "Nationalism in India",
        "The Making of a Global World",
        "The Age of Industrialisation",
        "Print Culture and the Modern World",
        "Resources and Development",
        "Forest and Wildlife Resources",
        "Water Resources",
        "Agriculture",
        "Minerals and Energy Resources",
        "Manufacturing Industries",
        "Lifelines of National Economy",
        "Power Sharing",
        "Federalism",
        "Democracy and Diversity",
        "Gender, Religion and Caste",
        "Popular Struggles and Movements",
        "Political Parties",
        "Outcomes of Democracy",
        "Development",
        "Sectors of the Indian Economy",
        "Money and Credit",
        "Globalisation and the Indian Economy",
        "Consumer Rights"
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
updateChapters();

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

// ---------------- Image Preview ----------------
fileInput.addEventListener("change", () => {
    previewContainer.innerHTML = "";

    const file = fileInput.files[0];
    if (!file || !file.type.startsWith("image/")) return;

    const reader = new FileReader();
    reader.onload = () => {
        const div = document.createElement("div");
        div.className = "preview-item";

        div.innerHTML = `
            <img src="${reader.result}" />
            <span class="remove-img">×</span>
        `;

        div.querySelector(".remove-img").onclick = () => {
            div.remove();
            fileInput.value = "";
        };

        previewContainer.appendChild(div);
    };

    reader.readAsDataURL(file);
});

// ---------------- Ask Question (TEXT / IMAGE / BOTH) ----------------
async function askQuestion() {
    const question = questionInput.value.trim();
    const file = fileInput.files[0];

    if (!question && !file) return;

    const subject = subjectSelect.value;
    const chapter = chapterSelect.value;

    addMessage("user", question || "📷 Image uploaded");

    questionInput.value = "";
    askBtn.disabled = true;
    askBtn.textContent = "ఆలోచిస్తోంది...";

    try {
        const formData = new FormData();
        formData.append("class_level", "10");
        formData.append("subject", subject);
        formData.append("chapter", chapter);
        formData.append("question", question || "");

        if (file) {
            formData.append("image", file);
        }

        const response = await fetch(`${API_BASE_URL}/api/ask`, {
            method: "POST",
            body: formData
        });

        if (!response.ok) {
            const err = await response.json();
            throw new Error(err.detail || "Server error");
        }

        const data = await response.json();
        addMessage("ai", data.answer, data.meta);

        previewContainer.innerHTML = "";
        fileInput.value = "";

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
