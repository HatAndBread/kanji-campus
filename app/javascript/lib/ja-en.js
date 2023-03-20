const url = "/dict/ja-en.json.gz"

const sentenceWorker = new Worker(`${window.location.origin}/sentences-worker.js`)
sentenceWorker.postMessage({type: "import"})
sentenceWorker.onmessage = () => {
  window.sentencesReady = true;
}
window.getSentences = (kanji) => {
  if (!window.sentencesReady) return;
  return new Promise((resolve, reject) => {
    sentenceWorker.onmessage = (message) => {
      if (message.data === "ERROR") {
        reject("Sentences called before ready")
      } else {
        resolve(message.data)
      }
    }
    sentenceWorker.postMessage({type: "get", kanji})
  });
}

const kanjiWorker = new Worker(`${window.location.origin}/kanji-worker.js`)
kanjiWorker.onmessage = () => {
  window.kanjiReady = true;
}
cue = []
kanjiWorker.postMessage({type: "import"})
window.lookup = (kanji) => {
  if (!window.kanjiReady) return;
  return new Promise((resolve, reject) => {
    kanjiWorker.onmessage = (message) => {
      if (message.data === "ERROR") {
        reject("Kanji lookup called before ready")
      } else {
        resolve(message.data)
      }
    }
    kanjiWorker.postMessage({type: "get", kanji})
  });
}

window.englishLookup = (english) => {
  if (!window.kanjiReady) return;

  return new Promise((resolve, reject) => {
    kanjiWorker.onmessage = (message) => {
      if (message.data === "ERROR") {
        reject("word lookup called before ready")
      } else {
        resolve(message.data)
      }
    }
    kanjiWorker.postMessage({type: "getFromEnglish", english})
  });
}

window.bulkLookup = (kanji) => {
  return new Promise((resolve, reject) => {
    kanjiWorker.onmessage = (message) => {
      if (message.data === "ERROR") {
        reject("Kanji bulk lookup called before ready")
      } else {
        resolve(message.data)
      }
    }
    kanjiWorker.postMessage({type: "getBulk", kanji})
  })
}

window.waitForReady = () => {
  return new Promise((resolve) => {
    const condition = () => window.kanjiReady && window.sentencesReady && window.kuroshiroReady
    if (condition()) resolve()
    const interval = window.setInterval(() => {
      if (condition()) {
        clearInterval(interval);
        resolve()
      }
    }, 1);
  })
}