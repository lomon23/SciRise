#include "WeatherNetwork.h"
#include <QNetworkAccessManager>
#include <QNetworkReply>
#include <QJsonDocument>
#include <QJsonObject>
#include <QUrlQuery>

WeatherNetwork::WeatherNetwork(QObject* parent) : QObject(parent) {
    m_manager = new QNetworkAccessManager(this);
}

void WeatherNetwork::fetchWeather(const QString& city) {
    QUrl url("http://localhost:8000/weather");
    QUrlQuery query;
    query.addQueryItem("city", city);
    url.setQuery(query);

    QNetworkReply* reply = m_manager->get(QNetworkRequest(url));
    connect(reply, &QNetworkReply::finished, this, [this, reply]() {
        onReplyFinished(reply);
        });
}

void WeatherNetwork::onReplyFinished(QNetworkReply* reply) {
    reply->deleteLater();
    if (reply->error() != QNetworkReply::NoError) {
        emit errorOccurred(reply->errorString());
        return;
    }

    QJsonDocument doc = QJsonDocument::fromJson(reply->readAll());
    if (!doc.isNull()) emit dataReady(doc.object());
}