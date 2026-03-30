#include <QApplication>
#include <QFile>
#include <QTextStream>
#include <QDir>
#include <QDebug>
#include <QWidget>
#include <QPushButton>
#include <QVBoxLayout>
#include <QDebug>

#include "AuthManager/AuthManager.h" 

void loadEnv(const QString &filePath) {
    QFile file(filePath);
    if (!file.open(QFile::ReadOnly | QFile::Text)) {
        qWarning() << "Cannot open .env file at:" << file.fileName();
        return;
    }

    QTextStream in(&file);
    while (!in.atEnd()) {
        QString line = in.readLine().trimmed();
 
        if (line.isEmpty() || line.startsWith("#")) {
            continue;
        }

        int eqIndex = line.indexOf('=');
        if (eqIndex > 0) {
            QString key = line.left(eqIndex).trimmed();
            QString value = line.mid(eqIndex + 1).trimmed();
            
            if (value.startsWith('"') && value.endsWith('"')) {
                value = value.mid(1, value.length() - 2);
            }

            qputenv(key.toUtf8(), value.toUtf8());
        }
    }
}

int main(int argc, char *argv[]){
    QApplication app(argc, argv);

    loadEnv(".env");

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