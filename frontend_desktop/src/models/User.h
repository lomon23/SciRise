#ifndef USER_H
#define USER_H

#include <QString>

struct User {
    int id = 0;
    QString username;
    QString email;
    QString avatarUrl;
    
    bool isValid() const {
        return id > 0 && !username.isEmpty();
    }
};

#endif