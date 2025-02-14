// Login Page
document.getElementById("login-btn").addEventListener("click", () => {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    if (email && password) {
        window.location.href = "/static/dashboard.html"; // Redirect to dashboard
    } else {
        alert("Please enter your email and password.");
    }
});

// Chatbot Logic
const chatBox = document.getElementById("chat-box");
const userInput = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");
const voiceBtn = document.getElementById("voice-btn");

function addMessage(message, isUser = false) {
    const messageDiv = document.createElement("div");
    messageDiv.classList.add("chat-message");
    messageDiv.classList.add(isUser ? "user-message" : "bot-message");
    messageDiv.innerHTML = `<p>${message}</p>`;
    chatBox.appendChild(messageDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
}

function showTypingIndicator() {
    const typingDiv = document.createElement("div");
    typingDiv.classList.add("typing-indicator");
    typingDiv.innerHTML = "<p>Wellness Whisper is typing...</p>";
    chatBox.appendChild(typingDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
    return typingDiv;
}

function hideTypingIndicator(typingDiv) {
    typingDiv.remove();
}

async function simulateTyping(response) {
    const typingDiv = showTypingIndicator();
    await new Promise((resolve) => setTimeout(resolve, 2000));
    hideTypingIndicator(typingDiv);
    addMessage(response);
}

async function sendMessage() {
    const text = userInput.value.trim();
    if (!text) return;

    addMessage(text, true);
    userInput.value = "";

    await simulateTyping("Let me think about that... 🤔");
    await new Promise((resolve) => setTimeout(resolve, 1000));

    try {
        const response = await fetch("/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: text }),
        });
        const data = await response.json();
        await simulateTyping(data.response);
    } catch (error) {
        await simulateTyping("Sorry, something went wrong. Please try again. 😔");
    }
}

function startVoiceInput() {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = "en-US";
    recognition.start();

    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        userInput.value = transcript;
        sendMessage();
    };

    recognition.onerror = (event) => {
        addMessage("Sorry, I couldn't understand that. Please try again. 😔", false);
    };
}

sendBtn.addEventListener("click", sendMessage);
userInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") sendMessage();
});
voiceBtn.addEventListener("click", startVoiceInput);

// Logout Button
document.querySelector(".logout").addEventListener("click", () => {
    window.location.href = "index.html"; // Redirect to login page
});

// Binaural Beats
let audioContext;
let oscillatorLeft;
let oscillatorRight;
let gainNode;

function startBinauralBeats() {
    const frequencySelect = document.getElementById("frequency-select");
    const selectedFrequency = frequencySelect.value;

    // Define base frequencies for binaural beats
    const baseFrequency = 200; // Base frequency for the left ear
    let frequencyDifference;

    switch (selectedFrequency) {
        case "alpha": // Alpha waves (8-14 Hz)
            frequencyDifference = 10; // 10 Hz difference
            break;
        case "beta": // Beta waves (14-30 Hz)
            frequencyDifference = 20; // 20 Hz difference
            break;
        case "theta": // Theta waves (4-8 Hz)
            frequencyDifference = 6; // 6 Hz difference
            break;
        case "delta": // Delta waves (0.5-4 Hz)
            frequencyDifference = 3; // 3 Hz difference
            break;
        default:
            frequencyDifference = 10; // Default to Alpha
    }

    // Create audio context
    audioContext = new (window.AudioContext || window.webkitAudioContext)();

    // Create oscillators for left and right ears
    oscillatorLeft = audioContext.createOscillator();
    oscillatorRight = audioContext.createOscillator();
    gainNode = audioContext.createGain();

    // Set frequencies
    oscillatorLeft.frequency.setValueAtTime(baseFrequency, audioContext.currentTime);
    oscillatorRight.frequency.setValueAtTime(baseFrequency + frequencyDifference, audioContext.currentTime);

    // Connect oscillators to gain node and then to the audio context destination
    oscillatorLeft.connect(gainNode);
    oscillatorRight.connect(gainNode);
    gainNode.connect(audioContext.destination);

    // Start oscillators
    oscillatorLeft.start();
    oscillatorRight.start();

    // Set gain (volume)
    gainNode.gain.setValueAtTime(0.5, audioContext.currentTime);

    addMessage(`Binaural beats started (${selectedFrequency} waves). Relax and enjoy! 🎶`, false);
}

function stopBinauralBeats() {
    if (audioContext) {
        oscillatorLeft.stop();
        oscillatorRight.stop();
        audioContext.close();
        addMessage("Binaural beats stopped. 🛑", false);
    }
}

// Event Listeners for Binaural Beats
document.getElementById("start-beats").addEventListener("click", startBinauralBeats);
document.getElementById("stop-beats").addEventListener("click", stopBinauralBeats);
