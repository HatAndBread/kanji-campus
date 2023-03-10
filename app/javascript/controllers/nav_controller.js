import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["modeToggle"];
  connect() {
    if (this.isDarkMode()) {
      this.modeToggleTarget.checked = true;
    }
    this.setStyle();
  }
  isDarkMode() {
    return !!parseInt(localStorage.getItem("mode"));
  }
  toggleMode() {
    localStorage.setItem("mode", this.isDarkMode() ? "0" : "1")
    this.setStyle();
  }
  setStyle() {
    const html = document.getElementsByTagName("html")[0]
    if (this.isDarkMode()) {
      html.dataset.theme = "dark"
    } else {
      html.dataset.theme = "light"
    }
  }
}
