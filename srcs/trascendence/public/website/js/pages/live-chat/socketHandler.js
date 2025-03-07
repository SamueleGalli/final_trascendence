function initSocket(username, chatAppInstance) {
    const socket = new WebSocket('ws://localhost:3000/ws');

    socket.onopen = () => {
        socket.send(JSON.stringify({ type: "join", username }));
    };

    socket.onmessage = (event) => {
        const msg = JSON.parse(event.data);

        if (msg.type === "message") {
            chatAppInstance.addMessageToChat('general', msg.data);
        } 
        else if (msg.type === "private_message") {
            const partner = username === msg.data.from ? msg.data.to : msg.data.from;
            const chatId = chatAppInstance.getPrivateChatId(username, partner);
            if (!chatAppInstance.chats.has(chatId)) {
                chatAppInstance.chats.set(chatId, []);
                chatAppInstance.createChatElement(chatId, partner, true);
            }
            chatAppInstance.addMessageToChat(chatId, msg.data);
        } 
        else if (msg.type === "friend_request") {
            if (!chatAppInstance.receivedRequests.find(r => r.from === msg.data.from)) {
                chatAppInstance.receivedRequests.push({ from: msg.data.from });
                chatAppInstance.updateFriendRequestsUI();
            }
        } 
        else if (msg.type === "friend_response") {
            if (msg.data.accepted) {
                chatAppInstance.friends.add(msg.data.from);
                const chatId = chatAppInstance.getPrivateChatId(chatAppInstance.username, msg.data.from);
                if (chatAppInstance.disabledChats[chatId]) {
                    delete chatAppInstance.disabledChats[chatId];
                    if (chatAppInstance.currentChat === chatId) {
                        chatAppInstance.enablePrivateChat();
                    }
                }
            } else {
                chatAppInstance.pendingRequests.delete(msg.data.from);
            }
            chatAppInstance.updateFriendsList();
        }        
        else if (msg.type === "friend_removed") {
            chatAppInstance.friends.delete(msg.data.from);
            chatAppInstance.pendingRequests.delete(msg.data.from);
            chatAppInstance.updateFriendsList();
            if (chatAppInstance.selectedUser === msg.data.from) {
                const addFriendItem = chatAppInstance.elements.contextMenu.querySelector('[data-action="addFriend"]');
                addFriendItem.textContent = 'Add Friend';
                addFriendItem.style.opacity = '1';
            }
            const chatId = chatAppInstance.getPrivateChatId(username, msg.data.from);
            if (chatAppInstance.chats.has(chatId)) {
                chatAppInstance.disablePrivateChat(chatId);
            }
        }
        else if (msg.type === "private_chat_started") {
            const chatId = chatAppInstance.getPrivateChatId(username, msg.data.from);
            if (!chatAppInstance.chats.has(chatId) && !document.querySelector(`.chat-tab[data-chat="${chatId}"]`)) {
                chatAppInstance.chats.set(chatId, []);
                chatAppInstance.createChatElement(chatId, msg.data.from, true);
            }
            chatAppInstance.addMessageToChat(chatId, {
                date: new Date().toISOString(),
                from: 'system',
                to: chatId,
                content: `Private chat with ${msg.data.from.charAt(0).toUpperCase() + msg.data.from.slice(1)} started.`
            });
        }        
        else if (msg.type === "system") {
            if (msg.data.content && msg.data.content.includes("You cannot send a friend request")) {
                let regex = /you're blocked from ([^.]+)\./i;
                let match = msg.data.content.match(regex);
                if (!match) {
                    regex = /You cannot send a friend request to([^.]+) because he blocked you\./i;
                    match = msg.data.content.match(regex);
                }
                if (match && match[1]) {
                    const blockingUser = match[1].trim().toLowerCase();
                    chatAppInstance.pendingRequests.delete(blockingUser);
                    if (chatAppInstance.selectedUser && chatAppInstance.selectedUser.toLowerCase() === blockingUser) {
                        const addFriendItem = chatAppInstance.elements.contextMenu.querySelector('[data-action="addFriend"]');
                        if (addFriendItem) {
                            addFriendItem.textContent = 'Add Friend';
                            addFriendItem.style.opacity = '1';
                        }
                    }
                }
            }
            chatAppInstance.addMessageToChat(chatAppInstance.currentChat, msg.data);
        }              
    };
    return socket;
}

export { initSocket };