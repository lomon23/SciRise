#ifndef WEATHERUI_H
#define WEATHERUI_H
#include <QWidget>
#include <QJsonObject>
#include <QString>

class WeatherUI : public QWidget {
    Q_OBJECT
public:
    explicit WeatherUI(QWidget* parent = nullptr);

signals:
    void searchRequested(const QString &city);

public slots:
    void updateView(const QJsonObject& root);
    void applyStyles();
    void showError(const QString &message);
};
#endif