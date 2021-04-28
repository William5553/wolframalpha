const fetch = require('node-superfetch');
const xml2js = require('xml2js');
const url = require('url');

class Client {
  constructor(appId) {
    this.appId = appId;
    this.baseURL = new URL('http://api.wolframalpha.com/v2/query');
  }

  makeQueryURL(query) {
    this.baseURL.query = { appid: this.appId };
    if (query instanceof Object) {
      for (const key in query) {
        const value = query[key];
        this.baseURL.query[key] = value;
      }
    } else {
      this.baseURL.query.input = query;
    }
    return url.format(this.baseURL);
  }

  query(query, callback) {
    if (this.appId == null)
      throw new Error('Cannot query without App ID');
    const queryURL = this.makeQueryURL(query);
    /*return request(queryURL, function(err, response, body) {
       
      });*/
    fetch.get(queryURL).then(data => {
      if (data.status !== 200)
        return callback(`Error ${data.status}: ${data.statusText}`, null);
      return xml2js.parseString(data.body, function(err, result) {
        if (err != null)
          return callback(err, result);
        else if (result.queryresult.$.error)
          return callback(result.queryresult.error, result);
        else
          return callback(null, result);
      });
    });
  }
}

module.exports = Client;