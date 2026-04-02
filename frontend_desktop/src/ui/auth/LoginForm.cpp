#include <QFile>
#include <QTextStream>
#include "LoginForm.h"

LoginForm::LoginForm(QWidget *parent) : QWidget(parent){
    this->setWindowTitle("SciRise");
    this->resize(400, 300);

    QString baseUrl = "";
    QFile envFile("../.env");

    if(envFile.open(QIODevice::ReadOnly | QIODevice::Text)){
        QTextStream in(&envFile);
        while(!in.atEnd()){
            QString line = in.readLine().trimmed();
            
            if(line.isEmpty() || line.startsWith("#")) {
                continue;
            }

            if(line.startsWith("API_BASE_URL=")){
                baseUrl = line.section("=", 1);
                break;
            }
        }
        envFile.close();
    }

    if (baseUrl.isEmpty()) {
        baseUrl = "http://127.0.0.1:8000/api/auth"; 
    }

    tokenManager = new TokenManager(this);
    apiClient = new ApiClient(baseUrl, tokenManager, this);

    authServise = new AuthServise(apiClient, tokenManager, this);

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

    authServise->login(loginText, passwordText);
}