#include "AuthManager.h"

AuthManager::AuthManager(QObject *parent) : QObject(parent){
    m_networkManager = new QNetworkAccessManager(this);
}

void AuthManager::registerUser(const QString &email, const QString &username, const QString &password)
{
    QNetworkRequest request(QUrl(m_baseUrl + "/register/"));
    request.setHeader(QNetworkRequest::ContentTypeHeader, "application/json");

    QJsonObject json;
    json["email"] = email;
    json["username"] = username;
    json["password"] = password;

    QNetworkReply *reply = m_networkManager->post(request, QJsonDocument(json).toJson());
    connect(reply, &QNetworkReply::finished, this, &AuthManager::onRegisterFinished);
}

void AuthManager::onRegisterFinished()
{
    QNetworkReply *reply = qobject_cast<QNetworkReply *>(sender());
    if (!reply) return;
    reply->deleteLater();

    if (reply->error() == QNetworkReply::NoError) {
        emit registerSuccess();
    } else {
        emit registerFailed(reply->errorString());
    }
}

void AuthManager::login(const QString &email, const QString &password)
{
    QNetworkRequest request(QUrl(m_baseUrl + "/login/"));
    request.setHeader(QNetworkRequest::ContentTypeHeader, "application/json");

    QJsonObject json;
    json["email"] = email;
    json["password"] = password;

    QNetworkReply *reply = m_networkManager->post(request, QJsonDocument(json).toJson());
    connect(reply, &QNetworkReply::finished, this, &AuthManager::onLoginFinished);
}

void AuthManager::onLoginFinished()
{
    QNetworkReply *reply = qobject_cast<QNetworkReply *>(sender());
    if (!reply) return;
    reply->deleteLater();

    if (reply->error() == QNetworkReply::NoError) {
        QJsonDocument doc = QJsonDocument::fromJson(reply->readAll());
        QJsonObject obj = doc.object();

        m_accessToken = obj["access"].toString();
        QString refreshToken = obj["refresh"].toString();

        saveRefreshToken(refreshToken);
        emit loginSuccess();
    } else {
        emit loginFailed(reply->errorString());
    }
}

void AuthManager::makeAuthenticatedGet(const QUrl &url)
{
    QNetworkRequest request(url);
    request.setRawHeader("Authorization", QString("Bearer %1").arg(m_accessToken).toUtf8());

    QNetworkReply *reply = m_networkManager->get(request);
    connect(reply, &QNetworkReply::finished, this, &AuthManager::onAuthenticatedRequestFinished);
}

void AuthManager::onAuthenticatedRequestFinished()
{
    QNetworkReply *reply = qobject_cast<QNetworkReply *>(sender());
    if (!reply) return;
    reply->deleteLater();

    int statusCode = reply->attribute(QNetworkRequest::HttpStatusCodeAttribute).toInt();

    if (statusCode == 401) {
        m_pendingRequests.enqueue({reply->url()});
        
        if (!m_isRefreshing) {
            refreshAccessToken();
        }
        return;
    }

    if (reply->error() == QNetworkReply::NoError) {
        emit dataReceived(reply->readAll());
    } else {
        emit requestFailed(reply->errorString());
    }
}

void AuthManager::refreshAccessToken()
{
    QString refreshToken = loadRefreshToken();
    if (refreshToken.isEmpty()) {
        emit requestFailed("No refresh token available. Please login again.");
        return;
    }

    m_isRefreshing = true;

    QNetworkRequest request(QUrl(m_baseUrl + "/refresh/"));
    request.setHeader(QNetworkRequest::ContentTypeHeader, "application/json");

    QJsonObject json;
    json["refresh"] = refreshToken;

    QNetworkReply *reply = m_networkManager->post(request, QJsonDocument(json).toJson());
    connect(reply, &QNetworkReply::finished, this, &AuthManager::onRefreshFinished);
}

void AuthManager::onRefreshFinished()
{
    m_isRefreshing = false;
    QNetworkReply *reply = qobject_cast<QNetworkReply *>(sender());
    if (!reply) return;
    reply->deleteLater();

    if (reply->error() == QNetworkReply::NoError) {
        QJsonDocument doc = QJsonDocument::fromJson(reply->readAll());
        m_accessToken = doc.object()["access"].toString();
        
        retryPendingRequests();
    } else {
        clearTokens();
        m_pendingRequests.clear();
        emit requestFailed("Session expired. Please login again.");
    }
}

void AuthManager::retryPendingRequests()
{
    while (!m_pendingRequests.isEmpty()) {
        PendingRequest req = m_pendingRequests.dequeue();
        makeAuthenticatedGet(req.url);
    }
}

void AuthManager::saveRefreshToken(const QString &token)
{
    QSettings settings("Scirise", "MyApp");
    settings.setValue("auth/refresh", token.toUtf8().toBase64()); 
}

QString AuthManager::loadRefreshToken()
{
    QSettings settings("Scirise", "MyApp");
    QByteArray base64Token = settings.value("auth/refresh").toByteArray();
    return QString::fromUtf8(QByteArray::fromBase64(base64Token));
}

void AuthManager::clearTokens()
{
    m_accessToken.clear();
    QSettings settings("Scirise", "MyApp");
    settings.remove("auth/refresh");
}

void AuthManager::logout()
{
    clearTokens();
}