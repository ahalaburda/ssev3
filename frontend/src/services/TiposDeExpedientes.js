import http from './http-common';

class TiposDeExpedientes {
  getAll() {
    return http.get('/tipos_de_expedientes/?format=json');
  }

  getDetails(id) {
    return http.get('/tipos_de_expedientes_detalles/?format=json&tipo_de_expediente_id=' + id);
  }

  create(tipoExpediente) {
    return http.post('/tipos_de_expedientes/', tipoExpediente);
  }

  createDetail(detail) {
    return http.post('/tipos_de_expedientes_detalles/', detail);
  }

  delete(id) {
    return http.delete('tipos_de_expedientes', id);
  }
}

export default new TiposDeExpedientes;
