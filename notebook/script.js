document.addEventListener('DOMContentLoaded', () => {
    const chatWindow = document.getElementById('chat-window');
    const userInput = document.getElementById('user-input');
    const sendButton = document.getElementById('send-button');
    const loadingIndicator = document.getElementById('loading-indicator');
    const errorMessage = document.getElementById('error-message');

    const appendMessage = (sender, text) => {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', `${sender}-message`);
        messageDiv.textContent = text;
        chatWindow.appendChild(messageDiv);
        chatWindow.scrollTop = chatWindow.scrollHeight; // Auto-scroll to the latest message
    };

    const sendMessage = async () => {
        const query = userInput.value.trim();
        if (query === '') return;

        appendMessage('user', query);
        userInput.value = '';
        sendButton.disabled = true;
        loadingIndicator.style.display = 'block';
        errorMessage.style.display = 'none';

        try {
            const response = await fetch('/query', { // Assuming your backend is served at the same origin on /query
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ query: query }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'Something went wrong on the server.');
            }

            const data = await response.json();
            appendMessage('bot', data.answer);
        } catch (error) {
            console.error('Error sending message:', error);
            errorMessage.textContent = `Error: ${error.message}`;
            errorMessage.style.display = 'block';
        } finally {
            loadingIndicator.style.display = 'none';
            sendButton.disabled = false;
        }
    };

    sendButton.addEventListener('click', sendMessage);
    userInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            sendMessage();
        }
    });
});