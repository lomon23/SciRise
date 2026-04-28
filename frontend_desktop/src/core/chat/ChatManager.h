#ifndef CHATMANAGER_H
#define CHATMANAGER_H

#include <QObject>
#include "ChatSocketClient.h"
#include "ChatMessage.h"
#include "TokenManager.h"

class ChatManager{
    Q_OBJECT
    public:
        explicit ChatManager(TokenManager *tokenManager, QObject *parent = nulltr);

        void connectToChat(const QString &wsUrl);
        void disconnectFromChat();

        void sendMessage(const QString &text);

        void isConnected() const;

    signals:
        void connected();
        void disconnected();
        void messageReceived(const ChatMessage &message);
        void errorOcurred(const QString &error);
        void authFailed();

    private slots:
        void onRawMessageReceived(const QString &username, const QString &text);

    private:
        ChatSocketClient *m_socketClient;
        TokenManager *m_tokenManager;
        QString m_currentUser;
};

#endif