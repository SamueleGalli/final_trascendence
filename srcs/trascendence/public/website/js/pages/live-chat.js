export default function LiveChat()
{
    return `
        <button class="chat-toggle" id="chatToggle">Live Chat</button>
        <div class="context-menu" id="contextMenu">
            <div class="context-menu-item" data-action="chat">Open Private Chat</div>
            <div class="context-menu-item" data-action="addFriend">Add Friend</div>
            <div class="context-menu-item" data-action="block">Block User</div>
            <div class="context-menu-item" data-action="profile">View Profile</div>
            <div class="context-menu-item" data-action="invite">Invite To The Game</div>
        </div>
        <div class="profile-modal" id="profileModal">
            <div class="profile-header">
                <div class="header-left">
                    <img src="test.png" alt="Avatar" class="profile-avatar" id="profileAvatar">
                    <div class="profile-info">
                        <div class="profile-title-wrapper">
                            <h3 class="chat-title" id="profileName">Nome Utente</h3>
                            <div class="profile-stats" id="profileStats">
                            W: <span id="userWins">0</span> | L: <span id="userLosses">0</span>
                            </div>
                        </div>
                        <div class="friend-status" id="profileStatus">Stato Amico</div>
                    </div>
                </div>
                <button class="close-profile" id="closeProfile">&times;</button>
            </div>
            <div class="profile-details">
                <p>
                    <strong>Stato:</strong>
                    <span id="lastOnline" class="status-text offline">Offline</span>
                    <span id="statusIndicator" class="status-indicator offline"></span>
                </p>
                <p><strong>Nome reale:</strong><span id="realname">Nome Reale Utente</span></p>
                <p><strong>Email:</strong><span id="userEmail">utente@example.com</span></p>
                <p><strong>Bio:</strong><span id="userBio">Breve descrizione...</span></p>
            </div>
        </div>
        <div class="chat-container" id="chatContainer">
            <div class="left-panel">
                <div class="chats-list" id="chatsList">
                    <div class="chat-tab active" data-chat="general">General Chat</div>
                </div>
                <div class="friends-tabs">
                    <img id="friendsButton" class="active" src="website/images/friends.png" alt="Friends">
                    <div id="friendRequestsButtonContainer" style="position: relative; display: inline-block;">
                        <img id="friendRequestsButton" src="website/images/add-friend.png" alt="Requests">
                        <span id="friendRequestsBadge" style="position: absolute; top: -8px; right: -8px; background: red; color: white; border-radius: 50%; font-size: 10px; padding: 1px 4px; display: none;"></span>
                    </div>                
                    <img id="blockedUsersButton" src="website/images/block-user.png" alt="Blocked">
                </div>
                <div class="friends-content">
                    <!-- Lista amici -->
                    <div class="friends-list" id="friendsList"></div>
                    <!-- Lista richieste di amicizia, inizialmente nascosta -->
                    <div class="friend-requests-list" id="friendRequestsList" style="display:none;"></div>
                    <!-- Lista utenti bloccati, inizialmente nascosta -->
                    <div class="blocked-users-list" id="blockedUsersList" style="display:none;"></div>
                </div>
            </div>
            <div class="main-chat">
                <header class="chat-header">
                    <h2 class="chat-title" id="currentChatTitle">General Chat</h2>
                    <button class="icon-button" id="closeChat">×</button>
                </header>
                <div class="messages-container" id="messages"></div>
                <div class="input-area">
                    <input type="text" class="message-input" id="messageInput" placeholder="Type your message...">
                    <button class="send-button" id="sendButton">Send</button>
                </div>
            </div>
        </div>
    `;
}