var UTILS = {
		attributelist: require('storm-attributelist'),
		throttle: require('lodash.throttle')
	},
    UI = (function(w, d) {
		'use strict';

		var Fader = require('./libs/storm-fader'),
			init = function() {
				Fader.init('.js-fader');
			};

		return {
			init: init
		};

	})(window, document, undefined);

global.STORM = {
    UTILS: UTILS,
    UI: UI
};

if('addEventListener' in window) window.addEventListener('DOMContentLoaded', STORM.UI.init, false);

