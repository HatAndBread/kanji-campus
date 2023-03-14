import {inflate} from "pako"
import Dexie from "dexie";
import axios from "axios";
const url = "/dict/ja-en.json.gz"

const db = new Dexie("kanji")


db.version(1).stores({
  kanji: "++id,kanji,english"
});

const parseData = (string) => {
  return new Promise((resolve) => {
    const worker = new Worker(`${window.location.origin}/dict-worker.js`);
    worker.onmessage = (message) => {
      resolve(message);
    }
    worker.postMessage(string);
  })
}

export const createDict = async () => {
  const { data } = await axios.get(url, {
    responseType: 'arraybuffer',
    decompress: true,
  });
  const string = inflate(data, { to: 'string' });
  const result = await parseData(string);
  db.kanji.bulkPut(result.data).then(() => {
    console.log("Kanji db ready")
    window.db = db;
  })
}


window.bulkLookup = (arrayOfKanji) => {
  return new Promise((resolve) => {
    db.kanji.where("kanji")
      .anyOf(arrayOfKanji)
      .toArray()
      .then((res) => resolve(res))
  })
}

window.lookup = async (kanji) => {
  const result = await db.kanji.get({kanji})
  return result?.english
}
