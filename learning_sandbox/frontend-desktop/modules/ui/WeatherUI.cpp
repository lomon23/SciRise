#include "WeatherUI.h"
#include "WeatherCard.h"
#include <QVBoxLayout>
#include <QHBoxLayout>
#include <QPushButton>
#include <QLineEdit>
#include <QScrollArea>
#include <QMessageBox>
#include <QJsonObject>
#include <QJsonArray>

WeatherUI::WeatherUI(QWidget *parent) : QWidget(parent) {
    // 1. Базові налаштування вікна
    setWindowTitle("SciRise Weather");
    resize(800, 600);

    // 2. Головний вертикальний лейаут (розташовує елементи зверху вниз)
    auto *mainLayout = new QVBoxLayout(this);

    // 3. Верхня панель (Поле вводу + Кнопка)
    auto *searchLayout = new QHBoxLayout(); // Горизонтальний лейаут
    auto *cityInput = new QLineEdit(this);
    cityInput->setPlaceholderText("Введіть назву міста...");
    
    auto *searchButton = new QPushButton("Пошук", this);
    searchButton->setCursor(Qt::PointingHandCursor);

    searchLayout->addWidget(cityInput);
    searchLayout->addWidget(searchButton);

    // 4. Зона для карток прогнозу (Скрол)
    auto *scrollArea = new QScrollArea(this);
    scrollArea->setWidgetResizable(true);
    
    // Контейнер, який буде знаходитись всередині скролу
    auto *cardContainer = new QWidget();
    cardContainer->setObjectName("CardContainer"); // Спеціально для твого applyStyles()
    
    // Горизонтальний лейаут для карток (зліва направо)
    auto *cardsLayout = new QHBoxLayout(cardContainer);
    cardsLayout->setAlignment(Qt::AlignLeft);
    
    scrollArea->setWidget(cardContainer);

    // 5. Збираємо все до купи у головний лейаут
    mainLayout->addLayout(searchLayout);
    mainLayout->addWidget(scrollArea);

    // 6. МАГІЯ СИГНАЛІВ: коли тиснемо кнопку, відправляємо сигнал searchRequested
    connect(searchButton, &QPushButton::clicked, this, [this, cityInput]() {
        if (!cityInput->text().trimmed().isEmpty()) {
            // Випромінюємо сигнал, який у main.cpp підключений до WeatherNetwork
            emit searchRequested(cityInput->text().trimmed()); 
        }
    });
    
    // Щоб пошук працював і по натисканню Enter у полі вводу
    connect(cityInput, &QLineEdit::returnPressed, searchButton, &QPushButton::click);

    // 7. Застосовуємо твої стилі з методу applyStyles()
    applyStyles();
}

void WeatherUI::applyStyles() {
    this->setStyleSheet(R"(
        QWidget { 
            background-color: #1f1f1f; 
            color: white; 
            font-family: 'Segoe UI', sans-serif;
        }
        QLineEdit { 
            background-color: #306c8c; 
            border-radius: 8px; 
            padding: 8px; 
            border: none;
        }
        QScrollArea { border: none; background: transparent; }
        #CardContainer { background: transparent; }
    )");
}

void WeatherUI::updateView(const QJsonObject& root) {
    QJsonObject current = root["current"].toObject();
    double temp = current["temp"].toDouble();
    QString advice = current["advice"].toString();

    QWidget *container = this->findChild<QWidget*>("CardContainer");
    if (!container) return;

    QHBoxLayout *layout = qobject_cast<QHBoxLayout*>(container->layout());
    if (!layout) return;

    QLayoutItem *child;
    while((child = layout->takeAt(0)) != nullptr){
        delete child->widget();
        delete child;
    }

    QJsonArray forecast = root["forecast"].toArray();
    for (const QJsonValue& val : forecast) {
        QJsonObject dayObj = val.toObject();
        auto *card = new WeatherCard(
            dayObj["day"].toString(),
            dayObj["temp"].toDouble(),
            container
        );

        layout->addWidget(card);
    }
}

void WeatherUI::showError(const QString &message) {
    QMessageBox::critical(this, "Помилка", message);
}