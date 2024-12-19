document.addEventListener('DOMContentLoaded', () => {
    let socket;
    let currentChatId = null;
    let userId = document.body.dataset.userId; // Get user ID from DOM

    // Initialize Socket.IO
    function initializeSocket() {
        if (typeof io !== 'undefined') {
            socket = io();
            setupSocketListeners();
            socket.emit('user connected', userId);
        } else {
            console.error('Socket.IO not loaded. Retrying in 1 second...');
            setTimeout(initializeSocket, 1000);
        }
    }

    // Setup Socket.IO Event Listeners
    function setupSocketListeners() {
        socket.on('connect', () => {
            console.log('Connected to Socket.IO');
            document.querySelectorAll('.chat-icon').forEach(icon => {
                icon.classList.remove('offline');
                icon.classList.add('online');
            });
        });

        socket.on('disconnect', () => {
            console.log('Disconnected from Socket.IO');
            document.querySelectorAll('.chat-icon').forEach(icon => {
                icon.classList.remove('online');
                icon.classList.add('offline');
            });
        });

        socket.on('chat message', (data) => {
            appendMessage(data.message, data.sender);
        });

        socket.on('user joined', (userId) => {
            appendSystemMessage(`User ${userId} joined the chat`);
        });

        socket.on('user left', (userId) => {
            appendSystemMessage(`User ${userId} left the chat`);
        });

        socket.on('typing', (data) => {
            const typingIndicator = document.getElementById('typingIndicator');
            if (data.isTyping) {
                typingIndicator.textContent = `${data.userId} is typing...`;
            } else {
                typingIndicator.textContent = '';
            }
        });
    }

    // Function to Append Message to Chat
    function appendMessage(message, sender) {
        const messagesDiv = document.getElementById('chatMessages');
        const messageElement = document.createElement('div');
        messageElement.className = sender === userId ? 'message sent' : 'message received';
        messageElement.textContent = message;
        messagesDiv.appendChild(messageElement);
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
    }

    // Function to Append System Messages
    function appendSystemMessage(message) {
        const messagesDiv = document.getElementById('chatMessages');
        const messageElement = document.createElement('div');
        messageElement.className = 'message system';
        messageElement.textContent = message;
        messagesDiv.appendChild(messageElement);
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
    }

    // Initialize Socket
    initializeSocket();

    // Event Listener for Chat Icon Click
    document.querySelectorAll('.chat-icon').forEach(icon => {
        icon.addEventListener('click', () => {
            currentChatId = icon.dataset.applicationId || icon.dataset.applicantId;
            document.getElementById('chatModal').style.display = 'block';
            socket.emit('join chat', { chatId: currentChatId, userId: userId });
            loadChatHistory(currentChatId);
        });
    });

    // Close Modal
    document.querySelector('.close').addEventListener('click', () => {
        document.getElementById('chatModal').style.display = 'none';
        socket.emit('leave chat', { chatId: currentChatId, userId: userId });
        currentChatId = null;
        document.getElementById('chatMessages').innerHTML = '';
    });

    // Send Message
    document.getElementById('sendMessage').addEventListener('click', sendMessage);

    // Handle 'Enter' Key Press
    document.getElementById('chatInput').addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            sendMessage();
        }
    });

    // Typing Indicator
    let typingTimeout;
    document.getElementById('chatInput').addEventListener('input', () => {
        socket.emit('typing', { chatId: currentChatId, userId: userId, isTyping: true });
        clearTimeout(typingTimeout);
        typingTimeout = setTimeout(() => {
            socket.emit('typing', { chatId: currentChatId, userId: userId, isTyping: false });
        }, 1000);
    });

    // Send Message Function
    function sendMessage() {
        const messageInput = document.getElementById('chatInput');
        const message = messageInput.value.trim();
        if (message && currentChatId) {
            socket.emit('chat message', { chatId: currentChatId, userId: userId, message: message });
            appendMessage(message, userId);
            messageInput.value = '';
        }
    }

    // Load Chat History
    function loadChatHistory(chatId) {
        appendSystemMessage('Loading chat history...');
        setTimeout(() => {
            appendSystemMessage('Chat history loaded.');
        }, 1000);
    }
});
