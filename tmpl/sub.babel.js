import reactro from 'reactro'
import template from './template'
import style from './style'

export default reactro.createSubComponent({
    //------------
    // for Reactro
    //
    name: '',

    template: template,// template.locals({}),
    // templateData: {},

    style: style,

    events: {
        // dom event
        // 'type': function(e, t) {},
        // 'type; delegate-selector': function(e, t) {},
        // 'type type2; delegate-selector': function(e, t) {},
        // 'type'(e, t) {},
        // 'type; delegate-selector'(e, t) {},
    },

    //----------
    // for React
    //
    // // if use reactro.template, render will be set automatically.
    // render() {
    //     console.log(this.name, 'render')
    // },

    // mixins: [],
    // statics: {},
    // propTypes: {},
    // getDefaultProps(){ return {} },
    // // getInitialState(){ return {} }, // don't have state data in sub component.
    // displayName: '',


    //------------------
    // Lifecycle Methods
    //
    // //---------
    // // on mount
    // //
    // componentWillMount() {
    //     console.log(this.name, 'will mount')
    // },
    //
    // componentDidMount() {
    //     console.log(this.name, 'did mount')
    // },

    // //----------
    // // on update
    // //
    // componentWillReceiveProps(nextProps) {
    //     console.log(this.name, 'will receive props')
    // },
    //
    // shouldComponentUpdate(nextProps, nextState) {
    //     console.log(this.name, 'should component update')
    //     // default true
    //     return true
    // },
    //
    // componentWillUpdate(nextProps, nextState) {
    //     console.log(this.name, 'will update')
    // },
    //
    // componentDidUpdate(prevProps, prevState) {
    //     console.log(this.name, 'did update')
    // },

    // //-----------
    // // on unmount
    // //
    // componentWillUnmount() {
    //   console.log(this.name, 'will unmount')
    // },

})
