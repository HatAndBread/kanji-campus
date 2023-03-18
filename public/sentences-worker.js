const worker_script = importScripts(
  "/pako_inflate.min.js"
);

let sentences;

const parse = (bin) => pako.inflate(bin, { to: "string" });

const fetchJSONFromGZFile = () => {
  return new Promise((resolve) => {
    const sentencesURL = "/dict/sentences.json.gz";
    fetch(sentencesURL).then(async (response) => {
      const blob = await response.blob();
      await readSingleFile(blob).then((res) => {
        sentences = JSON.parse(parse(res));
        resolve(sentences);
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
      fetchJSONFromGZFile().then((res) => {
        this.postMessage("ready")
      });
      break;
    }
    case "get": {
      if (!sentences) {
        this.postMessage("ERROR")
        break;
      }
      const kanji = event.data.kanji
      const result = []
      for (let i = 0; i < sentences.length; i++) {
        if(sentences[i].length === 2 && sentences[i][0].match(kanji)) result.push(sentences[i])
      }
      this.postMessage(result)
      break;
    }
    default: {
      postMessage("hi");
    }
  }
};
