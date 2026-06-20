function initMoviePlayer(url) {
  var player = document.querySelector("[data-player]");
  if (!player) {
    return;
  }

  var video = player.querySelector("video");
  var cover = player.querySelector(".player-cover");
  var triggers = Array.prototype.slice.call(player.querySelectorAll(".play-trigger"));
  var loaded = false;

  function start() {
    if (!video) {
      return;
    }

    if (cover) {
      cover.classList.add("is-hidden");
    }

    video.controls = true;

    if (!loaded) {
      loaded = true;
      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = url;
        video.addEventListener("loadedmetadata", function () {
          video.play().catch(function () {});
        }, { once: true });
      } else if (window.Hls && Hls.isSupported()) {
        var hls = new Hls({ enableWorker: true });
        hls.loadSource(url);
        hls.attachMedia(video);
        hls.on(Hls.Events.MANIFEST_PARSED, function () {
          video.play().catch(function () {});
        });
      } else {
        video.src = url;
        video.play().catch(function () {});
      }
    } else {
      video.play().catch(function () {});
    }
  }

  triggers.forEach(function (trigger) {
    trigger.addEventListener("click", function (event) {
      event.preventDefault();
      event.stopPropagation();
      start();
    });
  });

  if (video) {
    video.addEventListener("click", function () {
      if (!loaded || video.paused) {
        start();
      }
    });
  }
}
