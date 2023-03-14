onmessage = function(event) {
  const string = event.data
  const json = JSON.parse(string)
  const words = json.words
  let kanjis = []
  for (let i = 0; i < words.length; i++) {
    if (words[i].kanji[0] && words[i].kanji[0].text && words[i].sense[0] && words[i].sense[0].gloss[0].text) {
      kanjis.push({id: i, kanji: words[i].kanji[0]?.text, english: words[i].sense[0]?.gloss[0]?.text })
    }
  }
  postMessage(kanjis)
}