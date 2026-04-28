#include "ChatWindow.h"
#include <QCoreApplication>

ChatWindow::ChatWindow(TokenManager *tokenManager, QWidget *parent)
    : QWidget(parent) {

    m_textEdit = new QTextEdit(this);
    m_textEdit->setReadOnly(true);
    m_messageInput = new QLineEdit(this);
    m_sendButton = new QPushButton("Send", this);

    QVBoxLayout *layout = new QVBoxLayout(this);
    layout->addWidget(m_textEdit);
    layout->addWidget(m_messageInput);
    layout->addWidget(m_sendButton);

    m_chatManager = new ChatManager(tokenManager, this);

    connect(m_chatManager, &ChatManager::messageReceived, this, &ChatWindow::onMessageReceived);
    connect(m_sendButton, &QPushButton::clicked, this, &ChatWindow::onSendButtonClicked);

    QString wsUrl = qEnvironmentVariable("WS_CHAT_URL");

    m_chatManager->connectToChat(wsUrl);
}

void ChatWindow::onMessageReceived(const ChatMessage &msg) {
    QString html = QString("<b>%1</b>: %2").arg(msg.username, msg.text);
    m_textEdit->append(html);
}

void ChatWindow::onSendButtonClicked() {
    QString text = m_messageInput->text();
    
    m_chatManager->sendMessage(text);
    
    m_messageInput->clear();
}