#ifndef VIDEOCALLMANAGER_H
#define VIDEOCALLMANAGER_H

#include <QObject>
#include <QWebEnginePermission>
#include "network/sockets/VideoSocketClient.h"
#include "network/TokenManager.h"

class VideoCallManager : public QObject {
    Q_OBJECT
    public:
        explicit VideoCallManager(TokenManager *tokenManager, QObject *parent = nullptr);

        void connectToSignaling(const QString &wsUrl);
        void disconnectFromSignaling();

        void startCall();
        void acceptCall();
        void endCall();

        VideoSocketClient* getSocketClient() const;

    signals:
        void connected();
        void disconnected();
        void errorOccurred(const QString &error);
        void incomingCall(const QString &callerUsername);
        void offerReceived(const QJsonObject &offer, const QString &sender);

    private slots:
        void onOfferReceived(const QJsonObject &offer, const QString &sender);
        void onAnswerReceived(const QJsonObject &answer, const QString &sender);
        void onIceCandidateReceived(const QJsonObject &candidate, const QString &sender);

    private:
        VideoSocketClient *m_socketClient;
        TokenManager *m_tokenManager;
        QString m_currentPeer;
};

#endif