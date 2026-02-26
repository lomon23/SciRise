#ifndef WEATHERCARD_H
#define WEATHERCARD_H
#include <QFrame>
#include <QString>

class WeatherCard : public QFrame {
    Q_OBJECT
public:
    explicit WeatherCard(const QString& day, double temp, QWidget* parent = nullptr);
};
#endif