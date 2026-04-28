#ifndef CHATSOCKETCLIENT_H
#define CHATSOCKETCLIENT_H

#include "BaseSocketClient.h"

class ChatSocketClient: public BaseSocketClient{
    Q_OBJECT

    public:
        explicit BaseSocketClient(Q_Object *parent = nullptr);
        void sendChatMessage(const QString &text);

    signals:
        void chatMessageRecieved(const QString &username, QString &message);
        void authFailed();
    
    protected:
        void handleChatMessage(const QString &message) override;
};

#endif