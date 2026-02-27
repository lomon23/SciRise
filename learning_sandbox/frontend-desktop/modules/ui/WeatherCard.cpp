#include "WeatherCard.h"
#include <QLabel>
#include <QVBoxLayout>

WeatherCard::WeatherCard(const QString& day, double temp, QWidget* parent) : QFrame(parent) {
    setFixedSize(100, 100);
    setStyleSheet("WeatherCard { background-color: #2d2d2d; border-radius: 10px; border: 1px solid #3d3d3d; } "
                  "QLabel { color: white; font-size: 11px; }");

    auto* layout = new QVBoxLayout(this);
    auto* lblDay = new QLabel(day, this);
    lblDay->setAlignment(Qt::AlignCenter);
    
    auto* lblTemp = new QLabel(QString::number(temp, 'f', 1) + "°C", this);
    lblTemp->setAlignment(Qt::AlignCenter);
    QFont font = lblTemp->font();
    font.setBold(true);
    lblTemp->setFont(font);

    layout->addWidget(lblDay);
    layout->addWidget(lblTemp);
}