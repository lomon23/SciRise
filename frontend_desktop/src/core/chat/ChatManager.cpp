#include "ChatManager.h"
#include <QDebug>

ChatManager::ChatManager(TokenManager *tokenManager, QObject *parent)
    : QObject(parent), m_tokenManager(tokenManager) {
    
    m_socketClient = new ChatSocketClient(this);

    connect(m_socketClient, &ChatSocketClient::connected, this, &ChatManager::connected);
    connect(m_socketClient, &ChatSocketClient::disconnected, this, &ChatManager::disconnected);
    connect(m_socketClient, &ChatSocketClient::errorOccurred, this, &ChatManager::errorOccurred);
    connect(m_socketClient, &ChatSocketClient::authFailed, this, &ChatManager::authFailed);

    connect(m_socketClient, &ChatSocketClient::chatMessageReceived, 
            this, &ChatManager::onRawMessageReceived);
            
    m_currentUser = m_tokenManager->getUsername(); 
}

void ChatManager::connectToChat(const QString &wsUrl){
    if(!m_tokenManager){
        emit errorOcurred("No Token Manager provided");
        return;
    }

    QString token = m_tokenManager->getAccessToken();
    if(token.isEmpty()){
        emit authFailed();
        return;
    }

    m_socketClient->connectToServer(wsUrl, token);
}

void ChatManager::disconnectFromChat(){
    m_socketClient->disconnectFromServer();
}

void ChatManager::sendMessage(const QString &text){
    if(text.trimmed().isEmpty()) return;

    m_socketClient->sendChatMessage(text);
}

bool ChatManager::isConnected(){
    return m_socketClient->isConnected();
}

void ChatManager::onRawMessageReceived(QString &username, QString &text){
    ChatMessage msg;

    msg.username = username;
    msg.text = text;
    msg.timestamp = QDateTime::currentDateTime();

    msg.isMine = (username == m_currentUser);

    emit messageReceived(msg);
}