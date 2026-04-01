#include "LoginForm.h"

LoginForm::LoginForm(QWidget *parent) : QWidget(parent){
    this->setWindowTitle("SciRise");
    this->resize(400, 300);

    authManager = new AuthManager(this);

    loginInput = new QLineEdit(this);
    loginInput->setPlaceholderText("Enter login");

    passwordInput = new QLineEdit(this);
    passwordInput->setPlaceholderText("Enter password");
    passwordInput->setEchoMode(QLineEdit::Password);

    loginButton = new QPushButton("Log in", this);

    layout = new QVBoxLayout(this);
    layout->addWidget(loginInput);
    layout->addWidget(passwordInput);
    layout->addWidget(loginButton);
    this->setLayout(layout);

    connect(loginButton, &QPushButton::clicked, this, &LoginForm::onLoginButtonClicked);
}

void LoginForm::onLoginButtonClicked(){
    QString loginText = loginInput->text();
    QString passwordText = passwordInput->text();

    authManager->login(loginText, passwordText);
}