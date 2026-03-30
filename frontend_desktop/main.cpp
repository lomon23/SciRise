#include <QApplication>
#include <QWidget>
#include <QPushButton>
#include <QVBoxLayout>
#include <QDebug>

#include "AuthManager/AuthManager.h" 

int main(int argc, char *argv[]){
    QApplication app(argc, argv);

    QWidget window;
    window.resize(400, 300);
    window.setWindowTitle("SciRise Desktop Auth Test");

    QVBoxLayout *layout = new QVBoxLayout(&window);

    QPushButton *loginBtn = new QPushButton("Test Login", &window);
    layout->addWidget(loginBtn);

    AuthManager *authManager = new AuthManager(&window);

    QObject::connect(authManager, &AuthManager::loginSuccess, [](){
        qDebug() << "[SUCCESS] Login successful! Tokens are saved in QSettings.";
    });

    QObject::connect(authManager, &AuthManager::loginFailed, [](const QString &error){
        qDebug() << "[ERROR] Login failed:" << error;
    });

    QObject::connect(loginBtn, &QPushButton::clicked, [authManager](){
        qDebug() << "Sending login request to backend...";
        
        authManager->login("user@scirise.com", "StrongPassword123!");
    });

    window.show();
    return app.exec();
}