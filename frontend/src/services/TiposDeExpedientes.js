import http from './http-common';

class TiposDeExpedientes {
  getAll() {
    return http.get('/tipos_de_expedientes/?format=json');
  }

  getDetails(id) {
    return http.get('/tipos_de_expedientes_detalles/?format=json&tipo_de_expediente_id=' + id);
  }

}

export default new TiposDeExpedientes;
