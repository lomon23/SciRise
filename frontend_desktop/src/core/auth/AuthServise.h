#ifndef AUTHSERVISE_H
#define AUTHSERVISE_H

#include <QObject>
#include "network/ApiClient.h"
#include "network/TokenManager.h"

class AuthServise : public QObject {
    Q_OBJECT
public:
    explicit AuthServise(ApiClient *apiClient, TokenManager *tokenManager, QObject *parent = nullptr);

    void registerUser(const QString &email, const QString &username, const QString &password);
    void login(const QString &email, const QString &password);
    void logout();

signals:
    void registerSuccess();
    void registerFailed(const QString &error);
    void loginSuccess();
    void loginFailed(const QString &error);

private:
    ApiClient *m_apiClient;
    TokenManager *m_tokenManager;
};

#endif