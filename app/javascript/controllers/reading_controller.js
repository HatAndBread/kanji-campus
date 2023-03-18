import { Controller } from "@hotwired/stimulus"
import sample from "lodash.sample"
import uniq from "lodash.uniq"
import shuffle from "lodash.shuffle"
import diff from "fast-diff"
import JSConfetti from 'js-confetti'
jsConfetti = new JSConfetti()

const goodConfetti = [["🌈", "🦄", "🌸"], ["🌈"], ["🦄"], ["🌸"]]
let failures = 0;

export default class extends Controller {
  static targets = ["mondai", "translation", "loader", "cardsContainer", "correctAnswer", "start", "next", "timer", "score"]

  connect() {
    this.mondais = JSON.parse(this.element.dataset.data)
    this.synth = window.speechSynthesis;
    this.score = 0;
    window.waitForReady().then(() => {
      this.allKanjis = uniq(this.mondais.map((m) => m.kanji.split("").filter((k) => window.isKanji(k))).flat())
      this.loaderTarget.classList.add("hidden")
    })
  }

  updateScore(num) {
    this.score += num
    this.scoreTarget.innerText = this.score
  }

  endGame() {
    if (this.synth) this.synth.cancel()
    this.clearCards()
    this.mondaiTarget.innerHTML = ""
    this.translationTarget.innerHTML = ""
    this.correctAnswerTarget.innerHTML = ""
    this.nextTarget.classList.add("hidden")
  }

  selectKanji(e) {
    const {innerText} = e.currentTarget
    if (innerText === this.currentAnswer[0]) {
      this.currentAnswer.shift()
      e.currentTarget.classList.add("opacity-0")
      e.currentTarget.classList.add("shadow-[0_35px_60px_-15px_rgba(50,250,60,0.3)]")
      if (!this.currentAnswer.length) {
        window.playSound("correct")
        jsConfetti.addConfetti({
          emojis: sample(goodConfetti),
        })
        this.updateScore(1)
        this.next()
      }
    } else {
      window.playSound("wrong")
      if (this.synth) this.synth.cancel()
      this.correctAnswerTarget.innerText = this.currentKanji
      this.nextTarget.classList.remove("hidden")
      this.clearCards()
      this.updateScore(-1)
    }
  }

  clearCards () {
    this.cardsContainerTarget.innerHTML = ""
  }

  async next(e) {
    if (e?.currentTarget?.dataset?.btn === "start") {
      const interval = setInterval(() => {
        const current = parseInt(this.timerTarget.style.cssText.match(/\d+/)[0])
        this.timerTarget.style.cssText = `--value:${current - 1}`
        if (!current) {
          this.endGame()
          clearInterval(interval)
          return;
        }
      }, 1000)
    }
    try {
      this.correctAnswerTarget.innerHTML = ""
      this.startTarget.classList.add("hidden")
      this.nextTarget.classList.add("hidden")
      this.clearCards()
      if (this.synth) this.synth.cancel()
      const {kanji} = this.getKanji()
      const [japaneseSentence, translation ] = await this.getSentence(kanji)
      const replaced = japaneseSentence.replace(kanji, "")
      const kana = await kuroshiro.convert(japaneseSentence)
      let furigana = await kuroshiro.convert(japaneseSentence, {mode: "furigana"})
      const one = diff(japaneseSentence, kana).filter((x) => x[0])
      const theWord = diff(japaneseSentence, replaced).filter(x => x[0]).map((x => x[1]))[0].split("").map(x => window.isKanji(x) && kanji.split("").includes(x) ? x : 0).join("").split("0").filter((x) => x)
      const kanjis = []
      const kanas = []
      one.forEach((x, i) => {
        theWord.forEach((word) => {
          if (x[0] === -1 && x[1].match(word)) {
            kanjis.push(x[1].match(word)[0])
            kanas.push(one[i + 1][1])
          }
        })
      })
      for (let i = 0; i < kanjis.length; i++) {
        furigana = furigana.replace(kanjis[i], `<u class="text-secondary">${kanas[i].split("").map(x => `&nbsp;&nbsp;&nbsp;`).join("")}</u>`)
      }
      this.currentAnswer = kanjis.map((k) => k.split("")).flat()
      this.currentKanji = [...this.currentAnswer]
      let shuffled = shuffle(this.allKanjis).slice(0, 10).filter((k) => !this.currentKanji.join("").split("").includes(k))
      this.currentAnswer.forEach((a) => shuffled.push(a))
      shuffled = shuffle(shuffled)
      for (let i = 0; i < shuffled.length; i++) {
        const btn = document.createElement("button")
        btn.innerText = shuffled[i]
        btn.className = "font-kanji text-6xl border border-accent rounded m-4 transition" 
        btn.dataset.action = "click->reading#selectKanji"
        this.cardsContainerTarget.appendChild(btn)
      }
      this.mondaiTarget.innerHTML = furigana
      this.translationTarget.innerText = translation
      if (!kanjis.length) {
        throw new Error("no Kanji")
      } else if (!this.currentAnswer.length) {
        throw new Error("no current answer")
      }
      this.speak(japaneseSentence);
      failures = 0;
    } catch(e) {
      console.warn(e)
      if (failures < 10) {
        this.next()
        failures += 1
      } else {
        document.getElementById("open-reading-modal").click()
      }
    }
  }

  async getSentence(kanji) {
    const sentences = await window.getSentences(kanji)
    return sample(sentences)
  }

  getKanji() {
    return sample(this.mondais)
  }

  speak(japaneseSentence) {
    if (this.synth && localStorage.getItem("sound")) {
      const u = new SpeechSynthesisUtterance(japaneseSentence)
      u.lang = "ja"
      u.rate = 0.8;
      this.synth.speak(u)
    }
  }
}
