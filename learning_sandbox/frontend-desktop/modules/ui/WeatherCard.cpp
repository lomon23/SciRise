#include "WeatherCard.h"
#include <QLabel>
#include <QVBoxLayout>

WeatherCard::WeatherCard(const QString& day, double temp, QWidget* parent) : QFrame(parent) {
    setFixedSize(120, 160);
    setStyleSheet("background-color: #306c8c; border-radius: 12px; color: white;");

    auto* layout = new QVBoxLayout(this);
    auto* lblDay = new QLabel(day, this);
    auto* lblTemp = new QLabel(QString::number(temp) + "°C", this);

    layout->addWidget(lblDay);
    layout->addWidget(lblTemp);
}