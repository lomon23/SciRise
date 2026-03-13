#include <QApplication>
#include <QWidget>

int main(int argc, char *argv[]){
    QApplication app(argc, argv);

    QWidget window;
    window.resize(400, 300);
    window.setWindowTitle("Desktop application");
    window.show();

    return app.exec();
}