<script>
  let player = null;
  export let mp3 = null;

  const log = (...args) => console.log(...args);
  $: {
    // triggered when mp3 updated from outside
    log("play", mp3);
    startPlayer();
  }

  document.addEventListener("DOMContentLoaded", () => {
    log("init app and load polyfills");
    // Install built-in polyfills to patch browser incompatibilities.
    shaka.polyfill.installAll();
    // Check to see if the browser supports the basic APIs Shaka needs.
    if (shaka.Player.isBrowserSupported()) {
      // Everything looks good!
      initPlayer();
    } else {
      // This browser does not have the minimum set of APIs we need.
      console.error("Browser not supported!");
    }
  });

  function initPlayer() {
    log("init player");
    // Create a Player instance.
    player = new shaka.Player(document.getElementById("player"));

    // Attach player to the window to make it easy to access in the JS console.
    log("expose player on global");
    globalThis.player = player;

    // Listen for error events.
    // player.addEventListener("error", onErrorEvent);

    // Try to load a manifest.
    // This is an asynchronous process.
    // player.load(manifestUri).then(function() {
    //   // This runs if the asynchronous load is successful.
    //   console.log('The video has now been loaded!');
    // }).catch(onError);  // onError is executed if the asynchronous load fails.
  }
  function startPlayer() {
    if (!player || !mp3) {
      return;
    }
    log("start player", { player, mp3 });
    player
      .load(mp3)
      .then(() => {
        log("load success");
        player.getMediaElement().play();
      })
      .catch(e => log("load error", e));
  }
</script>

<style>
  audio {
    width: 100%;
  }
</style>

<audio id="player" controls />
