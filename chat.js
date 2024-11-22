// Mediator: ChatRoom
class ChatRoom {
    constructor() {
        this.users = {}; // Keep track of users
    }

    register(user) {
        this.users[user.name] = user;
        user.chatRoom = this;
        this.broadcast(`${user.name} has joined the chat.`);
    }

    unregister(user) {
        delete this.users[user.name];
        this.broadcast(`${user.name} has left the chat.`);
    }

    send(message, from, to = null) {
        if (to) {
            // Private message
            to.receive(message, from);
        } else {
            // Broadcast message
            for (let key in this.users) {
                if (this.users[key] !== from) {
                    this.users[key].receive(message, from);
                }
            }
        }
    }

    broadcast(message) {
        for (let key in this.users) {
            this.users[key].receive(message, null);
        }
    }
}

// User Class
class User {
    constructor(name) {
        this.name = name;
        this.chatRoom = null;
    }

    send(message, to = null) {
        if (this.chatRoom) {
            this.chatRoom.send(message, this, to);
        }
    }

    receive(message, from) {
        const fromName = from ? from.name : "System";
        this.display(`${fromName}: ${message}`);
    }

    display(message) {
        const chatBox = document.getElementById('chat');
        const newMessage = document.createElement('div');
        newMessage.textContent = message;
        chatBox.appendChild(newMessage);
        chatBox.scrollTop = chatBox.scrollHeight; // Auto-scroll
    }
}

// DOM Interactions
const chatRoom = new ChatRoom();
let currentUser = null;

document.getElementById('joinBtn').addEventListener('click', () => {
    const username = document.getElementById('username').value.trim();
    if (username) {
        currentUser = new User(username);
        chatRoom.register(currentUser);

        document.getElementById('message').disabled = false;
        document.getElementById('sendBtn').disabled = false;
        document.getElementById('username').disabled = true;
        document.getElementById('joinBtn').disabled = true;
    }
});

document.getElementById('sendBtn').addEventListener('click', () => {
    const message = document.getElementById('message').value.trim();
    if (message && currentUser) {
        currentUser.send(message);
        document.getElementById('message').value = '';
    }
});
