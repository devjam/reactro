import {EventEmitter} from 'events'
import delegate from 'dom-delegate'
import React from 'react'
import ReactDom from'react-dom'
import ReactDomServer from 'react-dom/server'
import PropTypes from 'prop-types'
import CreateReactClass from 'create-react-class'

const rootComponent = {
  getChildContext() {
    if (!this.context.root) {
      this.context.root = this
      this.isTopLevelRootComponent = true
    }
    return {}
  },
  componentWillMount() {
    let events = {}
    if(this.events.sub) {
      events = this.events.sub
    }
    if(this.events.pubsub) {
      events = this.events.pubsub
    }
    if(this.events.subscribe) {
      events = this.events.subscribe
    }
    for(let key in events) {
      this._pubsub.on(key, events[key].bind(this))
    }
  },
  componentWillUnmount() {
    return this._pubsub.removeAllListeners()
  }
}

const subComponent = {
  contextTypes: {
    root: PropTypes.object
  },
  childContextTypes: {
    root: PropTypes.object
  },
  getChildContext() {
    if (this.isRootComponent)
      return {root: this}
    else
      return {root: this.context.root}
  },
  componentWillMount() {
    if(document && this.style) {
      let style = document.querySelector(`style[data-component-name="${this.name}"]`)
      if(style) {
        style.setAttribute('data-component-count', style.getAttribute('data-component-count') * 1 + 1)
      } else {
        style = document.createElement('style')
        style.setAttribute('type', 'text/css')
        style.setAttribute('data-component-name', this.name)
        style.setAttribute('data-component-count', 1)
        style.innerHTML = this.style
        document.head.appendChild(style)
      }
    }
  },
  componentDidMount() {
    this._domEventDelegate = delegate(this.find())

    const events = this.events.dom ? this.events.dom : this.events
    for(let key in events) {
      const [type, selector] = key.split(';')
      if(selector)
        this._domEventDelegate.on(type, selector, events[key].bind(this))
      else
        this._domEventDelegate.on(type, events[key].bind(this))
    }
  },
  componentWillUnmount() {
    if(this._domEventDelegate) {
      this._domEventDelegate.off()
      this._domEventDelegate = null
    }
    if(window && this.style) {
      let style = document.querySelector('style[data-component-name="'+this.name+'"]')
      if(style) {
        const count = style.getAttribute('data-component-count') * 1 - 1
        if(count > 0)
          style.setAttribute('data-component-count', count)
        else
          document.head.removeChild(style)
      }
    }
  },
  publish() {
    const root = this.isRootComponent ? this : this.context.root
    if (0 < root._pubsub.listeners(arguments[0]).length)
      root._pubsub.emit.apply(root._pubsub, arguments)
    else if(!this.isTopLevelRootComponent)
      return root.context.root.publish.apply(this, arguments)
  },
  pub() {
    this.publish.apply(this, arguments)
  },
  find(refs) {
    if(refs)
      return ReactDom.findDOMNode(this.refs[refs])
    else
      return ReactDom.findDOMNode(this)
  },
  getState() {
    return this.context.root.state
  },
}

const createSubOptions = function(opts) {
  if(opts.name && !opts.displayName) opts.displayName = opts.name
  if(!opts.mixins) opts.mixins = []
  opts.mixins.unshift(subComponent)
  opts._domEventDelegate = null
  if(!opts.events) opts.events = {}
  if(!opts.templateData) opts.templateData = {}
  if(!opts.render) {
    if(opts.template) {
      opts.render = function() {
        this.templateData.props = this.props
        this.templateData.state = this.isRootComponent ? this.state : this.context.root.state
        return this.template(this.templateData)
      }
    } else {
      opts.render = function() {
        return ''
      }
    }
  }
  return opts
}

const createRootOptions = function(opts) {
  opts = createSubOptions(opts)
  opts.isRootComponent = true
  opts.mixins.unshift(rootComponent)
  opts._pubsub = new EventEmitter()
  opts._pubsub.setMaxListeners(0)
  return opts
}

export default {
  createRootComponent(opts) {
    return CreateReactClass(createRootOptions(opts))
  },
  createSubComponent(opts) {
    return CreateReactClass(createSubOptions(opts))
  },
  render(container, component, props = null) {
    if ('[object String]' === Object.prototype.toString.call(container))
      container = document.querySelector(container)
    return ReactDom.render(React.createElement(component, props), container)
  },
  renderToString(component, props = null, state = null) {
    let element
    if(React.isValidElement(component)) {
      element = component
    } else {
      element = React.createElement(component, props)
      if(!component.prototype.isRootComponent || state !== null) {
        const _element = element
        element = React.createElement(CreateReactClass(createRootOptions({
          getInitialState: ()=> state,
          render: ()=> React.createElement('div', null, _element),
        })))
      }
    }
    return ReactDomServer.renderToString(element)
  }
}
