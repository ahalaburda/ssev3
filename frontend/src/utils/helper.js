class Helper {

  /**
   * Determinar si esta logeado con respecto al access_token. True existe el token, si no false.
   * @returns {boolean}
   */
  existToken() {
    return !!localStorage.getItem('access_token');
  }

  /**
   * Obtener el ID del usuario logeado actualmente.
   * @returns {number}
   */
  getCurrentUserId() {
    const token_parts = JSON.parse(atob(localStorage.getItem('access_token').split('.')[1]));
    return token_parts.user_id;
  }
}

export default new Helper();