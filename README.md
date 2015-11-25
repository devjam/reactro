# reactro
react wrapper.  
<!--[sample source](http://)-->

## Install
```sh
npm i reactro -D
```

## Usage

app.js (will compile by browserify)
```js
var reactro = require('reactro');
var rootComponent = reactro.createRootComponent({
  template: require './template',
  templateData: {
    hello: 'Hello',
    SubComponent: reactro.createSubComponent({
      template: require './sub_template'
    })
  }
});
reactro.render('#container', rootComponent);
```

template.rjade (use react-jadeify)
```jade
.hello= hello
SubComponent(world="world")
```

sub_template.rjade (use react-jadeify)
```jade
.world= props.world
```

index.html
```html
<!DOCTYPE html>
<html>
  <body>
    <div id="container"></div>
    <script src="app.js"></script>
  </body>
</html>
```

### Methods

#### createRootComponent(opts)
React.createClass wrapper.  
return root component object.

##### opts
can use React.createClass opts.

###### name
if doesn't set displayName, overwite displayName.  
will use for namespace.

###### template
set React.createElement

###### templateData
can set data for template resource.  
props and root state will be set automatically.  
so can't use props and state keyword.

###### events
can add DOM events and pubsub events.
```js
{
    events: {
        // pubsub event
        subscribe: {
            'event type': function(param){}
        },
        // dom event
        dom: {
            'type; delegate-selector': function(e){},
            'type type2; delegate-selector': function(e){}
        }
    }
}
```

#### createSubComponent(opts)
React.createClass wrapper.  
return sub component object.

##### opts
can use React.createClass opts.

###### name
same as createRootComponent.

###### template
same as createRootComponent.

###### templateData
same as createRootComponent.

###### events
almost same as createRootComponent.  
but can add only DOM events and can omit `dom` keyword.

```js
{
    events: {
        'type; delegate-selector': function(e){},
        'type type2; delegate-selector': function(e){}
    }
}
```

#### render(selector, component, props)
ReactDom.render wrapper.  
render component into DOM element selected by selector.  
component will be converted to element with props.

### Component Object

#### Methods

##### publish(eventType[, params...])
publish event to root component's subscriber.

##### pub(eventType[, params...])
publish ailas.

##### find(ref)
get dom element by ref.  
if you don't use ref like `find()`, component dom element is returned.

##### $find(ref)
get ref element jquery object.

##### getState()
get root state object.

#### Properties
of course can use returned React.createClass's properties.
##### templateData
can change template resources.  
but can't use props and state keyword.

### Generate Component Files
use `reactro` command or copy `tmpl` directory.

#### Prepear
you can choose way of calling local command below.

##### Use `npm bin`
```sh
$(npm bin)/reactro
```

#### Use shell function
```sh
# add below code to .*rc(.zshrc etc.)
npmbin(){[ $# -ne 0 ] && $(npm bin)/$*}
```

```sh
npmbin reactro
```

#### Use `npmbin` Node Module
```sh
npm i npmbin -g
```
```sh
npmbin reactro
```

#### Generate Root Component
```sh
cd /path/to/put/component/dir
npmbin reactro create name=component_name root
```
generated files into `/path/to/put/component/dir/component_name`


#### Generate Base Component
```sh
cd /path/to/put/component/dir
npmbin reactro create name=component_name
```
generated files into `/path/to/put/component/dir/component_name`
