// Check if the browser supports the Web Speech API
if (!('webkitSpeechRecognition' in window) || !('speechSynthesis' in window)) {
    alert('Your browser does not support Speech Recognition or Text-to-Speech. Please use Google Chrome or another compatible browser.');
} else {
    // Safari compatibility: Use an alternative or show a warning
    if (!window.webkitSpeechRecognition) {
        alert('Speech Recognition is not supported in Safari. Please use Google Chrome for full functionality.');
    } else {
        // Create a new instance of SpeechRecognition
        const recognition = new webkitSpeechRecognition();
        recognition.continuous = false; // Stop recognition automatically when speech ends
        recognition.interimResults = false; // Only process final results
        recognition.lang = 'en-UK'; // Language

        // Get DOM elements
        const startBtn = document.getElementById('start-btn');
        const output = document.getElementById('output');

        let isListening = false;

        // Object with predefined responses
        const responses = {
            "hi": "Hi there, I am a virtual assistant. How can I help you?",
            "i need my child details": "Currently, this model is under development. Please find the details in the college database.",
            "what is your name": "I am a virtual assistant for the college, ready to assist you.",
            "tell me a joke": "Why don't scientists trust atoms? Because they make up everything!",
            "goodbye": "Goodbye! Have a great day!",
            "how are you": "I’m just a program, so I don’t have feelings, but I’m here to help you!"
        };

        // Toggle Speech Recognition
        let beforeListeningEl = document.getElementById("beforeListening");
        let whileListeningEl = document.getElementById("whileListening");

        startBtn.addEventListener('click', () => {
            if (!isListening) {
                isListening = true;
                beforeListeningEl.classList.add("d-none");
                whileListeningEl.classList.remove("d-none");
                window.speechSynthesis.cancel();
                recognition.start(); // Start speech recognition
                output.textContent = 'Listening... Speak now.';
            } else {
                recognition.stop(); // Stop speech recognition
                beforeListeningEl.classList.remove("d-none");
                whileListeningEl.classList.add("d-none");
                output.textContent = '';
                isListening = false;
            }
        });

        // Handle speech results
        recognition.onresult = (event) => {
            let transcript = '';
            for (let i = event.resultIndex; i < event.results.length; i++) {
                transcript += event.results[i][0].transcript;
            }
            const input = transcript.trim();
            const response = responses[input.toLowerCase()] || "Sorry, I don't have a response for that yet.";

            // Update output with the recognized input and response
            output.textContent = response;

            // Play the response as speech
            const utterance = new SpeechSynthesisUtterance(response);
            utterance.lang = 'en-UK'; // Language for speech synthesis
            window.speechSynthesis.speak(utterance);

            // Reset UI and listening state
            beforeListeningEl.classList.remove("d-none");
            whileListeningEl.classList.add("d-none");
            isListening = false;

            // Ensure recognition is stopped to prepare for the next cycle
            recognition.stop();
        };

        // Handle recognition end
        recognition.onend = () => {
            if (isListening) {
                output.textContent = 'Listening ended. Please click the mic button to speak again.';
                const cantCatch = new SpeechSynthesisUtterance('Listening ended. Please click the mic button to speak again.');
                cantCatch.lang = 'en-UK'; // Language for speech synthesis
                window.speechSynthesis.speak(cantCatch);

                // Reset UI and state
                beforeListeningEl.classList.remove("d-none");
                whileListeningEl.classList.add("d-none");
                isListening = false;
            }
        };

        // Handle errors
        recognition.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
            isListening = false;
            beforeListeningEl.classList.remove("d-none");
            whileListeningEl.classList.add("d-none");
        };

        // Keyboard input
        const cardEl = document.getElementById("fourthPageCard");
        const keyboardEl = document.getElementById("keyboard");

        let keyboardFlag = false;
        keyboardEl.addEventListener('click', () => {
            if (!keyboardFlag) {
                keyboardFlag = true;
                const keyboardInput = document.createElement("input");
                keyboardInput.type = "text";
                keyboardInput.placeholder = "Ask me anything...";
                keyboardInput.classList.add("keyboard-input");

                const keycardEl = document.createElement("div");
                keycardEl.id = "keyboardid";
                keycardEl.classList.add("bg-white");
                cardEl.appendChild(keycardEl);
                keycardEl.appendChild(keyboardInput);

                keyboardInput.addEventListener('keydown', (event) => {
                    if (event.key === "Enter") {
                        const input = keyboardInput.value.trim();
                        const response = responses[input.toLowerCase()] || "Sorry, I don't have a response for that yet.";
                        output.textContent = response;

                        const utterance = new SpeechSynthesisUtterance(response);
                        utterance.lang = 'en-UK';
                        window.speechSynthesis.speak(utterance);
                    }
                });
            } else {
                keyboardFlag = false;
                document.getElementById("keyboardid").remove();
            }
        });
    }
}
