// Generated by CoffeeScript 1.10.0
'use strict';
var $, EventEmitter, React, ReactDom, _, baseComponent, createBaseOptions, createRootOptions, rootComponent;

EventEmitter = require('events').EventEmitter;

React = require('react');

ReactDom = require('react-dom');

_ = require('lodash');

$ = require('jquery');

rootComponent = {
  getChildContext: function() {
    if (!this.context.root) {
      this.context.root = this;
      this.isTopLevelRootComponent = true;
    }
    return {};
  },
  componentWillMount: function() {
    var events, key, results, val;
    events = {};
    if (this.events.sub) {
      events = this.events.sub;
    }
    if (this.events.pubsub) {
      events = this.events.pubsub;
    }
    if (this.events.subscribe) {
      events = this.events.subscribe;
    }
    results = [];
    for (key in events) {
      val = events[key];
      results.push(this._pubsub.on(key, _.bind(val, this)));
    }
    return results;
  },
  componentWillUnmount: function() {
    return this._pubsub.removeAllListeners();
  }
};

baseComponent = {
  contextTypes: {
    root: React.PropTypes.object
  },
  childContextTypes: {
    root: React.PropTypes.object
  },
  getChildContext: function() {
    if (this.isRootComponent) {
      return {
        root: this
      };
    } else {
      return {
        root: this.context.root
      };
    }
  },
  componentDidMount: function() {
    var $rootDOM, delegate, events, key, ref, results, type, val;
    $rootDOM = this.$find();
    events = this.events.dom ? this.events.dom : this.events;
    results = [];
    for (key in events) {
      val = events[key];
      ref = key.split(';'), type = ref[0], delegate = ref[1];
      if (delegate) {
        results.push($rootDOM.on(type, delegate, _.bind(val, this)));
      } else {
        results.push($rootDOM.on(type, _.bind(val, this)));
      }
    }
    return results;
  },
  componentWillUnmount: function() {
    return this.$find().off();
  },
  pub: function() {
    return this.publish.apply(this, arguments);
  },
  publish: function() {
    var root;
    root = this.isRootComponent ? this : this.context.root;
    if (0 < root._pubsub.listeners(arguments[0]).length) {
      return root._pubsub.emit.apply(root._pubsub, arguments);
    } else if (!this.isTopLevelRootComponent) {
      return root.context.root.publish.apply(this, arguments);
    }
  },
  find: function(refs) {
    if (refs) {
      return ReactDom.findDOMNode(this.refs[refs]);
    } else {
      return ReactDom.findDOMNode(this);
    }
  },
  $find: function(refs) {
    return $(this.find(refs));
  },
  getState: function() {
    return this.context.root.state;
  }
};

createBaseOptions = function(opts) {
  if (opts.name && !opts.displayName) {
    opts.displayName = opts.name;
  }
  if (!opts.mixins) {
    opts.mixins = [];
  }
  opts.mixins.unshift(baseComponent);
  if (!opts.events) {
    opts.events = {};
  }
  if (opts.template && !opts.render) {
    opts.render = function() {
      return this.template(this);
    };
  }
  return opts;
};

createRootOptions = function(opts) {
  if (!opts.name) {
    throw new Error('root component requires name option');
  }
  opts = createBaseOptions(opts);
  opts.isRootComponent = true;
  opts.mixins.unshift(rootComponent);
  opts._pubsub = new EventEmitter();
  opts._pubsub.setMaxListeners(0);
  return opts;
};

module.exports = {
  createComponent: function(opts) {
    return React.createClass(createBaseOptions(opts));
  },
  createRootComponent: function(opts) {
    return React.createClass(createRootOptions(opts));
  },
  renderRoot: function(selector, component, props) {
    var container;
    if (props == null) {
      props = null;
    }
    container = $(selector)[0];
    return ReactDom.render(React.createElement(component, props), container);
  }
};
