import http from './http-common';

class TiposDeExpedientes {
  getAll() {
    return http.get('/tipos_de_expedientes/?format=json');
  }
}

export default new TiposDeExpedientes;
