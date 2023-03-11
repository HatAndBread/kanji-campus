const scriptsToLoad = ["kuroshiro", "kuroshiro-analyzer"];
let scriptsLoaded = 0;

export default () => {
  if (document.getElementById("kuroshiro") && document.getElementById("kuroshiro-analyzer")) return;

  scriptsToLoad.forEach((src) => {
    const script = document.createElement('script');
    script.src = `/${src}.js`;
    script.id = src;
    script.async = true;

    script.onload = () => {
      scriptsLoaded += 1;
      if (scriptsLoaded === scriptsToLoad.length) {
        window.kuroshiro = new Kuroshiro.default();
        kuroshiro.init(new KuromojiAnalyzer({ dictPath: "/dict" })).then(() => {
          window.kuroshiroReady = true;
          window.hasKanji = Kuroshiro.default.Util.hasKanji;
          window.isKanji = Kuroshiro.default.Util.isKanji;
          window.isKana = Kuroshiro.default.Util.isKana;
          window.isJapanese = Kuroshiro.default.Util.isJapanese;
        });
      }
    };
    document.body.appendChild(script);
  });
}