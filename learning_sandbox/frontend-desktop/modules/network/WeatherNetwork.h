#pragma once
#include <QObject>

class QNetworkAccessManager;
class QNetworkReply;
class QJsonObject;

class WeatherNetwork : public QObject {
    Q_OBJECT
public:
    explicit WeatherNetwork(QObject* parent = nullptr);
    void fetchWeather(const QString& city);

signals:
    void dataReady(const QJsonObject& root);
    void errorOccurred(const QString& msg);

private slots:
    void onReplyFinished(QNetworkReply* reply);

private:
    QNetworkAccessManager* m_manager;
};