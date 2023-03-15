import { Application } from "@hotwired/stimulus"
import NavController from "./nav_controller"
import CanvasController from "./canvas_controller"
import FlashController from "./flash_controller"
import NewController from "./new_controller"
import SessionsController from "./sessions_controller"
import handwriting from "../lib/handwriting"
import loadKuroshiro from "../lib/load-kuroshiro"
import { createDict } from "../lib/ja-en"

window.isDarkMode = () => document.getElementsByTagName("html")[0].dataset.theme === "dark"

const application = Application.start()
application.register("nav", NavController)
application.register("canvas", CanvasController)
application.register("flash", FlashController)
application.register("new", NewController)
application.register("sessions", SessionsController)

// Configure Stimulus development experience
application.debug = false
window.Stimulus   = application

loadKuroshiro()
createDict()

export { application }
