import {inflate} from "pako"
import axios from "axios";
const url = "/dict/ja-en.json.gz"

let words;

export const createDict = async () => {
  const { data } = await axios.get(url, {
    responseType: 'arraybuffer',
    decompress: true,
  });
  const string = inflate(data, { to: 'string' });
  const json = JSON.parse(string)
  words = json.words
}

window.lookup = (word) => {
  if (!words) {
    console.warn("Attempted to use dictionary before loaded.")
    return;
  }

  let english;
  for (let i = 0; i < words.length; i++) {
    if (words[i].kanji[0]?.text === word) {
      english =  words[i].sense[0]?.gloss[0]?.text;
      break;
    }
  }
  return english;
}