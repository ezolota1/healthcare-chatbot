async function sendMessage() {
    const chatOutput = document.getElementById('chat-output');
    const chatInput = document.getElementById('chat-input');
    const appointmentForm = document.getElementById('appointment-form');
    const message = chatInput.value.trim();

    if (!message) return;

    const userMessage = document.createElement('div');
    userMessage.classList.add('chat-message', 'user');
    userMessage.textContent = message;
    chatOutput.appendChild(userMessage);

    try {
        const response = await fetch('/chatbot/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message }),
        });

        const data = await response.json();

        const botMessage = document.createElement('div');
        botMessage.classList.add('chat-message', 'bot');
        botMessage.textContent = data.reply || "Sorry, something went wrong.";
        chatOutput.appendChild(botMessage);

        if (data.showAppointmentForm) {
            appointmentForm.style.display = 'block';
        } else {
            appointmentForm.style.display = 'none';
        }

        chatOutput.scrollTop = chatOutput.scrollHeight;
    } catch (error) {
        console.error('Error:', error);
        const errorMessage = document.createElement('div');
        errorMessage.classList.add('chat-message', 'error');
        errorMessage.textContent = "Error communicating with the server. Please try again.";
        chatOutput.appendChild(errorMessage);
    }

    chatInput.value = '';
}

document.getElementById('chat-form').addEventListener('submit', function (event) {
    event.preventDefault();
    sendMessage();
});

function filterAppointments(filter) {
    const appointmentItems = document.querySelectorAll('.appointment-item');
    appointmentItems.forEach(item => {
        if (filter === 'all' || item.classList.contains(filter)) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });
}

function handleKeyPress(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        sendMessage();
    }
}
