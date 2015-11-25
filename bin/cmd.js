#!/usr/bin/env node
;
var actions, arg, args, command, commands, data, error, fs, i, j, k, key, len, len1, len2, mkdirp, opts, path, ref, rl, spacer, tmplDir;

fs = require('fs');

path = require('path');

mkdirp = require('mkdirp');

rl = require('readline').createInterface(process.stdin, process.stdout);

data = require('../reactro.json');

tmplDir = path.resolve(__dirname, '../tmpl');

args = process.argv.slice(2);

opts = {};

for (i = 0, len = args.length; i < len; i++) {
  arg = args[i];
  arg = arg.split('=');
  if (arg.length === 2) {
    opts[arg[0]] = arg[1];
  } else {
    opts[arg[0]] = true;
  }
}

spacer = function(num) {
  var j, ref, space;
  space = '';
  for (j = 0, ref = num; 0 <= ref ? j < ref : j > ref; 0 <= ref ? j++ : j--) {
    space += ' ';
  }
  return space;
};

error = function(err) {
  console.log('Error: ' + err + '\n');
  return actions.help();
};

actions = {
  help: function() {
    var command, description, j, len1, spase;
    console.log('Usage: reactro [options]\n\nOptions:');
    for (j = 0, len1 = commands.length; j < len1; j++) {
      command = commands[j];
      command = command.slice(0, -1);
      description = command.pop();
      spase = spacer((command.length - 1) * 2);
      console.log('  ' + command.join(', ') + spase + description);
    }
    return process.exit();
  },
  version: function() {
    console.log(require('../package.json').version);
    return process.exit();
  },
  create: function() {
    var css, name, script, template, type;
    if (!opts.name || opts.name === true) {
      error('name is required with create command, see following help');
    }
    name = opts.name;
    type = opts.root ? 'root' : 'sub';
    script = data.config.script;
    if (-1 !== data.script.indexOf(opts.script)) {
      script = opts.script;
    }
    template = data.config.template;
    if (-1 !== data.template.indexOf(opts.template)) {
      template = opts.template;
    }
    css = data.config.css;
    if (-1 !== data.css.indexOf(opts.css)) {
      css = opts.css;
    }
    mkdirp.sync(name);
    fs.writeFileSync(name + '/index.' + script, fs.readFileSync(tmplDir + '/' + type + '.' + script));
    fs.writeFileSync(name + '/template.' + template, fs.readFileSync(tmplDir + '/template.' + template));
    fs.writeFileSync(name + '/style.' + css, fs.readFileSync(tmplDir + '/style.' + css));
    return process.exit();
  },
  interactive: function() {
    return process.exit();
  },
  setting: function() {
    return process.exit();
  },
  show: function() {
    switch (opts.show) {
      case 'config':
        console.log(data.config);
        break;
      case 'script':
        console.log(data.script);
        break;
      case 'template':
        console.log(data.template);
        break;
      case 'css':
        console.log(data.css);
        break;
      default:
        console.log(data);
    }
    return process.exit();
  }
};

commands = [['h', 'help', '        show help', actions.help], ['v', 'version', '     show version', actions.version], ['c', 'create', '      create component files, use with following options', actions.create], ['  name=*', '         component name required', function() {}], ['  script=*', '       choose script type', function() {}], ['  template=*', '     choose template type', function() {}], ['  css=*', '          choose css type', function() {}], ['  root', '           use root type componet', function() {}], ['show', 'show=all', ' show all of data', actions.show], ['show=config', '      show config', actions.show], ['show=script', '      show script type list', actions.show], ['show=template', '    show template type list', actions.show], ['show=css', '         show css type list', actions.show]];

for (j = 0, len1 = commands.length; j < len1; j++) {
  command = commands[j];
  ref = command.slice(0, -2);
  for (k = 0, len2 = ref.length; k < len2; k++) {
    key = ref[k];
    if (opts[key]) {
      command[command.length - 1]();
    }
  }
}

if (args.length) {
  error('option error, see following help');
} else {
  actions.help();
}
