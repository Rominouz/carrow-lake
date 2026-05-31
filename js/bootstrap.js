(function () {
  const FIRST_SCENE = 2;
  const MAX_SCENE = 99;

  function sceneId(sceneNumber) {
    return String(sceneNumber).padStart(2, '0');
  }

  function loadScript(src) {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      let done = false;

      function finish(ok) {
        if (done) return;
        done = true;
        clearTimeout(timer);
        if (!ok) script.remove();
        resolve(ok);
      }

      const timer = setTimeout(() => finish(false), 1200);
      script.src = src;
      script.onload = () => finish(true);
      script.onerror = () => finish(false);
      document.head.appendChild(script);
    });
  }

  async function boot() {
    const loadedScenes = [];

    for (let sceneNumber = FIRST_SCENE; sceneNumber <= MAX_SCENE; sceneNumber += 1) {
      const fileName = `scene-${sceneId(sceneNumber)}.js`;
      const ok = await loadScript(`./scenes/${fileName}?v=0.5.2`);

      if (!ok) break;
      loadedScenes.push(fileName);
    }

    window.CL_LOADED_SCENE_FILES = loadedScenes;
    await loadScript('./js/app.js?v=0.5.2');
  }

  boot();
})();
