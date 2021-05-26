import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import moment from 'moment';
import React from "react";

class Helper {

  /**
   * Determinar si existe o no el token en el local storage.
   * @returns {boolean}
   */
  existToken() {
    return !!sessionStorage.getItem('access_token');
  }

  /**
   * Determinar si existe la configuracion de anho en el session storage.
   * @returns {boolean}
   */
  existYearSetting() {
    return !!sessionStorage.getItem('year_setting')
  }

  /**
   * Obtener el ID del usuario logeado actualmente.
   * @returns {number}
   */
  getCurrentUserId() {
    const token_parts = this.existToken() &&
      JSON.parse(atob(sessionStorage.getItem('access_token').split('.')[1]));
    return token_parts.user_id;
  }

  /**
   * Si existe la configuracion de anho en el session storage, la retorna, sino por defecto 2020.
   * @returns {string|string}
   */
  getCurrentYearSetting() {
    return this.existYearSetting() ? sessionStorage.getItem('year_setting') : moment().startOf('year').format('YYYY');
  }

  /**
   * Retorna un expediente vacio
   * @returns {{
   * descripcion: string,
   * estado_id: {
   *    descripcion: string,
   *    id: number,
   *    activo: boolean
   * },
   * dependencia_origen_id: {
   *    descripcion: string,
   *    id: number,
   *    activo: boolean
   * },
   * dependencia_destino_id: {
   *    descripcion: string,
   *    id: number,
   *    activo: boolean
   * },
   * prioridad_id: {
   *    descripcion: string,
   *    id: number,
   *    activo: boolean
   * },
   * fecha_actualizacion: string,
   * fecha_creacion: string,
   * tipo_de_expediente_id: {
   *    descripcion: string,
   *    id: number,
   *    activo: boolean
   * },
   * monto: string,
   * monto_currency: string,
   * fecha_mesa_entrada: string,
   * objeto_de_gasto_id: {
   *    descripcion: string,
   *    id: number,
   *    activo: boolean
   * },
   * numero_mesa_de_entrada: number,
   * anho: number,
   * lote_id: {
   *    descripcion: string,
   *    dependencia_destino_id: {
   *        descripcion: string,
   *        id: number,
   *        activo: boolean
   *     },
   *     id: number,
   *
   *     fecha_creacion: string,
   *     activo: boolean
   * },
   * id: number}}
   */
  getExpedienteInitialState() {
    return {
      "id": 0,
      "numero_mesa_de_entrada": 0,
      "anho": 0,
      "descripcion": "",
      "monto_currency": "",
      "monto": "",
      "fecha_creacion": "",
      "fecha_actualizacion": "",
      "fecha_mesa_entrada": "",
      "tipo_de_expediente_id": {
        "id": 0,
        "descripcion": "",
        "activo": false,
        "saltos": 0
      },
      "dependencia_origen_id": {
        "id": 0,
        "descripcion": "",
        "activo": false
      },
      "dependencia_destino_id": {
        "id": 0,
        "descripcion": ""
        , "activo": false
      },
      "objeto_de_gasto_id": {
        "id": 0,
        "descripcion": "",
        "activo": false
      },
      "estado_id": {
        "id": 0,
        "descripcion": "",
        "activo": false
      },
      "prioridad_id": {
        "id": 0,
        "descripcion": ""
        , "activo": false
      },
      "lote_id": {
        "id": 0,
        "descripcion": "",
        "fecha_creacion": "",
        "activo": false,
        "dependencia_destino_id": {
          "id": 0,
          "descripcion": ""
          , "activo": false
        }
      }
    }
  }

  /**
   * Retorna una instancia vacia con todos sus campos disponibles
   * @returns {{estado_id: {descripcion: string, id: number, activo: boolean},
   * expediente_id: {},
   * usuario_id_salida: null,
   * fecha_final: string,
   * dependencia_siguiente_id: {descripcion: string, id: number, activo: boolean},
   * usuario_id_entrada: null,
   * fecha_recepcion: string,
   * dependencia_anterior_id: {descripcion: string, id: number, activo: boolean},
   * id: number,
   * fecha_creacion: string,
   * dependencia_actual_id: {descripcion: string, id: number, activo: boolean}}}
   */
  getInstanciaInitialState() {
    return {
      "id": 0,
      "fecha_creacion": "",
      "fecha_recepcion": "",
      "fecha_final": "",
      "expediente_id": this.getExpedienteInitialState(),
      "dependencia_anterior_id": {
        "id": 0,
        "descripcion": "",
        "activo": false
      },
      "dependencia_actual_id": {
        "id": 0,
        "descripcion": "",
        "activo": false
      },
      "dependencia_siguiente_id": {
        "id": 0,
        "descripcion": "",
        "activo": false
      },
      "estado_id": {
        "id": 0,
        "descripcion": "",
        "activo": false
      },
      "usuario_id_entrada": null,
      "usuario_id_salida": null
    }
  }

  /**
   * Retorna el valor de un estado
   * @returns {{
   *  RECHAZADO: string,
   *  DERIVADO: string,
   *  ANULADO: string,
   *  NORECIBIDO: string,
   *  RECIBIDO: string,
   *  FINALIZADO: string,
   *  PAUSADO: string.
   *  REANUDADO: string
   * }}
   */
  getEstado() {
    return {
      NORECIBIDO: 'No Recibido',
      RECIBIDO: 'Recibido',
      DERIVADO: 'Derivado',
      RECHAZADO: 'Rechazado',
      FINALIZADO: 'Finalizado',
      ANULADO: 'Anulado',
      PAUSADO: 'Pausado',
      REANUDADO: 'Reanudado'
    }
  }

  selectColor = (estado) => {
    switch (estado) {
      case 1:
        return '#f6c23e';
      case 2:
        return '#1cc88a';
      case 3:
        return '#36b9cc';
      case 4:
        return '#e74a3b';
      case 5:
        return '#858796';
      case 8:
        return '#AF7AC5';
      default:
        return '#5a5c69';
    }
  }
  /**
   * Retorna todos los posibles estados de un expediente.
   * @returns {(
   * {id: number, label: string, value: string})[]}
   */
  getAllEstados() {
    return [
      {
        id: 2,
        value: 'Recibido',
        label: <span style={{ color: '#1cc88a' }}><FontAwesomeIcon icon='check-double' /> Recibido</span>,

      },
      {
        id: 3,
        value: 'Derivado',
        label: <span style={{ color: '#36b9cc' }}><FontAwesomeIcon icon='forward' /> Derivado</span>
      },
      {
        id: 4,
        value: 'Rechazado',
        label: <span style={{ color: '#e74a3b' }}><FontAwesomeIcon icon='backward' /> Rechazado</span>
      },
      {
        id: 5,
        value: 'Finalizado',
        label: <span style={{ color: '#858796' }}><FontAwesomeIcon icon='archive' /> Finalizado</span>
      },
      {
        id: 6,
        value: 'Anulado',
        label: <span style={{ color: '#5a5c69' }}><FontAwesomeIcon icon='stop' /> Anulado</span>
      },
      {
        id: 7,
        value: 'Pausado',
        label: <span style={{ color: '#5a5c69' }}><FontAwesomeIcon icon='hand-paper' /> Pausado</span>
      },
      {
        id: 8,
        value: 'Reanudado',
        label: <span style={{ color: '#AF7AC5' }}><FontAwesomeIcon icon='fast-forward' /> Reanudado</span>
      }
    ]
  }

  getTheme() {

    return localStorage.getItem('theme')
  }
}

export default new Helper();