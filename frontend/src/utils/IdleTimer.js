import axiosInstance from "../services/http-common";
/**
 * Clase utilizada para detectar inactividad en el sistema
 * Para mas info https://medium.com/tinyso/how-to-detect-inactive-user-to-auto-logout-by-using-idle-timeout-in-javascript-react-angular-and-b6279663acf2
 */
class IdleTimer {
    constructor({ timeout, onTimeout, onExpired }) {
      this.timeout = timeout;
      this.onTimeout = onTimeout;
  
      const expiredTime = parseInt(sessionStorage.getItem("_expiredTime"), 10);
      if (expiredTime > 0 && expiredTime < Date.now()) {
        onExpired();
        return;
      }
  
      this.eventHandler = this.updateExpiredTime.bind(this);
      this.tracker();
      this.startInterval();
    }
  
    startInterval() {
      this.updateExpiredTime();
  
      this.interval = setInterval(() => {
        const expiredTime = parseInt(sessionStorage.getItem("_expiredTime"), 10);
        if (expiredTime < Date.now()) {
          if (this.onTimeout) {
            this.onTimeout();
            this.cleanUp();
          }
        }
      }, 1000);
    }
  
    /**
     * Actualiza el tiempo de Expiredtime cada vez que se detecte actividad
     */
    updateExpiredTime() {
      if (this.timeoutTracker) {
        clearTimeout(this.timeoutTracker);
      }
      this.timeoutTracker = setTimeout(() => {
        sessionStorage.setItem("_expiredTime", Date.now() + this.timeout * 1000);
      }, 300);
    }
  
    /**
     * Funcion para agregar oyentes para detectar mov de mouse, scroll
     * o el uso del teclado
     */
    tracker() {
      window.addEventListener("mousemove", this.eventHandler);
      window.addEventListener("scroll", this.eventHandler);
      window.addEventListener("keydown", this.eventHandler);
    }
  
    /**
     * Funcion que es llamada cuando se cumple el tiempo de inactividad establecido
     * se limpia el session storage y se eliminan los oyentes y se agrega el token
     * a la blacklist
     */
    cleanUp() {
      sessionStorage.removeItem("_expiredTime");
      clearInterval(this.interval);
      window.removeEventListener("mousemove", this.eventHandler);
      window.removeEventListener("scroll", this.eventHandler);
      window.removeEventListener("keydown", this.eventHandler);
      axiosInstance.post('/token/blacklist/', {
        "refresh_token": sessionStorage.getItem('refresh_token')
      }).then(response => {
        if (response.status === 205) {
          sessionStorage.clear();
          axiosInstance.defaults.headers['Authorization'] = null;
          window.location.reload();
        }
      }).catch(e => {
        console.log(e);
      })
    }
  }
  export default IdleTimer;
  