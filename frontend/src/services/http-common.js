import axios from 'axios';

// URL base para la conexiona con la API
const baseURL = 'http://192.168.17.14:8000/api';

// Creacion de la instancia de Axios
const axiosInstance = axios.create({
  baseURL: baseURL,
  headers: {
    'Authorization': 'JWT ' + sessionStorage.getItem('access_token'),
    'Content-type': 'application/json',
    'accept': 'application/json'
  }
});

/**
 * Para cuando expira el access_tocken haga un refresh y actualice el access_token.
 * Asi no va perder su sesion y no tendra que iniciar de nuevo su cuenta.
 * https://gist.github.com/smorstabilini/7ea9596633e594c2aeb19cec5c4caf83?ref=hackernoon.com
 */
/*
TODO controlar que cuando un token fue agregado en la blacklist y se intenta utilizar de nuevo el interceptor entra en un bucle infinito.
 */
axiosInstance.interceptors.response.use(
  response => response,
  error => {
    const originalRequest = error.config;
    if (error.response.status === 401 && error.response.statusText === "Unauthorized"
      && error.response.data.code === "token_not_valid") {
      const refreshToken = sessionStorage.getItem('refresh_token');
      if (refreshToken) {
        const tokenParts = JSON.parse(atob(refreshToken.split('.')[1]));
        // exp date in token is expressed in seconds, while now() returns milliseconds:
        const now = Math.ceil(Date.now() / 1000);
        if (tokenParts.exp > now) {
          return axiosInstance
            .post('/token/refresh/', {refresh: refreshToken})
            .then((response) => {

              sessionStorage.setItem('access_token', response.data.access);
              sessionStorage.setItem('refresh_token', response.data.refresh);

              axiosInstance.defaults.headers['Authorization'] = "JWT " + response.data.access;
              originalRequest.headers['Authorization'] = "JWT " + response.data.access;

              return axiosInstance(originalRequest);
            })
            .catch(err => {
              console.log(err)
            });
        }
      } else {
        console.log("no refresh token");
      }

    } // else error is different from 401
    return Promise.reject(error);
  }
);

export default axiosInstance;