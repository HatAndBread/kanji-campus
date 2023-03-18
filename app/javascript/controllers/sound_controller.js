import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["toggle"]

  connect() {
    const status = localStorage.getItem("sound")
    if (status) {
      this.toggleTarget.checked = true
    }
  }

  click(e) {
    if (e.currentTarget.checked) {
      localStorage.setItem("sound", "1")
    } else {
      localStorage.removeItem("sound")
    }
  }
}
