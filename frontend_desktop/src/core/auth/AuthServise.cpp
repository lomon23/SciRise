#include "AuthServise.h"
#include <QJsonDocument>
#include <QJsonObject>
#include <QNetworkReply>

AuthServise::AuthServise(ApiClient *apiClient, TokenManager *tokenManager, QObject *parent)
    : QObject(parent), m_apiClient(apiClient), m_tokenManager(tokenManager) {
}

void AuthServise::login(const QString &email, const QString &password) {
    QJsonObject json;
    json["email"] = email;
    json["password"] = password;
    QByteArray jsonData = QJsonDocument(json).toJson();

    QNetworkReply *reply = m_apiClient->post("/login", jsonData);

    connect(reply, &QNetworkReply::finished, this, [this, reply]() {
        if (reply->error() == QNetworkReply::NoError) {
            QByteArray responseData = reply->readAll();
            QJsonDocument doc = QJsonDocument::fromJson(responseData);
            QJsonObject obj = doc.object();

            QString accessToken = obj["access"].toString();
            QString refreshToken = obj["refresh"].toString();

            m_tokenManager->saveTokens(accessToken, refreshToken);
            emit loginSuccess();
        } else {
            emit loginFailed(reply->errorString());
        }
        
        reply->deleteLater();
    });
}

void AuthServise::registerUser(const QString &email, const QString &username, const QString &password) {
    QJsonObject json;
    json["email"] = email;
    json["username"] = username;
    json["password"] = password;
    QByteArray jsonData = QJsonDocument(json).toJson();

    QNetworkReply *reply = m_apiClient->post("/register", jsonData);

    connect(reply, &QNetworkReply::finished, this, [this, reply]() {
        if (reply->error() == QNetworkReply::NoError) {
            emit registerSuccess();
        } else {
            emit registerFailed(reply->errorString());
        }
        
        reply->deleteLater();
    });
}

void AuthServise::logout() {
    m_tokenManager->clearTokens();
}