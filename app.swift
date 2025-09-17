import SwiftUI
import AVKit

struct ScreensaverView: View {
    private let player: AVPlayer

    init() {
        if let path = Bundle.main.path(forResource: "screensaver", ofType:"mp4") {
            self.player = AVPlayer(url: URL(fileURLWithPath: path))
            self.player.actionAtItemEnd = .none
            NotificationCenter.default.addObserver(
                forName: .AVPlayerItemDidPlayToEndTime,
                object: self.player.currentItem,
                queue: .main
            ) { _ in
                self.player.seek(to: .zero)
                self.player.play()
            }
        } else {
            self.player = AVPlayer()
        }
    }

    var body: some View {
        VideoPlayer(player: player)
            .ignoresSafeArea() // Fullscreen
            .onAppear {
                player.play()
            }
    }
}

@main
struct ScreensaverApp: App {
    var body: some Scene {
        WindowGroup {
            ScreensaverView()
        }
    }
}