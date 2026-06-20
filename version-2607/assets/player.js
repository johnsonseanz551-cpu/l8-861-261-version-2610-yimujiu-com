(function () {
  window.setupMoviePlayer = function (streamUrl) {
    var video = document.getElementById('movieVideo');
    var overlay = document.querySelector('.player-overlay');
    var message = document.querySelector('.player-message');
    var playButtons = document.querySelectorAll('[data-player-action="play"]');
    var muteButtons = document.querySelectorAll('[data-player-action="mute"]');
    var fullscreenButtons = document.querySelectorAll('[data-player-action="fullscreen"]');
    var controlBar = document.querySelector('.player-controls');
    var hls = null;
    var attached = false;

    if (!video || !streamUrl) {
      return;
    }

    function showMessage(text) {
      if (!message) {
        return;
      }
      message.textContent = text;
      message.classList.add('is-visible');
    }

    function hideOverlay() {
      if (overlay) {
        overlay.classList.add('is-hidden');
      }
      if (controlBar) {
        controlBar.classList.add('is-visible');
      }
    }

    function updatePlayState() {
      var text = video.paused ? '▶' : 'Ⅱ';
      playButtons.forEach(function (button) {
        button.textContent = text;
      });
    }

    function attachSource(onReady) {
      if (attached) {
        onReady();
        return;
      }
      attached = true;

      if (window.Hls && window.Hls.isSupported()) {
        hls = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true
        });
        hls.loadSource(streamUrl);
        hls.attachMedia(video);
        hls.on(window.Hls.Events.MANIFEST_PARSED, function () {
          onReady();
        });
        hls.on(window.Hls.Events.ERROR, function (event, data) {
          if (data && data.fatal) {
            showMessage('视频暂时无法播放，请稍后再试');
          }
        });
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = streamUrl;
        video.addEventListener('loadedmetadata', onReady, { once: true });
        video.load();
      } else {
        showMessage('视频暂时无法播放，请稍后再试');
      }
    }

    function playVideo() {
      hideOverlay();
      attachSource(function () {
        var playResult = video.play();
        if (playResult && typeof playResult.catch === 'function') {
          playResult.catch(function () {
            showMessage('点击播放器继续观看');
          });
        }
      });
    }

    function toggleVideo() {
      if (video.paused) {
        playVideo();
      } else {
        video.pause();
      }
    }

    playButtons.forEach(function (button) {
      button.addEventListener('click', function (event) {
        event.stopPropagation();
        toggleVideo();
      });
    });

    muteButtons.forEach(function (button) {
      button.addEventListener('click', function (event) {
        event.stopPropagation();
        video.muted = !video.muted;
        button.textContent = video.muted ? '静音' : '声音';
      });
    });

    fullscreenButtons.forEach(function (button) {
      button.addEventListener('click', function (event) {
        event.stopPropagation();
        if (document.fullscreenElement) {
          document.exitFullscreen();
        } else if (video.requestFullscreen) {
          video.requestFullscreen();
        }
      });
    });

    if (overlay) {
      overlay.addEventListener('click', playVideo);
    }

    video.addEventListener('click', toggleVideo);
    video.addEventListener('play', updatePlayState);
    video.addEventListener('pause', updatePlayState);
    video.addEventListener('ended', updatePlayState);
    window.addEventListener('beforeunload', function () {
      if (hls) {
        hls.destroy();
      }
    });
    updatePlayState();
  };
})();
