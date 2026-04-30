#ifndef CHATSOCKETCLIENT_H
#define CHATSOCKETCLIENT_H

#include <QObject>
#include "BaseSocketClient.h"

class ChatSocketClient: public BaseSocketClient{
    Q_OBJECT

    public:
        explicit ChatSocketClient(QObject *parent = nullptr);
        void sendChatMessage(const QString &text);

    signals:
        void chatMessageReceived(const QString &username, const QString &message);
        void authFailed();
    
    protected:
        void handleChatMessage(const QString &message) override;
};

#endif