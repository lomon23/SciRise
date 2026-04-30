#ifndef CHATMANAGER_H
#define CHATMANAGER_H

#include <QObject>
#include "network/sockets/ChatSocketClient.h"
#include "models/ChatMessage.h"
#include "network/TokenManager.h"

class ChatManager : public QObject{
    Q_OBJECT
    public:
        explicit ChatManager(TokenManager *tokenManager, QObject *parent = nullptr);

        void connectToChat(const QString &wsUrl);
        void disconnectFromChat();

        void sendMessage(const QString &text);

        bool isConnected() const;

    signals:
        void connected();
        void disconnected();
        void messageReceived(const ChatMessage &message);
        void errorOccurred(const QString &error);
        void authFailed();

    private slots:
        void onRawMessageReceived(const QString &username, const QString &text);

    private:
        ChatSocketClient *m_socketClient;
        TokenManager *m_tokenManager;
        QString m_currentUser;
};

#endif