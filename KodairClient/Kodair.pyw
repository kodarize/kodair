import sys
from PyQt5.QtCore import Qt, QUrl, QRect
from PyQt5.QtWidgets import QApplication, QMainWindow, QSystemTrayIcon, QMenu
from PyQt5.QtGui import QIcon, QGuiApplication
from PyQt5.QtWebEngineWidgets import QWebEngineView

# Lightweight Kodair Client by Coley Hatt

class WebBrowser(QMainWindow):
    def __init__(self):
        super().__init__()

        self.setWindowTitle("Kodair")

        self.setWindowIcon(QIcon("icon.png"))  # Path to your icon file

        self.web_view = QWebEngineView()

        self.web_view.load(QUrl("https://kodair.us"))

        self.setCentralWidget(self.web_view)

        self.init_system_tray_icon()
        
        self.showMaximized()
        
    def init_system_tray_icon(self):
        self.tray_icon = QSystemTrayIcon(self)

        self.tray_icon.setIcon(QIcon("icon.png"))  # Path to your icon file
        
        self.tray_icon_menu = QMenu()
        restore_action = self.tray_icon_menu.addAction("Restore")
        exit_action = self.tray_icon_menu.addAction("Exit")

        restore_action.triggered.connect(self.show)
        exit_action.triggered.connect(self.close)

        self.tray_icon.setContextMenu(self.tray_icon_menu)
        
        self.tray_icon.show()
        
    def closeEvent(self, event):
        event.ignore()
        self.hide()
        
    def set_windowed_fullscreen(self):
        screen_geometry = QGuiApplication.primaryScreen().geometry()

        self.setGeometry(screen_geometry)
        
        self.setWindowFlags(Qt.FramelessWindowHint)

        self.show()

if __name__ == '__main__':
    app = QApplication(sys.argv)
    
    # Create an instance of the WebBrowser class
    browser = WebBrowser()
    
    # Run the application event loop
    sys.exit(app.exec_())
