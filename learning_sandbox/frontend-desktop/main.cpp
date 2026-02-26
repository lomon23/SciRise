#include <QApplication>
#include "modules/network/WeatherNetwork.h"
#include "modules/ui/WeatherUI.h"

int main(int argc, char* argv[]) {
    QApplication a(argc, argv);

    WeatherUI ui;
    WeatherNetwork network;

    QObject::connect(&ui, &WeatherUI::searchRequested, &network, &WeatherNetwork::fetchWeather);
    QObject::connect(&network, &WeatherNetwork::dataReady, &ui, &WeatherUI::updateView);
    QObject::connect(&network, &WeatherNetwork::errorOccurred, &ui, &WeatherUI::showError);

    ui.show();
    return a.exec();
}