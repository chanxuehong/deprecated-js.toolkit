(function(window, undefined) {
	"use strict";

	if (window.chanxuehong !== undefined) { // has been loaded
		return;
	}

	// urlQueryValues.prototype maps a string key to a list of values
	var urlQueryValues = function() {};

	urlQueryValues.prototype = {
		constructor: urlQueryValues,
		__data: {},

		// get gets the first value associated with the given key.
		// If there are no values associated with the key, get returns
		// the empty string. To access multiple values, use the map
		// directly.
		get: function(key) {
			var values = this.__data[key];
			if (values === undefined || values.length <= 0) {
				return "";
			}
			return values[0];
		},
		// set sets the key to value. It replaces any existing values.
		set: function(key, value) {
			this.__data[key] = [value];
		},
		// add adds the value to key. It appends to any existing values associated with key. 
		add: function(key, value) {
			var values = this.__data[key];
			if (values === undefined) {
				this.__data[key] = [value];
			} else {
				values.push(value);
			}
		},
		// del deletes the values associated with key.
		del: function(key) {
			delete this.__data[key];
		},
		// encode encodes the values into “URL encoded” form ("bar=baz&foo=quux"). 
		encode: function() {
			var data = this.__data;
			var str = "";
			for (var k in data) {
				var vs = data[k];
				var prefix = encodeURIComponent(k) + "=";
				for (var i = 0, len = vs.length; i < len; i++) {
					if (str.length > 0) {
						str += "&";
					}
					str += prefix;
					str += encodeURIComponent(vs[i]);
				}
			}
			return str;
		}
	};

	var chanxuehong = {
		// parseQuery parses the URL-encoded query string and returns a map listing the values specified for each key.
		// parseQuery always returns a non-null map containing all the valid query parameters found.
		// If the query is not specified, parseQuery parses from window.location.search.
		parseQuery: function(query) {
			var ret = new urlQueryValues();

			if (query === undefined) {
				query = window.location.search;
				if (!query) { // "" or undefined
					return ret;
				}
				query = query.slice(1);
			} else if (typeof query !== "string") {
				return ret;
			}

			var kvArr = query.split("&");
			for (var i = 0, len = kvArr.length; i < len; i++) {
				var key = kvArr[i];
				var value = "";

				var j = key.indexOf("=");
				if (j >= 0) {
					value = decodeURIComponent(key.slice(j + 1));
					key = key.slice(0, j);
				}
				if (key === "") { // can empty?
					continue;
				}
				key = decodeURIComponent(key);

				ret.add(key, value);
			}

			return ret;
		},
	};

	window.chanxuehong = chanxuehong;
	return;
})(window);