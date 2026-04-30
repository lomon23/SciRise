#include "VideoSocketClient.h"
#include <QJsonDocument>
#include <QDebug>

VideoSocketClient::VideoSocketClient(QObject *parent) :BaseSocketClient(parent){}

void VideoSocketClient::sendWebRtcSignal(const QJsonObject &payload){
    sendJson(payload);
}

void VideoSocketClient::handleChatMessage(const QString &message){
    QJsonDocument doc = QJsonDocument::fromJson(message.toUtf8());

    if(!doc.isObject()){
        return;
    }

    QJsonObject root = doc.object();

    if(!root.contains("payload") || !root.contains("sender")){
        qWarning() << "Invalid WebRTC signal format received";
        return;
    }

    QString sender = root["sender"].toString();
    QJsonObject payload = root["payload"].toObject();
    QString type = root["type"].toString();

    qDebug() << "Received WebRTC signal: " << type << " from " << sender;

    if(type == "offer"){
        emit offerReceived(payload, sender);
    } else if (type == "answer"){
        emit answerReceived(payload, sender);
    } else if (type == "candidate"){
        emit iceCandidateReceived(payload, sender);
    }
}