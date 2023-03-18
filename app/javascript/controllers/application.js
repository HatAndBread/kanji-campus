import { Application } from "@hotwired/stimulus"
import NavController from "./nav_controller"
import CanvasController from "./canvas_controller"
import FlashController from "./flash_controller"
import NewController from "./new_controller"
import SessionsController from "./sessions_controller"
import ReadingSessionsController from "./reading_sessions_controller"
import ReadingController from "./reading_controller"
import SoundController from "./sound_controller"
import handwriting from "../lib/handwriting"
import loadKuroshiro from "../lib/load-kuroshiro"
import "../lib/ja-en"

window.isDarkMode = () => document.getElementsByTagName("html")[0].dataset.theme === "dark"

const application = Application.start()
application.register("nav", NavController)
application.register("canvas", CanvasController)
application.register("flash", FlashController)
application.register("new", NewController)
application.register("sessions", SessionsController)
application.register("reading-sessions", ReadingSessionsController)
application.register("reading", ReadingController)
application.register("sound", SoundController)

// Configure Stimulus development experience
application.debug = false
window.Stimulus   = application

loadKuroshiro()

const sounds = {
  correct: new Audio('/correct.mp3'),
  wrong: new Audio('/wrong.mp3')
}
sounds.wrong.volume = 0.1;

window.playSound = (soundName) => {
  if (localStorage.getItem("sound")) sounds[soundName].play()
}


export { application }
