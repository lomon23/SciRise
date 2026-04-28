#include <QApplication>
#include "LoginForm.h"
#include "utils/EnvLoader.h"

int main(int argc, char *argv[]) {
    QApplication app(argc, argv);

    EnvLoader::load("../.env");

    LoginForm window;
    window.show();

    return app.exec();
}