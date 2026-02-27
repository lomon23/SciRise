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
#include <QLabel>
#include <QDebug>
#include <QJsonDocument>

WeatherUI::WeatherUI(QWidget *parent) : QWidget(parent) {
    setWindowTitle("SciRise Weather");
    resize(900, 700);

    auto *mainLayout = new QVBoxLayout(this);
    
    auto *searchLayout = new QHBoxLayout();
    auto *cityInput = new QLineEdit(this);
    cityInput->setPlaceholderText("Введіть назву міста...");
    auto *searchButton = new QPushButton("Пошук", this);
    searchButton->setCursor(Qt::PointingHandCursor);
    searchLayout->addWidget(cityInput);
    searchLayout->addWidget(searchButton);

    auto *currentWeatherWidget = new QWidget(this);
    currentWeatherWidget->setObjectName("CurrentWeather");
    auto *currentLayout = new QVBoxLayout(currentWeatherWidget);
    auto *lblMainInfo = new QLabel("Оберіть місто", currentWeatherWidget);
    lblMainInfo->setObjectName("MainTempLabel");
    lblMainInfo->setAlignment(Qt::AlignCenter);
    currentLayout->addWidget(lblMainInfo);

    auto *hourlyScroll = new QScrollArea(this);
    hourlyScroll->setWidgetResizable(true);
    hourlyScroll->setFixedHeight(120);
    auto *hourlyContainer = new QWidget();
    hourlyContainer->setObjectName("HourlyContainer");
    auto *hourlyLayout = new QHBoxLayout(hourlyContainer);
    hourlyLayout->setSizeConstraint(QLayout::SetMinAndMaxSize);
    hourlyScroll->setWidget(hourlyContainer);

    auto *dailyScroll = new QScrollArea(this);
    dailyScroll->setWidgetResizable(true);
    auto *dailyContainer = new QWidget();
    dailyContainer->setObjectName("DailyContainer");
    auto *dailyLayout = new QHBoxLayout(dailyContainer);
    dailyLayout->setSizeConstraint(QLayout::SetMinAndMaxSize);
    dailyScroll->setWidget(dailyContainer);

    mainLayout->addLayout(searchLayout);
    mainLayout->addWidget(currentWeatherWidget);
    mainLayout->addWidget(new QLabel("Погодинний прогноз (24г):"));
    mainLayout->addWidget(hourlyScroll);
    mainLayout->addWidget(new QLabel("Прогноз на тиждень:"));
    mainLayout->addWidget(dailyScroll);

    connect(searchButton, &QPushButton::clicked, this, [this, cityInput]() {
        QString text = cityInput->text().trimmed();
        if (!text.isEmpty()) emit searchRequested(text);
    });
    connect(cityInput, &QLineEdit::returnPressed, searchButton, &QPushButton::click);

    applyStyles();
}

void WeatherUI::updateView(const QJsonObject& root) {
    auto *lblMain = findChild<QLabel*>("MainTempLabel");
    QJsonObject current = root["current"].toObject();
    if (lblMain) {
        lblMain->setText(QString("%1: %2°C\n%3")
            .arg(root["city"].toString())
            .arg(current["temp"].toDouble())
            .arg(current["advice"].toString()));
    }

    auto updateContainer = [this](const QString& objectName, const QJsonArray& data, bool isHourly) {
        QWidget *container = findChild<QWidget*>(objectName);
        if (!container) return;
        QLayout *layout = container->layout();
        
        QLayoutItem *item;
        while ((item = layout->takeAt(0))) {
            if (QWidget *w = item->widget()) w->deleteLater();
            delete item;
        }

        for (const QJsonValue& val : data) {
            QJsonObject obj = val.toObject();
            QString label = isHourly ? obj["time"].toString() : obj["date"].toString();
            double t = isHourly ? obj["temp"].toDouble() : obj["temp_max"].toDouble();
            layout->addWidget(new WeatherCard(label, t, container));
        }
    };

    updateContainer("HourlyContainer", root["hourly"].toArray(), true);
    updateContainer("DailyContainer", root["daily"].toArray(), false);
}

void WeatherUI::applyStyles() {
    this->setStyleSheet(R"(
        QWidget { background-color: #1a1a1a; color: white; font-family: 'Segoe UI'; }
        QLineEdit { background-color: #2d2d2d; border-radius: 5px; padding: 5px; border: 1px solid #3d3d3d; }
        QPushButton { background-color: #306c8c; border-radius: 5px; padding: 5px 15px; }
        #MainTempLabel { font-size: 24px; font-weight: bold; margin: 20px; color: #4a90e2; }
        QScrollArea { border: none; background: transparent; }
        #HourlyContainer, #DailyContainer { background: transparent; }
    )");
}

void WeatherUI::showError(const QString &message) {
    QMessageBox::critical(this, "SciRise Error", message);
}