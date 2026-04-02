#ifndef TOKENMANAGER_H
#define TOKENMANAGER_H

#include <QObject>
#include <QSettings>

class TokenManager: public QObject{
    Q_OBJECT

    public:
        explicit TokenManager(QObject *parent = nullptr);

        void saveTokens(const QString &accessToken, const QString &refreshToken);
        void clearTokens();

        QString getAccessToken() const;
        QString getRefreshToken() const;
        bool hasValidToken() const;

    private:
        QString m_accessToken; 
};

#endif