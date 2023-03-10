import { Application } from "@hotwired/stimulus"
import NavController from "./nav_controller";
import CanvasController from "./canvas_controller";
import FlashController from "./flash_controller";
import NewController from "./new_controller";
import handwriting from "../lib/handwriting";

window.isDarkMode = () => document.getElementsByTagName("html")[0].dataset.theme === "dark";

const application = Application.start()
application.register("nav", NavController);
application.register("canvas", CanvasController);
application.register("flash", FlashController);
application.register("new", NewController);

// Configure Stimulus development experience
application.debug = false
window.Stimulus   = application


export { application }