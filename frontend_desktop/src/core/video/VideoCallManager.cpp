#include "VideoCallManager.h"
#include <QDebug>

VideoCallManager::VideoCallManager(TokenManager *tokenManager, QObject *parent)
    : QObject(parent), m_tokenManager(tokenManager) {
    
    m_socketClient = new VideoSocketClient(this);

    connect(m_socketClient, &VideoSocketClient::connected, this, &VideoCallManager::connected);
    connect(m_socketClient, &VideoSocketClient::disconnected, this, &VideoCallManager::disconnected);
    connect(m_socketClient, &VideoSocketClient::errorOccurred, this, &VideoCallManager::errorOccurred);

    connect(m_socketClient, &VideoSocketClient::offerReceived, this, &VideoCallManager::onOfferReceived);
    connect(m_socketClient, &VideoSocketClient::answerReceived, this, &VideoCallManager::onAnswerReceived);
    connect(m_socketClient, &VideoSocketClient::iceCandidateReceived, this, &VideoCallManager::onIceCandidateReceived);
}

void VideoCallManager::connectToSignaling(const QString &wsUrl){
    if(!m_tokenManager) return;
    QString token = m_tokenManager->getAccessToken();
    m_socketClient->connectToServer(wsUrl, token);
}

void VideoCallManager::disconnectFromSignaling(){
    m_socketClient->disconnectFromServer();
}

void VideoCallManager::startCall(){
    qDebug() << "Starting call, sending offer ...";
    QJsonObject offer;
    offer["type"] = offer;
    offer["sdp"] = "dummy_sdp_data";
    m_socketClient->sendWebRtcSignal(offer);
}

void VideoCallManager::acceptCall(){
    qDebug() << "Accepting call, sending answer";
    QJsonObject answer;
    answer["type"] = answer;
    answer["sdp"] = "dummy_sdp_data";
    m_socketClient->sendWebRtcSignal(answer);
}

void VideoCallManager::endCall(){
    qDebug() << "Ending call";
    m_currentPeer.clear();
}

void VideoCallManager::onOfferReceived(const QJsonObject &offer, const QString &sender){
    qDebug() << "Incomming call from " << sender;
    m_currentPeer = sender;
    emit incomingCall(sender);
}

void VideoCallManager::onAnswerReceived(const QJsonObject &answer, const QString &sender){
    qDebug() << sender << " accepted call";
}

void VideoCallManager::onIceCandidateReceived(const QJsonObject &candidate, const QString &sender){
    qDebug() << "Received ICE candidate from " << sender;
}

VideoSocketClient* VideoCallManager::getSocketClient() const {
    return m_socketClient;
}