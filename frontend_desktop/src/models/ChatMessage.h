#ifndef CHATMESSAGE_H
#define CHATMESSAGE_H

#include <QString>
#include <QDateTime>

struct ChatMessage{
    QString username;
    QString text;
    QDateTime timestamp;
    bool isMine;
};

#endif