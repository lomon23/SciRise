#include "ChatSocketClient.h"

ChatSocketClient::ChatSocketClient(QObject *parent) :BaseSocketClient(parent){}

void ChatSocketClient::sendChatMessage(const QString &text){
    QJsonObject json;
    json["message"] = text;

    sendJson(json);
}

void ChatSocketClient::handleChatMessage(const QString &message){
    QJsonDocument doc = QJsonDocument::fromJson(message.toUtf8());
    if(!doc.isObject()){
        qWarning() << "Recieved invalid JSON in ChatSocketClient";
        return;
    }

    QJsonObject obj = doc.object();

    if(obj.contains("message") && obj["message"].toString() == "AUTH_FAILED"){
        emit authFailed();
        return;
    }

    if(obj.contains("message") && obj.contains["username"]){
        emit chatMessageRecieved(obj["username"].toString(), obj["message"].toString());
    }
}