const url = "/dict/ja-en.json.gz"

const sentenceWorker = new Worker(`${window.location.origin}/sentences-worker.js`)
sentenceWorker.postMessage({type: "import"})
window.getSentences = (kanji) => {
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
cue = []
kanjiWorker.postMessage({type: "import"})
window.lookup = (kanji) => {
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