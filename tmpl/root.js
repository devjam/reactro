'use strict';
var reactro = require('reactro');
var template = require('./template');
var style = require('./style');

module.exports = reactro.createRootComponent({
    //------------
    // for Reactro
    //
    name: '',

    template: template, // template.locals({}),
    // templateData: {},

    style: style,

    events: {
        // pubsub event
        subscribe: {
            // 'event type': function(param) {},
        },
        // dom event
        dom: {
            // 'type': function(e, t) {},
            // 'type; delegate-selector': function(e, t) {},
            // 'type type2; delegate-selector': function(e, t) {},
        }
    }

    //----------
    // for React
    //
    // // if use reactro.template, render will be set automatically.
    // render: function() {
    //     console.log(this.name, 'render');
    // },

    // mixins: [],
    // statics: {},
    // propTypes: {},
    // getDefaultProps: function(){ return {} },
    getInitialState: function(){ return {} },
    // displayName: '',


    //------------------
    // Lifecycle Methods
    //
    // // ---------
    // // on mount
    // //
    // componentWillMount: function() {
    //     console.log(this.name, 'will mount');
    // },
    //
    // componentDidMount: function() {
    //     console.log(this.name, 'did mount');
    // },

    // //----------
    // // on update
    // //
    // componentWillReceiveProps: function(nextProps) {
    //     console.log(this.name, 'will receive props');
    // },
    //
    // shouldComponentUpdate: function(nextProps, nextState) {
    //     console.log(this.name, 'should component update');
    //     // default true
    //     return true;
    // },
    //
    // componentWillUpdate: function(nextProps, nextState) {
    //     console.log(this.name, 'will update');
    // },
    //
    // componentDidUpdate: function(prevProps, prevState) {
    //     console.log(this.name, 'did update');
    // },

    // //-----------
    // // on unmount
    // //
    // componentWillUnmount: function() {
    //   console.log(this.name, 'will unmount');
    // },

});
