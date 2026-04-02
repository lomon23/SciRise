#include "TokenManager.h"
#include <QSettings>

TokenManager::TokenManager(QObject *parent) : QObject(parent) {}

void TokenManager::saveTokens(const QString &accessToken, const QString &refreshToken) {
    m_accessToken = accessToken;
    
    QSettings settings("SciRise", "DesktopClient");
    settings.setValue("refreshToken", refreshToken);
}

void TokenManager::clearTokens() {
    m_accessToken.clear();
    
    QSettings settings("SciRise", "DesktopClient");
    settings.remove("refreshToken");
}

QString TokenManager::getAccessToken() const {
    return m_accessToken;
}

QString TokenManager::getRefreshToken() const {
    QSettings settings("SciRise", "DesktopClient");
    return settings.value("refreshToken").toString();
}

bool TokenManager::hasValidToken() const {
    return !m_accessToken.isEmpty();
}