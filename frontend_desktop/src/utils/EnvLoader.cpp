#include "EnvLoader.h"
#include <QFile>
#include <QTextStream>
#include <QDebug>

namespace EnvLoader {
    void load(const QString &filePath) {
        QFile file(filePath);
        if (!file.open(QIODevice::ReadOnly | QIODevice::Text)) {
            qWarning() << "Could not open .env file at:" << filePath;
            return;
        }

        QTextStream in(&file);
        while (!in.atEnd()) {
            QString line = in.readLine().trimmed();
            
            if (line.isEmpty() || line.startsWith("#")) continue;
            
            int equalsPos = line.indexOf('=');
            if (equalsPos > 0) {
                QString key = line.left(equalsPos).trimmed();
                QString value = line.mid(equalsPos + 1).trimmed();
                
                qputenv(key.toUtf8(), value.toUtf8());
            }
        }
        file.close();
    }
}