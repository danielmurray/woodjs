/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	__webpack_require__(1);
	__webpack_require__(21);

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _form = __webpack_require__(2);
	
	var _input = __webpack_require__(4);
	
	var _inputdropdown = __webpack_require__(5);
	
	var _list = __webpack_require__(3);
	
	var _text = __webpack_require__(7);
	
	window.Wood = {};
	
	// include base common widgets
	__webpack_require__(8);
	__webpack_require__(9);
	__webpack_require__(10);
	__webpack_require__(11);
	__webpack_require__(12);
	__webpack_require__(13);
	__webpack_require__(4);
	__webpack_require__(14);
	__webpack_require__(15);
	__webpack_require__(16);
	__webpack_require__(17);
	__webpack_require__(18);
	__webpack_require__(19);
	__webpack_require__(20);
	
	// ES2015 Components
	
	
	Wood.Assistant = _list.Assistant;
	Wood.Divider = _list.Divider;
	Wood.Form = _form.Form;
	Wood.Input = _input.Input;
	Wood.InputDropdown = _inputdropdown.InputDropdown;
	Wood.InputList = _form.InputList;
	Wood.List = _list.List;
	Wood.Subheader = _list.Subheader;
	Wood.Header = _text.Header;
	
	exports.default = Wood;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.Form = exports.InputList = undefined;
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _list = __webpack_require__(3);
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var InputList = function (_List) {
	  _inherits(InputList, _List);
	
	  function InputList() {
	    _classCallCheck(this, InputList);
	
	    return _possibleConstructorReturn(this, Object.getPrototypeOf(InputList).apply(this, arguments));
	  }
	
	  _createClass(InputList, [{
	    key: 'childViewOptions',
	    value: function childViewOptions(model, index) {
	      return model.attributes;
	    }
	  }, {
	    key: 'getChildView',
	    value: function getChildView(model, index) {
	      return Wood.Input;
	    }
	  }, {
	    key: 'onInputChange',
	    value: function onInputChange(inputView) {
	      this.triggerMethod('inputs:change', !this.error);
	    }
	  }, {
	    key: 'validate',
	    value: function validate() {
	      var valid = true;
	      for (var i in this.children._views) {
	        var childView = this.children._views[i];
	        var childValid = childView.validate();
	        valid = valid && childValid;
	      }
	      return valid;
	    }
	  }, {
	    key: 'childEvents',
	    get: function get() {
	      return {
	        'input:change': 'onInputChange'
	      };
	    }
	  }, {
	    key: 'error',
	    get: function get() {
	      var error = false;
	      for (var i in this.children._views) {
	        var childView = this.children._views[i];
	        error = error || childView.error;
	      }
	      return error;
	    }
	  }, {
	    key: 'values',
	    get: function get() {
	      var values = {};
	      for (var i in this.children._views) {
	        var childView = this.children._views[i];
	        values[childView.id] = childView.value;
	      }
	      return values;
	    }
	  }]);
	
	  return InputList;
	}(_list.List);
	
	var Form = function (_Marionette$LayoutVie) {
	  _inherits(Form, _Marionette$LayoutVie);
	
	  function Form() {
	    _classCallCheck(this, Form);
	
	    return _possibleConstructorReturn(this, Object.getPrototypeOf(Form).apply(this, arguments));
	  }
	
	  _createClass(Form, [{
	    key: 'events',
	    value: function events() {
	      return {
	        submit: 'onFormSubmit'
	      };
	    }
	  }, {
	    key: 'initialize',
	    value: function initialize(options) {
	      this._inputs = options.inputs || [];
	      this._submitButtonViewOptions = options.submitButton || { label: 'Submit' };
	    }
	  }, {
	    key: 'onError',
	    value: function onError() {
	      var submitButton = this.submitBtnContainer.currentView;
	      submitButton.onError();
	    }
	  }, {
	    key: 'onFormSubmit',
	    value: function onFormSubmit(event) {
	      event.preventDefault();
	      this.submitForm();
	    }
	  }, {
	    key: 'onInputsChange',
	    value: function onInputsChange(inputListView, valid) {
	      var submitButton = this.submitBtnContainer.currentView;
	      submitButton.disable(!valid);
	    }
	  }, {
	    key: 'onPost',
	    value: function onPost() {
	      var submitButton = this.submitBtnContainer.currentView;
	      submitButton.onPost();
	    }
	  }, {
	    key: 'onRender',
	    value: function onRender() {
	      var inputList = new InputList({
	        model: this.model,
	        collection: this.inputs
	      });
	      this.inputListContainer.show(inputList);
	
	      var submitButtonView = new this.submitButtonView(_.extend({}, this.submitButtonViewOptions, {
	        disabled: !!this.error
	      }));
	      this.submitBtnContainer.show(submitButtonView);
	    }
	  }, {
	    key: 'onSuccess',
	    value: function onSuccess() {
	      var submitButton = this.submitBtnContainer.currentView;
	      submitButton.onSuccess();
	    }
	  }, {
	    key: 'regions',
	    value: function regions() {
	      return {
	        inputListContainer: '#input-list-container',
	        submitBtnContainer: '#submit-btn'
	      };
	    }
	  }, {
	    key: 'submitForm',
	    value: function submitForm() {
	      if (this.validate()) {
	        var data = this.getData();
	        this.triggerMethod('action:submit:form', data);
	      }
	    }
	  }, {
	    key: 'validate',
	    value: function validate() {
	      return this.inputListContainer.currentView.validate();
	    }
	  }, {
	    key: 'attributes',
	    get: function get() {
	      return {
	        class: 'wood form'
	      };
	    }
	  }, {
	    key: 'childEvents',
	    get: function get() {
	      return {
	        'click:button': 'onFormSubmit',
	        'inputs:change': 'onInputsChange'
	      };
	    }
	  }, {
	    key: 'error',
	    get: function get() {
	      return this.inputListContainer.currentView.error;
	    }
	  }, {
	    key: 'inputs',
	    get: function get() {
	      return new Backbone.Collection(this._inputs);
	    }
	  }, {
	    key: 'submitButtonView',
	    get: function get() {
	      return Wood.RaisedButton;
	    }
	  }, {
	    key: 'submitButtonViewOptions',
	    get: function get() {
	      return this._submitButtonViewOptions;
	    }
	  }, {
	    key: 'tagName',
	    get: function get() {
	      return 'form';
	    }
	  }, {
	    key: 'template',
	    get: function get() {
	      return _.template('\n      <div id="input-list-container" class="input-list"></div>\n      <div class="btns">\n        <div id="submit-btn" class="submit-btn"></div>\n      </div>\n    ');
	    }
	  }, {
	    key: 'values',
	    get: function get() {
	      return this.inputListContainer.currentView.values;
	    }
	  }]);
	
	  return Form;
	}(Marionette.LayoutView);
	
	exports.InputList = InputList;
	exports.Form = Form;

