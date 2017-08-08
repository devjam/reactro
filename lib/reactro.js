'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _events = require('events');

var _domDelegate = require('dom-delegate');

var _domDelegate2 = _interopRequireDefault(_domDelegate);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _server = require('react-dom/server');

var _server2 = _interopRequireDefault(_server);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _createReactClass = require('create-react-class');

var _createReactClass2 = _interopRequireDefault(_createReactClass);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var rootComponent = {
  getChildContext: function getChildContext() {
    if (!this.context.root) {
      this.context.root = this;
      this.isTopLevelRootComponent = true;
    }
    return {};
  },
  componentWillMount: function componentWillMount() {
    var events = {};
    if (this.events.sub) {
      events = this.events.sub;
    }
    if (this.events.pubsub) {
      events = this.events.pubsub;
    }
    if (this.events.subscribe) {
      events = this.events.subscribe;
    }
    for (var key in events) {
      this._pubsub.on(key, events[key].bind(this));
    }
  },
  componentWillUnmount: function componentWillUnmount() {
    return this._pubsub.removeAllListeners();
  }
};

var subComponent = {
  contextTypes: {
    root: _propTypes2.default.object
  },
  childContextTypes: {
    root: _propTypes2.default.object
  },
  getChildContext: function getChildContext() {
    if (this.isRootComponent) return { root: this };else return { root: this.context.root };
  },
  componentWillMount: function componentWillMount() {
    if (document && this.style) {
      var style = document.querySelector('style[data-component-name="' + this.name + '"]');
      if (style) {
        style.setAttribute('data-component-count', style.getAttribute('data-component-count') * 1 + 1);
      } else {
        style = document.createElement('style');
        style.setAttribute('type', 'text/css');
        style.setAttribute('data-component-name', this.name);
        style.setAttribute('data-component-count', 1);
        style.innerHTML = this.style;
        document.head.appendChild(style);
      }
    }
  },
  componentDidMount: function componentDidMount() {
    this._domEventDelegate = (0, _domDelegate2.default)(this.find());

    var events = this.events.dom ? this.events.dom : this.events;
    for (var key in events) {
      var _key$split = key.split(';'),
          _key$split2 = _slicedToArray(_key$split, 2),
          type = _key$split2[0],
          selector = _key$split2[1];

      if (selector) this._domEventDelegate.on(type, selector, events[key].bind(this));else this._domEventDelegate.on(type, events[key].bind(this));
    }
  },
  componentWillUnmount: function componentWillUnmount() {
    if (this._domEventDelegate) {
      this._domEventDelegate.off();
      this._domEventDelegate = null;
    }
    if (window && this.style) {
      var style = document.querySelector('style[data-component-name="' + this.name + '"]');
      if (style) {
        var count = style.getAttribute('data-component-count') * 1 - 1;
        if (count > 0) style.setAttribute('data-component-count', count);else document.head.removeChild(style);
      }
    }
  },
  publish: function publish() {
    var root = this.isRootComponent ? this : this.context.root;
    if (0 < root._pubsub.listeners(arguments[0]).length) root._pubsub.emit.apply(root._pubsub, arguments);else if (!this.isTopLevelRootComponent) return root.context.root.publish.apply(this, arguments);
  },
  pub: function pub() {
    this.publish.apply(this, arguments);
  },
  find: function find(refs) {
    if (refs) return _reactDom2.default.findDOMNode(this.refs[refs]);else return _reactDom2.default.findDOMNode(this);
  },
  getState: function getState() {
    return this.context.root.state;
  }
};

var createSubOptions = function createSubOptions(opts) {
  if (opts.name && !opts.displayName) opts.displayName = opts.name;
  if (!opts.mixins) opts.mixins = [];
  opts.mixins.unshift(subComponent);
  opts._domEventDelegate = null;
  if (!opts.events) opts.events = {};
  if (!opts.templateData) opts.templateData = {};
  if (!opts.render) {
    if (opts.template) {
      opts.render = function () {
        this.templateData.props = this.props;
        this.templateData.state = this.isRootComponent ? this.state : this.context.root.state;
        return this.template(this.templateData);
      };
    } else {
      opts.render = function () {
        return '';
      };
    }
  }
  return opts;
};

var createRootOptions = function createRootOptions(opts) {
  opts = createSubOptions(opts);
  opts.isRootComponent = true;
  opts.mixins.unshift(rootComponent);
  opts._pubsub = new _events.EventEmitter();
  opts._pubsub.setMaxListeners(0);
  return opts;
};

exports.default = {
  createRootComponent: function createRootComponent(opts) {
    return (0, _createReactClass2.default)(createRootOptions(opts));
  },
  createSubComponent: function createSubComponent(opts) {
    return (0, _createReactClass2.default)(createSubOptions(opts));
  },
  render: function render(container, component) {
    var props = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

    if ('[object String]' === Object.prototype.toString.call(container)) container = document.querySelector(container);
    return _reactDom2.default.render(_react2.default.createElement(component, props), container);
  },
  renderToString: function renderToString(component) {
    var props = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    var state = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

    var element = void 0;
    if (_react2.default.isValidElement(component)) {
      element = component;
    } else {
      element = _react2.default.createElement(component, props);
      if (!component.prototype.isRootComponent || state !== null) {
        var _element = element;
        element = _react2.default.createElement((0, _createReactClass2.default)(createRootOptions({
          getInitialState: function getInitialState() {
            return state;
          },
          render: function render() {
            return _react2.default.createElement('div', null, _element);
          }
        })));
      }
    }
    return _server2.default.renderToString(element);
  }
};