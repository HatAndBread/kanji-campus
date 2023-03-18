const worker_script = importScripts(
  "/pako_inflate.min.js"
);

let kanjis;

const parse = (bin) => pako.inflate(bin, { to: "string" });

const fetchJSONFromGZFile = () => {
  return new Promise((resolve) => {
    const kanjiURL = "/dict/ja-en.json.gz";
    fetch(kanjiURL).then(async (response) => {
      const blob = await response.blob();
      await readSingleFile(blob).then((res) => {
        kanjis = JSON.parse(parse(res))?.words;
        resolve(true);
      });
    });
  });
};

async function readSingleFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = function (e) {
      resolve(e?.target?.result);
    };
    reader.readAsArrayBuffer(file);
    reader.onabort = reject;
    reader.onerror = reject;
  });
}

onmessage = function (event) {
  switch (event.data.type) {
    case "import": {
      fetchJSONFromGZFile().then(() => {
        this.postMessage("ready")
      });
      break;
    }
    case "get": {
      if (!kanjis) {
        this.postMessage("ERROR")
        break;
      }
      const kanji = event.data.kanji
      let result;
      for (let i = 0; i < kanjis.length; i++) {
        if(kanjis[i]?.kanji[0]?.text === kanji) {
          result = kanjis[i]?.sense[0]?.gloss[0]?.text
          break;
        }
      }
      this.postMessage(result)
      break;
    }
    case "getBulk": {
      if (!kanjis) {
        this.postMessage("ERROR")
        break;
      }
      const kanji = event.data.kanji
      const result = {};
      userKanjis:
      for (let i = 0; i < kanji.length; i++) {
        if (!kanji[i]) continue 
      dictionaryKanjis:
        for (let j = 0; j < kanjis.length; j++) {
          if (kanji[i] === kanjis[j]?.kanji[0]?.text) {
            const english = kanjis[j]?.sense[0]?.gloss[0]?.text;
            if (english) result[kanji[i]] = english 
            break dictionaryKanjis;
          }
        }
      }
      this.postMessage(result)
      break;
    }
    default: {
      console.error(`Unhandled message type: ${event.data.type}`)
    }
  }
};
