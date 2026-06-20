import { H as Hls } from './hls.js';

const players = Array.from(document.querySelectorAll('[data-player]'));

function initPlayer(shell) {
    const video = shell.querySelector('video');
    const cover = shell.querySelector('.player-cover');
    const stream = shell.dataset.stream;
    let ready = false;
    let hls = null;

    if (!video || !cover || !stream) {
        return;
    }

    const bind = () => {
        if (ready) {
            return;
        }

        ready = true;

        if (Hls.isSupported()) {
            hls = new Hls({
                enableWorker: true,
                lowLatencyMode: false,
            });
            hls.loadSource(stream);
            hls.attachMedia(video);
            hls.on(Hls.Events.MANIFEST_PARSED, () => {
                video.play().catch(() => {});
            });
        } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = stream;
            video.addEventListener('loadedmetadata', () => {
                video.play().catch(() => {});
            }, { once: true });
        }
    };

    const play = () => {
        bind();
        cover.classList.add('is-hidden');
        video.controls = true;
        video.play().catch(() => {});
    };

    cover.addEventListener('click', play);
    video.addEventListener('click', () => {
        if (!ready) {
            play();
        }
    });

    window.addEventListener('pagehide', () => {
        if (hls) {
            hls.destroy();
        }
    });
}

players.forEach(initPlayer);
