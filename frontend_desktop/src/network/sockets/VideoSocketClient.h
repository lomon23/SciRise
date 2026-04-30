#ifndef VIDEOSOCKETCLIENT_H
#define VIDEOSOCKETCLIENT_H

#include "BaseSocketClient.h"
#include <QJsonObject>

class VideoSocketClient: public BaseSocketClient{
    Q_OBJECT
    public:
        explicit VideoSocketClient(QObject *parent = nullptr);

        void sendWebRtcSignal(const QJsonObject &payload);

    signals:
        void offerReceived(const QJsonObject &offer, const QString &sender);
        void answerReceived(const QJsonObject &answer, const QString &sender);
        void iceCandidateReceived(const QJsonObject &candidate, const QString &sender);

    protected:
        void handleChatMessage(const QString &message) override;
};

#endif