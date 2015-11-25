`#!/usr/bin/env node
`
# $(npm bin)/reactro
# or
# npmbin(){[ $# -ne 0 ] && $(npm bin)/$*}
# npmbin(){[ $# -eq 0 ] && ls $(npm bin) || $(npm bin)/$*}
# npmbin(){[ $# -eq 0 ] && echo $(npm bin) && ls $(npm bin) || $(npm bin)/$*}
# npmbin reactro
# or
# npm i npmbin -g
# npmbin reactro

fs = require 'fs'
path = require 'path'
mkdirp = require 'mkdirp'
rl = require 'readline'
  .createInterface process.stdin, process.stdout

data = require '../reactro.json'
tmplDir = path.resolve __dirname, '../tmpl'

args = process.argv.slice 2
opts = {}
for arg in args
  arg = arg.split '='
  if arg.length == 2
    opts[arg[0]] = arg[1]
  else
    opts[arg[0]] = true

# util
spacer = (num)->
  space = ''
  for [0...num]
    space += ' '
  space

error = (err)->
  console.log 'Error: ' + err + '\n'
  actions.help()

# command
actions =
  help: ->
    console.log 'Usage: reactro [options]\n\nOptions:'
    for command in commands
      command = command.slice 0, -1
      description = command.pop()
      spase = spacer (command.length - 1) * 2
      console.log '  ' + command.join(', ') + spase + description
    process.exit()

  version: ->
    console.log require('../package.json').version
    process.exit()

  create: ->
    if !opts.name || opts.name == true
      error 'name is required with create command, see following help'
    name = opts.name
    type = if opts.root then 'root' else 'sub'
        # type = data.config.type
        # type = opts.type if -1 != data.type.indexOf opts.type
    script = data.config.script
    script = opts.script if -1 != data.script.indexOf opts.script
    template = data.config.template
    template = opts.template if -1 != data.template.indexOf opts.template

    # console.log process.cwd(), name, type, script, template

    mkdirp.sync name
    fs.writeFileSync name + '/index.' + script, fs.readFileSync tmplDir + '/' + type + '.' + script
    fs.writeFileSync name + '/template.' + template, fs.readFileSync tmplDir + '/template.' + template

    process.exit()

  interactive: ->
    process.exit()

  setting: ->
    process.exit()

    # try
    #   packagejson = require '../../../package.json'
    #   packagejson.scripts = {} if !packagejson.scripts
    #   packagejson.scripts.reactro = 'reactro'
    #   fs = require 'fs'
    #   fs.writeFileSync '../../package.json', JSON.stringify packagejson, null, '  '
    #   console.log 'add scripts reactro to package.json'
    # catch err
    #   console.error err

  show: ->
    switch opts.show
      when 'config'
        console.log data.config
      when 'script'
        console.log data.script
      when 'template'
        console.log data.template
      else
        console.log data
    process.exit()


commands = [
  ['h', 'help', '        show help', actions.help]
  ['v', 'version', '     show version', actions.version]
  ['c', 'create', '      create component files, use with following options', actions.create]
  ['  name=*', '         component name required', ->]
  # ['  type=*', '         component type [sub, root] default: sub', ->]
  ['  script=*', '       use script type from script list', ->]
  ['  template=*', '     use template engine type from template engine list', ->]
  ['  root', '           use root type componet', ->]
  # ['i', 'interactive', ' interactive create mode', actions.interactive]
  # ['s', 'setting', '     interactive config setting mode', actions.setting]
  ['show', 'show=all', ' show all of data', actions.show]
  ['show=config', '      show config', actions.show]
  ['show=script', '      show script list', actions.show]
  ['show=template', '    show template engine list', actions.show]
]

for command in commands
  for key in command.slice 0, -2
    command[command.length - 1]() if opts[key]

if args.length
  error 'option error, see following help'
else
  actions.help()


# opts = require "opts"
#
# app =
#     stack: {}
#     keys: ["name", "email", "age"]
#     state: 0
#     target: null
#
#     question: (answer)->
#         if answer != undefined
#             @stack[@keys[@state]] = answer
#             @state += 1
#
#         if !@keys[@state]
#             @save()
#             rl.close()
#             return
#
#         rl.question(
#             @keys[@state] + " : "
#             @question.bind this
#         )
#
#     save : ->
#         if @target
#             fs.writeFile @target, JSON.stringify @stack
#         else
#             console.log @stack
#
# opts.parse [
#     short : "t"
#     long : "target"
#     description : "file to save"
#     value : true
#     callback : (value)->
#         app.target = value
# ]
#
# app.question()
