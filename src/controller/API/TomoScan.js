import { REQUEST_TYPE } from 'src/common/constants';
import QueryString from 'query-string';
import axios from 'axios';

export default class TomoScan {
  /**
   * user login
   */
  static async getTokenHolder(address, page = 1, limit = 20) {
    const query = {
      address,
      page,
      limit
    };
    const apiUrl = '/api/token-holders/trc21';
    return this.fetchData(apiUrl, REQUEST_TYPE.GET, query);
  }

  static fetchData(apiUrl, method, queryBody, postData) {
    return new Promise(async (resolve, reject) => {
      let queryStr = '';
      if (queryBody) {
        queryStr = '?' + QueryString.stringify(queryBody);
      }
      queryStr = queryStr.replace('%25', '%');

      const params = {
        baseURL: process.env.REACT_APP_TOMOSCAN_URL,
        method: method || REQUEST_TYPE.GET,
        url: apiUrl + queryStr,
      };

      if (postData) {
        params.data = postData;
      }

      let auth = localStorage.getItem('userAuth');
      if (auth) {
        auth = `Bearer ${JSON.parse(auth).token}`;
        params.headers = {
          Authorization: auth,
        };
      }

      axios(params)
        .then(function (response) {
          // handle success
          if (response.status >= 200 && response.status < 300) {
            return resolve(response.data);
          } else {
            return resolve(null);
          }
        })
        .catch(function (error) {
          // handle error
          console.log(error);
          return reject(error);
        });
    });
  }
}
