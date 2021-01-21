import http from './http-common';

class ObjetosDeGastos{
    /**
     * Obtener todos los objetos de gastos de la API.
     * @param page Pagina a mostrar
     * @returns {Promise<AxiosResponse<ObjetoDeGasto>>}
     */
    getAll(page){
        return http.get(`/objetos_de_gastos/?format=json&page=${page}`);
    }

    getAllNoPag(){
        return http.get("/objetos_de_gastos_no_pag/?format=json")
    }

    /**
     * Crear un objeto de gasto.
     * @param objetoDeGasto
     * @returns {Promise<AxiosResponse<any>>}
     */
    create(objetoDeGasto){
        return http.post('objetos_de_gastos/', objetoDeGasto);
    }

    /**
     * Actualiza un objeto de gasto.
     * @param id
     * @param objetoDeGasto
     * @returns {Promise<AxiosResponse<any>>}
     */
    update(id, objetoDeGasto) {
        return http.put(`/objetos_de_gastos/${id}`, objetoDeGasto);
    }

    /**
     * Obtiene un objeto de gasto.
     * @param id
     * @returns {Promise<AxiosResponse<any>>}
     */
    getById(id){
        return http.get('/objetos_de_gastos/' + id + '?format=json');
    }

    /**
     * Elimina un objetod de gasto.
     * @param id
     * @returns {Promise<AxiosResponse<any>>}
     */
    delete(id) {
        return http.delete(`/objetos_de_gastos/${id}`);
    }
}

export default new ObjetosDeGastos();