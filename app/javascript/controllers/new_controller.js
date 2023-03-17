import { Controller } from "@hotwired/stimulus"
import debounce from "lodash.debounce";

export default class extends Controller {
  static targets = ["mondai", "mondaiTable", "import", "loader"]

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
    const kanji = clone.querySelector(".kanji")
    const yomikata = clone.querySelector(".yomikata")
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
    if (!window.kuroshiroReady) {
      // show error message
      return
    };

    const {value, parentNode} = e.target;
    if (window.hasKanji(value)) {
      kuroshiro.convert(value).then((res) => {
        const yomikata = parentNode.parentNode.parentNode.querySelector(".yomikata")
        window.lookup(value).then((english) => {
          if (english) res += ` [${english}]`
          yomikata.value = res;
        })
      })
    }
  }

  import() {
    if (!window.kuroshiroReady) {
      return;
    }

    this.loaderTarget.classList.remove("hidden")
    setTimeout(() => {
      this._import().then(() => {
        this.loaderTarget.classList.add("hidden")
      });
    }, 160);
  }

  parseData (string) {
    return new Promise((resolve) => {
      const worker = new Worker(`${window.location.origin}/dict-worker.js`);
      worker.onmessage = (message) => {
        resolve(message);
      }
      worker.postMessage(string);
    })
  }

  _import () {
    return new Promise(async (resolve) => {
      const potentialWords = this.importArea.value.split(/\s|,|、/)
        .filter((c) => c && window.hasKanji(c));
      const dict = await window.bulkLookup(potentialWords);
      for (let i = 0; i < potentialWords.length; i++) {
        const value = potentialWords[i];
        const el = this.newWord();
        const kanji = el.querySelector(".kanji");
        kanji.value = value;
        kuroshiro.convert(value).then((res) => {
          const yomikata = el.querySelector(".yomikata");
          if (res) {
            const english = dict[value]
            if (english) res += ` [${english}]`
            yomikata.value = res;
            if (i + 1 === potentialWords.length) resolve(true);
          } else {
            if (i + 1 === potentialWords.length) resolve(true);
          }
        })
      }
    this.importArea.value = "";
    })
  }

  handleSubmit(e) {
    Array.from(this.mondaiTableTarget.children).forEach((el, i) => {
      const kanji = el.querySelector(".kanji")
      const yomikata = el.querySelector(".yomikata")
      if (!kanji || !yomikata) return;

      yomikata.name = yomikata.name.replace(/\[[0-9]+\]/, `[${i}]`)
      yomikata.id = yomikata.id.replace(/[0-9]+_yomikata/, `${i}_yomikata`)
      kanji.name = kanji.name.replace(/\[[0-9]+\]/, `[${i}]`)
      kanji.id = kanji.id.replace(/[0-9]+_kanji/, `${i}_kanji`)
    });
  }
}
