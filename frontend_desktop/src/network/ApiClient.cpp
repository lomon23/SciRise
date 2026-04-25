#include "ApiClient.h"
#include <QNetworkRequest>
#include <QNetworkReply>

ApiClient::ApiClient(const QString &baseUrl, TokenManager *tokenManager, QObject *parent)
    : QObject(parent), m_baseUrl(baseUrl), m_tokenManager(tokenManager) {
    m_networkManager = new QNetworkAccessManager(this);
}

QNetworkReply* ApiClient::get(const QString &endpoint) {
    QUrl url(m_baseUrl + endpoint);
    QNetworkRequest request(url);
    
    if (m_tokenManager->hasValidToken()) {
        QString bearerHeader = "Bearer " + m_tokenManager->getAccessToken();
        request.setRawHeader("Authorization", bearerHeader.toUtf8());
    }
    
    return m_networkManager->get(request);
}

QNetworkReply* ApiClient::post(const QString &endpoint, const QByteArray &data) {
    QUrl url(m_baseUrl + endpoint);
    QNetworkRequest request(url);
    
    request.setHeader(QNetworkRequest::ContentTypeHeader, "application/json");
    
    if (m_tokenManager->hasValidToken()) {
        QString bearerHeader = "Bearer " + m_tokenManager->getAccessToken();
        request.setRawHeader("Authorization", bearerHeader.toUtf8());
    }
    
    return m_networkManager->post(request, data);
}