const fetch = require('node-superfetch');
const xml2js = require('xml2js');

class Client {
  constructor(appId) {
    this.appId = appId;
  }

  query(query, callback) {
    if (this.appId == null)
      throw new Error('Cannot query without App ID');
    const opt = { appid: this.appId };
    if (query instanceof Object) {
      for (const key in query) {
        const value = query[key];
        opt[key] = value;
      }
    } else {
      opt.input = query;
    }
    fetch.get('http://api.wolframalpha.com/v2/query').query(opt).then(data => {
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