#ifndef BASESOCKETCLIENT_H
#define BASESOCKETCLIENT_H

#include <QObject>
#include <QtWebSockets/QWebSocket>
#include <QJsonObject>
#include <QJsonDocument>
#include <QUrl>

class BaseSocketClient: public QObject{
    Q_OBJECT
    public:
        explicit BaseSocketClient(QObject *parent = nullptr);
        virtual ~BaseSocketClient();

        void connectToServer(const QString &endpoint, const QString &token);
        void disconnectFromServer();

        bool isConnected() const;
        
    signals:
        void connected();
        void disconnected();
        void errorOccurred(const QString &error);

    protected:
        void sendJson(const QJsonObject &json);
        virtual void handleTextMessage(const QString &message) = 0;

    private slots:
        void onConnected();
        void onDisconnected();
        void onTextMessageReceived(const QString &message);
        void onError(QAbstractSocket::SocketError error);
        void onSslErrors(const QList<QSslerror> &errors);

    private:
        QWebSocket m_webSocket;
};

#endif