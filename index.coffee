'use strict'
{EventEmitter} = require 'events'

React = require 'react'
ReactDom = require 'react-dom'

_ = require 'lodash'
$ = require 'jquery'

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
            @_pubsub.on key, _.bind val, @

    componentWillUnmount: ->
        @_pubsub.removeAllListeners()


baseComponent =
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
        $rootDOM = @$find()
        events = if @events.dom then @events.dom else @events
        for key, val of events
            [type, delegate] = key.split ';'
            if delegate
                $rootDOM.on type, delegate, _.bind val, @
            else
                $rootDOM.on type, _.bind val, @

    componentWillUnmount: ->
        # remove DOM event
        @$find().off()

    ## pub/sub
    pub: ->
        @publish.apply @, arguments

    publish: ->
        root = if @isRootComponent then @ else @context.root
        if 0 < root._pubsub.listeners(arguments[0]).length
            root._pubsub.emit.apply root._pubsub, arguments
        else if !@isTopLevelRootComponent
            root.context.root.publish.apply @, arguments


    # utils
    find: (refs)->
        if refs
            ReactDom.findDOMNode @refs[refs]
        else
            ReactDom.findDOMNode @

    $find: (refs)->
        $ @find refs

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


createBaseOptions = (opts)->
    if opts.name && !opts.displayName
        opts.displayName = opts.name

    opts.mixins = [] unless opts.mixins
    opts.mixins.unshift baseComponent

    opts.events = {} unless opts.events

    # default render
    if opts.template && !opts.render
        opts.render = ->
            @template @

    opts


createRootOptions = (opts)->
    # throw new Error 'root component requires name option' if !opts.name
    opts = createBaseOptions opts
    opts.isRootComponent = true
    opts.mixins.unshift rootComponent

    opts._pubsub = new EventEmitter()
    opts._pubsub.setMaxListeners 0

    opts


module.exports =
    createComponent: (opts)->
        React.createClass createBaseOptions opts

    createRootComponent: (opts)->
        React.createClass createRootOptions opts

    renderRoot: (selector, component, props = null)->
        container = $(selector)[0]
        ReactDom.render(
            React.createElement component, props
            container
        )