/***/ },
/* 3 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var Subheader = function (_Marionette$ItemView) {
	  _inherits(Subheader, _Marionette$ItemView);
	
	  function Subheader(options) {
	    _classCallCheck(this, Subheader);
	
	    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Subheader).call(this, options));
	
	    _this.text = options.text || '';
	    return _this;
	  }
	
	  _createClass(Subheader, [{
	    key: 'templateHelpers',
	    value: function templateHelpers() {
	      return {
	        text: this.options.text
	      };
	    }
	  }, {
	    key: 'tagName',
	    get: function get() {
	      return 'wood-subheader';
	    }
	  }, {
	    key: 'template',
	    get: function get() {
	      return _.template('<%-text%>');
	    }
	  }]);
	
	  return Subheader;
	}(Marionette.ItemView);
	
	var Divider = function (_Marionette$ItemView2) {
	  _inherits(Divider, _Marionette$ItemView2);
	
	  function Divider() {
	    _classCallCheck(this, Divider);
	
	    return _possibleConstructorReturn(this, Object.getPrototypeOf(Divider).apply(this, arguments));
	  }
	
	  _createClass(Divider, [{
	    key: 'tagName',
	    get: function get() {
	      return 'wood-divider';
	    }
	  }, {
	    key: 'template',
	    get: function get() {
	      return _.template('');
	    }
	  }]);
	
	  return Divider;
	}(Marionette.ItemView);
	
	var List = function (_Marionette$Collectio) {
	  _inherits(List, _Marionette$Collectio);
	
	  function List() {
	    _classCallCheck(this, List);
	
	    return _possibleConstructorReturn(this, Object.getPrototypeOf(List).apply(this, arguments));
	  }
	
	  _createClass(List, [{
	    key: 'getChild',
	    value: function getChild(index) {
	      return this.children.find(function (view) {
	        return view._index === index;
	      });
	    }
	  }, {
	    key: 'getChildView',
	    value: function getChildView(model, index) {
	      console.log(model);
	      return Wood.Item;
	    }
	  }, {
	    key: 'tagName',
	    get: function get() {
	      return 'wood-list';
	    }
	  }]);
	
	  return List;
	}(Marionette.CollectionView);
	
	var Assistant = function (_List) {
	  _inherits(Assistant, _List);
	
	  function Assistant() {
	    _classCallCheck(this, Assistant);
	
	    return _possibleConstructorReturn(this, Object.getPrototypeOf(Assistant).apply(this, arguments));
	  }
	
	  _createClass(Assistant, [{
	    key: 'getChildView',
	    value: function getChildView(model, index) {
	      return model.get('itemView') || this.getOption('childView') || Wood.Item;
	    }
	  }, {
	    key: 'childViewOptions',
	    value: function childViewOptions(model, index) {
	      return model.get('itemOptions');
	    }
	  }, {
	    key: 'initialize',
	    value: function initialize(options) {
	      this.options = _.extend({}, this.defaults, options);
	      this.collection = new Backbone.Collection(this.options.items);
	    }
	  }]);
	
	  return Assistant;
	}(List);
	
	exports.Assistant = Assistant;
	exports.Divider = Divider;
	exports.List = List;
	exports.Subheader = Subheader;

/***/ },
/* 4 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var Input = function (_Marionette$LayoutVie) {
	  _inherits(Input, _Marionette$LayoutVie);
	
	  function Input() {
	    _classCallCheck(this, Input);
	
	    return _possibleConstructorReturn(this, Object.getPrototypeOf(Input).apply(this, arguments));
	  }
	
	  _createClass(Input, [{
	    key: 'errorMessage',
	    value: function errorMessage() {
	      return false;
	    }
	  }, {
	    key: 'events',
	    value: function events() {
	      return {
	        'change input': 'keyPress',
	        'keyup input': 'keyPress',
	        'keydown input': 'keyPress',
	        'focusin  input': 'onFocusIn',
	        'focusout input': 'onFocusOut'
	      };
	    }
	  }, {
	    key: 'initialize',
	    value: function initialize(options) {
	      this.id = options.id || null;
	      this.disabled = options.disabled || false;
	      this.floatingLabelText = options.floatingLabelText || '';
	      this.hintText = options.hintText || '';
	      this.required = options.required || false;
	      this.type = options.type || 'text';
	      this.value = options.value || options.defaultValue || '';
	    }
	  }, {
	    key: 'keyPress',
	    value: function keyPress(e) {
	      if (e.keyCode === 13 || e.keyCode === 38 || e.keyCode === 40) {
	        e.preventDefault();
	        // TODO figure out to have
	        // ignore enter keypress
	        return;
	      }
	      this.value = e.target.value;
	    }
	  }, {
	    key: 'onChange',
	    value: function onChange(value) {}
	  }, {
	    key: 'onFocusIn',
	    value: function onFocusIn() {
	      this.$el.addClass('focused');
	    }
	  }, {
	    key: 'onFocusOut',
	    value: function onFocusOut() {
	      this.$el.removeClass('focused');
	      this.validate();
	      this.triggerMethod('input:change', this.value);
	    }
	  }, {
	    key: 'templateHelpers',
	    value: function templateHelpers() {
	      return {
	        disabled: this.disabled ? 'disabled=true' : '',
	        floatingLabelText: this.floatingLabelText,
	        hintText: this.hintText,
	        value: this.value,
	        type: this.type
	      };
	    }
	  }, {
	    key: 'validate',
	    value: function validate() {
	      var error = false;
	      if (this.required && this.value === '') {
	        error = 'This field is required';
	      }
	      this.error = error || this.errorMessage(this.value);
	    }
	  }, {
	    key: 'attributes',
	    get: function get() {
	      return {
	        class: 'wood input'
	      };
	    }
	  }, {
	    key: 'childEvents',
	    get: function get() {
	      return {
	        'click:button': 'onFormSubmit',
	        'inputs:change': 'onInputsChange'
	      };
	    }
	  }, {
	    key: 'disabled',
	    get: function get() {
	      return this._disabled;
	    },
	    set: function set(disabled) {
	      if (disabled) {
	        this.$el.addClass('disabled');
	      } else {
	        this.$el.removeClass('disabled');
	      }
	      this._disabled = disabled;
	    }
	  }, {
	    key: 'error',
	    get: function get() {
	      return this._error;
	    },
	    set: function set(error) {
	      if (error) {
	        this.$el.addClass('erred');
	        this.$('#error-text').text(error);
	      } else {
	        this.$el.removeClass('erred');
	        this.$('#error-text').text('');
	      }
	      this._error = error;
	    }
	  }, {
	    key: 'filled',
	    get: function get() {
	      return this._filled;
	    },
	    set: function set(filled) {
	      if (filled) {
	        this.$el.addClass('filled');
	      } else {
	        this.$el.removeClass('filled');
	      }
	      this._filled = filled;
	    }
	  }, {
	    key: 'floatingLabelText',
	    get: function get() {
	      return this._floatingLabelText;
	    },
	    set: function set(floatingLabelText) {
	      if (floatingLabelText) {
	        this.$el.addClass('labeled');
	      }
	      this._floatingLabelText = floatingLabelText;
	    }
	  }, {
	    key: 'template',
	    get: function get() {
	      return _.template('\n      <div class="label-placeholder"></div>\n      <div class="label-text"><%-floatingLabelText%></div>\n      <div class="hint-text"><%-hintText%></div>\n      <input type="<%-type%>" value="<%-value%>" <%-disabled%>"></input>\n      <div class="border-bottom">\n        <div class="border-bottom-inactive"></div>\n        <div class="border-bottom-active"></div>\n      </div>\n      <div id="error-text" class="error-text"></div>\n    ');
	    }
	  }, {
	    key: 'value',
	    get: function get() {
	      return this._value;
	    },
	    set: function set(value) {
	      if (this._value !== value) {
	        if (value === '') {
	          this.filled = false;
	        } else {
	          this.filled = true;
	        }
	        this.$('input').val(value);
	        this._value = value;
	        this.onChange(this._value);
	        this.triggerMethod('input:change', this._value);
	      }
	    }
	  }]);
	
	  return Input;
	}(Marionette.LayoutView);
	
	exports.Input = Input;

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.InputDropdown = undefined;
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _input = __webpack_require__(4);
	
	var _list = __webpack_require__(3);
	
	var _popover = __webpack_require__(6);
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } // TODO change component name
	
	
	var DropdownList = function (_List) {
	  _inherits(DropdownList, _List);
	
	  function DropdownList() {
	    _classCallCheck(this, DropdownList);
	
	    return _possibleConstructorReturn(this, Object.getPrototypeOf(DropdownList).apply(this, arguments));
	  }
	
	  _createClass(DropdownList, [{
	    key: 'childViewOptions',
	    value: function childViewOptions(model, index) {
	      return {
	        primaryText: model.get('label')
	      };
	    }
	  }, {
	    key: 'decrementHoveredIndex',
	    value: function decrementHoveredIndex() {
	      if (this.hoveredIndex !== null) {
	        if (this.hoveredIndex > 0) {
	          this.hoveredIndex -= 1;
	        }
	      } else {
	        this.hoveredIndex = this.children.length;
	      }
	    }
	  }, {
	    key: 'filter',
	    value: function filter(child, index, collection) {
	      var childLabel = child.get('label').toLowerCase();
	      var searchTerms = this.searchTerm.split(' ').map(function (s) {
	        return s.toLowerCase();
	      });
	      return searchTerms.every(function (s) {
	        return childLabel.includes(s);
	      });
	    }
	  }, {
	    key: 'getValue',
	    value: function getValue() {
	      var childView = this.getChild(this.hoveredIndex);
	      return childView.model;
	    }
	  }, {
	    key: 'getChildView',
	    value: function getChildView(model, index) {
	      return Wood.ItemButton;
	    }
	  }, {
	    key: 'incrementHoveredIndex',
	    value: function incrementHoveredIndex() {
	      if (this.hoveredIndex !== null) {
	        if (this.hoveredIndex < this.children.length - 1) {
	          this.hoveredIndex += 1;
	        }
	      } else {
	        this.hoveredIndex = 0;
	      }
	    }
	  }, {
	    key: 'initialize',
	    value: function initialize(options) {
	      this.hoveredIndex = options.hoveredIndex || null;
	      this.searchTerm = options.searchTerm || '';
	    }
	  }, {
	    key: 'onItemClick',
	    value: function onItemClick(itemView) {
	      var itemModel = itemView.model;
	      this.triggerMethod('item:select', itemModel);
	    }
	  }, {
	    key: 'scrollToMe',
	    value: function scrollToMe(itemView) {
	      // TODO make this elegant
	      var someWeirdOffest = 266.5;
	      var popoverHeight = this.$el.height();
	      var popoverTopOffset = this.$el.scrollTop();
	      var popoverBottomOffset = popoverTopOffset + popoverHeight;
	      var itemHeight = itemView.$el.height();
	      var itemTopOffset = itemView.$el.offset().top - someWeirdOffest;
	      var itemBottmOffset = itemTopOffset + itemHeight;
	      if (itemBottmOffset > popoverBottomOffset) {
	        this.$el.scrollTop(itemBottmOffset + popoverTopOffset - popoverHeight);
	      } else if (itemTopOffset < 0) {
	        this.$el.scrollTop(itemTopOffset + popoverTopOffset);
	      }
	    }
	  }, {
	    key: 'childEvents',
	    get: function get() {
	      return {
	        'action:click:item': 'onItemClick'
	      };
	    }
	  }, {
	    key: 'hoveredIndex',
	    get: function get() {
	      return this._hoveredIndex;
	    },
	    set: function set(index) {
	      if (this.hoveredIndex != null) {
	        var oldChild = this.getChild(this._hoveredIndex);
	        oldChild.$el.removeClass('hover');
	      }
	
	      this._hoveredIndex = index;
	      if (index !== null) {
	        var newChild = this.getChild(index);
	        newChild.$el.addClass('hover');
	        this.scrollToMe(newChild);
	      }
	    }
	  }, {
	    key: 'searchTerm',
	    get: function get() {
	      return this._searchTerm;
	    },
	    set: function set(term) {
	      this.hoveredIndex = null;
	      this._searchTerm = term;
	      this.render();
	    }
	  }]);
	
	  return DropdownList;
	}(_list.List);
	
	var InputDropdown = function (_Marionette$LayoutVie) {
	  _inherits(InputDropdown, _Marionette$LayoutVie);
	
	  function InputDropdown() {
	    _classCallCheck(this, InputDropdown);
	
	    return _possibleConstructorReturn(this, Object.getPrototypeOf(InputDropdown).apply(this, arguments));
	  }
	
	  _createClass(InputDropdown, [{
	    key: 'events',
	    value: function events() {
	      return {
	        'keydown': 'keyPress',
	        'focusin': 'onFocusIn',
	        'focusout': 'onFocusOut'
	      };
	    }
	  }, {
	    key: 'keyPress',
	    value: function keyPress(e) {
	      var keynum = e.keyCode;
	      if (keynum === 38) {
	        // Move selection up
	        this.dropdownList.decrementHoveredIndex();
	      }
	
	      if (keynum === 40) {
	        // Move selection down
	        this.dropdownList.incrementHoveredIndex();
	      }
	
	      if (keynum === 13) {
	        // Act on current selection
	        e.stopImmediatePropagation();
	        this.value = this.dropdownList.getValue();
	      }
	    }
	  }, {
	    key: 'initialize',
	    value: function initialize(options) {
	      this.inputOptions = {
	        id: options.id,
	        disabled: options.disabled,
	        floatingLabelText: options.floatingLabelText,
	        hintText: options.hintText,
	        required: options.required,
	        type: options.type,
	        defaultValue: options.defaultValue
	      };
	      this._value = options.defaultValue;
	      this.dropdownOptions = new Backbone.Collection(options.options);
	    }
	  }, {
	    key: 'onFocusIn',
	    value: function onFocusIn() {
	      this.popover.show();
	    }
	  }, {
	    key: 'onFocusOut',
	    value: function onFocusOut() {
	      this.popover.hide();
	    }
	  }, {
	    key: 'onInputChange',
	    value: function onInputChange(inputView, inputValue) {
	      this.dropdownList.searchTerm = inputValue;
	    }
	  }, {
	    key: 'onItemHover',
	    value: function onItemHover(itemView) {}
	  }, {
	    key: 'onItemSelect',
	    value: function onItemSelect(itemModel) {
	      this.value = itemModel;
	    }
	  }, {
	    key: 'onRender',
	    value: function onRender() {
	      this.input = new _input.Input(_.extend({}, this.inputOptions, {
	        value: this.label
	      }));
	      this.inputContainer.show(this.input);
	
	      this.popover = new _popover.Popover({
	        contentView: DropdownList,
	        contentViewOptions: {
	          collection: this.dropdownOptions
	        }
	      });
	      this.popoverContainer.show(this.popover);
	
	      this.dropdownList = this.popover.getContent();
	      this.listenTo(this.dropdownList, 'item:select', this.onItemSelect);
	    }
	  }, {
	    key: 'regions',
	    value: function regions() {
	      return {
	        inputContainer: '#input-container',
	        popoverContainer: '#popover-container'
	      };
	    }
	  }, {
	    key: 'templateHelpers',
	    value: function templateHelpers() {
	      return {};
	    }
	  }, {
	    key: 'childEvents',
	    get: function get() {
	      return {
	        'input:change': 'onInputChange'
	      };
	    }
	  }, {
	    key: 'tagName',
	    get: function get() {
	      return 'wood-input-dropdown';
	    }
	  }, {
	    key: 'template',
	    get: function get() {
	      return _.template('\n      <div id="input-container" class="input-container"></div>\n      <div id="popover-container" class="popover-container"></div>\n    ');
	    }
	  }, {
	    key: 'label',
	    get: function get() {
	      if (this._value) {
	        return this._value.get('label');
	      }
	    }
	  }, {
	    key: 'value',
	    get: function get() {
	      if (this._value) {
	        return value.get('value');
	      }
	    },
	    set: function set(value) {
	      var valueModel = this.dropdownOptions.get(value);
	      if (valueModel) {
	        this._value = valueModel;
	        this.input.value = this.label;
	        return true;
	      } else {
	        return false;
	      }
	    }
	  }]);
	
	  return InputDropdown;
	}(Marionette.LayoutView);
	
	exports.InputDropdown = InputDropdown;

/***/ },
/* 6 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	// TODO change component name
	
	var Popover = function (_Marionette$LayoutVie) {
	  _inherits(Popover, _Marionette$LayoutVie);
	
	  function Popover() {
	    _classCallCheck(this, Popover);
	
	    return _possibleConstructorReturn(this, Object.getPrototypeOf(Popover).apply(this, arguments));
	  }
	
	  _createClass(Popover, [{
	    key: 'getContent',
	    value: function getContent() {
	      return this.content;
	    }
	  }, {
	    key: 'getContentView',
	    value: function getContentView() {
	      return this.contentView;
	    }
	  }, {
	    key: 'getContentViewOptions',
	    value: function getContentViewOptions() {
	      return this.contentViewOptions;
	    }
	  }, {
	    key: 'hide',
	    value: function hide() {
	      this.$el.removeClass('expanded');
	    }
	  }, {
	    key: 'initialize',
	    value: function initialize(options) {
	      this.contentView = options.contentView || null;
	      this.contentViewOptions = options.contentViewOptions || null;
	    }
	  }, {
	    key: 'onRender',
	    value: function onRender() {
	      var ContenViewClass = this.getContentView();
	      var contenViewOptions = this.getContentViewOptions();
	      this.content = new ContenViewClass(contenViewOptions);
	      this.contentContainer.show(this.content);
	    }
	  }, {
	    key: 'regions',
	    value: function regions() {
	      return {
	        contentContainer: '#content-container'
	      };
	    }
	  }, {
	    key: 'show',
	    value: function show() {
	      this.$el.addClass('expanded');
	    }
	  }, {
	    key: 'templateHelpers',
	    value: function templateHelpers() {
	      return {};
	    }
	  }, {
	    key: 'tagName',
	    get: function get() {
	      return 'wood-popover';
	    }
	  }, {
	    key: 'template',
	    get: function get() {
	      return _.template('\n      <div id="content-container" class="content-container"></div>\n    ');
	    }
	  }]);
	
	  return Popover;
	}(Marionette.LayoutView);
	
	exports.Popover = Popover;

/***/ },
/* 7 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var Header = exports.Header = function (_Marionette$ItemView) {
	  _inherits(Header, _Marionette$ItemView);
	
	  function Header(options) {
	    _classCallCheck(this, Header);
	
	    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Header).call(this, options));
	
	    _this.text = options || '';
	    return _this;
	  }
	
	  _createClass(Header, [{
	    key: 'templateHelpers',
	    value: function templateHelpers() {
	      return {
	        text: this.options.text
	      };
	    }
	  }, {
	    key: 'tagName',
	    get: function get() {
	      return 'wood-header';
	    }
	  }, {
	    key: 'template',
	    get: function get() {
	      return _.template('<%-text%>');
	    }
	  }]);
	
	  return Header;
	}(Marionette.ItemView);
	
	exports.Header = Header;

/***/ },
/* 8 */
/***/ function(module, exports) {

	'use strict';
	
	/**
	 * Created by danmurray on 2/17/16.
	 */
	(function (Wood) {
	  Wood.Avatar = Marionette.ItemView.extend({
	    tagName: "wood-avatar",
	    template: _.template('<div class="shape <%-shape%> color-<%-color%> backgroundColor-<%-backgroundColor%>">' + '<% if (image) { %>' + '<img class="img" src="<%-image%>"></img>' + '<%} else if(icon) {%>' + '<i class="icon fa fa-icon fa-<%-icon%>"></i>' + '<%} else if(letter) {%>' + '<span class="letter"><%-letter%></span>' + '<%}%>' + '</div>' + ''),
	    regions: {},
	    events: {},
	    defaults: {
	      image: null,
	      icon: null,
	      letter: null,
	      shape: null,
	      color: 'inherit',
	      backgroundColor: 'inherit'
	    },
	    initialize: function initialize(options) {
	      this.options = _.extend({}, this.defaults, this.options);
	    },
	    onRender: function onRender() {},
	    templateHelpers: function templateHelpers() {
	      return _.extend({}, this.options, {});
	    }
	  });
	})(window.Wood);

/***/ },
/* 9 */
/***/ function(module, exports) {

	'use strict';
	
	/**
	 * Created by danmurray on 2/17/16.
	 */
	(function (Wood) {
	  var Label = Marionette.LayoutView.extend({
	    tagName: 'wood-label',
	    attributes: {},
	    template: _.template('<div id="icon-container" class="icon-wrapper"></div>' + '<span class="text-wrapper"><%-text%></span>' + ''),
	    regions: {
	      iconContainer: '#icon-container'
	    },
	    defaults: {
	      iconClass: 'fa',
	      text: 'Button',
	      color: 'inherit'
	    },
	    initialize: function initialize(options) {
	      this.options = _.extend({}, this.defaults, options);
	    },
	    onRender: function onRender() {
	      if (this.options.icon) {
	        var iconView = new Wood.Icon({
	          icon: this.options.icon,
	          iconClass: this.options.iconClass,
	          color: this.options.color
	        });
	        this.iconContainer.show(iconView);
	      }
	    },
	    templateHelpers: function templateHelpers() {
	      return _.extend({}, this.options, {});
	    }
	  });
	
	  var Button = Marionette.LayoutView.extend({
	    tagName: 'button',
	    attributes: {
	      class: 'wood button'
	    },
	    template: _.template('<div id="ripple-container" class="ripple-container backgroundColor-<%-backgroundColor%>"></div>' + '<div id="label-container" class="label-wrapper color-<%-color%>"><%-label%></div>' + ''),
	    regions: {
	      rippleContainer: '#ripple-container',
	      labelContainer: '#label-container'
	    },
	    events: {
	      'focusin': 'focusIn',
	      'focusout': 'focusOut',
	      'mousedown': 'mouseDown',
	      'mouseout': 'mouseOut',
	      'click': 'click'
	    },
	    focusIn: function focusIn(e) {
	      var ripple = this.rippleContainer.currentView;
	      ripple.focusIn();
	    },
	    focusOut: function focusOut(e) {
	      var ripple = this.rippleContainer.currentView;
	      ripple.focusOut();
	    },
	    mouseDown: function mouseDown(e) {
	      var x = e.pageX - this.$el.offset().left;
	      var y = e.pageY - this.$el.offset().top;
	      var ripple = this.rippleContainer.currentView;
	      ripple.mouseDown(x, y);
	    },
	    mouseOut: function mouseOut(e) {
	      var target = $(e.toElement);
	      if (target.closest(this.$el).length == 0) {
	        var ripple = this.rippleContainer.currentView;
	        ripple.mouseOut();
	      }
	    },
	    click: function click(e) {
	      e.preventDefault();
	      var ripple = this.rippleContainer.currentView;
	      ripple.click();
	      this.triggerMethod("action:click:button");
	    },
	    defaults: {
	      iconClass: 'fa',
	      label: 'Button',
	      color: 'white',
	      backgroundColor: 'secondary',
	      disabled: false
	    },
	    disable: function disable(disabled) {
	      if (!this._saving) {
	        this.$el.attr('disabled', disabled);
	      }
	    },
	    initialize: function initialize(options) {
	      this.options = _.extend({}, this.defaults, options);
	      this.disable(this.options.disabled);
	    },
	    onRender: function onRender() {
	      var ripple = new Wood.Ripple();
	      this.rippleContainer.show(ripple);
	
	      var label = new Label({
	        icon: this.options.icon,
	        iconClass: this.options.iconClass,
	        color: this.options.color,
	        text: this.options.label
	      });
	      this.labelContainer.show(label);
	    },
	    onPost: function onPost() {
	      this.disable(true);
	      this._saving = true;
	      var label = new Label({
	        icon: {
	          view: Wood.Spinner,
	          options: {
	            radius: 12,
	            strokeWidth: 6
	          }
	        },
	        text: this.options.label
	      });
	      this.labelContainer.show(label);
	    },
	    onSuccess: function onSuccess() {
	      this._saving = false;
	      this.disable(false);
	      var label = new Label({
	        text: this.options.label
	      });
	      this.labelContainer.show(label);
	    },
	    onError: function onError() {
	      this._saving = false;
	      this.disable(false);
	      var label = new Label({
	        text: this.options.label
	      });
	      this.labelContainer.show(label);
	    },
	    templateHelpers: function templateHelpers() {
	      return _.extend({}, this.options, {});
	    },
	    saveClick: function saveClick() {
	      // this.stateChange('saving');
	      // this.triggerMethod('action:saveButtonClick');
	    },
	    stateChange: function stateChange(state) {
	      // if( this.state != state){
	      //   this.state = state;
	      //   this.render();
	      // }
	    }
	  });
	
	  Wood.FlatButton = Button.extend({
	    attributes: {
	      class: 'wood button flat'
	    }
	  });
	
	  Wood.RaisedButton = Button.extend({
	    attributes: {
	      class: 'wood button raised'
	    }
	  });
	
	  Wood.DropdownButton = Button.extend({
	    attributes: {
	      class: 'wood button dropdown'
	    },
	    template: _.template('<div id="ripple-container" class="ripple-container backgroundColor-<%-backgroundColor%>"></div>' + '<div id="label-container" class="label-wrapper color-<%-color%>"><%-label%></div>' + '<div id="caret-container" class="caret-wrapper color-<%-color%>"></div>' + ''),
	    toggle: function toggle() {
	      this.expanded = !this.expanded;
	      this.renderCaret(this.expanded);
	    },
	    focusIn: function focusIn(e) {},
	    focusOut: function focusOut(e) {},
	    mouseDown: function mouseDown(e) {
	      if (this.expanded) {
	        var ripple = this.rippleContainer.currentView;
	        ripple.mouseOut();
	        this.triggerMethod('action:dropdown:collapse');
	      } else {
	        Button.prototype.mouseDown.call(this, e);
	        this.triggerMethod('action:dropdown:expand');
	      }
	      this.toggle();
	    },
	    mouseOut: function mouseOut(e) {},
	    click: function click(e) {},
	    initialize: function initialize(options) {
	      Button.prototype.initialize.call(this, options);
	      this.expanded = false;
	    },
	    onRender: function onRender() {
	      Button.prototype.onRender.call(this);
	      this.addRegion("caretContainer", "#caret-container");
	      this.renderCaret(this.expanded);
	    },
	    renderCaret: function renderCaret(expanded) {
	      var icon = expanded ? 'angle-up' : 'angle-down';
	      var caret = new Wood.Icon({
	        icon: icon,
	        color: this.options.color
	      });
	      this.caretContainer.show(caret);
	    }
	  });
	})(window.Wood);

/***/ },
/* 10 */
/***/ function(module, exports) {

	'use strict';
	
	/**
	 * Created by danmurray on 2/17/16.
	 */
	(function (Wood) {
	  Wood.Card = Marionette.LayoutView.extend({
	    tagName: "wood-card",
	    template: _.template('<div class="card-header">' + '<div id="avatar-wrapper" class="avatar-wrapper"></div>' + '<div class="title"><%-primaryText%></div>' + '</div>' + '<div id="card-content" class="card-content"></div>' + '<div id="card-footer" class="card-footer"></div>' + ''),
	    regions: {
	      cardHeader: "#card-header",
	      avatar: "#avatar-wrapper",
	      cardContent: "#card-content",
	      cardFooter: "#card-footer"
	    },
	    events: {},
	    defaults: {
	      primaryText: 'Card',
	      headerView: null,
	      headerOptions: {
	        icon: 'question',
	        shape: 'circle'
	      },
	      contentView: null,
	      contentOptions: {},
	      footerView: null,
	      footerOptions: {}
	    },
	    initialize: function initialize(options) {
	      this.options = _.extend({}, this.defaults, this.options);
	    },
	    onRender: function onRender() {
	      var avatar = new Wood.Avatar(this.options.headerOptions);
	      this.avatar.show(avatar);
	
	      if (this.options.contentView) {
	        var content = new this.options.contentView(this.options.contentOptions);
	        this.cardContent.show(content);
	      }
	    },
	    templateHelpers: function templateHelpers() {
	      return _.extend({}, this.options, {});
	    }
	  });
	})(window.Wood);

/***/ },
/* 11 */
/***/ function(module, exports) {

	'use strict';
	
	/**
	 * Created by danmurray on 14/12/15.
	 * TODO remove bootstrap dependency
	 */
	(function (keys) {
	  Wood.Dialog = Marionette.LayoutView.extend({
	    tagName: 'wood-dialog',
	    template: _.template('' + '<div id="dialog-content-container"></div>' + ''),
	    regions: {
	      dialogContentContainer: '#dialog-content-container'
	    },
	    defaults: {
	      title: 'Dialog'
	    },
	    initialize: function initialize(options) {
	      this.options = _.extend({}, this.defaults, options);
	
	      this.dialog = new BootstrapDialog({
	        type: BootstrapDialog.TYPE_PRIMARY,
	        size: BootstrapDialog.SIZE_NORMAL,
	        html: true
	      });
	    },
	    onRender: function onRender() {
	      // var dialogContent = this.options.dialogContent;
	      // if( dialogContent ){}
	      //   this.dialogContentContainer.show(new dialogContent.view(dialogContent.options));
	    },
	    open: function open() {
	      this.dialog.setTitle(this.options.title);
	      this.dialog.setMessage(this.$el);
	      this.dialog.open();
	    },
	    close: function close() {
	      this.dialog.close();
	      if (this.onClose) this.onClose();
	    }
	  }, {
	    show: function show(options) {
	      var widget = new this(options);
	      widget.render();
	      widget.open();
	    }
	  });
	
	  Wood.FormDialog = Wood.Dialog.extend({
	    tagName: 'wood-form-dialog',
	    defaults: {
	      title: 'Dialog',
	      formOptions: {}
	    },
	    childEvents: {
	      "action:submit:form": "submit"
	    },
	    submit: function submit(formView, data) {
	      if (this.options.onSubmit) {
	        this.options.onSubmit(data);
	      } else {
	        this.triggerMethod('action:submit:form', data);
	      }
	      this.close();
	    },
	    onRender: function onRender() {
	      var form = new Wood.Form(this.options.formOptions);
	      this.dialogContentContainer.show(form);
	    }
	  });
	})(window.keys);

/***/ },
/* 12 */
/***/ function(module, exports) {

	'use strict';
	
	/**
	 * Created by danmurray on 4/6/16.
	 */
	(function (Wood) {
	  Wood.Dropdown = Marionette.LayoutView.extend({
	    tagName: 'wood-dropdown',
	    template: _.template('<div id="button-container" class="button-container"></div>' + '<div class="dropdown-anchor">' + '<div id="dropdown-container" class="dropdown-container <%-floatRightClass%>"></div>' + '</div>' + ''),
	    regions: {
	      buttonContainer: '#button-container',
	      dropdownContainer: '#dropdown-container'
	    },
	    childEvents: {
	      'action:dropdown:expand': 'onDropdownExpand',
	      'action:dropdown:collapse': 'onDropdownCollapse'
	    },
	    onDropdownCollapse: function onDropdownCollapse() {
	      this.$('.dropdown-container').removeClass('expanded');
	    },
	    onDropdownExpand: function onDropdownExpand() {
	      var self = this;
	      event.stopPropagation();
	      this.$('.dropdown-container').addClass('expanded');
	
	      $('body').bind('mousedown', function (e) {
	        var target = $(e.target);
	        var outDropdown = self.$('#dropdown-container').find(target).length == 0;
	        if (outDropdown) {
	          var outButton = self.$('#button-container').find(target).length == 0;
	          if (outButton) {
	            self.buttonContainer.currentView.mouseDown(e);
	          }
	          self.onDropdownCollapse();
	          $(this).unbind(e);
	        }
	      });
	    },
	    defaults: {
	      floatRight: false
	    },
	    initialize: function initialize(options) {
	      this.options = _.extend({}, this.defaults, this.options);
	    },
	    onBeforeDestroy: function onBeforeDestroy() {
	      $('body').unbind('click');
	    },
	    onRender: function onRender() {
	      var button = new Wood.DropdownButton(this.options.buttonOptions);
	      this.buttonContainer.show(button);
	
	      if (this.options.contentView) {
	        var contentView = new this.options.contentView(this.options.contentOptions);
	        this.dropdownContainer.show(contentView);
	      }
	    },
	    templateHelpers: function templateHelpers() {
	      return _.extend({}, this.options, {
	        floatRightClass: this.options.floatRight ? 'floatRight' : ''
	      });
	    }
	  });
	})(window.Wood);

/***/ },
/* 13 */
/***/ function(module, exports) {

	'use strict';
	
	/**
	 * Created by danmurray on 2/26/15.
	 */
	(function (Wood) {
	  Wood.Icon = Marionette.LayoutView.extend({
	    attributes: {
	      class: 'wood-icon'
	    },
	    iconTemplates: {
	      'fa': '<i class="fa fa-icon fa-<%-icon%> color-<%-color%>"></i>',
	      'material': '<i class="material-icons color-<%-color%>"><%-icon%></i>'
	    },
	    defaults: {
	      clickEvent: 'action:click:icon',
	      color: 'inherit',
	      disabled: false,
	      icon: 'circle-thin',
	      iconClass: 'fa',
	      tooltip: false
	    },
	    tagName: 'wood-icon',
	    template: _.template('<%= iconTemplate %>' + ''),
	    iconTemplate: function iconTemplate(options) {
	      return _.template(this.iconTemplates[this.options.iconClass])(options);
	    },
	    initialize: function initialize(options) {
	      this.options = _.extend({}, this.defaults, options);
	    },
	    setAttr: function setAttr(setObj) {
	      _.extend(this.options, setObj);
	    },
	    templateHelpers: function templateHelpers() {
	      return _.extend({}, this.options, {
	        iconTemplate: this.iconTemplate(this.options)
	      });
	    }
	  });
	
	  Wood.IconButton = Wood.Icon.extend({
	    attributes: {
	      class: 'wood-icon'
	    },
	    events: {
	      'focusin': 'focusIn',
	      'focusout': 'focusOut',
	      'mousedown': 'mouseDown',
	      'mouseleave': 'mouseOut',
	      'click': 'click'
	    },
	    regions: {
	      rippleContainer: '#ripple-container',
	      tooltipContainer: '#tooltip-container'
	    },
	    tagName: 'button',
	    template: _.template('<div id="ripple-container"></div>' + '<%= iconTemplate %>' + '<div id="tooltip-container"></div>' + ''),
	    click: function click(e) {
	      var ripple = this.rippleContainer.currentView;
	      ripple.click();
	      this.triggerMethod(this.options.clickEvent, e);
	    },
	    disable: function disable(disabled) {
	      this.$el.attr('disabled', disabled);
	    },
	    focusIn: function focusIn(e) {
	      var ripple = this.rippleContainer.currentView;
	      ripple.focusIn();
	      if (this.tooltip) {
	        this.tooltip.focusIn();
	      }
	    },
	    focusOut: function focusOut(e) {
	      var ripple = this.rippleContainer.currentView;
	      ripple.focusOut();
	      if (this.tooltip) {
	        this.tooltip.focusOut();
	      }
	    },
	    initialize: function initialize(options) {
	      this.options = _.extend({}, this.defaults, options);
	      this.disable(this.options.disabled);
	    },
	    mouseDown: function mouseDown(e) {
	      var ripple = this.rippleContainer.currentView;
	      ripple.mouseDown();
	    },
	    mouseOut: function mouseOut(e) {
	      var ripple = this.rippleContainer.currentView;
	      ripple.mouseOut();
	    },
	    onRender: function onRender() {
	      var ripple = new Wood.Ripple();
	      this.rippleContainer.show(ripple);
	
	      if (this.options.tooltip || this.options.disabled) {
	        var text = this.options.tooltip || 'Disabled';
	        this.tooltip = new Wood.Tooltip({
	          text: text
	        });
	        this.tooltipContainer.show(this.tooltip);
	      }
	    }
	  });
	
	  Wood.Checkbox = Marionette.LayoutView.extend({
	    attributes: {
	      class: 'wood-checkbox'
	    },
	    childEvents: {
	      "action:click:checkbox": "clickCheckbox"
	    },
	    defaults: {
	      boxIconView: Wood.IconButton,
	      boxIconOptions: {
	        icon: 'square-o',
	        color: 'inherit',
	        clickEvent: 'action:click:checkbox'
	      },
	      checked: false,
	      checkIconView: Wood.Icon,
	      checkIconOptions: {
	        icon: 'check-square',
	        color: 'blue'
	      },
	      disabled: false,
	      tooltip: false
	    },
	    events: {},
	    regions: {
	      checkContainer: '#check-container',
	      boxContainer: '#box-container'
	    },
	    tagName: 'wood-checkbox',
	    template: _.template('<div class="check-wrapper">' + '<div id="check-container"></div>' + '</div>' + '<div class="box-wrapper">' + '<div id="box-container"></div>' + '</div>' + ''),
	    clickCheckbox: function clickCheckbox(child, event) {
	      event.stopPropagation();
	      if (this.$el.attr('checked')) {
	        this.options.checked = false;
	      } else {
	        this.options.checked = true;
	      }
	
	      this.$el.attr('checked', this.options.checked);
	      this.triggerMethod("action:click:checkbox", this.options.checked);
	    },
	    disable: function disable(disabled) {
	      this.boxContainer.currentView.disable(disabled);
	    },
	    focusIn: function focusIn(e) {
	      if (this.tooltip) {
	        this.tooltip.focusIn();
	      }
	    },
	    focusOut: function focusOut(e) {
	      if (this.tooltip) {
	        this.tooltip.focusOut();
	      }
	    },
	    initialize: function initialize(options) {
	      //jquery recursive copy
	      this.options = $.extend(true, {}, this.defaults, options, {});
	    },
	    onRender: function onRender() {
	      var check = new this.options.checkIconView(this.options.checkIconOptions);
	      this.checkContainer.show(check);
	
	      var box = new this.options.boxIconView(_.extend({}, this.options.boxIconOptions, {
	        disabled: this.options.disabled,
	        tooltip: this.options.tooltip
	      }));
	      this.boxContainer.show(box);
	
	      this.$el.attr('checked', this.options.checked);
	    }
	  });
	
	  Wood.Separator = Marionette.ItemView.extend({
	    tagName: 'wood-separator',
	    template: _.template('')
	  });
	
	  Wood.IconList = Marionette.CollectionView.extend({
	    childView: Wood.Icon,
	    tagName: 'wood-icon-list',
	    buildChildView: function buildChildView(child, ChildViewClass, childViewOptions) {
	      var id = child.get('id');
	      var view = child.get('view');
	      var options = child.get('options');
	      // build the final list of options for the childView class
	      var options = _.extend({}, childViewOptions, options, {
	        id: id
	      });
	
	      // create the child view instance
	      var view = new view(options);
	
	      // return it
	      return view;
	    },
	    getView: function getView(id) {
	      for (var i in this.children._views) {
	        var childView = this.children._views[i];
	        if (id == childView.id) return childView;
	      }
	    }
	  });
	})(window.Wood);

/***/ },
/* 14 */
/***/ function(module, exports) {

	'use strict';
	
	(function (Wood) {
	  Wood.Item = Marionette.LayoutView.extend({
	    tagName: 'wood-item',
	    template: _.template('<div class="item-wrapper">' + '<% if (leftIcon) { %>' + '<div id="left-icon-container" class="left-icon"></div>' + '<%}%>' + '<div class="item-body">' + '<div class="primary-text"><%=primaryText%></div>' + '<div class="secondary-text"><%-secondaryText%></div>' + '</div>' + '<% if (rightIcon) { %>' + '<div id="right-icon-container" class="right-icon"></div>' + '<%}%>' + '</div>' + ''),
	    regions: {
	      leftIconContainer: '#left-icon-container',
	      rightIconContainer: '#right-icon-container'
	    },
	    defaults: {
	      leftIcon: false,
	      leftIconView: Wood.Avatar,
	      leftIconOptions: {},
	      primaryText: null,
	      secondaryText: null,
	      rightIcon: false,
	      rightIconView: null,
	      rightIconOptions: {}
	    },
	    initialize: function initialize(options) {
	      this.options = _.extend({}, this.defaults, this.options);
	    },
	    onRender: function onRender() {
	      if (this.options.leftIcon) {
	        var leftIcon = new this.options.leftIconView(this.options.leftIconOptions);
	        this.leftIconContainer.show(leftIcon);
	      }
	
	      if (this.options.rightIcon) {
	        var rightIcon = new this.options.rightIconView(this.options.rightIconOptions);
	        this.rightIconContainer.show(rightIcon);
	      }
	    },
	    templateHelpers: function templateHelpers() {
	      return _.extend({}, this.options, {
	        value: this.value
	      });
	    }
	  });
	
	  Wood.ItemButton = Wood.Item.extend({
	    attributes: {
	      class: 'button'
	    },
	    events: {
	      'mousedown': 'click'
	    },
	    defaults: _.extend({}, Wood.Item.prototype.defaults, {
	      clickEvent: 'action:click:item',
	      clickEventArg: null
	    }),
	    click: function click(e) {
	      this.triggerMethod(this.options.clickEvent, this.options.clickEventArg);
	    }
	  });
	})(window.Wood);

/***/ },
/* 15 */
/***/ function(module, exports) {

	'use strict';
	
	(function (Wood) {
	  Wood.Spinner = Marionette.ItemView.extend({
	    tagName: 'wood-spinner',
	    template: _.template('<svg class="circular" viewBox="<%-r+5%> <%-r+5%> <%-d+10%> <%-d+10%>" height="<%-d%>" width="<%-d%>">' + '<circle class="path" cx="<%-d+10%>" cy="<%-d+10%>" r="<%-radius%>" stroke-width="<%-strokeWidth%>"/>' + '</svg>' + ''),
	    defaults: {
	      radius: 20,
	      strokeWidth: 2
	    },
	    initialize: function initialize(options) {
	      this.options = _.extend({}, this.defaults, this.options);
	    },
	    templateHelpers: function templateHelpers() {
	      var radius = this.options.radius;
	      return _.extend({}, this.options, {
	        r: radius,
	        d: radius * 2
	      });
	    }
	  }, {
	    overlay: function overlay($el, options) {
	      var widget = new Wood.Spinner(options);
	      widget.render();
	      var $overlay = widget.$el;
	      $overlay.addClass('overlay');
	
	      $el.append($overlay);
	      return $overlay;
	    }
	  });
	
	  Wood.SpinnerOverlay = Marionette.LayoutView.extend({
	    tagName: 'wood-spinner-overlay',
	    template: _.template('<div class="overlay backgroundColor-<%-backgroundColor%>">' + '<div id="spinner-container"></div>' + '</div>' + ''),
	    defaults: {
	      backgroundColor: 'transparent'
	    },
	    events: {
	      'click': 'preventDefault'
	    },
	    regions: {
	      spinnerContainer: '#spinner-container'
	    },
	    initialize: function initialize(options) {
	      this.options = _.extend({}, this.defaults, this.options);
	    },
	    onRender: function onRender() {
	      var spinner = new Wood.Spinner();
	      this.spinnerContainer.show(spinner);
	    },
	    preventDefault: function preventDefault(e) {
	      e.preventDefault();
	    },
	    templateHelpers: function templateHelpers() {
	      return _.extend({}, this.options, {});
	    }
	  }, {
	    show: function show($el, options) {
	      var overlay = new Wood.SpinnerOverlay(options);
	      overlay.render();
	
	      $el.append(overlay.$el);
	      return overlay.$el;
	    }
	  });
	
	  // TODO
	  // Wood.InlineLoader = Marionette.ItemView.extend({
	  //     tagName: 'img',
	  //     attributes: {
	  //         src: '/assets/images/loaders/bar.gif',
	  //         style: 'position:absolute;margin:auto;top:0;bottom:0;'
	  //     },
	  //     template: _.template('')
	  // });
	})(window.Wood);

/***/ },
/* 16 */
/***/ function(module, exports) {

	'use strict';
	
	(function (Wood) {
	  Wood.Ripple = Marionette.ItemView.extend({
	    attributes: {
	      class: 'wood ripple-wrapper'
	    },
	    template: _.template(''),
	    initialize: function initialize() {
	      this.$ripples = [];
	    },
	    pythagoras: function pythagoras(a, b) {
	      return Math.pow(Math.pow(a, 2) + Math.pow(b, 2), 0.5);
	    },
	    createRipple: function createRipple(className, x, y) {
	      var $ripple = $(document.createElement('div'));
	      $ripple.addClass('circle ripple ' + className);
	      var h = this.$el.height();
	      var w = this.$el.width();
	      if (x == undefined) {
	        x = w / 2;
	        y = h / 2;
	      }
	      var r = this.pythagoras(Math.max(x, w - x), Math.max(y, h - y));
	      $ripple.css({
	        'top': y - r,
	        'left': x - r,
	        'height': 2 * r,
	        'width': 2 * r
	      });
	      return $ripple;
	    },
	    focusIn: function focusIn() {
	      if (!this.$pulse && this.$ripples.length == 0) {
	        var $pulse = this.createRipple('pulsing');
	        this.$el.append($pulse);
	        this.$pulse = $pulse;
	      }
	    },
	    focusOut: function focusOut() {
	      if (this.$pulse) {
	        this.fade(this.$pulse, 0);
	        this.$pulse = undefined;
	      }
	    },
	    mouseDown: function mouseDown(x, y) {
	      var $ripple = this.createRipple('propagating', x, y);
	      this.$el.append($ripple);
	      this.$ripples.push($ripple);
	    },
	    mouseOut: function mouseOut() {
	      var $ripple = this.$ripples.pop();
	      if ($ripple) {
	        this.fade($ripple);
	      }
	    },
	    click: function click() {
	      var self = this;
	      var $ripple = this.$ripples.pop();
	      if ($ripple) {
	        this.$ripples.push($ripple);
	      } else {
	        this.mouseDown();
	      }
	      setTimeout(function () {
	        self.mouseOut();
	      }, 0);
	    },
	    fade: function fade(ripple, duration) {
	      var duration = typeof duration == 'number' ? duration : 500;
	      ripple.fadeOut(duration, function () {
	        ripple.remove();
	      });
	    }
	  });
	})(window.Wood);

/***/ },
/* 17 */
/***/ function(module, exports) {

	'use strict';
	
	/**
	 * Created by danmurray on 14/12/15.
	 * TODO remove datatables dependency
	 */
	(function (Wood) {
	    Wood.Table = Marionette.ItemView.extend({
	        tagName: 'table',
	        attributes: {
	            class: 'table table-striped',
	            cellspacing: 0,
	            width: '100%',
	            style: 'min-width:100%;min-height:100%;'
	        },
	        template: _.template('<% if (showHeader) { %>' + '<thead>' + '<tr>' + '<% _.each(columns, function (column) { %>' + '<th><%= column.display %></th>' + '<% }); %>' + '</tr>' + '</thead>' + '<% } %>' + '<% if (showFooter) { %>' + '<tfoot>' + '<tr>' + '<% _.each(columns, function (column) { %>' + '<th><%= column.display %></th>' + '<% }); %>' + '</tr>' + '</tfoot>' + '<% } %>' + '<tbody></tbody>'),
	        collectData: function collectData() {
	            var output = [];
	            this.collection.each(function (model) {
	                output.push(model.attributes);
	            });
	            return output;
	        },
	        getColumns: function getColumns(schema) {
	            var output = [];
	
	            // load the column information from the schema
	            if (schema) {
	                _.each(schema.columns, function (info) {
	                    if (info.visible !== false) {
	                        output.push({
	                            data: info.field,
	                            display: info.display
	                        });
	                    }
	                });
	            }
	            return output;
	        },
	        getColumnDefs: function getColumnDefs(columns) {
	            var defs = [];
	            var self = this;
	            _.each(columns, function (col, index) {
	                if (col.renderer) {
	                    var renderer = col.renderer;
	                    var dataName = col.data;
	                    var rendererOptions = col.rendererOptions;
	
	                    defs.push({
	                        targets: index,
	                        data: dataName,
	                        render: function render(data, type, full, meta) {
	                            if (type === 'display') {
	                                var widget = self[renderer](data, type, full, meta, rendererOptions);
	
	                                if (typeof widget === 'string') {
	                                    return widget;
	                                } else {
	                                    var id = dataName + '_' + meta.row;
	                                    self.renderers[id] = widget;
	                                    return '<span id="' + id + '" class="renderer-container waiting"></span>';
	                                }
	                            } else {
	                                return data;
	                            }
	                        }
	                    });
	                }
	            });
	            return defs;
	        },
	        getExportData: function getExportData(record, field) {
	            return record.attributes[field];
	        },
	        initialize: function initialize(options) {
	            var self = this;
	            var default_columns = self.getColumns(self.collection.model.prototype.schema);
	            if (options.columnFilter) {
	                default_columns = _.filter(default_columns, options.columnFilter);
	            }
	
	            // store the collection for this datatable
	            this.table = undefined;
	            self.renderers = {};
	            self.baseSearch = options.search || '';
	
	            self.rowHeight = options.rowHeight || 59;
	            self.maxVisibleRows = options.maxVisibleRows || 10;
	            self.collection = options.collection;
	            self.columns = options.columns || default_columns;
	            self.columnDefs = options.columnDefs || self.getColumnDefs(self.columns);
	            self.showHeader = options.showHeader || true;
	            self.showFooter = options.showFooter || false;
	            self.dataTableOptions = options.dataTableOptions || {};
	            self.title = options.title;
	
	            $(window).on("resize", function () {
	                self.resizeHeight();
	            });
	        },
	        onRowRender: function onRowRender(row, data, index) {
	            var self = this;
	            $(row).find('.renderer-container.waiting').each(function () {
	                var $holder = $(this);
	                $holder.removeClass('waiting');
	
	                var renderer = self.renderers[$holder.attr('id')];
	
	                // add a jquery object directly
	                if (renderer instanceof jQuery) {
	                    $holder.append(renderer);
	                }
	
	                // render a backbone view
	                else {
	                        renderer.render();
	                        $holder.append(renderer.$el);
	                    }
	            });
	        },
	        onLoad: function onLoad() {
	            // virtual method
	        },
	        onShow: function onShow() {
	            var self = this;
	
	            // set the default loader for this table to load collection information
	            var options = {
	                scrollY: $(window).height() - 385,
	                scrollX: true,
	                deferRender: true,
	                dom: '<"title">ZTfrtiS',
	                scrollCollapse: true,
	                columns: this.columns,
	                columnDefs: this.columnDefs,
	                rowCallback: function rowCallback(row, data, index) {
	                    return self.onRowRender(row, data, index);
	                },
	                scroller: {
	                    rowHeight: this.rowHeight,
	                    displayBuffer: 2
	                },
	                ajax: function ajax(data, callback, settings) {
	                    var $overlay = new Wood.Spinner.overlay(self.$el);
	                    return self.collection.fetch({
	                        data: {
	                            expand: self.columns.map(function (c) {
	                                return c.data;
	                            }).join(',')
	                        },
	                        success: function success(collection) {
	                            $overlay.remove();
	                            callback({ data: self.collectData() });
	                            self.onLoad();
	                        }
	                    });
	                },
	                tableTools: {
	                    sSwfPath: '/assets/swf/copy_csv_xls_pdf.swf',
	                    aButtons: [{
	                        sExtends: 'csv',
	                        sButtonText: 'Export',
	                        sButtonClass: 'btn btn-default btn-xs',
	                        fnCellRender: function fnCellRender(value, column, domRow, row) {
	                            var record = self.collection.at(row);
	                            var field = self.columns[column].data;
	                            return self.getExportData(record, field);
	                        }
	                    }]
	                }
	            };
	
	            this.table = this.$el.DataTable(_.extend(options, self.dataTableOptions));
	            this.table.search(this.baseSearch);
	            this.$dataTable = self.$el.closest('.dataTables_wrapper');
	            this.$el.on('search.dt', function () {
	                self.trigger('change:search', self.table.search());
	            });
	
	            if (self.title) {
	                table = self;
	                self.$dataTable.find('div.title').append(self.title);
	            }
	
	            this.resizeHeight();
	        },
	        onDestroy: function onDestroy() {
	            $(window).off("resize");
	        },
	        refresh: function refresh() {
	            var $overlay = Wood.Spinner.overlay(this.$el);
	            this.table.ajax.reload(function () {
	                $overlay.remove();
	            });
	        },
	        rowCount: function rowCount() {
	            var info = this.table.page.info();
	            return info.recordsTotal;
	        },
	        setHeight: function setHeight(height) {
	            this.$dataTable.find('.dataTables_scrollBody').css('max-height', height + "px");
	        },
	        resizeHeight: function resizeHeight() {
	            this.setHeight($(window).height() - 570);
	        },
	        unfilteredRowCount: function unfilteredRowCount() {
	            var info = this.table.page.info();
	            return info.recordsDisplay;
	        },
	        templateHelpers: function templateHelpers() {
	            return {
	                columns: this.columns,
	                showHeader: this.showHeader,
	                showFooter: this.showFooter
	            };
	        }
	    });
	})(window.Wood);

/***/ },
/* 18 */
/***/ function(module, exports) {

	'use strict';
	
	/**
	 * Created by danmurray on 3/11/15.
	 */
	(function (Wood) {
	  Wood.Tooltip = Marionette.LayoutView.extend({
	    attributes: {
	      class: 'wood tooltip-anchor-wrapper'
	    },
	    template: _.template('<div class="tooltip-anchor">' + '<div class="tooltip-wrapper">' + '<div class="wood-tooltip"><%- text %></div>' + '</div>' + '</div>' + ''),
	    defaults: {
	      text: ''
	    },
	    focusIn: function focusIn() {
	      this.$el.addClass('focused');
	    },
	    focusOut: function focusOut() {
	      this.$el.removeClass('focused');
	    },
	    initialize: function initialize(options) {
	      this.options = _.extend({}, this.defaults, this.options);
	    },
	    templateHelpers: function templateHelpers() {
	      return _.extend({}, this.options, {});
	    }
	  });
	})(window.Wood);

/***/ },
/* 19 */
/***/ function(module, exports) {

	'use strict';
	
	(function (Wood) {
	  Wood.Toolbar = Marionette.LayoutView.extend({
	    tagName: "wood-toolbar",
	    template: _.template('' + '<div id="left-icons-wrapper" class="left-icons-wrapper"></div>' + '<div class="title"><%-title%></div>' + '<div id="right-icons-wrapper" class="right-icons-wrapper"></div>' + ''),
	    regions: {
	      leftIconsContainer: "#left-icons-wrapper",
	      rightIconsContainer: "#right-icons-wrapper"
	    },
	    childEvents: {
	      'action:click:icon': "onClickIcon"
	    },
	    events: {
	      'click .title': 'onClickTitle'
	    },
	    onClickIcon: function onClickIcon(iconView) {
	      this.triggerMethod('action:click:icon', iconView);
	    },
	    onClickTitle: function onClickTitle() {
	      this.triggerMethod('action:click:title');
	    },
	    defaults: {
	      leftIcons: [],
	      rightIcons: [],
	      title: 'Toolbar',
	      color: 'black',
	      backgroundColor: 'grey-light'
	    },
	    initialize: function initialize() {
	      this.options = _.extend({}, this.defaults, this.options);
	    },
	    templateHelpers: function templateHelpers() {
	      return _.extend({}, this.options, {});
	    },
	    getIcon: function getIcon(iconId) {
	      var a = this.leftIconsContainer.currentView.getView(iconId);
	      var b = this.rightIconsContainer.currentView.getView(iconId);
	      return a || b;
	    },
	    onRender: function onRender() {
	      this.$el.addClass('color-' + this.options.color);
	      this.$el.addClass('backgroundColor-' + this.options.backgroundColor);
	
	      var leftIconList = new Wood.IconList({
	        collection: new Backbone.Collection(this.options.leftIcons)
	      });
	      this.leftIconsContainer.show(leftIconList);
	
	      var rightIconList = new Wood.IconList({
	        collection: new Backbone.Collection(this.options.rightIcons)
	      });
	      this.rightIconsContainer.show(rightIconList);
	    }
	  });
	})(window.Wood);

/***/ },
/* 20 */
/***/ function(module, exports) {

	'use strict';
	
	/**
	 * Created by danmurray on 4/5/16.
	 */
	(function (Wood) {
	  Wood.Branch = Marionette.LayoutView.extend({
	    tagName: "wood-branch",
	    template: _.template('<div id="tree-container"></div>' + ''),
	    childEvents: {},
	    regions: {
	      treeContainer: "#tree-container"
	    },
	    defaults: {},
	    initialize: function initialize(options) {
	      this.options = _.extend({}, this.defaults, this.options);
	      this.tree = this.options.tree;
	    },
	    getTree: function getTree() {
	      return this.tree.getTree(this.options);
	    },
	    bubbleChildEvent: function bubbleChildEvent(childEventName) {
	      this.childEvents[childEventName] = function (child, args) {
	        this.triggerMethod(childEventName, args);
	      };
	    },
	    onRender: function onRender() {
	      var tree = this.getTree();
	      this.treeContainer.show(tree);
	
	      for (var childEventName in tree.childEvents) {
	        this.bubbleChildEvent(childEventName);
	      }
	    },
	    templateHelpers: function templateHelpers() {
	      return _.extend({}, this.options, {});
	    }
	  });
	
	  Wood.Branches = Marionette.CollectionView.extend({
	    tagName: "wood-branches",
	    childView: Wood.Branch,
	    buildChildView: function buildChildView(child, ChildViewClass, childViewOptions) {
	      // build the final list of options for the childView class
	      var options = _.extend({}, childViewOptions, child.attributes, {
	        tree: this.tree
	      });
	
	      // create the child view instance
	      var view = new ChildViewClass(options);
	
	      // return it
	      return view;
	    },
	    events: {},
	    defaults: {},
	    initialize: function initialize(options) {
	      this.options = _.extend({}, this.defaults, this.options);
	      this.tree = this.options.tree;
	    },
	    onRender: function onRender() {},
	    templateHelpers: function templateHelpers() {
	      return _.extend({}, this.options, {});
	    },
	    filter: function filter(child, index, collection) {
	      return this.tree.filter(child, index, collection);
	    },
	    viewComparator: function viewComparator(a, b) {
	      return this.tree.viewComparator(a, b);
	    }
	  });
	
	  Wood.Tree = Marionette.LayoutView.extend({
	    tagName: "wood-tree",
	    template: _.template('<div class="tree-wrapper">' + '<div class="twig"></div>' + '<div id="item-container" class="item-container"></div>' + '</div>' + '<div id="children-container" class="children-container"></div>' + ''),
	    regions: {
	      itemContainer: "#item-container",
	      childrenContainer: "#children-container"
	    },
	    events: {},
	    defaults: {
	      itemView: Wood.Item,
	      itemOptions: {},
	      children: []
	    },
	    initialize: function initialize(options) {
	      this.options = _.extend({}, this.defaults, this.options);
	    },
	    filter: function filter(child, index, collection) {
	      return true;
	    },
	    viewComparator: function viewComparator(a, b) {
	      return false;
	    },
	    getCollection: function getCollection() {
	      return new Backbone.Collection(this.options.children);
	    },
	    getItem: function getItem() {
	      return new this.options.itemView(this.options.itemOptions);
	    },
	    getTree: function getTree(options) {
	      return new Wood.Tree(options);
	    },
	    onRender: function onRender() {
	      var item = this.getItem();
	      this.itemContainer.show(item);
	
	      this.collection = this.getCollection();
	      if (this.collection.length > 0) {
	        var branches = new Wood.Branches({
	          tree: this,
	          collection: this.collection
	        });
	        this.childrenContainer.show(branches);
	      }
	    },
	    templateHelpers: function templateHelpers() {
	      return _.extend({}, this.options, {});
	    }
	  });
	
	  Wood.Arborist = Wood.Tree.extend({
	    filter: function filter(child, index, collection) {
	      var model = this.options.collection.get(this.options.root);
	      return child.get('parent') == model.get('id');
	    },
	    getCollection: function getCollection() {
	      return this.options.collection;
	    },
	    getItem: function getItem() {
	      var model = this.options.collection.get(this.options.root);
	      return new Wood.Item({
	        primaryText: model.get('id')
	      });
	    },
	    getTree: function getTree(options) {
	      return new Wood.Arborist({
	        root: options.id,
	        collection: this.collection
	      });
	    }
	  });
	})(window.Wood);

/***/ },
/* 21 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ }
/******/ ]);
//# sourceMappingURL=wood.js.map