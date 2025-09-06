// DOM Elements (with null checks)
const select = document.querySelector(".select-heading");
const arrow = document.querySelector(".select-heading img");
const options = document.querySelector(".options");
const option = document.querySelectorAll(".option");
const selecttext = document.querySelector(".select-heading span");

// Dropdown Toggle
if (select && options && arrow) {
    select.addEventListener("click", () => {
        options.classList.toggle("active-options");
        arrow.classList.toggle("rotate");
    });
}

// Update dropdown text
option.forEach(item => {
    item.addEventListener("click", () => {
        if (selecttext) selecttext.innerText = item.innerText;
    });
});

// Chatbot Toggle
const chatimg = document.getElementById("chatbotimg");
const chatbox = document.getElementById("chatbox");

if (chatimg && chatbox) {
    chatimg.addEventListener("click", () => {
        chatbox.classList.toggle("active-chat-box");
        chatimg.src = chatbox.classList.contains("active-chat-box") ? "cross.svg" : "chatbot.svg";
    });
}

// Chat Functionality
const prompt = document.querySelector(".prompt");
const chatbtn = document.querySelector(".input-area button");
const chatContainer = document.querySelector(".chat-container");
const h1 = document.querySelector(".h1");
let userMessage = "";

// ✅ CORRECTED API URL (no space!)
const API_KEY = "AIzaSyDU9qKh8L6dUevMktD6ebtuvjMfo5zZeDM"; // ← Replace with your real key
const Api_url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

function scrollToBottom() {
    if (chatContainer) chatContainer.scrollTop = chatContainer.scrollHeight;
}

async function generateApiResponse(aiChatBox, userMessage) {
    const textElement = aiChatBox.querySelector(".text");

    try {
        const response = await fetch(Api_url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ role: "user", parts: [{ text: userMessage }] }],
            }),
        });

        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        const data = await response.json();
        const apiResponse =
            data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ||
            "I'm not sure how to answer that. Can you rephrase?";

        textElement.innerText = apiResponse;
    } catch (error) {
        console.error("API Error:", error);
        textElement.innerText = "❌ Failed to connect to AI. Check internet or API key.";
    } finally {
        aiChatBox.querySelector(".loading").style.display = "none";
        scrollToBottom();
    }
}

function createChatBox(html, className) {
    const div = document.createElement("div");
    div.className = className;
    div.innerHTML = html;
    return div;
}

function showLoading(userMessage) {
    const html = `<p class="text">...</p><img src="load.gif" class="loading" />`;
    const aiChatBox = createChatBox(html, "ai-chat-box");
    chatContainer.appendChild(aiChatBox);
    generateApiResponse(aiChatBox, userMessage);
    scrollToBottom();
}

function sendMessage() {
    userMessage = prompt?.value.trim();
    if (!userMessage) return;

    const userHtml = `<p class="text"></p>`;
    const userChatbox = createChatBox(userHtml, "user-chat-box");
    userChatbox.querySelector(".text").innerText = userMessage;
    chatContainer.appendChild(userChatbox);

    h1.style.display = "none";
    prompt.value = "";
    scrollToBottom();

    setTimeout(() => showLoading(userMessage), 600);
}

// Send on button click or Enter
chatbtn?.addEventListener("click", sendMessage);
prompt?.addEventListener("keydown", e => {
    if (e.key === "Enter") {
        e.preventDefault();
        sendMessage();
    }
});

// 🎙️ Voice Assistant
const ai = document.querySelector(".virtual-assistant img");
const speakpage = document.querySelector(".speak-page");
const content = document.querySelector(".speak-page h1");

function speak(text) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1;
    utterance.pitch = 1.2;
    utterance.volume = 1;
    utterance.lang = "en-GB";
    window.speechSynthesis.speak(utterance);
}

// Safe Speech Recognition
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
let recognition;

if (SpeechRecognition) {
    recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognition.onstart = () => {
        console.log("🎙️ Voice recognition started");
    };

    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript.toLowerCase();
        content.innerText = transcript;
        speakpage.style.display = "none";
        takeCommand(transcript);
    };

    recognition.onerror = (event) => {
        speakpage.style.display = "none";
        alert("🎤 Error: " + event.error + ". Try again.");
    };
} else {
    console.warn("⚠️ Browser does not support Speech Recognition");
}

function takeCommand(message) {
    if (message.includes("open chat")) {
        speak("Opening chat");
        chatbox.classList.add("active-chat-box");
        chatimg.src = "cross.svg";
    } else if (message.includes("closing chat")) {
        speak("Closing chat, sir.");
        chatbox.classList.remove("active-chat-box");
        chatimg.src = "chatbot.svg";
    } else if (message.includes("open home")) {
        speak("Opening home page.");
        window.location.href = "index.html";
    } else if (message.includes("open calculator") || message.includes("bmi")) {
        speak("Opening BMI calculator.");
        openBmiCalculator();
    } else {
        speak("Try saying 'open chat' or 'calculate BMI'.");
    }
}

