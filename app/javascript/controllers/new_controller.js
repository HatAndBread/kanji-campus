import { Controller } from "@hotwired/stimulus"
import max from "lodash.max";
import debounce from "lodash.debounce";

export default class extends Controller {
  static targets = ["mondai", "mondaiTable", "import"]

  initialize() {
    this.kanjiInput = debounce(this.kanjiInput, 400).bind(this);
  }

  connect() {
    this.importArea = document.getElementById("import-area");
    this.importBtn = document.getElementById("import-btn");
    this.boundImport = this.import.bind(this)
    this.importBtn.addEventListener("click", this.boundImport)
  }

  disconnect() {
    this.importBtn.removeEventListener("click", this.boundImport)
  }


  newWord() {
    const clone = this.mondaiTarget.cloneNode(true);
    const mondaiCount = max(Array.from(document.querySelectorAll(".mondai")).map((el) => parseInt(el.dataset.id))) + 1
    clone.dataset.id = mondaiCount;
    const kanji = clone.querySelector(".kanji")
    const yomikata = clone.querySelector(".yomikata")
    yomikata.name = yomikata.name.replace(/\[0\]/, `[${mondaiCount}]`)
    yomikata.id = yomikata.id.replace(/0_yomikata/, `${mondaiCount}_yomikata`)
    kanji.name = kanji.name.replace(/\[0\]/, `[${mondaiCount}]`)
    kanji.id = kanji.id.replace(/0_kanji/, `${mondaiCount}_kanji`)
    yomikata.value = "";
    kanji.value = "";
    this.mondaiTableTarget.appendChild(clone)
    kanji.focus()
    return clone;
  }

  delete(e) {
    if (document.querySelectorAll(".mondai").length < 2) return;
    e.currentTarget.parentNode.parentNode.remove()
  }

  kanjiInput(e) {
    if (!window.kuroshiroReady) return;

    const {value, parentNode} = e.target;
    if (window.hasKanji(value)) {
      kuroshiro.convert(value).then((res) => {
        const yomikata = parentNode.parentNode.parentNode.querySelector(".yomikata")
        yomikata.value = res;
      })
    }
  }

  import() {
    if (!window.kuroshiroReady) return;

    this.importArea.value.split(/\s|,|、/)
      .forEach((value) => {
        if (value && window.hasKanji(value)) {
          const el = this.newWord()
          const kanji = el.querySelector(".kanji")
          kanji.value = value;
          kuroshiro.convert(value).then((res) => {
            const yomikata = el.querySelector(".yomikata")
            yomikata.value = res;
          })
        }
      });
  }
}
