request = require 'request'
xml2js = require 'xml2js'
url = require 'url'

class Client
	constructor: (@appId) ->
		@baseURL = url.parse("http://api.wolframalpha.com/v2/query")

	makeQueryURL: (query) ->
		@baseURL.query =
			appid: @appId

		if query instanceof Object
			for key, value of query
				@baseURL.query[key] = value
		else
			@baseURL.query.input = query

		url.format(@baseURL)	

	query: (query, callback) ->
		if not @appId?
			throw new Error("Cannot query without appId.")
		queryURL = @makeQueryURL(query)
		request queryURL, (err, response, body) ->
			if err? or response.statusCode isnt 200
				return callback err, null
			xml2js.parseString body, (err, result) ->
				if err?
					callback err, result
				else if result.queryresult.$.error
					callback result.queryresult.error, result
				else
					callback null, result



module.exports = Client