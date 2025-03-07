function setupEventListeners(chatApp) {
    const elems = chatApp.elements;

    elems.chatToggle.addEventListener('click', () => chatApp.toggleChat());
    elems.closeChat.addEventListener('click', () => chatApp.closeChat());
    elems.sendButton.addEventListener('click', () => chatApp.sendMessage());
    elems.messageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') chatApp.sendMessage();
    });

    elems.friendsList.addEventListener('click', (e) => {
        if (e.target.classList.contains('friend-item')) {
            const user = e.target.dataset.user;
            chatApp.showContextMenuForUser(user, e.clientX, e.clientY);
        }
    });

    if (elems.blockedUsersList) {
        elems.blockedUsersList.addEventListener('click', (e) => {
            // Aggiungi un log di debug per verificare l'evento
            console.log('Click in blockedUsersList', e.target);
            if (e.target.classList.contains('blocked-user-item')) {
                const user = e.target.dataset.user;
                chatApp.showContextMenuForUser(user, e.clientX, e.clientY);
            }
        });
    }

    elems.chatsList.addEventListener('click', (e) => {
        if (e.target.classList.contains('chat-tab') && !e.target.classList.contains('tab-close')) {
            const chatId = e.target.dataset.chat;
            chatApp.switchChat(chatId);
        } else if (e.target.classList.contains('tab-close')) {
            const chatId = e.target.closest('.chat-tab').dataset.chat;
            chatApp.closePrivateChat(chatId);
        }
    });

    elems.chatsList.addEventListener('contextmenu', (e) => {
        const chatTab = e.target.closest('.chat-tab');
        if (chatTab && !chatTab.classList.contains('tab-close')) {
            const chatId = chatTab.dataset.chat;
            if (chatId !== 'general' && chatId.startsWith('private-')) {
                e.preventDefault();
            }
        }
    });

    elems.currentChatTitle.addEventListener('contextmenu', (e) => {
        if (chatApp.currentChat !== 'general') {
            e.preventDefault();
            const user = chatApp.currentChat.replace('private-', '');
            chatApp.showContextMenuForUser(user, e.clientX, e.clientY);
        }
    });

    document.addEventListener('click', (e) => {
        if (!e.target.closest('.context-menu') &&
            !e.target.classList.contains('friend-item') &&
            !e.target.classList.contains('sender') &&
            !e.target.classList.contains('blocked-user-item')) {
            chatApp.hideContextMenu();
        }
    });

    elems.contextMenu.addEventListener('click', (e) => {
        if (e.target.dataset.action) {
            chatApp.handleContextAction(e.target.dataset.action);
        }
    });

    elems.closeProfile.addEventListener('click', () => {
        chatApp.elements.profileModal.style.display = 'none';
    });

    elems.messagesContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('sender')) {
            const user = e.target.textContent.replace(':', '').trim().toLowerCase();
            if (user !== 'self') {
                chatApp.showContextMenuForUser(user, e.clientX, e.clientY);
            }
        }
    });

    if (elems.friendsButton) {
        elems.friendsButton.addEventListener('click', () => {
            elems.friendsList.style.display = 'block';
            elems.friendRequestsList.style.display = 'none';
            elems.blockedUsersList.style.display = 'none';
            elems.friendsButton.classList.add('active');
            if (elems.friendRequestsButton) elems.friendRequestsButton.classList.remove('active');
            if (elems.blockedUsersButton) elems.blockedUsersButton.classList.remove('active');
        });
    }

    if (elems.friendRequestsButton) {
        elems.friendRequestsButton.addEventListener('click', () => {
            elems.friendsList.style.display = 'none';
            elems.friendRequestsList.style.display = 'block';
            elems.blockedUsersList.style.display = 'none';
            elems.friendsButton.classList.remove('active');
            elems.friendRequestsButton.classList.add('active');
            if (elems.blockedUsersButton) elems.blockedUsersButton.classList.remove('active');
        });
    }

    // Gestione del tab "Blocked Users" in modo analogo
    if (elems.blockedUsersButton) {
        elems.blockedUsersButton.addEventListener('click', () => {
            elems.friendsList.style.display = 'none';
            elems.friendRequestsList.style.display = 'none';
            elems.blockedUsersList.style.display = 'block';
            elems.friendsButton.classList.remove('active');
            elems.friendRequestsButton.classList.remove('active');
            elems.blockedUsersButton.classList.add('active');
        });
    }
}

export { setupEventListeners };
