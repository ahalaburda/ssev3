import http from "./http-common";

class Expedientes{
    getAll() {
        return http.get('/expedientes/?format=json');
    }
}

export default new Expedientes;