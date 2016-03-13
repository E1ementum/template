/*

	This file is part of JAS;
	Version 5.4.0;
	Copyright (c) 2013 - 2015 LetMeCode.ru;
	See more in "info.txt";

*/



if (typeof jas === 'undefined') {

	(function(base, doc) {

		/*
			SETUP
		*/

		var jas = function(s, jas_class) {
			if (typeof s === 'string') {
				s = jas.find(s);
				if (!s.length) return null;
				s = s[0];
			}
			var o = s.jas_object;
			if (jas.isdef(o)) {
				return o;
			} else {
				if (jas.isdef(jas_class)) {
					return jas_new_object(s, jas_class);
				}
			}
			return null;
		};

		/*
			Variables
		*/

		var version = '5.4.0';
		var jas_autoload_classes = [];
		var jas_hooks = {};
		var get_params = null;
		var cookies = null;

		/*
			JASSET
		*/

		var jasset = function(es) {
			if (typeof es !== 'undefined') {
				if (!es.tagName) {
					for (var i = 0; i < es.length; i++) {
						this.push(es[i]);
					}
				} else {
					this.push(es);
				}
			}
		};

		jas.set_proto = new Array();
		jasset.prototype = jas.set_proto;

		jas.set_proto.parent = function(selector) {
			if (!this.length) return new jasset();
			var cur = this[0];
			if (typeof selector === 'undefined') {
				if (cur.parentNode) {
					return new jasset([cur.parentNode]);
				} else {
					return new jasset();
				}
			}
			var all = doc.querySelectorAll(selector);
			var r = null;
			var i;
			while (true) {
				cur = cur.parentNode;
				if (cur == null) break;
				for(i = 0; i < all.length; i++) {
					if (all[i] == cur) {
						r = cur;
						break;
					}
				}
				if (r != null) break;
			}
			if (r == null) {
				return new jasset();
			} else {
				return new jasset([r]);
			}
		};

		jas.set_proto.attr_get = function(attr, def) {
			if (!this.length) return null;
			var a = this[0].getAttribute(attr);
			if (a != null) {
				return a;
			}
			if (jas.isdef(def)) {
				return def;
			} else {
				return '';
			}
		};

		jas.set_proto.attr_set = function(attr, value) {
			if (!this.length) return this;
			for (var i = 0; i < this.length; i++) {
				this[i].setAttribute(attr, value);
			}
			return this;
		};

		jas.set_proto.class_exists = function(className) {
			if (!this.length) return false;
			var b = false;
			for (var i = 0; i < this.length; i++) {
				b = this[i].className && new RegExp('(^|\\s)' + className + '(\\s|$)').test(this[i].className);
				if (b) break;
			}
			return b;
		};

		jas.set_proto.class_remove = function(className) {
			if (!this.length) return this;
			var n;
			var cs;
			var j;
			for (var i = 0; i < this.length; i++) {
				n = '';
				cs = this[i].className.split(' ');
				for (j = 0; j < cs.length; j++) {
					if (cs[j] !== className) {
						if (n != '') n += ' ';
						n += cs[j];
					}
				}
				this[i].className = n;
			}
			return this;
		};

		jas.set_proto.class_add = function(className) {
			if (!this.length) return this;
			var cs;
			var j;
			var b;
			for (var i = 0; i < this.length; i++) {
				cs = this[i].className.split(' ');
				b = false;
				for (j = 0; j < cs.length; j++) {
					if (cs[j] === className) {
						b = true;
						break;
					}
				}
				if (!b) this[i].className += (this[i].className === '' ? '' : ' ') + className;
			}
			return this;
		};

		jas.set_proto.find = function(selector, first) {
			var n = new jasset();
			if (!this.length) return n;
			if (!jas.isdef(selector)) selector = '*';
			var a;
			var j;
			for (var i = 0; i < this.length; i++) {
				a = this[i].querySelectorAll(selector);
				for (var j = 0; j < a.length; j++) {
					n.push(a[j]);
					if (first) return n;
				}
			}
			return n;
		};

		jas.set_proto.first = function() {
			if (!this.length) return new jasset();
			return new jasset([this[0]]);
		}

		jas.set_proto.last = function() {
			if (!this.length) return new jasset();
			return new jasset([this[this.length - 1]]);
		}

		jas.set_proto.event_add = function(event, fn) {
			for (var i = 0; i < this.length; i++) {
				this[i].addEventListener(event, fn);
			}
			return this;
		};

		jas.set_proto.each = function(fn) {
			for (var i = 0; i < this.length; i++) {
				fn.apply(this[i], [i]);
			}
			return this;
		};

		jas.set_proto.insert_before = function(element) {
			if (this.length) {
				this[0].parentNode.insertBefore(element, this[0]);
			}
			return this;
		};

		jas.set_proto.insert_after = function(element) {
			if (this.length) {
				var n = this[0].nextSibling;
				if (n) {
					this[0].parentNode.insertBefore(element, n);
				} else {
					this[0].parentNode.appendChild(element);
				}
			}
			return this;
		};

		jas.set_proto.html = function(html) {
			for (var i = 0; i < this.length; i++) {
				this[i].innerHTML = html;
			}
			return this;
		};

		jas.set_proto.remove = function(html) {
			for (var i = 0; i < this.length; i++) {
				this[i].parentElement.removeChild(this[i]);
			}
			this.length = 0;
			return this;
		};

		/*
			JAS Global
		*/

		base.jas = jas;
		jas.version = version;
		if (typeof jas_path === 'undefined') {
			jas_calc_path();
		}
		base.jas_timestamp_user = (new Date()).getTime();
		jas.classes = {};
		jas.objects = [];
		jas.current_object = null;
		jas.animation_step = 10;

		jas.set = function(s) {
			return new jasset(s);
		}

		jas.cbrt = function(n) {
			var r = Math.pow(Math.abs(n), 1 / 3);
			return n < 0 ? -r : r;
		};

		jas.hook_set = function(e, f) {
			if (e == 'animation') {
				if (f()) {
					animation_timer_run();
				} else {
					return;
				}
			}
			if (!jas.isdef(jas_hooks[e])) {
				jas_hooks[e] = [];
			}
			jas_hooks[e].push(f);
		};

		jas.hook = function(hook, a) {
			if (jas.isdef(jas_hooks[hook])) {
				var i = 0;
				var l = jas_hooks[hook].length;
				while (i < l) {
					var r = jas_hooks[hook][i].apply(this, a);
					if (!r) {
						if (hook == 'animation') animation_timer_stop();
						jas_hooks[hook].splice(i, 1);
						l--;
					} else {
						i++;
					}
				}
			}
		};

		jas.new_element = function(tagname, attributes, parent) {
			var e = doc.createElement(tagname);
			for (k in attributes) {
				if (attributes.hasOwnProperty(k)) {
					e.setAttribute(k, attributes[k]);
				}
			}
			if (jas.isdef(parent)) {
				parent.appendChild(e);
			}
			return e;
		};

		jas.extend = function(child, child_class, parent_class) {
			if (!jas.isdef(parent_class)) parent_class = 'jas_object';
			var parent = this.classes[parent_class];
			this.classes[child_class] = child;
			child.jas_class = child_class;
			var F = function() {};
			F.prototype = parent.prototype;
			child.prototype = new F();
			child.prototype.constructor = child;
			child.superclass = parent.prototype;
			child.parent_class = parent_class;
		};

		jas.inherit = function(t, c, a) {
			jas.classes[c].superclass.constructor.apply(t, a);
		};

		jas.autoload_class = function(jas_class) {
			jas_autoload_classes.push(jas_class);
		};

		jas.find = function(selector, first) {
			if (first) {
				var e = doc.querySelector(selector);
				return new jasset(e != null ? [e] : []);
			} else {
				return new jasset(doc.querySelectorAll(selector));
			}
		};

		jas.ajax = function(a, f) {
			a.request = new XMLHttpRequest();
			a.orsc = function() {
				switch (this.request.readyState) {
					case 4:
						this.result(this.request.responseText, this.request.status);
						break;
				}
			};
			a.request.onreadystatechange = function() {
				a.orsc();
			};
			a.request.open(a.method, a.url, true);
			var fd;
			var formdata = jas.isdef(a.formdata) ? a.formdata : false;
			if (formdata) {
				fd = a.data;
			} else {
				fd = new FormData();
				for (var k in a.data) {
					if (a.data.hasOwnProperty(k)) {
						fd.append(k, a.data[k]);
					}
				}
			}
			a.request.send(fd);
		};

		jas.isdef = function(v) {
			return !(typeof v === 'undefined');
		};

		jas.cubic_bezier_parse = function(s) {
			switch (s) {
				case 'ease'			: return [.25, .1, .25, 1];
				case 'linear'		: return [  0,  0,   1, 1];
				case 'ease-in'		: return [.42,  0,   1, 1];
				case 'ease-out'		: return [  0,  0, .58, 1];
				case 'ease-in-out'	: return [.42,  0, .58, 1];
				default:
					if (s.indexOf('cubic-bezier(') == 0) {
						var t = s.substr(13);
						t = t.substr(0, t.indexOf(')'));
						t = t.split(',');
						for (var i = 0; i < 4; i++) {
							t[i] = parseFloat(t[i]);
						}
						return t;
					}
			}
			return false;
		};

		jas.cubic_bezier_math = function(bz, x) {
			if ((x == 0) || (x == 1)) return x;
			var a = 3 * bz[0] + 1 - 3 * bz[2];
			var b = - 6 * bz[0] + 3 * bz[2];
			var c = 3 * bz[0];
			var d = - x;
			var p = (3 * a * c - Math.pow(b, 2)) / (3 * Math.pow(a, 2));
			var q = (2 * Math.pow(b, 3) - 9 * a * b * c + 27 * Math.pow(a, 2) * d) / (27 * Math.pow(a, 3));
			var r = Math.pow(p / 3, 3) + Math.pow(q / 2, 2);
			var t;
			if (r < 0) {
				var f;
				if (q < 0) {
					f = Math.atan(Math.sqrt(-r) / (-q / 2));
				} else if (q > 0) {
					f = Math.atan(Math.sqrt(-r) / (-q / 2)) + Math.PI;
				} else {
					f = Math.PI / 2;
				}
				var b1 = 2 * Math.sqrt(-p / 3);
				var b2 = b / (3 * a);
				t = b1 * Math.cos(f / 3) - b2;
				if ((t < 0) || (t > 1)) t = b1 * Math.cos(f / 3 + (2 * Math.PI) / 3) - b2;
				if ((t < 0) || (t > 1)) t = b1 * Math.cos(f / 3 + (4 * Math.PI) / 3) - b2;
			} else if (r > 0) {
				t = jas.cbrt(- q / 2 + Math.sqrt(r)) + jas.cbrt(- q / 2 - Math.sqrt(r)) - b / (3 * a);
			} else {
				t = - jas.cbrt(- q / 2);
				if ((t < 0) || (t > 1)) t = t * -2;
			}
			var b1 = 3 * t * Math.pow(1 - t, 2);
			var b2 = 3 * Math.pow(t, 2) * (1 - t);
			var b3 = Math.pow(t, 3);
			var y = b1 * bz[1] + b2 * bz[3] + b3;
			return y;
		};

		jas.page_scroll = function(d) {
			var t = jas.isdef(d.speed) ? d.speed : 500;
			go22_f = jas.cubic_bezier_parse(jas.isdef(d.timing_function) ? d.timing_function : 'ease');
			if (typeof go22_run !== 'undefined') {
				if (go22_run) clearInterval(go22_timer);
			}
			go22_run = true;
			go22_counter = go22_total = Math.floor(t / jas.animation_step) + 1;
			go22_sp = Math.floor(document.documentElement.scrollTop || document.body.parentNode.scrollTop || document.body.scrollTop);
			go22_fp = (jas.isdef(d.target) ? document.querySelector(d.target).getBoundingClientRect().top + go22_sp : (jas.isdef(d.pos) ? d.pos : 0)) + (jas.isdef(d.offset) ? d.offset : 0);
			var f = function() {
				var y = go22_sp + (go22_fp - go22_sp) * jas.cubic_bezier_math(go22_f, 1 - (go22_counter / go22_total));
				go22_last = Math.floor(y);
				if (document.documentElement) document.documentElement.scrollTop = go22_last;
				if (document.body.parentNode) document.body.parentNode.scrollTop = go22_last;
				if (document.body) document.body.scrollTop = go22_last;
				go22_counter--;
				if (go22_counter < 0) {
					clearInterval(go22_timer);
					go22_run = false;
				}
			};
			f();
			go22_timer = setInterval(f, jas.animation_step);
		};

		jas.get = function(name, default_value) {
			if (get_params == null) {
				get_params = {};
				var query = base.location.search.substring(1);
				var pairs = query.split('&');
				var pair;
				for (var i = 0; i < pairs.length; i++) {
					pair = pairs[i].split('=');
					get_params[pair[0]] = unescape(pair[1]);
				}
			}
			if (typeof default_value === 'undefined') {
				default_value = null;
			}
			if (typeof get_params[name] === 'undefined') {
				return default_value;
			} else {
				return get_params[name];
			}
		};

		jas.cookies_update = function() {
			cookies = {};
			var pairs = doc.cookie.split(';');
			var pair;
			for (var i = 0; i < pairs.length; i++) {
				pair = pairs[i];
				while (pair.charAt(0) == ' ') {
					pair = pair.substring(1);
				}
				pair = pair.split('=');
				cookies[pair[0]] = pair[1];
			}
		};

		jas.cookie_get = function(name, default_value) {
			name = escape(name);
			if (cookies == null) {
				jas.cookies_update();
			}
			if (typeof default_value === 'undefined') {
				default_value = null;
			}
			if (typeof cookies[name] === 'undefined') {
				return default_value;
			} else {
				return unescape(cookies[name]);
			}
		};

		jas.cookie_set = function(name, value, expires_timestamp, path, domain, secure) {
			name = escape(name);
			value = escape(value);
			if (cookies == null) {
				jas.cookies_update();
			}
			cookies[name] = value;
			var s = name + '=' + value;
			if (typeof expires_timestamp !== 'undefined')	s += '; expires=' + ((new Date(expires_timestamp)).toGMTString());
			if (typeof path !== 'undefined')				s += '; path=' + path;
			if (typeof domain !== 'undefined')				s += '; domain=' + domain;
			if (typeof secure !== 'undefined')				s += '; secure';
			document.cookie = s;
		};

		jas.cookie_remove = function(name) {
			name = escape(name);
			if (cookies == null) {
				jas.cookies_update();
			}
			delete cookies[name];
			document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC';
		};

		jas.time = function(server_time) {
			if (typeof server_time === 'undefined') {
				server_time = false;
			}
			var t = (new Date()).getTime();
			if (server_time) {
				return jas_timestamp_server + (t - jas_timestamp_user);
			} else {
				return t;
			}
		};

		/*
			Classes
		*/

		jas.classes.jas_object = function(element, jas_class) {
			Object.defineProperty(this, 'prop', {
				'value'		: function() {
					switch (arguments.length) {
						case 1:
							Object.defineProperties(this, arguments[0]);
							break;
						case 2:
							Object.defineProperty(this, arguments[0], arguments[1]);
							break;
					}
					return this;
				}
			});
			var params = {};
			var hooks = {};
			this.prop({
				'lock'	: {
					'value'		: function() {
						Object.preventExtensions(this);
						return this;
					}
				},
				'jas_class'			: {
					'value'		: jas_class
				},
				'element'			: {
					'value'		: element
				},
				'jas_id'			: {
					'value'		: jas.objects.push(this) - 1
				},
				'param'				: {
					'value'		: function(n, v) {
						switch (arguments.length) {
							case 1:
								if (jas.isdef(params[n])) {
									return params[n];
								} else {
									return '';
								}
								break;
							case 2:
								params[n] = v;
								return this;
								break;
						}
					},
				},
				'param_def'				: {
					'value'		: function(n, d) {
						if (jas.isdef(params[n])) {
							return params[n];
						} else {
							return d;
						}
					},
				},
				'hook_set'				: {
					'value'		: function(hook, f) {
						if (!jas.isdef(hooks[hook])) {
							hooks[hook] = [];
						}
						hooks[hook].push(f);
						return this;
					}
				},
				'hook'				: {
					'value'		:	function(hook, a) {
						if (jas.isdef(hooks[hook])) {
							for (var i = 0; i < hooks[hook].length; i++) {
								hooks[hook][i].apply(this, a);
							}
						}
						return this;
					}
				},
				'reload_params'		: {
					'value'		: function() {
						var as = this.element.attributes;
						var v;
						var r = {};
						var p;
						var k;
						for (var i = 0; i < as.length; i++) {
							if (as[i].name.substring(0, 9) == 'data-jas_') {
								v = as[i].name.substring(9);
								if (v == 'params') {
									eval('p = ' + as[i].value + ';');
									for (k in p) {
										if (p.hasOwnProperty(k)) {
											if (!jas.isdef(r[k])) {
												r[k] = p[k];
											}
										}
									}
								} else {
									r[v] = eval(as[i].value);
								}
							}
						}
						for (k in r) {
							if (r.hasOwnProperty(k)) {
								params[k] = r[k];
							}
						}
						return this;
					}
				},
				'init'			: {
					'value'			: function() {
						this.lock();
						return this;
					},
					'configurable'	: true,
					'writable'		: true
				}
			});
			Object.defineProperty(this.element, 'jas_object', {
				'value'		: this
			});
		};
		jas.classes.jas_object.parent_class = null;

		jas.extend(function(element, jas_class) {
			jas.inherit(this, 'jas_control', arguments);
		}, 'jas_control');

		jas.extend(function(element, jas_class) {
			jas.inherit(this, 'jas_input', arguments);
			this.prop({
				'name'		: {
					'value'			: '',
					'writable'		: true,
					'configurable'	: true
				},
				'value'		: {
					'value'			: '',
					'writable'		: true,
					'configurable'	: true
				},
				'required'	: {
					'value'			: false,
					'writable'		: true,
					'configurable'	: true
				},
				'required_msg'	: {
					'set'			: function(s) {
						this.hint.text = s;
					},
					'get'			: function() {
						return this.hint.text;
					},
					'configurable'	: true
				},
				'hint'			: {
					'value'			: jas(jas.new_element('div', {'class': 'jas_hint'}, this.element), 'jas_hint'),
					'writable'		: true,
					'configurable'	: true
				},
				'is_input'	: {
					'value'		: true
				},
				'init'		: {
					'value'			: function() {
						this.reload_params();
						this.name = this.param('name');
						this.value = this.param('value');
						this.required = this.param_def('required', false);
						var i = jas.new_element('input', {
							'name'		: this.name,
							'type'		: 'hidden',
							'value'		: this.value
						}, this.element);
						this.required_msg = this.param('required_msg');
						this.prop({
							'input'		: {
								value	: i
							},
							'name'		: {
								'set'			: function(v) {
									jas.set(this.input).attr_set('name', v);
								},
								'get'			: function() {
									return jas.set(this.input).attr_get('name');
								},
								'configurable'	: true
							},
							'value'		: {
								'set'			: function(v) {
									this.input.value = v;
								},
								'get'			: function() {
									return this.input.value;
								},
								'configurable'	: true
							}
						});
						this.lock();
						return this;
					},
					'configurable'	: true
				},
				'test'		: {
					'value'			: function(show_hint) {
						var r = true;
						if (this.required !== false) {
							if (this.required === true) {
								r = this.value != '';
							} else {
								rx = new RegExp(this.required);
								r = rx.test(this.value);
							}
						}
						if (!r) {
							jas.set(this.element).class_add('jas_error');
							if (show_hint) this.hint.show();
						}
						return r;
					},
					'configurable'	: true
				}
			});
		}, 'jas_input', 'jas_control');
		jas.autoload_class('jas_input');

		jas.extend(function(element, jas_class) {
			jas.inherit(this, 'jas_edit', arguments);
			var self = this;
			var required_ex = '';
			this.prop({
				'type'			: {
					'value'			: 'text',
					'writable'		: true,
					'configurable'	: true
				},
				'init'			: {
					'value'			: function() {
						this.reload_params();
						this.name = this.param('name');
						this.value = this.param('value');
						this.required = this.param('required');
						this.required_msg = this.param('required_msg');
						this.type = this.param('type');
						var at = ['text', 'password', 'email', 'textarea'];
						if (at.indexOf(this.type) == -1) this.type = 'text';
						this.prop('type', {
							'value'		: this.type
						});
						var i;
						switch (this.type) {
							case 'textarea':
								i = jas.new_element('textarea', {
									'name'			: this.name,
									'class'			: 'jas_edit_input'
								}, this.element);
								i.value = this.value;
								break;
							default:
								var t = this.type == 'password' ? 'password' : 'text';
								i = jas.new_element('input', {
									'name'			: this.name,
									'type'			: t,
									'value'			: this.value,
									'class'			: 'jas_edit_input'
								}, this.element);
								break;
						}
						switch (this.type) {
							case 'email':
								var ex = this.required;
								this.prop('required', {
									'set'			: function(v) {
										if (v === true) v = '^((?:(?:(?:[a-zA-Z0-9][\\.\\-\\+_]?)*)[a-zA-Z0-9])+)\\@((?:(?:(?:[a-zA-Z0-9][\\.\\-_]?){0,62})[a-zA-Z0-9])+)\\.([a-zA-Z0-9]{2,6})$';
										required_ex = v;
									},
									'get'			: function() {
										return required_ex;
									},
									'configurable'	: true
								});
								this.required = ex;
								break;
						}
						this.prop({
							'input'			: {
								'value'		: i
							},
							'placeholder'	: {
								'set'			: function(v) {
									jas.set(this.input).attr_set('placeholder', v);
								},
								'get'			: function() {
									return jas.set(this.input).attr_get('placeholder');
								},
								'configurable'	: true
							},
							'name'			: {
								'set'			: function(v) {
									jas.set(this.input).attr_set('name', v);
								},
								'get'			: function() {
									return jas.set(this.input).attr_get('name');
								},
								'configurable'	: true
							},
							'value'			: {
								'set'			: function(v) {
									this.input.value = v;
								},
								'get'			: function() {
									return this.input.value;
								},
								'configurable'	: true
							}
						});
						this.placeholder = this.param('placeholder');
						this.input.addEventListener('focus', function() {
							self.hook('focus');
							jas.set(self.element).class_remove('jas_error').class_add('jas_active');
						});
						this.input.addEventListener('blur', function() {
							self.hook('blur');
							jas.set(self.element).class_remove('jas_active');
						});
						this.lock();
						return this;
					},
					'configurable'	: true
				}
			});
		}, 'jas_edit', 'jas_input');
		jas.autoload_class('jas_edit');

		jas.extend(function(element, jas_class) {
			jas.inherit(this, 'jas_file', arguments);
			var self = this;
			var text;
			var text_div;
			var placeholder;
			var placeholder_div;
			this.prop({
				'init'			: {
					'value'			: function() {
						this.reload_params();
						this.required = this.param('required');
						this.required_msg = this.param('required_msg');
						this.name = this.param('name');
						var w = jas.new_element('div', {
							'class'		: 'jas_file_input_wrap'
						}, this.element);
						var i = jas.new_element('input', {
							'type'		: 'file',
							'class'		: 'jas_file_input',
							'name'		: this.name
						}, w);
						i.addEventListener('click', function() {
							jas.set(self.element).class_remove('jas_error');
						});
						i.addEventListener('change', function() {
							var t = '';
							for (var i = 0; i < this.files.length; i++) {
								t += this.files[i].name + '; ';
							}
							self.text = t;
						});
						var text_div = jas.new_element('div', {
							'class'		: 'jas_file_text',
							'style'		: 'display: none;'
						}, this.element);
						var placeholder_div = jas.new_element('div', {
							'class'		: 'jas_file_placeholder'
						}, this.element);
						this.prop({
							'input'			: {
								'value'		: i
							},
							'text'		: {
								'set'			: function(s) {
									text = s;
									text_div.innerHTML = s;
									if (s != '') {
										text_div.style.display = 'block';
										placeholder_div.style.display = 'none';
									} else {
										text_div.style.display = 'none';
										placeholder_div.style.display = 'block';
									}
								},
								'get'			: function() {
									return text;
								},
								'configurable'	: true
							},
							'placeholder'		: {
								'set'			: function(s) {
									placeholder = s;
									placeholder_div.innerHTML = s;
								},
								'get'			: function() {
									return placeholder;
								},
								'configurable'	: true
							},
							'test'		: {
								'value'			: function(show_hint) {
									var r = true;
									if (this.required !== false) {
										if (!this.input.files.length) {
											r = false;
										}
									}
									if (!r) {
										jas.set(this.element).class_add('jas_error');
										if (show_hint) this.hint.show();
									}
									return r;
								},
								'configurable'	: true
							}
						});
						this.placeholder = this.param('placeholder');
						this.text = this.param('text');
						this.lock();
						return this;
					}
				}
			});
		}, 'jas_file', 'jas_input');
		jas.autoload_class('jas_file');

		jas.extend(function(element, jas_class) {
			jas.inherit(this, 'jas_form', arguments);
			var disabled = false;
			var source_tag = null;
			var source = '';
			var self = this;
			this.prop({
				'init'		: {
					'value'			: function() {
						this.reload_params();
						jas.set(this.element).find('.jas_form_submit').each(function() {
							this.jas_owner = self;
							jas.new_element('input', {
								'type'		: 'submit',
								'class'		: 'jas_form_submit_input'
							}, this);
						});
						this.source = this.param('source');
						this.element.addEventListener('submit', function(e) {
							if (disabled) {
								e.preventDefault();
								return;
							}
							var j = jas(this);
							j.hook('process_prepare');
							var els = jas.set(this).find();
							var o;
							var er = false;
							for (var i = 0; i < els.length; i++) {
								o = els[i].jas_object;
								if (jas.isdef(o)) {
									if (jas.isdef(o.is_input) && o.is_input == true) {
										if (o.required !== false) {
											if (!o.test(!er)) er = true;
										}
									}
								}
							}
							if (!er) {
								j.hook('process_begin');
								var m = jas.set(this).attr_get('method').toUpperCase();
								switch (m) {
									case 'GET_AJAX':
									case 'POST_AJAX':
										e.preventDefault();
										var a = jas.set(this).attr_get('action');
										jas.ajax({
											'url'		: a,
											'method'	: (m == 'POST_AJAX' ? 'POST' : 'GET'),
											'form'		: this,
											'data'		: new FormData(this),
											'formdata'	: true,
											'result'	: function(t, s) {
												var j = this.form.jas_object;
												j.hook('process_end', [t, s]);
											}
										});
										break;
								}
							} else {
								j.hook('error');
								e.preventDefault();
							}
						});
						this.lock();
						return this;
					},
					'configurable'	: true
				},
				'source'			: {
					'get'			: function() {
						return source;
					},
					'set'			: function(s) {
						source = s;
						if (source_tag == null && source != '') {
							source_tag = jas.new_element('input', {
								'type'		: 'hidden',
								'name'		: 'jas_source',
								'value'		: source
							}, this.element);
						}
						if (source_tag != null) source_tag.value = s;
					},
					'configurable'	: true
				},
				'disable'	: {
					'value'		: function() {
						disabled = true;
						return this;
					},
					'configurable'	: true
				},
				'enable'	: {
					'value'		: function() {
						disabled = false;
						return this;
					},
					'configurable'	: true
				},
				'submit'	: {
					'value'			: function() {
						this.element.submit();
						return this;
					},
					'configurable'	: true
				}
			});
		}, 'jas_form');
		jas.autoload_class('jas_form');

		jas.extend(function(element, jas_class) {
			jas.inherit(this, 'jas_slider', arguments);
			var self = this;
			var bh = [];
			var tf = [];
			var tfn = '';
			var ts = 0;
			var cs = -1;
			var cp = 0;
			var rp = 0;
			var lp = 0;
			var ad = 0;
			var anim = false;
			var step = function() {
				var d = cp - lp;
				var x = 1 - (cs / ts);
				var bz = jas.cubic_bezier_math(tf, x);
				rp = lp + bz * d;
				self.set(rp);
				cs--;
				if (cs < 0) {
					var fl = self.frames.length;
					while (cp > fl) cp -= fl;
					while (cp < 1) cp += fl;
					rp = lp = cp;
					anim = false;
					return false;
				} else {
					return true;
				}
			};
			function set_frame(f, b) {
				var x = jas.isdef(b.x) ? b.x : 0;
				var y = jas.isdef(b.y) ? b.y : 0;
				var s = jas.isdef(b.s) ? b.s : 1;
				var z = jas.isdef(b.z) ? b.z : 0;
				var o = jas.isdef(b.o) ? b.o : 1;
				f.element.style.left = x + 'px';
				f.element.style.top = y + 'px';
				f.element.style.webkitTransform = 'scale(' + s + ')';
				f.element.style.MozTransform = 'scale(' + s + ')';
				f.element.style.msTransform = 'scale(' + s + ')';
				f.element.style.OTransform = 'scale(' + s + ')';
				f.element.style.zIndex = Math.floor(z);
				f.element.style.opacity = o;
			}
			function hybrid_state(l, d) {
				var m = (l >= bh.length) ? bh.length - 1 : l;
				var n = l - 1;
				if ((n < 0) || (n >= bh.length)) n = bh.length - 1;
				var b1 = bh[n];
				var b2 = bh[m];
				if ((d == 0) || (m == n)) {
					return b2;
				} else {
					if (!jas.isdef(b1.x)) b1.x = 0;
					if (!jas.isdef(b1.y)) b1.y = 0;
					if (!jas.isdef(b1.s)) b1.s = 1;
					if (!jas.isdef(b1.z)) b1.z = 0;
					if (!jas.isdef(b1.o)) b1.o = 1;
					if (!jas.isdef(b2.x)) b2.x = 0;
					if (!jas.isdef(b2.y)) b2.y = 0;
					if (!jas.isdef(b2.s)) b2.s = 1;
					if (!jas.isdef(b2.z)) b2.z = 0;
					if (!jas.isdef(b2.o)) b2.o = 1;
					return {
						'x'		: b1.x + (b2.x - b1.x) * (1 - d),
						'y'		: b1.y + (b2.y - b1.y) * (1 - d),
						's'		: b1.s + (b2.s - b1.s) * (1 - d),
						'z'		: b1.z + (b2.z - b1.z) * (1 - d),
						'o'		: b1.o + (b2.o - b1.o) * (1 - d)
					};
				}
			}
			this.prop({
				'init'				: {
					'value'			: function() {
						this.reload_params();
						this.speed = this.param_def('speed', 500);
						this.timing_function = this.param_def('timing_function', 'ease');
						bh = this.param('behavior');
						var i;
						var j;
						var k;
						var s = jas.set(this.element);
						var fs = s.find('.jas_slider_frame').each(function() {
							self.add_frame(this);
						});
						var i = fs.length;
						if (i) {
							while (i < bh.length) {
								i += fs.length;
								for (j = 0; j < fs.length; j++) {
									k = fs[j].cloneNode(true);
									jas.set(fs[j]).insert_after(k);
									this.add_frame(k);
								}
							}
						}
						this.set(0);
						cp = lp = rp = pp = 0;
						s.find('.jas_slider_bullet').each(function() {
							var s = jas.set(this);
							var j = s.attr_get('data-jas_set', 'default');
							var k = false;
							if (!jas.isdef(self.bulletsets[j])) {
								self.bulletsets[j] = [];
								k = true;
							}
							self.bulletsets[j].push({
								'element'	: this,
								'active'	: k
							});
							if (k) s.class_add('jas_active');
						}).event_add('click', function() {
							var a = jas.set(this).attr_get('data-jas_set', 'default');
							var bl;
							var j;
							var k;
							for (var i = 0; i < self.bulletsets[a].length; i++) {
								bl = self.bulletsets[a][i];
								if (bl.active) j = i;
								if (bl.element == this) k = i;
							}
							self.index += k - j;
						});
						s.find('.jas_slider_button_left').event_add('click', function() {
							self.index--;
						});
						s.find('.jas_slider_button_right').event_add('click', function() {
							self.index++;
						});
						this.lock();
						return this;
					},
				'configurable'		: true
				},
				'set'				: {
					'value'			: function(k) {
						rp = k;
						var l = Math.floor(k);
						var d = k - l;
						var fl = this.frames.length;
						if (!fl) return;
						while (l < 1) l += fl;
						while (l > fl) l -= fl;
						var k;
						var m;
						for (var j = 0; j < fl; j++) {
							k = j + l;
							if (k > fl) k -= fl;
							m = j;
							set_frame(this.frames[k - 1], hybrid_state(m, d));
						}
					},
					'configurable'		: true
				},
				'bulletsets'		: {
					'value'			: {},
					'configurable'	: true
				},
				'speed'				: {
					'set'			: function(s) {
						speed = s;
						ts = Math.floor(s / jas.animation_step) + 1;
					},
					'get'			: function() {
						return speed;
					},
					'configurable'	: true
				},
				'timing_function'	: {
					'get'			: function() {
						return tfn;
					},
					'set'			: function(s) {
						tfn = s;
						tf = jas.cubic_bezier_parse(s);
					},
					'configurable'	: true
				},
				'frames'			: {
					'value'			: [],
					'configurable'	: true
				},
				'add_frame'			: {
					'value'			: function(s) {
						this.frames.push({
							'element'	: s,
						});
						return this;
					},
					'configurable'	: true
				},
				'index'				: {
					'set'			: function(s) {
						pp = cp;
						var k;
						var l;
						for (var a in this.bulletsets) {
							if (this.bulletsets.hasOwnProperty(a)) {
								l = this.bulletsets[a].length;
								for (var i = 0; i < l; i++) {
									bl = this.bulletsets[a][i];
									if (bl.active) {
										jas.set(bl.element).class_remove('jas_active');
										bl.active = false;
										break;
									}
								}
								k = i + Math.floor(s - pp);
								while (k < 0) k += l;
								while (k >= l) k -= l;
								jas.set(this.bulletsets[a][k].element).class_add('jas_active');
								this.bulletsets[a][k].active = true;
							}
						}
						lp = rp;
						cp = s;
						cs = ts - 1;
						if (!anim) {
							anim = true;
							jas.hook_set('animation', step);
						}
						this.hook('change');
					},
					'get'			: function() {
						return cp;
					},
				'configurable'	: true
				}
			});
		}, 'jas_slider', 'jas_control');
		jas.autoload_class('jas_slider');

		jas.extend(function(element, jas_class) {
			jas.inherit(this, 'jas_popup', arguments);
			var ovr;
			var wrap;
			var self = this;
			var visible = false;
			var refr = function() {
				if (visible) {
					ovr.style.width = document.documentElement.offsetWidth + 'px';
					ovr.style.height = document.documentElement.offsetHeight + 'px';
					if (document.documentElement) document.documentElement.scrollTop = dst;
					if (document.body.parentNode) document.body.parentNode.scrollTop = dst;
					if (document.body) document.body.scrollTop = dst;
					wrap.style.height = ((window.innerWidth / document.documentElement.clientWidth) * document.documentElement.clientHeight) + 'px';
				}
				return true;
			}
			this.prop({
				'init'		: {
					'value'			: function() {
						this.reload_params();
						ovr = jas.new_element('div', {
							'class'		: 'jas_popup_overlay'
						}, jas.find('body')[0]);
						wrap = jas.new_element('div', {
							'class'		: 'jas_popup_wrap'
						}, ovr);
						var table = jas.new_element('div', {
							'class'		: 'jas_popup_table'
						}, wrap);
						var cell = jas.new_element('div', {
							'class'		: 'jas_popup_cell'
						}, table);
						cell.appendChild(this.element);
						this.element.style.display = 'inline-block';
						jas.set(this.element).find('.jas_popup_close').event_add('click', function() {
							self.hide();
						});
						cell.addEventListener('click', function(e) {
							if (e.target == this) self.hide();
						});
						jas.hook_set('scroll', refr);
						jas.hook_set('resize', refr);
						jas.hook_set('touchmove', refr);
						this.lock();
						return this;
					},
					'configurable'	: true
				},
				'show'		: {
					'value'			: function() {
						ovr.style.display = 'block';
						visible = true;
						dst = (document.documentElement.scrollTop || document.body.parentNode.scrollTop || document.body.scrollTop);
						wrap.style.top = dst + 'px';
						refr();
						this.hook('show');
						return this;
					},
					'configurable'	: true
				},
				'hide'		: {
					'value'			: function() {
						ovr.style.display = 'none';
						visible = false;
						this.hook('hide');
						return this;
					},
					'configurable'	: true
				},
			});
		}, 'jas_popup');
		jas.autoload_class('jas_popup');

		jas.extend(function(element, jas_class) {
			jas.inherit(this, 'jas_hint', arguments);
			var self = this;
			var text;
			var text_div;
			this.prop({
				'init'		: {
					'value'			: function() {
						this.reload_params();
						text_div = jas.new_element('div', {
							'class'		: 'jas_hint_text'
						}, this.element);
						jas.new_element('div', {
							'class'		: 'jas_hint_tail'
						}, this.element);
						this.text = this.param_def('text', 'jas_hint');
						this.lock();
						return this;
					},
					'configurable'	: true
				},
				'text'		: {
					'set'			: function(s) {
						text = s;
						text_div.innerHTML = s;
					},
					'get'			: function() {
						return text;
					},
					'configurable'	: true
				},
				'show'		: {
					'value'			: function() {
						this.element.style.display = 'block';
						jas.hook_set('mousedown', function() {
							self.hide();
							return false;
						});
						this.hook('show');
						return this;
					},
					'configurable'	: true
				},
				'hide'		: {
					'value'			: function() {
						this.element.style.display = 'none';
						this.hook('hide');
						return this;
					},
					'configurable'	: true
				}
			});
		}, 'jas_hint');
		jas.autoload_class('jas_hint');

		jas.extend(function(element, jas_class) {
			jas.inherit(this, 'jas_dropdown', arguments);
			var self = this;
			var sopt = jas.set();
			var dropper;
			var content;
			var placeholder;
			var index = -1;
			this.prop({
				'init'				: {
					'value'			: function() {
						this.reload_params();
						this.name = this.param('name');
						this.input = jas.new_element('input', {
							type	: 'hidden',
							name	: this.name
						}, this.element);
						this.value = this.param('value');
						this.required = this.param('required');
						this.required_msg = this.param('required_msg');
						this.options = this.param('options');
						dropper = jas.new_element('div', {class: 'jas_dropdown_dropper'}, this.element);
						content = jas.new_element('div', {class: 'jas_dropdown_content'}, this.element);
						placeholder = jas.new_element('div', {class: 'jas_dropdown_placeholder'}, this.element);
						placeholder.innerHTML = this.param('placeholder');
						jas.new_element('div', {class: 'jas_dropdown_arrow'}, this.element);
						jas.set(this.element).event_add('click', function(e) {
							jas.set(self.element).class_remove('jas_error');
							if (!jas.set(e.target).class_exists('jas_dropdown_option')) {
								self.expand();
							}
						});
						this.recreate().lock();
						return this;
					},
					'writable'		: true,
					'configurable'	: true
				},
				'recreate'			: {
					'value'			: function() {
						sopt.remove();
						var e;
						var c = -1;
						for (var i = 0; i < this.options.length; i++) {
							e = jas.new_element('div', {class: 'jas_dropdown_option'}, dropper);
							e.innerHTML = this.options[i].content;
							if (this.options[i].selected) c = i;
							sopt.push(e);
						}
						this.index = c;
						sopt.event_add('click', function() {
							self.index = sopt.indexOf(this);
							self.shrink();
						});
						this.hook('recreate');
						return this;
					},
					'writable'		: true,
					'configurable'	: true
				},
				'index'			: {
					'set'			: function(v) {
						if ((v < 0) || (v >= this.options.length)) v = -1;
						if (v != -1) {
							this.content = this.options[v].content;
							this.value = this.options[v].value;
						} else {
							this.content = '';
							this.value = '';
						}
					},
					'get'			: function() {
						return index;
					},
					'configurable'	: true
				},
				'content'			: {
					'set'			: function(v) {
						content.innerHTML = v;
						if (v == '') {
							content.style.display = 'none';
							placeholder.style.display = 'block';
						} else {
							content.style.display = 'block';
							placeholder.style.display = 'none';
						}
					},
					'get'			: function() {
						return content.innerHTML;
					},
					'configurable'	: true
				},
				'placeholder'			: {
					'set'			: function(v) {
						placeholder.innerHTML = v;
					},
					'get'			: function() {
						return placeholder.innerHTML;
					},
					'configurable'	: true
				},
				'options'			: {
					'value'			: [],
					'writable'		: true,
					'configurable'	: true
				},
				'input'			: {
					'value'			: null,
					'writable'		: true,
					'configurable'	: true
				},
				'expand'			: {
					'value'			: function() {
						jas.set(this.element).class_add('jas_expanded');
						jas.hook_set('mousedown', function(e) {
							if (!jas.set(e.target).class_exists('jas_dropdown_option')) {
								self.shrink();
							}
							return false;
						});
						this.hook('expand');
					},
					'writable'		: true,
					'configurable'	: true
				},
				'shrink'			: {
					'value'			: function() {
						jas.set(this.element).class_remove('jas_expanded');
						this.hook('shrink');
					},
					'writable'		: true,
					'configurable'	: true
				},
				'value'				: {
					'set'			: function(v) {
						this.input.value = v;
						this.hook('change');
					},
					'get'			: function() {
						return this.input.value;
					},
					'configurable'	: true
				}
			});
		}, 'jas_dropdown', 'jas_input');
		jas.autoload_class('jas_dropdown');

		jas.extend(function(element, jas_class) {
			jas.inherit(this, 'jas_trackbar', arguments);
			var self = this;
			var line;
			var button;
			var value;
			var lx;
			var lv;
			var bw;
			var md = false;
			function mdmove(x) {
				hit((x - lx) + lv);
			}
			function set() {
				var m = self.element.offsetWidth - bw;
				var d = self.max - self.min;
				var x = m * ((value - self.min) / d) + bw / 2;
				line.style.width = x + 'px';
			}
			function hit(x) {
				var b = bw / 2;
				var m = self.element.offsetWidth - b;
				if (x < b) x = b;
				if (x > m) x = m;
				x -= b;
				m -= b;
				var d = self.max - self.min;
				var k = d * (x / m);
				k = Math.round(k / self.step) * self.step;
				var v = self.min + k;
				self.value = v;
				set();
			}
			this.prop({
				'init'				: {
					'value'			: function() {
						this.reload_params();
						this.name = this.param('name');
						this.input = jas.new_element('input', {
							type	: 'hidden',
							name	: this.name
						}, this.element);
						line = jas.new_element('div', {
							class	: 'jas_trackbar_line'
						}, this.element);
						button = jas.new_element('div', {
							class	: 'jas_trackbar_button'
						}, line);
						this.element.addEventListener('mousedown', function(e) {
							if ((e.target == self.element) || (e.target == line)) {
								hit(e.offsetX);
							}
							lx = e.pageX;
							lv = line.offsetWidth;
							md = true;
							jas.set(self.element).class_add('jas_active');
							jas.find('body').class_add('jas_trackbar_lock');
							jas.hook_set('mouseup', function(e) {
								md = false;
								jas.set(self.element).class_remove('jas_active');
								mdmove(e.pageX);
								jas.find('body').class_remove('jas_trackbar_lock');
								return false;
							});
							jas.hook_set('mousemove', function(e) {
								if (!md) return false;
								mdmove(e.pageX);
								return true;
							});
						});
						this.min = this.param_def('min', 0);
						this.max = this.param_def('max', 100);
						bw = this.param_def('button_width', 'default');
						if (bw == 'default') bw = button.offsetWidth;
						this.button_width = bw;
						this.step = this.param_def('step', 1);
						this.value = this.param('value');
						return this;
					},
					'writable'		: true,
					'configurable'	: true
				},
				'input'			: {
					'value'			: null,
					'writable'		: true,
					'configurable'	: true
				},
				'min'			: {
					'value'			: 0,
					'writable'		: true,
					'configurable'	: true
				},
				'max'			: {
					'value'			: 0,
					'writable'		: true,
					'configurable'	: true
				},
				'step'			: {
					'value'			: 0,
					'writable'		: true,
					'configurable'	: true
				},
				'button_width'			: {
					'set'			: function(v) {
						bw = v;
						set();
					},
					'get'			: function() {
						return bw;
					},
					'configurable'	: true
				},
				'value'				: {
					'set'			: function(v) {
						if (v < this.min) v = this.min;
						if (v > this.max) v = this.max;
						value = v;
						set();
						this.input.value = v;
						this.hook('change', [v]);
					},
					'get'			: function() {
						return value;
					},
					'configurable'	: true
				}
			});
		}, 'jas_trackbar', 'jas_input');
		jas.autoload_class('jas_trackbar');

		/*
			Local Functions
		*/

		function jas_calc_path() {
			var ss = doc.getElementsByTagName('script');
			var sj = ss[ss.length - 1].src;
			var f = sj.substr(0, sj.lastIndexOf('/') + 1);
			jas_path = f;
		}

		function jas_new_object(el, jas_class) {
			if (jas.isdef(el.jas_object)) return false;
			var o = new jas.classes[jas_class](el, jas_class);
			o.init();
			return o;
		}

		function jas_autoload() {
			var j;
			var els;
			var es;
			for (var i = 0; i < jas_autoload_classes.length; i++) {
				jas.find('.' + jas_autoload_classes[i]).each(function() {
					jas_new_object(this, jas_autoload_classes[i]);
				});
			}
		};

		var animation_timer_count = 0
		var animation_timer;
		function animation_timer_run() {
			if (animation_timer_count == 0) {
				animation_timer = setInterval(function() {
					jas.hook('animation');
				}, jas.animation_step);
			}
			animation_timer_count++;
		}
		function animation_timer_stop() {
			animation_timer_count--;
			if (animation_timer_count == 0) clearInterval(animation_timer);
		}

		/*
			Listeners
		*/

		doc.addEventListener('mousedown', function(e) {
			jas.hook('mousedown', [e]);
		});

		doc.addEventListener('mouseup', function(e) {
			jas.hook('mouseup', [e]);
		});

		doc.addEventListener('mousemove', function(e) {
			jas.hook('mousemove', [e]);
		});

		base.addEventListener('resize', function(e) {
			jas.hook('resize', [e]);
		});

		base.addEventListener('scroll', function(e) {
			jas.hook('scroll', [e]);
		});

		doc.addEventListener('touchstart', function(e) {
			jas.hook('touchstart', [e]);
		});

		doc.addEventListener('touchmove', function(e) {
			jas.hook('touchmove', [e]);
		});

		doc.addEventListener('touchend', function(e) {
			jas.hook('touchend', [e]);
		});

		doc.addEventListener('DOMContentLoaded', function(e) {
			doc.removeEventListener('DOMContentLoaded', arguments.callee, false);
			jas.hook('prepare');
			jas_autoload();
			jas.hook('ready');
		});

	})(window, document);

}
