#ifndef AUTHMANAGER_H
#define AUTHMANAGER_H

#include <QObject>
#include <QNetworkAccessManager>
#include <QNetworkReply>
#include <QNetworkRequest>
#include <QSettings>
#include <QJsonDocument>
#include <QJsonObject>
#include <QQueue>

class AuthManager: public QObject{
    Q_OBJECT
    public:
        explicit AuthManager(QObject *parent = nullptr);

        void registerUser(const QString &email, const QString &username, const QString &password);
        void login(const QString &email, const QString &password);
        void logout();

        void makeAuthenticatedGet(const QUrl &url);

    signals:
        void registerSuccess();
        void registerFailed(const QString &error);
    
        void loginSuccess();
        void loginFailed(const QString &error);
    
        void dataReceived(const QByteArray &data);
        void requestFailed(const QString &error);

    private slots:
        void onRegisterFinished();
        void onLoginFinished();
        void onRefreshFinished();
        void onAuthenticatedRequestFinished();

    private:
        void refreshAccessToken();
        void retryPendingRequests();
    
        void saveRefreshToken(const QString &token);
        QString loadRefreshToken();
        void clearTokens();

        QNetworkAccessManager *m_networkManager;
        
        QString m_accessToken;
        const QString m_baseUrl = "API_BASE_URL";

        struct PendingRequest {
            QUrl url;
        };
        
        QQueue<PendingRequest> m_pendingRequests;
        bool m_isRefreshing = false;
};

#endif