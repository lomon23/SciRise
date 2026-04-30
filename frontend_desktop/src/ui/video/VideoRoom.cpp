#include "VideoRoom.h"

VideoRoom::VideoRoom(VideoCallManager *callManager, QWidget *parent) 
    : QWidget(parent), m_callManager(callManager) {
    
    m_webView = new QWebEngineView(this);
    QVBoxLayout *layout = new QVBoxLayout(this);
    layout->addWidget(m_webView);

    connect(m_webView->page(), &QWebEnginePage::permissionRequested, this, [](QWebEnginePermission permission) {
        auto type = permission.permissionType();
        if (type == QWebEnginePermission::PermissionType::MediaAudioCapture ||
            type == QWebEnginePermission::PermissionType::MediaVideoCapture ||
            type == QWebEnginePermission::PermissionType::MediaAudioVideoCapture) {
            permission.grant();
        }
    });

    m_webChannel = new QWebChannel(this);
    m_bridge = new WebRTCBridge(this);
    
    m_webChannel->registerObject(QStringLiteral("backendBridge"), m_bridge);
    m_webView->page()->setWebChannel(m_webChannel);

    connect(m_bridge, &WebRTCBridge::outOfferReady, m_callManager, [this](const QJsonObject& offer){
        QJsonObject payload;
        payload["type"] = "offer";
        payload["sdp"] = offer;
        m_callManager->getSocketClient()->sendWebRtcSignal(payload);
    });

    connect(m_callManager, &VideoCallManager::offerReceived, this, [this](const QJsonObject& offer, const QString& sender){
        QJsonDocument doc(offer);
        QString jsCode = QString("handleRemoteOffer(%1);").arg(QString(doc.toJson(QJsonDocument::Compact)));
        m_webView->page()->runJavaScript(jsCode);
    });

    m_webView->load(QUrl("qrc:/resources/webrtc.html"));
}