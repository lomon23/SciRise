#ifndef CHATWINDOW_H
#define CHATWINDOW_H

#include <QWidget>
#include <QTextEdit>
#include <QLineEdit>
#include <QPushButton>
#include <QVBoxLayout>
#include "ChatManager.h"
#include "TokenManager.h"

class ChatWindow : public QWidget {
    Q_OBJECT
public:
    explicit ChatWindow(TokenManager *tokenManager, QWidget *parent = nullptr);
    ~ChatWindow() = default;

private slots:
    void onSendButtonClicked();
    void onMessageReceived(const ChatMessage &msg);

private:
    QTextEdit *m_textEdit;
    QLineEdit *m_messageInput;
    QPushButton *m_sendButton;

    ChatManager *m_chatManager;
};

#endif 