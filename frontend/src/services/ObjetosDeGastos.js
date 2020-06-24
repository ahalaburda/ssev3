import http from './http-common';

class ObjetosDeGastos{
    getAll(page){
        return http.get(`/objetos_de_gastos/?format=json&page=${page}`);
    }

    create(objetoDeGasto){
        return http.post('objetos_de_gastos/', objetoDeGasto);
    }

    update(id, objetoDeGasto) {
        return http.put(`/objetos_de_gastos/${id}`, objetoDeGasto);
    }

    getById(id){
        return http.get('/objetos_de_gastos/' + id + '?format=json');
    }

    delete(id) {
        return http.delete(`/objetos_de_gastos/${id}`);
    }
}

export default new ObjetosDeGastos();