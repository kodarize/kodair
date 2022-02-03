/**
 * Raxan (Rich Ajax Application) JavaScript Object / Startup script
 * Copyright (c) 2011 Raymond Irving (http://raxanpdi.com)
 *
 * Dual licensed under the MIT and GPL licenses.
 * See the LICENSE.txt file
 *
 */

/**
 *  Raxan Javascript Object
 */
Raxan = {
	version: '1.0', //@todo: update version number
	revision: '0',
	path: '',
	scriptpath: '',
	csspath: '',
	expando: '',
	arraycol: {},
	inc: {},
	UI: {}, // UI namespace
	regvar: {}, // registered variables - for usewith service-side registerVar() method
	loading: 0,
	isReady: false,
	isLoad: false,
	supportReadyState: false,
	hasFlashEvent: {},

	// initialize system
	init: function () {
		var i, js, st, m, src, code, elm;
		var pth,
			tag,
			tags = document.getElementsByTagName('SCRIPT');
		this.cnt = 0; // set counter
		// get library path
		tag = tags[tags.length - 1];
		src = tag.src + '';
		elm = document.createElement('script');
		this.supportReadyState = elm.readyState ? true : false;
		this.msie = navigator.userAgent.indexOf('MSIE') >= 0;
		if (this.msie) {
			var match = /msie ([\w.]+)/.exec(navigator.userAgent.toLowerCase());
			this.msieVer = parseFloat(match[1]);
		}

		if (tag && (st = src.indexOf('startup.js')) >= 0) {
			// setup paths
			pth = this.path = src.substr(0, st);
			this.csspath = pth + 'ui/css/';
			this.scriptpath = pth + 'ui/javascripts/';
		}

		// invoke pre init functions
		if (self.RaxanPreInit)
			for (i in RaxanPreInit) if (typeof RaxanPreInit[i] == 'function') RaxanPreInit[i]();
	},

	// initialize event handling after main scrips have been loaded
	initEvents: function () {
		var me = this;
		if (this.pcbk) return this;
		this.pcbk = true;
		this.handlePageEvents(
			function (e) {
				me.readyCallback(e);
			},
			function (e) {
				me.loadCallback(e);
			},
			function (e) {
				me.unloadCallback(e);
			}
		);
		return this;
	},

	// document callback handlers: ready, load, unload, error
	loadCallback: function (e) {
		var i,
			l,
			a = this.collection('load');
		this.arraycol['load'] = null;
		this.isLoad = true;
		l = a.length;
		for (i = 0; i < l; i++) a[i](e);
	},
	unloadCallback: function (e) {
		var i,
			l,
			a = this.collection('unload');
		this.arraycol['unload'] = null;
		l = a.length;
		for (i = 0; i < l; i++) a[i](e);
	},
	readyCallback: function (e) {
		var i,
			l,
			a = this.collection('ready');
		this.arraycol['ready'] = null;
		this.isReady = true;
		l = a.length;
		for (i = 0; i < l; i++) a[i](e);
		a = this.collection('binds');
		this.arraycol['binds'] = null;
		l = a.length;
		for (i = 0; i < l; i++) this.handleEvent(a[i][0], a[i][1], a[i][2]);
	},
	iTriggerError: function (txt, code) {
		var i,
			l,
			r,
			a = this.collection('error');
		l = a.length;
		for (i = 0; i < l; i++) r = a[i](txt, code) || r;
		return r;
	},
	iTriggerPreloader: function (elm, e, mode, result) {
		var i,
			l,
			r,
			a = this.collection('preloader');
		e = e ? e : jQuery.Event('togglepreloader');
		if (result) e.serverResult = result;
		if (elm) e.target = e.currentTarget = elm;
		l = a.length;
		for (i = 0; i < l; i++) r = a[i](e, mode) || r;
		return r;
	},

	// handle event binding
	handleEvent: function (css, evt, fn) {
		if (window.jQuery) jQuery(css).bind(evt, fn);
	},

	// handle page events ready, load, unload
	handlePageEvents: function (rdy, ld, uld) {
		var j,
			w = window;
		if (w.jQuery) {
			// use jquery events
			j = w.jQuery;
			j(rdy);
			j(w).load(ld).unload(uld);
		} else {
			// use browser load events
			function e(n, f) {
				if (n == 'load' && document.readyState == 'complete' && document.body) f();
				// for msie when script is loaded inside <body> tag
				else if (w.addEventListener) w.addEventListener(n, f, false);
				else if (w.attachEvent) w.attachEvent('on' + n, f);
			}
			e('load', function (evt) {
				rdy(evt);
				ld(evt);
			}); // call ready and load after document load
			e('unload', uld);
			e = null;
		}
	},

	// returns url parameters
	urlparams: function () {
		var a, o, n, nv;
		if (this._urlparams) return this._urlparams;
		else {
			a = (location + '').split(/\?/);
			o = { _url: a[0], _query: a[1] };
			nv = a[1] ? a[1].split(/\&/) : null;
			if (nv)
				for (n in nv) {
					a = nv[n].split(/\=/);
					o[a[0]] = a[1] ? unescape(a[1]) : '';
				}
			this._urlparams = o;
			return o;
		}
	},

	// returns html file name
	filename: function () {
		var f = (location + '').split(/\?/)[0].split(/\//);
		f = f[f.length - 1];
		return f;
	},

	// returns array from the collection object
	collection: function (name) {
		var c = this.arraycol;
		return !c[name] ? (c[name] = []) : c[name];
	},

	// register ready event. This is event normally triggered before onload
	ready: function (fn) {
		var a = this.collection('ready');
		if (this.isReady && !this.loading) fn(jQuery);
		else a[a.length] = fn;
		if (!this.loading) return this.initEvents();
	},

	// register page load event
	load: function (fn) {
		var a = this.collection('load');
		if (this.isLoad && !this.loading) fn(jQuery);
		else a[a.length] = fn;
		if (!this.loading) return this.initEvents();
	},

	// register page unload event
	unload: function (fn) {
		var a = this.collection('unload');
		a[a.length] = fn;
		if (!this.loading) return this.initEvents();
	},

	// register raxan error handler - This event is triggered whenever there's a raxan eror
	error: function (fn) {
		var a = this.collection('error');
		a[a.length] = fn;
	},

	// register raxan togglepreloader event - This event is triggered before and after a client-server request
	togglePreloader: function (fn) {
		var a = this.collection('preloader');
		a[a.length] = fn;
	},

	/**
	 * Bind a function to an event
	 */
	bind: function (css, evt, fn) {
		var a = this.collection('binds');
		if (this.isReady && self.jQuery) jQuery(css).bind(evt, fn);
		else a[a.length] = [css, evt, fn];
		if (!this.loading) return this.initEvents();
	},

	/**
	 * Post data to the server.
	 * form - form element used when uploading upload files.
	 */
	post: function (url, data, form, target) {
		var i,
			c,
			f,
			div,
			elm,
			str = '';
		var b = document.getElementsByTagName('body');
		if (!b) return this;
		else b = b[0];
		if (form) f = form;
		else {
			f = document.createElement('form');
			b.appendChild(f);
		}
		f.action = url;
		f.setAttribute('method', 'post');
		if (target) f.setAttribute('target', target);
		if (data)
			for (i in data) {
				if (!f.elements[i])
					if (typeof data[i] != 'object')
						str += '<input name="' + i + '" type="hidden" />';
					else for (c in data[i]) str += '<input name="' + i + '" type="hidden" />'; // support for arrays and complex data types
			}
		if (str) {
			div = document.createElement('div');
			div.innerHTML = str;
			f.appendChild(div);
		}
		if (f && data)
			for (i in data) {
				elm = f.elements[i];
				if (typeof data[i] != 'object') {
					if (elm.type == 'hidden') elm.value = data[i];
				} else {
					for (c in data[i]) {
						// support for elements with multiple values
						if (elm[c] && elm[c].type == 'hidden') elm[c].value = data[i][c];
					}
				}
			}
		f.submit();
		f.removeChild(div); // remove elements after submiting form
		return this;
	},

	/**
	 * Dynamically includes a CSS file
	 */
	css: function (src, ext) {
		var f,
			k = 'css:' + src;
		if (src && !this.inc[k]) {
			// check if already included
			f = !ext ? this.csspath + src + '.css' : src; // check if script is external
			this.insertScript(f, 'text/stylesheet');
			if (src.toLowerCase() == 'master' && this.msie && this.msieVer < 8) {
				// apply IE css master fixes
				this.insertScript(this.csspath + src + '.ie.css', 'text/stylesheet');
			}
			this.inc[k] = true;
		}
		return this;
	},

	// returns script callback handler - used by include
	callback: function (n, mode, fn) {
		if (mode == 1)
			return function () {
				Raxan.inc[Raxan.inc[n]] = true; // script loaded
			};
		else
			return function () {
				Raxan.loading--; // decrement load counter
				if (typeof fn == 'function') fn();
				if (Raxan.loading == 0) {
					if (Raxan.isReady) Raxan.readyCallback(window.jQuery);
					if (Raxan.isLoaded) Raxan.loadCallback();
					if (!Raxan.isReady) Raxan.initEvents();
				}
				Raxan.inc[Raxan.inc[n]] = true; // script loaded
			};
	},

	/**
	 * Dynamically includes a Javascript file
	 */
	include: function (src, extrn, fn) {
		var i, l, n, url, cbk, mode;
		if (typeof src == 'string') src = [src];
		l = src.length;
		for (i = 0; i < l; i++) {
			n = src[i] + '';
			if (n && !this.inc[n]) {
				// check if already included
				url = !extrn ? this.scriptpath + n + '.js' : n; // check if script is external
				if (i < l - 1) mode = 1;
				else {
					mode = 2;
					this.loading++; // increment load counter
				}
				cbk = this.callback(n, mode, fn); // get a callback for the included script
				this.inc[n] = this.insertScript(url, 'text/javascript', false, cbk);
			} else if (fn) {
				cbk = this.inc[this.inc[n]];
				if (cbk === true) fn();
				// script already loaded so do callback
				else {
					this.inc[this.inc[n]] = function () {
						// script not yet loaded
						cbk();
						fn();
					};
				}
			}
		}

		return this;
	},

	/**
	 * Insert Script Tag into document
	 * @return string Id of inserted script
	 */
	insertScript: function (src, type, embedded, callback) {
		var callbk = '',
			doc = document;
		var elm,
			id = 'raxsl' + this.cnt++; // raxan script loder id
		var tag,
			headTag = doc.getElementsByTagName('head')[0];

		type = type ? type : 'text/javascript';
		if (callback) this.inc[id] = callback; // register callback

		if (headTag && doc.body) {
			// document loaded - append scripts/css
			if (type == 'text/stylesheet') {
				elm = doc.createElement('link');
				elm.setAttribute('rel', 'stylesheet');
				elm.setAttribute('href', src);
			} else {
				elm = doc.createElement('script');
				elm.setAttribute('type', type);
				if (!embedded) elm.setAttribute('src', src);
				else {
					if (doc.all) elm.innerHTML = src;
					elm.appendChild(doc.createTextNode(src));
				}
			}
			if (callback) {
				callbk = function () {
					raxanloadjs(id, this);
				};
				if (this.msie && elm.readyState) elm.onreadystatechange = callbk;
				else elm.onload = elm.onerror = callbk;
			}
			elm.setAttribute('id', id);
			headTag.appendChild(elm);
			//headTag.removeChild(elm); // don't remove <script> tag - fixes issue with IE when using inside the <body tag>
		} else {
			// document not loaded - write scripts
			if (type == 'text/stylesheet') {
				// css
				if (!embedded) tag = '<link id="' + id + '" rel="stylesheet" href="' + src + '" />';
				else tag = '<style id="' + id + '" type="text/stylesheet">' + src + '</style>';
			} else {
				// javascript
				if (callback) {
					// opera 9 supports readyState but not the inline onreadystatechange
					callbk =
						this.msie && this.supportReadyState
							? ' onreadystatechange="raxanloadjs(\'' + id + '\',this)"'
							: ' onload="raxanloadjs(\'' +
							  id +
							  '\',this)" onerror="raxanloadjs(\'' +
							  id +
							  '\',this)"';
				}
				if (!embedded)
					tag =
						'<script id="' +
						id +
						'" type="' +
						type +
						'" src="' +
						src +
						'"' +
						callbk +
						'></script>';
				else {
					tag =
						'<script id="' +
						id +
						'" type="' +
						type +
						'"' +
						callbk +
						'>' +
						src +
						'</script>';
				}
			}
			document.write(tag);
		}

		return id;
	},

	// log to debug console
	log: function (txt) {
		if (window.console) window.console.log(txt);
	},
};

// Script Load callback
function raxanloadjs(id, elm) {
	elm = elm ? elm : this;
	var fn = Raxan.inc[id] ? Raxan.inc[id] : null;
	if (Raxan.msie && elm.readyState) {
		// for IE browsers
		//if (elm.readyState == "complete" || (Raxan.isReady && elm.readyState == "loaded")){
		if (elm.readyState == 'complete' || elm.readyState == 'loaded') {
			elm.onreadystatechange = null;
			if (typeof fn == 'function') {
				if (!Raxan.isReady) fn();
				else setTimeout(fn, 10); // call via timeout after page load.
				//IE sometimes fail to execute script before completing readystate
			}
		}
	} else {
		// for other browsers
		if (typeof fn == 'function') fn();
	}
}

/* PDI Helper Functions */

var _PDI_AJAX_ERR_MSG =
	'Error while connecting to server. Please try again or report the matter to the administrator. See the Error Console for more information.'; //default msg

/**
 * Creates a conduit connection to the page
 * @param string name
 * @param array options
 * @return Raxan.Conduit
 */
Raxan.createConduit = function (name, options) {
	return new this.Conduit(name, options);
};

/**
 * Dispatch server-side event
 * @param string type Event type
 * @param mixed value (Optional) Value to be passed to the server-side event. This value can be retrieved from the server by using val(), intVal(), etc
 * @param function fn (Optional) JavaScript Callback function
 * @return Raxan
 */
Raxan.dispatchEvent = function (type, value, fn) {
	var url,
		target,
		serialize,
		opt = {},
		o = {};
	if (typeof type == 'object') {
		o = type;
		type = o.type;
		fn = null;
		value = null;
	} // dispatchEvent(option)
	else if (value && jQuery.isFunction(value)) {
		fn = value;
		value = null;
	} // dispatchEvent(type,fn)
	type = jQuery.trim(type);
	opt.vu = o.view;
	opt.targetWindow = o.targetWindow;
	target = o.target ? o.target : 'page';
	url = o.url;
	if (url) target += '@' + url; // setup preferred target
	serialize = o.serialize ? o.serialize : null;
	if (value === null) value = o.value;
	fn = o.complete ? o.complete : fn;
	if (fn && type.substr(0, 1) != '#') type = '#' + type;
	if (fn || type.substr(0, 1) == '#')
		opt.callback = function (result, status) {
			Raxan.iTriggerPreloader(null, null, 'off', result); // toogle preloader event handlers
			if (fn && typeof fn == 'function') return fn(result, status);
		};
	this.iTriggerPreloader(null, null, 'on'); // toogle preloader event handlers
	this.iTriggerRemote(target, type, value, serialize, opt);
	return this;
};

/**
 * Returns registered server-side value
 * @param string name Name of variable
 * @param mixed _default Optional default value
 * @param boolean _remove Optional. Remove or delete the registered variable
 * @return mixed
 *
 */
Raxan.getVar = function (name, _default, _remove) {
	var v = this.regvar[name];
	if (typeof v == 'undefined') v = _default;
	if (_remove) delete this.regvar[name];
	return v;
};

// Used internally to control Flash message effect
Raxan.iFlashEffect = function (effect, id, exposeOpt) {
	var opt, ar, elm;
	id = id ? '#' + id : '.flashmsg:first';
	if (effect) {
		ar = effect.split(/-/); // get direction
		effect = ar[0];
		if (ar[1]) opt = { direction: ar[1] };
	}
	if (!this.hasFlashEvent[id])
		jQuery(id + ' .close').live('click', function (e) {
			var me = jQuery(this),
				elm = me.parents('.rax-flash-msg:first');
			if (elm.length == 0) elm = me;
			if (!elm.attr('data-flash-fx')) elm.hide();
			else elm.stop().fadeOut('fast');
			e.preventDefault();
			if (elm.data('rax-flash-expose')) {
				$.mask.close();
				elm.data('rax-flash-expose', false);
			}
			$(id).trigger('flashmsg', 'off'); // trigger flashmsg event - off
			return false;
		});
	this.hasFlashEvent[id] = true;

	elm = jQuery(id + ' .rax-flash-msg');
	if (exposeOpt) elm.expose(exposeOpt).data('rax-flash-expose', true);
	elm.stop().hide();
	if (effect == 'fade') elm.fadeIn();
	else elm.show(effect, opt);
	// trigger flashmsg event - on
	$(id).trigger('flashmsg', 'on');
};

// Used internally to update client element
Raxan.iUpdateClient = function (selectors, source, sourceDelim) {
	var $ = jQuery;
	source = source.split(sourceDelim);
	$(selectors).each(function (i) {
		var elm = $(source[i]).get(0);
		Raxan.iUpdateElement(this, elm);
	});
};
// Used internally
Raxan.iUpdateElement = function (srcElm, targetElm) {
	var expando,
		cb = [],
		src = srcElm,
		tar = targetElm;

	// @todo: this method needs to be optimized and modified to support ui widgets

	// get jQuery expando
	if (jQuery.expando) expando = jQuery.expando;
	// jquery 1.4.2
	else if (this.expando) expando = this.expando;
	else {
		var a = $('<div />').data('test', 1).get(0); // get the expando the hard way :(
		for (i in a) if (i.indexOf('jQuery') == 0) expando = this.expando = i;
	}
	function cloneEvents(elm, mode, path, index) {
		var i,
			e,
			l,
			data,
			events,
			type,
			handler,
			ix = 1;
		if (elm.nodeType == 3 || elm.nodeType == 8) return;
		if (!index) index = '';
		path = path ? path + '/' : '';
		path += elm['id'] ? elm['id'] : elm.nodeName.toLowerCase() + index;
		if (mode == 'copy') {
			e = elm[expando] ? elm[expando] : jQuery.data(elm);
			if (jQuery.cache[e]) cb[path] = jQuery.cache[e];
		} else if (mode == 'paste' && cb[path]) {
			// clone events and data
			data = cb[path];
			events = data['events'];
			delete data['handle'];
			delete data['events'];
			for (type in data) jQuery.data(elm, type, data[type]);
			for (type in events) {
				for (handler in events[type]) {
					jQuery.event.add(elm, type, events[type][handler], events[type][handler].data);
				}
			}
		}
		var nm = (elm.nodeName + '').toLowerCase();
		if (nm == 'select') return; // no need to clone <option> tags
		l = elm.childNodes.length;
		if (l)
			for (i = 0; i < l; i++) {
				e = elm.childNodes[i];
				if (e.nodeType != 3 && e.nodeType != 8) {
					cloneEvents(e, mode, path, ix++);
				}
			}
	}
	cloneEvents(src, 'copy');
	cloneEvents(tar, 'paste');
	var s = src.style,
		t = tar.style; // retain elmement position
	if (s.position && !t.position) t.position = s.position;
	if (s.left && !t.left) t.left = s.left;
	if (s.top && !t.top) t.top = s.top;
	$(srcElm).replaceWith(targetElm); // replace element
};

// Used internally to trigger jQuery events on target elements
Raxan.iTriggerEvent = function (elm, type, data, delegate, serverResult) {
	var event, events;
	if (typeof elm == 'string') elm = jQuery(elm).get(0);
	if (!elm) return null;
	events = jQuery.data(elm, 'events');
	if (delegate || (events && events[type])) {
		event = jQuery.Event(type);
		if (serverResult) event.serverResult = serverResult;
		jQuery(elm).trigger(event, data);
	}
	return event;
};

// Used internally to bind client-side elements to server-side events
Raxan.iBindRemote = $bind = function (css, evt, val, serialize, ptarget, script, options) {
	var $ = jQuery;

	evt = $.trim(evt);
	if (!evt) evt = 'click';
	var type = evt.substr(0, 1) == '#' ? evt.substr(1) : evt;
	var delay,
		confirm,
		targetWin,
		delegate,
		disable,
		toggle,
		icache,
		before,
		after,
		vu,
		repeat = 1,
		o = options;
	if (o === true) delegate = true;
	// last param can be true (for delegates) or an array of options
	else if (o) {
		delegate = o['dt'] ? o['dt'] : false;
		confirm = o['ct'] ? o['ct'] : '';
		delay = o['dl'] ? o['dl'] : 0;
		disable = o['ad'] ? o['ad'] : '';
		toggle = o['at'] ? o['at'] : '';
		icache = o['ic'] ? o['ic'] : '';
		repeat = o['rpt'] ? o['rpt'] : repeat;
		vu = o['vu'] ? o['vu'] : '';
		targetWin = o['tw'] ? o['tw'] : '';
	}
	var cb = function (e, eventParam) {
		var ievent;
		var preventPostback = false;
		var preventDefault = e.type == 'click' || e.type == 'submit' ? true : false;
		var me = this,
			t = ptarget ? ptarget : this.getAttribute('id') + '';
		e.currentTarget = this; // needed for jQuery.live() 1.3.2 ?

		// check if element is disabled
		if ($(me).attr('disabled') == 'disabled') {
			e.preventDefault();
			return;
		}

		if (delegate && !ptarget) t = css + (delegate !== true ? ' ' + delegate : ''); // append delegate css to target
		if (script) {
			before = script['before'] ? script['before'] : script;
			after = script['after'] ? script['after'] : '';
		}

		if (before) eval(before);
		if (!preventPostback) {
			var opt = {
					event: e,
					eventParam: eventParam,
					vu: vu, // page view name
					delegate: delegate,
					confirm: confirm, // message to be displayed before event
					targetWindow: targetWin,
					callback: function (result, status) {
						var elm;
						if (disable) {
							elm = $(disable);
							if (elm.length > 0) elm.attr('disabled', '');
						}
						// trigger event: disablecontent (off)
						Raxan.iTriggerEvent(me, 'disablecontent', 'off', delegate, result);

						if (toggle) {
							elm = $(toggle);
							if (elm.length > 0) elm.hide();
						}
						// trigger event: togglecontent (off) and assign server-side result to the event object
						ievent = Raxan.iTriggerEvent(me, 'togglecontent', 'off', delegate, result);
						Raxan.iTriggerPreloader(me, ievent, 'off', result); // toogle preloader event handlers

						if (after) eval(after);
					},
				},
				fn = function () {
					if (icache && (me.type == 'text' || me.tagName == 'textarea')) {
						// input cache
						var old = $(me).data('clxOldValue'),
							nw = me.value;
						if (nw && (nw + '').length < icache) return;
						else if (old != nw) $(me).data('clxOldValue', nw);
						else return;
					}

					// auto-toggle element
					var elm;
					if (toggle) {
						elm = $((toggle = toggle == 1 ? me : toggle));
						if (elm.length > 0) elm.show();
					}
					// trigger event: togglecontent (on)
					ievent = Raxan.iTriggerEvent(me, 'togglecontent', 'on', delegate);
					if (ievent && ievent.isDefaultPrevented()) return;
					Raxan.iTriggerPreloader(me, ievent, 'on'); // toogle preloader event handlers

					// call remote server-event
					var failed = !Raxan.iTriggerRemote(t, evt, val, serialize, opt);
					preventDefault = failed ? true : preventDefault;

					if (!failed) {
						// auto-disable element after triggering remote
						if (disable) {
							elm = $((disable = disable == 1 ? me : disable));
							if (elm.length > 0) elm.attr('disabled', 'disabled');
						}
						// trigger event: disablecontent (on)
						Raxan.iTriggerEvent(me, 'disablecontent', 'on', delegate);
					}
				};

			if (!delay) fn();
			else {
				clearTimeout($(this).data('clxTimeout') || 0);
				$(this).data('clxTimeout', setTimeout(fn, delay));
			}
		}
		if (preventDefault) e.preventDefault();
	};

	if (isNaN(type)) {
		if (!delegate) $(css).bind(type, cb);
		else if (delegate === true) $(css).live(type, cb);
		else $(css).delegate(delegate, type, cb);
	} else {
		// timeout
		var cnt = 1,
			tmr = 0,
			ms = parseInt(type);
		if (ms < 1000) ms = 1000;
		tmr = window.setInterval(function () {
			if (repeat !== true && repeat >= 1 && cnt > repeat) clearTimeout(tmr);
			else {
				var elm,
					e = $.Event(type);
				e.result = undefined;
				e.currentTarget = e.target = elm = $(css).get(0);
				cb.call(elm, e, null);
				cnt++;
			}
		}, ms);
	}
};

// Used internally to trigger or invoke an event on the server
Raxan.iTriggerRemote = $trigger = function (target, type, val, serialize, opt) {
	var $ = jQuery,
		sdata,
		ievent;
	opt = opt || {};
	var e = opt.event,
		callback = opt.callback,
		vu = opt.vu,
		confirmText = opt.confirm,
		targetWindow = opt.targetWindow;
	var i,
		a,
		s,
		telm,
		tname,
		isupload,
		form,
		post = {},
		tmp,
		url,
		isAjax = false;
	if (!type) type = 'click'; // defaults to click
	if (type.substr(0, 1) == '#') {
		isAjax = true;
		type = type.substr(1);
	}
	tmp = target.split(/@/); // support for target@url
	target = tmp[0];
	url = tmp[1] ? tmp[1] : _PDI_URL;

	// get event current target element
	if (e && (e.currentTarget || e.target)) {
		telm = e.currentTarget || e.target;
		tname = (telm.nodeName + '').toLowerCase();
		targetWindow =
			targetWindow || telm.getAttribute('target') || telm.getAttribute('formTarget'); // get target window
		isupload = tname == 'form' && /multipart\/form-data/i.test(telm.encoding); // check form encoding
		if (isupload) form = telm;
	}

	if (telm) {
		var n,
			nn,
			targets = e ? [e.currentTarget, e.target] : [];
		for (n in targets) {
			// loop through currentTarget and target element
			n = targets[n];
			if (!n) continue;
			nn = (n.nodeName + '').toLowerCase(); // get node name

			// get confirm message from target
			if (!confirmText) confirmText = n.getAttribute('data-event-confirm'); // get confirm text from html5 data attribute

			// get vu from target
			if (!vu) vu = n.getAttribute('data-event-view'); // get view from html5 data attribute

			// get event value from target
			if (val === '' || val === null) {
				if (e && e.value !== '' && e.value !== undefined) val = e.value;
				else {
					tmp = n.getAttribute('data-event-value'); // extract value from html5 data attribute
					if (tmp) s = tmp;
					else if (/v:/i.test(n.className)) {
						s = n.className.match(/v:(\w+)/)[1]; // extract value from class name using format v:value
					} else if (nn == 'a' || nn == 'area') {
						// extract value from anchor hash
						s = (n.href || n.getAttribute('href')) + '';
						s = (tmp = s.lastIndexOf('#')) ? s.substr(tmp + 1) : '';
					} else if (nn == 'input' || nn == 'select' || nn == 'textarea') {
						// extract value from element
						s = $(n).serializeArray()[0];
						s = s ? s['value'] : null;
					}
					val = s ? s : val;
				}
			}
		}
	}

	// display confirm message
	if (confirmText && !confirm(confirmText)) {
		if (callback) callback(null, false);
		return false;
	}

	// setup postback url and view mode
	if (!url) url = self.location.href;
	if (vu) {
		url = url.replace(/vu=[^&]*/, '').replace(/[\?&]$/, '');
		if (vu && vu != 'index') url += (url.indexOf('?') == -1 ? '?' : '&') + 'vu=' + vu;
	}

	// check serialization - if target is form then serialize the form
	if (!serialize && tname == 'form' && !isupload) serialize = telm;
	else if (
		!serialize &&
		(tname == 'input' || tname == 'button') && // if target is submit button then serialize form
		/submit|image/i.test(telm.type) &&
		telm.form
	) {
		isupload = /multipart\/form-data/i.test(telm.form.encoding); // check form encoding
		if (isupload) form = telm.form;
		else serialize = telm.form;
	}

	// serialize selector elements
	if (serialize) {
		s = $(serialize);
		if (s.length > 0) {
			var valid = true;
			s.each(function () {
				// check for html5 form element validity
				if (valid && this.checkValidity) {
					if (!this.elements) {
						valid = this.checkValidity();
						if (!valid) this.focus();
					} else
						for (i = 0; i < this.elements.length; i++) {
							valid = this.elements[i].checkValidity();
							if (!valid) {
								this.elements[i].focus();
								break;
							}
						}
				}
			});
			if (!valid) {
				if (callback) callback(null, false);
				return false;
			}
			sdata = s.serializeArray(); // serialize data from matched elements
			var selm = s.get(0); // is serialized object a form?
			if ((selm.nodeName + '').toLowerCase() == 'form') {
				isupload = /multipart\/form-data/i.test(selm.encoding); // check form encoding
				if (isupload) {
					form = selm;
					selm = null;
				}
			}
		}
	}

	// trigger serializecontent event
	ievent =
		telm != 'page'
			? Raxan.iTriggerEvent(telm, 'serializecontent', undefined, opt.delegate)
			: null;
	if (ievent) {
		if (ievent.isDefaultPrevented()) {
			if (callback) callback(null, false);
			return false;
		}
		if (ievent.value) val = ievent.value;
		if (ievent.result) {
			s = ievent.result; // must returns a 2D array with name and value keys
			if (sdata && sdata.concat) sdata = sdata.concat(s);
			// merge serilaized data from custom event
			else sdata = s;
		}
	}

	// put serialized data into post variable
	if (sdata)
		for (i in sdata) {
			if (!post[sdata[i].name]) post[sdata[i].name] = sdata[i].value;
			else {
				// build array - fix for php
				a = post[sdata[i].name];
				if (typeof a != 'object') a = [a];
				a[a.length] = sdata[i].value;
				post[sdata[i].name] = a;
			}
		}

	// get token
	var token,
		en,
		st,
		c = document.cookie;
	st = c.indexOf('_ptok=');
	if (st >= 0) {
		en = c.indexOf(';', st);
		token = unescape(en > 0 ? c.substr(st + 6, en - (st + 6)) : c.substr(st + 6));
	}

	// prepare post data
	post['_e[type]'] = type;
	post['_e[value]'] = val;
	post['_e[target]'] = target;
	post['_e[tok]'] = token; // set postback token

	if (e) {
		var o = $(e.target).offset();
		if (e.which) post['_e[which]'] = e.which;
		if (e.button) post['_e[button]'] = e.button;
		if (e.ctrlKey) post['_e[ctrlKey]'] = e.ctrlKey;
		if (e.metaKey) post['_e[metaKey]'] = e.metaKey;
		if (e.pageX) post['_e[pageX]'] = e.pageX;
		if (e.pageY) post['_e[pageY]'] = e.pageY;
		if (o.left) post['_e[targetX]'] = o.left;
		if (o.top) post['_e[targetY]'] = o.top;
	}
	if (opt.eventParam) {
		// check for extra event params
		var ep = opt.eventParam;
		if (ep.helper) post['_e[uiHelper]'] = ep.helper.attr('id'); // check if special ui object
		if (ep.sender) post['_e[uiSender]'] = ep.sender.attr('id');
		if (ep.draggable) post['_e[uiDraggable]'] = ep.draggable.attr('id');
		if (ep.item) {
			post['_e[uiItem]'] = ep.item.attr('id');
			if ($(telm).hasClass('ui-sortable'))
				post['_e[uiSortedItemIds]'] = $(telm).sortable('toArray').join(','); // get sorted item ids
		}
	}

	// post data to server
	if (!isAjax) Raxan.post(url, post, isupload ? form : null, targetWindow);
	else {
		post['_ajax_call_'] = 'on'; // let server know this is ajax
		$.ajax({
			cache: false,
			url: url,
			type: 'post',
			data: post,
			dataType: 'json',
			success: function (data) {
				var _ctarget_ = e ? e.currentTarget : null,
					_target_ = e ? e.target : null; // refrenced as this and target
				if (!data && callback) callback(null, false);
				else if (data) {
					if (data['_actions']) eval(data['_actions']);
					Raxan.ready(function () {
						// execute callback when raxan is ready or not loading scripts
						if (callback) callback(data['_result'], true); // pass ajax results to callback function
					});
				}
			},
			error: function (s) {
				var rt,
					result,
					httpCode = s.status;
				if (s && httpCode == 0) {
					// ignore when status code is 0
					if (callback) callback(null, false);
				} else {
					result = s.responseText;
					if (callback) rt = callback(result, false, httpCode); // pass results to callback function
					if (rt !== true) rt = Raxan.iTriggerError(result, httpCode); // trigger raxan error event handlers
					// check if error was handled
					if (rt !== true) {
						var err = 'Error Output:\n-------------------\n' + result;
						var friendlyerr =
							httpCode != 401 && httpCode != 403 ? _PDI_AJAX_ERR_MSG + '\n\n' : '';
						friendlyerr += $('<div>' + err.substr(0, 210) + '</div>').text() + '...';
						Raxan.log(err); // log to console
						alert(friendlyerr); // show friendly message
					}
				}
			},
			/*dataFilter: function(data) {
                // support for native JSON parser - http://ping.fm/UFKii
                if (typeof (JSON) !== 'undefined' &&
                    typeof (JSON.parse) === 'function') data = JSON.parse(data);
                return data;
            },*/
			xhr: function () {
				// XHR for postbacks and file uploads
				var fn = function () {};
				var id = this.counter ? ++this.counter : (this.counter = 10);
				return !isupload
					? $.ajaxSettings.xhr()
					: {
							status: 404,
							readyState: 0,
							getResponseHeader: fn,
							setRequestHeader: fn,
							open: function (type, url) {
								var frame =
									'<iframe name="rx01Ajax' +
									id +
									'" src="about:blank" width="1" height="1" ' +
									'style="position:absolute;left:-1000px;visibility:hidden"/>';
								var me = this;
								me.url = url;
								me.readyState = 1;
								me.frm = $(frame)
									.load(function () {
										var f = me.frm;
										var d = f.contentDocument || f.contentWindow.document;
										if (d.location == 'about:blank') return; // opera needs this?
										me.responseText =
											$('textarea', d).val() || $('body', d).html();
										me.readyState = 4;
										me.status = 200;
										$(f).unbind(); // unbind event to prevent looping in IE
										d.open();
										d.close(); // close document to prevent busy cursor in FF
										me.onreadystatechange(); // tigger the onreadystatechange - used in jquery 1.4+
										document.body.removeChild(me.frm);
										me.frm = null;
									})
									.get(0);
								document.body.appendChild(this.frm);
							},
							send: function () {
								var target = 'rx01Ajax' + id;
								post['_ajax_call_'] = 'iframe';
								Raxan.post(this.url, post, form, target);
							},
							abort: function () {
								if (this.frm) {
									document.body.removeChild(this.frm);
									this.frm = null;
								}
							},
					  };
			},
		});
	}
	return true;
};

// Raxan Conduit - Experimental
Raxan.Conduit = function (name, options) {
	var k;
	this.name = name;
	if (options) for (k in options) this.options[k] = options[k];
};
Raxan.Conduit.prototype = {
	length: 0,
	current: -1,
	buffer: [],
	fn: [],
	name: '',
	options: {
		bufferSize: 50,
		pageSize: 10,
		requestDelay: 70,
		before: null,
		after: null,
		error: null,
	},
	boc: function () {
		return this.current == 0 ? true : false;
	},
	clearDnTimer: function () {
		if (this.lastOffset) this.fn = null;
		if (this.timer) {
			clearTimeout(this.timer);
			this.timer = 0;
		}
	},
	download: function (offset, limit, fn, mode) {
		var params,
			startPos,
			me = this,
			tms = this.options.requestDelay || 70; // timeout in ms
		startPos = offset = parseInt(offset);
		limit = limit !== null ? limit : this.options.bufferSize;
		if (limit < 0) {
			(startPos += limit + 1) < 0 ? (startPos = 0) : null;
			limit *= -1;
		}
		params = { offset: startPos, limit: limit, rowcount: this.length, param: null };
		this.fn = [];
		this.fn[offset] = fn;
		if (this.timer) clearTimeout(this.timer);
		var dt = new Date();
		if (this.lastTime && dt - this.lastTime < 500) tms = 200;
		if (!this.dwnlCounter) this.dwnlCounter = 0;
		this.timer = setTimeout(function () {
			me.dwnlCounter++;
			if (me.options.before) me.options.before(me);
			Raxan.dispatchEvent('rax-conduit-' + me.name, params, function (rt, status) {
				var i,
					errHandled,
					ds,
					count,
					c = 0,
					cb = me.fn ? me.fn[offset] : null;
				me.dwnlCounter--;
				if (status && rt) {
					count = me.length = rt.rowcount;
					ds = rt.dataset;
					if (ds && ds.length)
						for (i in ds) {
							me.buffer[startPos + c++] = ds[i];
						}
					if (count && count < me.buffer.length) me.buffer = me.buffer.slice(0, count); // slice buffer to match count
					if (mode != 'get' && offset > me.buffer.length - 1) {
						offset = me.current = (me.length = me.buffer.length) - 1;
					}
					if (cb && me.buffer[offset]) cb(me.buffer[offset], offset);
				}
				if (me.lastOffset == offset || me.dwnlCounter == 0) {
					if (!status && me.options.error) errHandled = me.options.error(me, rt);
					if (me.options.after) me.options.after(me);
					if (errHandled === true) return errHandled;
				}
			});
		}, tms);
		this.lastOffset = offset;
		this.lastTime = new Date();
	},
	eoc: function () {
		return this.current >= this.length - 1 ? true : false;
	},
	each: function (fn) {
		var total,
			index = -1,
			me = this,
			f = function (d, offset) {
				total = me.length;
				index++;
				fn(d, offset, index, total);
				if (!me.eoc()) me.next(f);
			};
		this.rewind();
		this.next(f);
	},
	first: function (fn) {
		this.moveTo(0, fn);
	},
	get: function (offset, fn) {
		var d = this.buffer[offset];
		d ? fn && fn(d, offset) : this.download(offset, null, fn, 'get');
	},
	last: function (fn) {
		if (this.length) this.moveTo(this.length - 1, fn);
	},
	loop: function (start, end, fn) {
		var index = 0,
			dir = start <= end ? 1 : -1;
		var total = (end - start) * dir + 1;
		if (total < 0) total = 0;
		var me = this,
			f = function (d, offset) {
				if (me.length && total > me.length) total = me.length;
				fn(d, offset, index, total);
				start += dir;
				index++;
				if (index < total) me.moveTo(start, f, dir);
			};
		this.moveTo(start, f, dir);
	},
	loopBy: function (n, fn) {
		var dir = n < 0 ? -1 : 1;
		this.loop(this.current + dir, this.current + n, fn);
	},
	moveTo: function (offset, fn, _dir) {
		offset = parseInt(offset);
		if (_dir == undefined) _dir = 1;
		if (offset !== null) {
			if (offset < 0) offset = 0;
			this.current = offset;
			var d = this.buffer[this.current];
			this.clearDnTimer();
			d
				? fn && fn(d, this.current)
				: this.download(this.current, this.options.bufferSize * _dir, fn);
		}
	},
	next: function (fn) {
		var d = this.buffer[++this.current];
		this.clearDnTimer();
		d ? fn && fn(d, this.current) : this.download(this.current, null, fn);
	},
	page: function (n, fn) {
		var s,
			pc,
			pg = this.current <= 0 ? 1 : Math.ceil(this.current / this.options.pageSize);
		if (n == undefined) return pg;
		else {
			s = this.options.pageSize * (n - 1);
			if ((pc = this.pageCount()) && n > pc) return;
			var dataset = [],
				f = function (d, offset, index, count) {
					dataset[dataset.length] = d;
					if (index == count - 1) fn(dataset, offset);
				};
			this.loop(s, s + this.options.pageSize - 1, f);
		}
	},
	pageCount: function () {
		var c;
		return this.length && (c = Math.ceil(this.length / this.options.pageSize)) ? c : 0;
	},
	prev: function (fn) {
		var d = this.buffer[--this.current < 0 ? (this.current = 0) : this.current];
		this.clearDnTimer();
		d
			? fn && fn(d, this.current)
			: this.download(this.current, this.options.bufferSize * -1, fn);
	},
	reset: function () {
		this.buffer = [];
		this.current = -1;
		this.length = 0;
	},
	rewind: function () {
		this.current = -1;
	},
};

html = Raxan; // deprecate html
Raxan.init();

/**
 * Bouncing Ball Code-Behind File
 * Wriiten by Raymond Irving
 *
 * Credits:
 * --------------
 * This example is based on the article:Physics in Flash - Gravity - Written by Craig Smith.
 * Visit http://www.spoono.com/flash/tutorials/tutorial.php?url=gravity
 *
 */

// load css framework with default theme
Raxan.css('master');
Raxan.css('default/theme');

// load jquery libraries
Raxan.include('jquery');
Raxan.include('jquery-ui-interactions');

var gravity = 2.5;
var restitution = 0.7;
var friction = 0.9;

var ballSize;
var boundry;
var ball;
var timer = null;
var animateBox = true;
var boxShift = false;

var vel = { x: 1, y: 1 };
var old = { x: 10, y: 10 };
var pos = { x: 10, y: 10 };
var lastPos = {};

var dragging = false;

Raxan.ready(function () {
	var box = $('#box');

	ball = $('#ball');
	vel = { x: 1, y: 1 };
	pos = { x: 10, y: 10 };
	old = { x: 10, y: 10 };
	ballSize = ball.height();
	boundry = { width: box.width(), height: box.height() };

	ball.css({ top: 1, left: 1 }).draggable({
		start: function () {
			dragging = true;
			clearTimeout(timer);
		},
		stop: function () {
			dragging = false;
			moveBall();
		},
		drag: function () {
			var b = $(this);
			old.x = pos.x;
			old.y = pos.y;
			pos.x = parseInt(b.css('left'));
			pos.y = parseInt(b.css('top'));
			vel.x = (pos.x - old.x) / 0.5;
			vel.y = (pos.y - old.y) / 0.5;
		},
	});

	timer = setTimeout('self.moveBall()', 100);
});

// listen to button click event
Raxan.bind('#btnSave', 'click', function () {
	var f = document.forms['frmSettings'];

	animateBox = f.elements['anibox'].checked ? true : false;
	gravity = parseFloat(f.elements['gravity'].value);
	restitution = parseFloat(f.elements['restitution'].value);
	friction = parseFloat(f.elements['friction'].value);

	this.blur();

	$('#msgbox').animate({ top: -5 }).animate({ color: '#000' }, 1500).animate({ top: -50 });

	return false;
});

// moveball function
self.moveBall = function () {
	if (!dragging) {
		vel.y += gravity;

		pos.x += vel.x;
		pos.y += vel.y;

		if (boxShift) {
			$('#box').css({ padding: 0, margin: 0 });
			boxShift = false;
		}

		if (pos.x + ballSize > boundry.width) {
			pos.x = boundry.width - ballSize;
			vel.x *= -restitution;
			if (animateBox) {
				$('#box').css('padding-right', 4);
				boxShift = true;
			}
		}

		// check if ball left the bottom of the stage.
		if (pos.y + ballSize > boundry.height) {
			pos.y = boundry.height - ballSize;
			vel.y *= -restitution;
			vel.x *= friction;
			if (animateBox && lastPos.y != pos.y) {
				$('#box').css('padding-bottom', 2);
				boxShift = true;
			}
		}

		if (pos.x < 0) {
			pos.x = 0;
			vel.x *= -restitution;
			if (animateBox) {
				$('#box').css('margin-left', -4);
				boxShift = true;
			}
		}

		if (pos.y < 0) {
			pos.y = 0;
			vel.y *= -restitution;
			if (animateBox) {
				$('#box').css('margin-top', -4);
				boxShift = true;
			}
		}

		// update position of the ball
		ball.css({ top: pos.y, left: pos.x });
		lastPos.x = pos.x;
		lastPos.y = pos.y;

		// set timeout
		timer = setTimeout('self.moveBall()', 50);
	}
};