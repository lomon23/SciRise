#ifndef APICLIENT_H
#define APICLIENT_H

#include <QObject>
#include <QNetworkAccessManager>
#include <QNetworkReply>
#include "TokenManager.h"

class ApiClient : public QObject {
    Q_OBJECT
public:
    explicit ApiClient(const QString &baseUrl, TokenManager *tokenManager, QObject *parent = nullptr);

    QNetworkReply* get(const QString &endpoint);
    QNetworkReply* post(const QString &endpoint, const QByteArray &data);

signals:
    void dataReceived(const QByteArray &data);
    void requestFailed(const QString &error);

private:
    QString m_baseUrl;
    QNetworkAccessManager *m_networkManager;
    TokenManager *m_tokenManager;
};

#endif