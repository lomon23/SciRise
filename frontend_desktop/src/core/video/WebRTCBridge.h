#ifndef WEBRTCBRIDGE_H
#define WEBRTCBRIDGE_H

#include <QObject>
#include <QJsonObject>

class WebRTCBridge : public QObject {
    Q_OBJECT
public:
    explicit WebRTCBridge(QObject *parent = nullptr) : QObject(parent) {}

public slots:
    void sendOfferToBackend(const QJsonObject& offer) { emit outOfferReady(offer); }
    void sendAnswerToBackend(const QJsonObject& answer) { emit outAnswerReady(answer); }
    void sendIceCandidateToBackend(const QJsonObject& candidate) { emit outCandidateReady(candidate); }

signals:
    void outOfferReady(const QJsonObject& offer);
    void outAnswerReady(const QJsonObject& answer);
    void outCandidateReady(const QJsonObject& candidate);
};

#endif