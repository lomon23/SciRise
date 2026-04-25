#include "BaseSocketClient.h"
#include <QDebug>

BaseSocketClient::BaseSocketClient(QObject *parent) : QObject(parent){
    connect(&m_webSocket, &QWebSocket::connected, this, &BaseSocketClient::onConnected);
    connect(&m_webSocket, &QWebSocket::disconnected, this, &BaseSocketClient::onDisconnected);
    connect(&m_webSocket, &QWebSocket::textMessageReceived, this, &BaseSocketClient::onTextMessageReceived);
    connect(&m_webSocket, &QWebSocket::errorOccurred, this, &BaseSocketClient::onError);
    
    connect(&m_webSocket, QOverload<const QList<QSslError>&>::of(&QWebSocket::sslErrors),
            this, &BaseSocketClient::onSslErrors);
}

BaseSocketClient::~BaseSocketClient(){
    m_webSocket.close();
}

void BaseSocketClient::connectToServer(const QString &endpoint, QString &token){
    QUrl url(endpoint);
    if(!token.isEmpty()){
        url.setQuery("token = " + token);
    }

    qDebug() << "Connecting to WebSockets:" << url.toString();
    m_webSocket.open(url);
}

void BaseSocketClient::disconnectFromServer(){
    m_webSocket.close();
}

bool BaseSocketClient::isConnected() const {
    return m_webSocket.state() == QAbstractSocket::ConnectedState;
}

void BaseSocketClient::sendJson(const QJsonObject &json){
    if(isConnected()){
        QJsonDocument doc(json);
        m_webSocket.sendTextMessage(doc.toJson(QJsonDocument::Compact));
    } else {
        qWarning() << "Cannot send data: WebSocket is not connected.";
    }
}

void BaseSocketClient::onConnected() {
    qDebug() << "WebSocket Connected!";
    emit connected();
}

void BaseSocketClient::onDisconnected() {
    qDebug() << "WebSocket Disconnected!";
    emit disconnected();
}

void BaseSocketClient::onTextMessageReceived(const QString &message) {
    handleTextMessage(message);
}

void BaseSocketClient::onError(QAbstractSocket::SocketError error) {
    qWarning() << "WebSocket Error:" << m_webSocket.errorString();
    emit errorOccurred(m_webSocket.errorString());
}

void BaseSocketClient::onSslErrors(const QList<QSslError> &errors) {
    m_webSocket.ignoreSslErrors();
}