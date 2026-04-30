#ifndef LOGINFORM_H
#define LOGINFORM_H

#include <QWidget>
#include <QPushButton>
#include <QLineEdit>
#include <QVBoxLayout>

#include "core/auth/AuthServise.h"
#include "network/TokenManager.h"
#include "network/ApiClient.h"

class LoginForm: public QWidget{
    Q_OBJECT

    public:
        explicit LoginForm(QWidget *parent = nullptr);

    private slots:
        void onLoginButtonClicked();

    private:
        QLineEdit *loginInput;
        QLineEdit *passwordInput;
        QPushButton *loginButton;
        QVBoxLayout *layout;

        TokenManager *tokenManager;
        ApiClient *apiClient;
        AuthServise *authServise;
};

#endif