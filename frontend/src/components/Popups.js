import {store} from "react-notifications-component";
import "react-notifications-component/dist/theme.css"

class Popups {
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
}

export default new Popups();