'use strict'
{EventEmitter} = require 'events'
delegate = require 'dom-delegate'

React = require 'react'
ReactDom = require 'react-dom'
ReactDomServer = require 'react-dom/server'

rootComponent =
    # context
    getChildContext: ->
        if !@context.root
            @context.root = @
            @isTopLevelRootComponent = true
        {}

    # pub/sub
    componentWillMount: ->
        events = {}
        events = @events.sub if @events.sub
        events = @events.pubsub if @events.pubsub
        events = @events.subscribe if @events.subscribe
        for key, val of events
            @_pubsub.on key, val.bind @

    componentWillUnmount: ->
        @_pubsub.removeAllListeners()


subComponent =
    # context
    contextTypes:
        root: React.PropTypes.object

    childContextTypes:
        root: React.PropTypes.object

    getChildContext: ->
        if @isRootComponent
            root: @
        else
            root: @context.root

    # event
    ## DOM event
    componentDidMount: ->
        # add DOM event
        @_domEventDelegate = delegate @find()
        events = if @events.dom then @events.dom else @events
        for key, val of events
            [types, selector] = key.split ';'
            for type in types.split ' '
                if selector
                    @_domEventDelegate.on type, selector, val.bind @
                else
                    @_domEventDelegate.on type, val.bind @

    componentWillUnmount: ->
        # remove DOM event
        if @_domEventDelegate
            @_domEventDelegate.off()
            @_domEventDelegate = null

    ## pub/sub
    publish: ->
        # TODO add namespace feature?
        root = if @isRootComponent then @ else @context.root
        if 0 < root._pubsub.listeners(arguments[0]).length
            root._pubsub.emit.apply root._pubsub, arguments
        else if !@isTopLevelRootComponent
            root.context.root.publish.apply @, arguments

    pub: ->
        @publish.apply @, arguments

    # utils
    find: (refs)->
        if refs
            ReactDom.findDOMNode @refs[refs]
        else
            ReactDom.findDOMNode @

    getState: ->
        @context.root.state

    # update: (changes)->
    #     root = if @isRootComponent then @ else @context.root
    #     root.setState changes

    # getRoot: (name)->
    #     console.log 'name', @name
    #     return @ if @ == @context.root
    #     root = if @isRootComponent then @ else @context.root
    #     if root.name != name
    #         root = @context.root.getRoot name
    #     root


createSubOptions = (opts)->
    if opts.name && !opts.displayName
        opts.displayName = opts.name

    opts.mixins = [] unless opts.mixins
    opts.mixins.unshift subComponent

    opts._domEventDelegate = null
    opts.events = {} unless opts.events
    opts.templateData = {} unless opts.templateData

    # default render
    if !opts.render
        if opts.template
            opts.render = ->
                @templateData.props = @props
                @templateData.state = if @isRootComponent then @state else @context.root.state
                @template @templateData
        else
            opts.render = -> ''

    opts


createRootOptions = (opts)->
    # throw new Error 'root component requires name option' if !opts.name
    opts = createSubOptions opts
    opts.isRootComponent = true
    opts.mixins.unshift rootComponent

    opts._pubsub = new EventEmitter()
    opts._pubsub.setMaxListeners 0

    opts


module.exports =
    createRootComponent: (opts)->
        React.createClass createRootOptions opts

    createSubComponent: (opts)->
        React.createClass createSubOptions opts

    render: (container, component, props = null)->
        if '[object String]' == Object.prototype.toString.call container
            container = document.querySelector container
        ReactDom.render(
            React.createElement component, props
            container
        )

    renderToString: (component, props = null, state = null)->
        if React.isValidElement component
            element = component
        else
            element = React.createElement component, props
            if !component.prototype.isRootComponent || state != null
                _element = element
                element = React.createElement React.createClass createRootOptions
                    getInitialState: -> state
                    render: -> React.createElement 'div', null, _element

            # TODO 多分こっちのほうがいい。要検証
            # if state != null
            #     if element.isRootComponent
            #         element.setState state
            #     else
            #         _element = element
            #         element = React.createElement React.createClass createRootOptions
            #             getInitialState: -> state
            #             render: -> React.createElement 'div', null, _element
        ReactDomServer.renderToString element
