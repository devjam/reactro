#!/usr/bin/env node
'use strict';

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _mkdirp = require('mkdirp');

var _mkdirp2 = _interopRequireDefault(_mkdirp);

var _readline = require('readline');

var _readline2 = _interopRequireDefault(_readline);

var _reactro = require('../reactro.json');

var _reactro2 = _interopRequireDefault(_reactro);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// $(npm bin)/reactro
// or
// npmbin(){[ $# -ne 0 ] && $(npm bin)/$*}
// npmbin(){[ $# -eq 0 ] && ls $(npm bin) || $(npm bin)/$*}
// npmbin(){[ $# -eq 0 ] && echo $(npm bin) && ls $(npm bin) || $(npm bin)/$*}
// npmbin reactro
// or
// npm i npmbin -g
// npmbin reactro

_readline2.default.createInterface(process.stdin, process.stdout);

var tmplDir = _path2.default.resolve(__dirname, '../tmpl');

var args = process.argv.slice(2);
var opts = {};
var _iteratorNormalCompletion = true;
var _didIteratorError = false;
var _iteratorError = undefined;

try {
  for (var _iterator = args[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
    var arg = _step.value;

    arg = arg.split('=');
    if (arg.length == 2) opts[arg[0]] = arg[1];else opts[arg[0]] = true;
  }

  // util
} catch (err) {
  _didIteratorError = true;
  _iteratorError = err;
} finally {
  try {
    if (!_iteratorNormalCompletion && _iterator.return) {
      _iterator.return();
    }
  } finally {
    if (_didIteratorError) {
      throw _iteratorError;
    }
  }
}

var spacer = function spacer(num) {
  var space = '';
  while (0 < num--) {
    space += ' ';
  }return space;
};

var error = function error(err) {
  console.log('Error:' + err + '\n');
  actions.help();
};

// command
var actions = {
  help: function help() {
    console.log('Usage: reactro [options]\n\nOptions:');
    var _iteratorNormalCompletion2 = true;
    var _didIteratorError2 = false;
    var _iteratorError2 = undefined;

    try {
      for (var _iterator2 = commands[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
        var command = _step2.value;

        command = command.slice(0, -1);
        var description = command.pop();
        var spase = spacer((command.length - 1) * 2);
        console.log('  ' + (command.join(', ') + spase + description));
      }
    } catch (err) {
      _didIteratorError2 = true;
      _iteratorError2 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion2 && _iterator2.return) {
          _iterator2.return();
        }
      } finally {
        if (_didIteratorError2) {
          throw _iteratorError2;
        }
      }
    }

    process.exit();
  },
  version: function version() {
    console.log(require('../package.json').version);
    process.exit();
  },
  create: function create() {
    if (!opts.name || opts.name == true) error('name is required with create command, see following help');
    var name = opts.name;
    var type = opts.root ? 'root' : 'sub';
    // let type = data.config.type
    // if(data.type.indexOf(opts.type) != -1)type = opts.type
    var script = _reactro2.default.config.script;
    if (_reactro2.default.script.indexOf(opts.script) != -1) script = opts.script;
    if (script == 'babel') {
      type += '.babel';
      script = 'js';
    }
    var template = _reactro2.default.config.template;
    if (_reactro2.default.template.indexOf(opts.template) != -1) template = opts.template;
    var css = _reactro2.default.config.css;
    if (_reactro2.default.css.indexOf(opts.css) != -1) css = opts.css;

    // console.log process.cwd(), name, type, script, template, css

    _mkdirp2.default.sync(name);
    _fs2.default.writeFileSync(name + '/index.' + script, _fs2.default.readFileSync(tmplDir + '/' + type + '.' + script));
    _fs2.default.writeFileSync(name + '/template.' + template, _fs2.default.readFileSync(tmplDir + '/template.' + template));
    _fs2.default.writeFileSync(name + '/style.' + css, _fs2.default.readFileSync(tmplDir + '/style.' + css));
    process.exit();
  },
  interactive: function interactive() {
    process.exit();
  },
  setting: function setting() {
    process.exit();

    // try
    //   packagejson from '../../../package.json'
    //   packagejson.scripts = {} if !packagejson.scripts
    //   packagejson.scripts.reactro = 'reactro'
    //   fs from 'fs'
    //   fs.writeFileSync '../../package.json', JSON.stringify packagejson, // ll, '  '
    //   console.log 'add scripts reactro to package.json'
    // catch err
    //   console.error err
  },
  show: function show() {
    switch (opts.show) {
      case 'config':
        console.log(_reactro2.default.config);
        break;
      case 'script':
        console.log(_reactro2.default.script);
        break;
      case 'template':
        console.log(_reactro2.default.template);
        break;
      case 'css':
        console.log(_reactro2.default.css);
        break;
      default:
        console.log(_reactro2.default);
    }
    process.exit();
  }
};

var commands = [['h', 'help', '        show help', actions.help], ['v', 'version', '     show version', actions.version], ['c', 'create', '      create component files, use with following options', actions.create], ['  name=*', '         component name required', function () {}],
// ['  type=*', '         component type [sub, root] default: sub', ()=>{}],
['  script=*', '       choose script type', function () {}], ['  template=*', '     choose template type', function () {}], ['  css=*', '          choose css type', function () {}], ['  root', '           use root type componet', function () {}],
// ['i', 'interactive', ' interactive create mode', actions.interactive],
// ['s', 'setting', '     interactive config setting mode', actions.setting],
['show', 'show=all', ' show all of data', actions.show], ['show=config', '      show config', actions.show], ['show=script', '      show script type list', actions.show], ['show=template', '    show template type list', actions.show], ['show=css', '         show css type list', actions.show]];

var _iteratorNormalCompletion3 = true;
var _didIteratorError3 = false;
var _iteratorError3 = undefined;

try {
  for (var _iterator3 = commands[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
    var command = _step3.value;
    var _iteratorNormalCompletion4 = true;
    var _didIteratorError4 = false;
    var _iteratorError4 = undefined;

    try {
      for (var _iterator4 = command.slice(0, -2)[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
        var key = _step4.value;

        if (opts[key]) command[command.length - 1]();
      }
    } catch (err) {
      _didIteratorError4 = true;
      _iteratorError4 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion4 && _iterator4.return) {
          _iterator4.return();
        }
      } finally {
        if (_didIteratorError4) {
          throw _iteratorError4;
        }
      }
    }
  }
} catch (err) {
  _didIteratorError3 = true;
  _iteratorError3 = err;
} finally {
  try {
    if (!_iteratorNormalCompletion3 && _iterator3.return) {
      _iterator3.return();
    }
  } finally {
    if (_didIteratorError3) {
      throw _iteratorError3;
    }
  }
}

if (args.length) error('option error, see following help');else actions.help();