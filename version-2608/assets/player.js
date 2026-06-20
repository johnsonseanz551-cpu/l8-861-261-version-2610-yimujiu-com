(function () {
  function setupPlayer(player) {
    var video = player.querySelector("video");
    var button = player.querySelector("[data-player-button]");
    var source = player.getAttribute("data-video-src");
    var hlsInstance = null;
    var initialized = false;

    if (!video || !button || !source) {
      return;
    }

    function initialize() {
      if (initialized) {
        return Promise.resolve();
      }
      initialized = true;

      if (window.Hls && window.Hls.isSupported()) {
        hlsInstance = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true,
          backBufferLength: 90
        });
        hlsInstance.loadSource(source);
        hlsInstance.attachMedia(video);
      } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = source;
      } else {
        video.src = source;
      }

      return Promise.resolve();
    }

    function playVideo() {
      initialize().then(function () {
        player.classList.add("is-playing");
        var playPromise = video.play();
        if (playPromise && typeof playPromise.catch === "function") {
          playPromise.catch(function () {
            player.classList.remove("is-playing");
          });
        }
      });
    }

    button.addEventListener("click", playVideo);
    video.addEventListener("play", function () {
      player.classList.add("is-playing");
    });
    video.addEventListener("pause", function () {
      if (video.currentTime === 0 || video.ended) {
        player.classList.remove("is-playing");
      }
    });
    video.addEventListener("ended", function () {
      player.classList.remove("is-playing");
    });

    window.addEventListener("beforeunload", function () {
      if (hlsInstance && typeof hlsInstance.destroy === "function") {
        hlsInstance.destroy();
      }
    });
  }

  Array.prototype.slice.call(document.querySelectorAll(".movie-player")).forEach(setupPlayer);
})();
