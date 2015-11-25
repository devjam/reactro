'use strict'
reactro = require 'reactro'

module.exports = reactro.createComponent
  #-----
  # Init
  #
  name: ''

  template: require './template'
  # templateData: {}

  # events:
  #   # dom event
  #   'type; delegate-selector': (e)->
  #   'type type2; delegate-selector': (e)->

  # render: ->
  #   console.log @name, 'render'

  # mixins: []
  # statics: {}
  # propTypes: {}
  # getDefaultProps: -> {}
  # getInitialState: -> {}
  # displayName: ''


  # #------------------
  # # Lifecycle Methods
  #
  # #---------
  # # on mount
  # #
  # componentWillMount: ->
  #   console.log @name, 'will mount'
  #
  # # <- render timing
  #
  # componentDidMount: ->
  #   console.log @name, 'did mount'

  # #----------
  # # on update
  # #
  # componentWillReceiveProps: (nextProps)->
  #   console.log @name, 'will receive props'
  #
  # shouldComponentUpdate: (nextProps, nextState)->
  #   console.log @name, 'should component update'
  #   # default true
  #   true
  #
  # componentWillUpdate: (nextProps, nextState)->
  #   console.log @name, 'will update'
  #
  # # <- render timing
  #
  # componentDidUpdate: (prevProps, prevState)->
  #   console.log @name, 'did update'

  # #-----------
  # # on unmount
  # #
  # componentWillUnmount: ->
  #   console.log @name, 'will unmount'
