import { Controller } from "@hotwired/stimulus"
import shuffle from "lodash.shuffle"
import sample from "lodash.sample"
import debounce from "lodash.debounce"
import JSConfetti from 'js-confetti'

const goodConfetti = [["🌈", "🦄", "🌸"], ["🌈"], ["🦄"], ["🌸"]]

let listeners = []
export default class extends Controller {
  static targets = ["canvas", "mondais", "currentQuestion", "userAnswerDisplay", "maru", "sankaku", "batsu", "checkBtn", "nextBtn", "skipBtn", "stroke", "modal", "loader", "correctNum", "totalNum", "percentage", "progress"]

  connect() {
    this.jsConfetti = new JSConfetti()
    this.canvas = new handwriting.Canvas(this.canvasTarget)
    this.ctx = this.canvas.cxt
    this.setOptions()
    this.canvas.set_Undo_Redo(true, false)
    this.questionNumber = 0
    this.correctlyAnswered = 0
    this.canvas.setCallBack((d) => {
      this.questionNumber += 1;
      this.canvas.set_Undo_Redo(false, false) // Clear stored steps
      this.canvas.set_Undo_Redo(true, false)
      this.checkBtnTarget.classList.add("hidden")
      this.loaderTarget.classList.add("hidden")
      this.currentQuestionTarget.classList.add("hidden")
      this.nextBtnTarget.classList.remove("hidden")
      if (window.kuroshiroReady) {
        this.answer.split("").forEach((char) => {
          if (window.isKanji(char) || window.isKana(char)) {
            const div = document.createElement("div")
            div.innerText = char
            div.className = "border rounded bg-base-100 m-auto"
            this.strokeTarget.appendChild(div)
          }
        })
        this.scroll()
      }
      if (d[0] === this.answer) {
        this.maruTarget.classList.add("opacity-100")
        this.setAnswerDisplay(d[0], "🙆‍♀️✨")
        this.correctlyAnswered += 1
        this.jsConfetti.addConfetti({
          emojis: sample(goodConfetti),
        })
      } else if (d.includes(this.answer)) {
        this.sankakuTarget.classList.add("opacity-100")
        this.setAnswerDisplay(d[0], "🔺")
      } else {
        this.batsuTarget.classList.add("opacity-100")
        this.setAnswerDisplay(d[0], "🙅‍♀️")
      }
      this.updateQuestionNumber()
      setTimeout(()=> {
        [this.maruTarget, this.sankakuTarget, this.batsuTarget].forEach((t) => t.classList.remove("opacity-100"))
      }, 2000)
    })
    this.setQuestions()
    this.setCurrentQuestion()
    listeners.push(debounce((e) => {
      this.canvasTarget.width = Math.floor(window.innerWidth * .9)
      this.canvas.erase()
    }, 100))
    listeners[listeners.length - 1]()
    window.addEventListener("resize", listeners[listeners.length - 1])
  }

  disconnect() {
    listeners.forEach((l) => {
      document.removeEventListener("resize", l)
    })
    listeners = []
  }

  recognize() {
    if (this.canvas.trace.length) {
      this.canvas.recognize(this.canvas.trace)
      this.loaderTarget.classList.remove("hidden")
    } else {
      this.modalTarget.click()
    }
  }

  setCurrentQuestion() {
    let question = this.questions.shift()
    if (!question) {
      this.setQuestions()
      question = this.questions.shift()
    }
    this.answer = question.kanji
    this.currentQuestionTarget.innerHTML = `Write this in kanji: <strong>${question.yomikata}</strong>`
    this.canvas.trace = []
    this.erase()
    this.setAnswerDisplay()
    this.nextBtnTarget.classList.add("hidden")
    this.checkBtnTarget.classList.remove("hidden")
    this.currentQuestionTarget.classList.remove("hidden")
    this.strokeTarget.innerHTML = ""
    this.scroll()
  }

  setQuestions() {
    this.questions = shuffle(Array.from(
      this.mondaisTarget.querySelectorAll(".mondai")
    )).map((div) => ({
      kanji: div.dataset.kanji,
      yomikata: div.dataset.yomikata,
    }))
  }

  setAnswerDisplay(text, emoji) {
    if (!text) {
      this.userAnswerDisplayTarget.innerText = ""
      this.userAnswerDisplayTarget.classList.add("hidden")
      return
    }
    this.userAnswerDisplayTarget.innerHTML = `It looks like you wrote: <strong>${text}</strong>  ${emoji}`
      this.userAnswerDisplayTarget.classList.remove("hidden")
  }

  updateQuestionNumber() {
    this.totalNumTarget.innerText = this.questionNumber
    this.correctNumTarget.innerText = this.correctlyAnswered
    const percentage = (this.correctlyAnswered / this.questionNumber) * 100
    this.percentageTarget.innerText = `${(percentage).toFixed(1)}%`
    this.progressTarget.value = Math.round(percentage)
  }

  undo() {
    this.canvas.undo()
  }

  erase() {
    this.canvas.erase()
  }

  setOptions() {
    this.canvas.setOptions({ language: "ja", numOfReturn: 10})
  }

  scroll() {
    if (window.innerHeight < 500) {
      this.element.scrollIntoView(true)
    }
  }
}
