import {store} from "react-notifications-component";
import "react-notifications-component/dist/theme.css"

/**
 * Mensajes popups
 */
class Popups {
  /**
   * Mensaje de exito.
   * @param message mensaje a mostrar.
   */
  success(message) {
    store.addNotification({
      message: message,
      type: "success",
      insert: "bottom",
      container: "top-right",
      animationIn: ["animated", "fadeIn"],
      animationOut: ["animated", "fadeOut"],
      dismiss: {
        duration: 5000
      }
    });
  }

  /**
   * Mensaje de error.
   * @param message mensaje a mostrar
   */
  error(message) {
    store.addNotification({
      message: message,
      type: "danger",
      insert: "bottom",
      container: "top-right",
      animationIn: ["animated", "fadeIn"],
      animationOut: ["animated", "fadeOut"],
      dismiss: {
        duration: 5000
      }
    });
  }

   /**
   * Mensaje de info.
   * @param message mensaje a mostrar.
   */
    info(message) {
      store.addNotification({
        message: message,
        type: "info",
        insert: "bottom",
        container: "top-right",
        animationIn: ["animated", "fadeIn"],
        animationOut: ["animated", "fadeOut"],
      });
    }
}

export default new Popups();