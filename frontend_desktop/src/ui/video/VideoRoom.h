#ifndef VIDEOROOM_H
#define VIDEOROOM_H

#include <QWebEngineView>
#include <QWebEnginePage>
#include <QWebEngineProfile>
#include <QVBoxLayout>
#include <QWebChannel>
#include <QWidget>
#include <QWebEnginePermission>
#include <QJsonObject>
#include <QJsonDocument>

#include "core/video/VideoCallManager.h"
#include "core/video/WebRTCBridge.h"

class VideoRoom : public QWidget{
    Q_OBJECT
    public:
        explicit VideoRoom(VideoCallManager *callManager = nullptr, QWidget *parent = nullptr);

    private:
        VideoCallManager *m_callManager;
        QWebEngineView *m_webView;
        QWebChannel *m_webChannel;
        WebRTCBridge *m_bridge;

};

#endif