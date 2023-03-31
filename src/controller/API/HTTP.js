import { REQUEST_TYPE } from 'src/common/constants';
import axios from 'axios';
import { Promise } from 'q';

export default class HTTP {
  /**
   * [POST]
   * Admin login
   */
  static async authenticate(username, password) {
    const data = {
      username,
      password,
    };
    const apiUrl = '/admin/authenticate';
    return this.fetchData(apiUrl, REQUEST_TYPE.POST, null, data);
  }

  /**
   * [GET]
   * User list
   */
  static async getUserList(url, params = {}) {
    return this.fetchData(url, REQUEST_TYPE.GET, params);
  }

  /**
   * [GET]
   * Marathon list
   */
  static async getMarathonList(url, params = {}) {
    return this.fetchData(url, REQUEST_TYPE.GET, params);
  }

  /**
   * [POST]
   * Admin login
   */
  static async addMarathon(url, data = {}) {
    return this.fetchData(url, REQUEST_TYPE.POST, null, data);
  }

  static async editMarathon(url, data = {}) {
    return this.fetchData(url, REQUEST_TYPE.PUT, null, data);
  }

  static fetchData(apiUrl, method, params, postData) {
    return new Promise(async (resolve, reject) => {

      const request = {
        baseURL: process.env.REACT_APP_API_APP,
        method: method || REQUEST_TYPE.GET,
        url: apiUrl,
        params
      };

      if (postData) {
        request.data = postData;
      }

      let auth = localStorage.getItem('userAuth');
      if (auth) {
        auth = `Bearer ${JSON.parse(auth).token}`;
        request.headers = {
          authorization: auth,
        };
      }

      axios(request)
        .then(function (response) {
          if (response.status >= 200 && response.status < 300) return resolve(response.data);
          return resolve(null);
        })
        .catch(function (error) {
          console.log(error);
          return reject(error);
        });
    });
  }
}