ai?.addEventListener("click", () => {
    if (recognition) {
        recognition.start();
        speakpage.style.display = "flex";
    } else {
        alert("Your browser doesn't support voice commands. Use Chrome.");
    }
});

// BMI Calculator
const bmiModal = document.getElementById("bmiModal");
const closeBmi = document.getElementById("closeBmi");
const cancelBmi = document.getElementById("cancelBmi");
const bmiForm = document.getElementById("bmiForm");
const resultDiv = document.getElementById("result");
const openBmiBtn = document.getElementById("openBmiBtn");

function openBmiCalculator() {
    bmiModal.style.display = "flex";
}

openBmiBtn?.addEventListener("click", openBmiCalculator);
closeBmi?.addEventListener("click", () => { bmiModal.style.display = "none"; });
cancelBmi?.addEventListener("click", () => { bmiModal.style.display = "none"; });

bmiForm?.addEventListener("submit", function (e) {
    e.preventDefault();
    const name = document.getElementById("name").value;
    const weight = parseFloat(document.getElementById("weight").value);
    const height = parseFloat(document.getElementById("height").value) / 100;
    const birthDate = new Date(document.getElementById("birthDate").value);
    const today = new Date();

    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) age--;

    const bmi = (weight / (height * height)).toFixed(2);
    let category, diet;
    if (bmi < 18.5) {
        category = "Underweight";
        diet = "Eat more calories with healthy fats, proteins, and carbs.";
    } else if (bmi >= 18.5 && bmi < 24.9) {
        category = "Normal weight";
        diet = "Balanced diet: fruits, veggies, lean proteins, hydration.";
    } else if (bmi >= 25 && bmi < 29.9) {
        category = "Overweight";
        diet = "Reduce sugar, increase fiber, drink water, exercise.";
    } else {
        category = "Obese";
        diet = "Consult a nutritionist. Focus on portion control.";
    }

    document.getElementById("resultName").textContent = name;
    document.getElementById("resultAge").textContent = age;
    document.getElementById("resultBmi").textContent = bmi;
    document.getElementById("bmiCategory").textContent = category;
    document.getElementById("dietPlan").textContent = diet;
    resultDiv.style.display = "block";
});

// Calendar
const calendarBtn = document.getElementById("calendarBtn");
const calendarModal = document.getElementById("calendarModal");
const closeCalendar = document.getElementById("closeCalendar");
const checkboxes = document.querySelectorAll(".task-checkbox");
const progressFill = document.getElementById("progressFill");
const progressText = document.getElementById("progressText");

let congratulated = false;

calendarBtn?.addEventListener("click", () => {
    calendarModal.style.display = "flex";
    updateProgress();
});

closeCalendar?.addEventListener("click", () => {
    calendarModal.style.display = "none";
});

function updateProgress() {
    const total = checkboxes.length;
    const checked = document.querySelectorAll(".task-checkbox:checked").length;
    const percent = Math.round((checked / total) * 100);
    progressFill.style.width = `${percent}%`;
    progressText.textContent = `${percent}% Complete`;

    progressFill.style.backgroundColor = percent < 30 ? "#f44336" :
                                       percent < 70 ? "#ff9800" : "#4CAF50";

    if (percent === 100 && !congratulated) {
        setTimeout(() => {
            alert("🎉 Well Done! You completed all workouts this week! 💪");
            congratulated = true;
        }, 500);
    }
}

checkboxes.forEach(cb => cb.addEventListener("change", updateProgress));

// 🔐 Login & Logout
const loginModal = document.getElementById("loginModal");
const loginForm = document.getElementById("loginForm");
const loginEmail = document.getElementById("loginEmail");
const loginPassword = document.getElementById("loginPassword");
const logoutBtn = document.getElementById("logoutBtn");

logoutBtn.style.display = "none";

window.addEventListener("load", () => {
    if (window.location.pathname.includes("index.html")) {
        const hasLoggedIn = localStorage.getItem("hasLoggedIn");
        if (hasLoggedIn) {
            loginModal.style.display = "none";
            logoutBtn.style.display = "block";
        } else {
            loginModal.style.display = "flex";
            loginModal.style.opacity = "1";
        }
    }
});

loginForm?.addEventListener("submit", function (e) {
    e.preventDefault();
    const email = loginEmail.value.trim();
    const password = loginPassword.value;

    if (email && password) {
        localStorage.setItem("hasLoggedIn", "true");
        localStorage.setItem("userEmail", email);

        loginModal.style.opacity = "0";
        setTimeout(() => loginModal.style.display = "none", 500);
        logoutBtn.style.display = "block";

        alert(`Welcome, ${email.split('@')[0]}! 💪 Your fitness journey starts now!`);
    } else {
        alert("Please enter both email and password.");
    }
});

logoutBtn?.addEventListener("click", () => {
    if (confirm("Are you sure you want to Log out?")) {
        localStorage.removeItem("hasLoggedIn");
        localStorage.removeItem("userEmail");
        logoutBtn.style.display = "none";
        loginModal.style.display = "flex";
        loginModal.style.opacity = "1";
        alert("Logged out. See you soon! 👋");
    }
});