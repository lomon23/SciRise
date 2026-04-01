#include <QApplication>
#include "LoginForm.h"

int main(int argc, char *argv[]) {
    QApplication app(argc, argv);

    LoginForm window;
    window.show();

    return app.exec();
}