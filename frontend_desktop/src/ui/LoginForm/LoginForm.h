#ifndef LOGINFORM_H
#define LOGINFORM_H

#include <QWidget>
#include <QPushButton>
#include <QLineEdit>
#include <QVBoxLayout>
#include "AuthManager.h"

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

        AuthManager *authManager;
};

#endif