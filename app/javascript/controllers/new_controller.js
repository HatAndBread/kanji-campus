import { Controller } from "@hotwired/stimulus"
import max from "lodash.max";

export default class extends Controller {
  static targets = ["mondai", "mondaiTable"]
  connect() {
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
  }

  delete(e) {
    if (document.querySelectorAll(".mondai").length < 2) return;
    e.currentTarget.parentNode.parentNode.remove()
  }
}
