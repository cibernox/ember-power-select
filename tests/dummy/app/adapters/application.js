import DS from 'ember-data';
import fetch from 'fetch';

export default DS.JSONAPIAdapter.extend({
  _ajaxRequest(ajaxOptions) {
    return fetch(ajaxOptions.url).then((response) => {
      if (!response.ok) {
        throw new Error('Request failed');
      }
      return response.json().then((json) => {
        ajaxOptions.success(json, response.statusText, {
          status: response.status,
          getAllResponseHeaders() {
            return Object.entries(response.headers.map).map(([k, v]) => `${k}:${v}`).join('\r\n');
          }
        });
        return json;
      });
    });
  }
});
