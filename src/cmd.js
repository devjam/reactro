#!/usr/bin/env node

// $(npm bin)/reactro
// or
// npmbin(){[ $# -ne 0 ] && $(npm bin)/$*}
// npmbin(){[ $# -eq 0 ] && ls $(npm bin) || $(npm bin)/$*}
// npmbin(){[ $# -eq 0 ] && echo $(npm bin) && ls $(npm bin) || $(npm bin)/$*}
// npmbin reactro
// or
// npm i npmbin -g
// npmbin reactro

import fs from 'fs'
import path from 'path'
import mkdirp from 'mkdirp'
import rl from 'readline'
rl.createInterface(process.stdin, process.stdout)

import data from '../reactro.json'
const tmplDir = path.resolve(__dirname, '../tmpl')

const args = process.argv.slice(2)
const opts = {}
for(let arg of args) {
  arg = arg.split('=')
  if(arg.length == 2)
    opts[arg[0]] = arg[1]
  else
    opts[arg[0]] = true
}

// util
const spacer = (num)=> {
  let space = ''
  while(0 < num--) space += ' '
  return space
}

const error = (err)=> {
  console.log(`Error:${err}\n`)
  actions.help()
}

// command
const actions = {
  help() {
    console.log('Usage: reactro [options]\n\nOptions:')
    for(let command of commands){
      command = command.slice(0, -1)
      const description = command.pop()
      const spase = spacer((command.length - 1) * 2)
      console.log(`  ${command.join(', ') + spase + description}`)
    }
    process.exit()
  },

  version() {
    console.log(require('../package.json').version)
    process.exit()
  },

  create() {
    if(!opts.name || opts.name == true)
      error('name is required with create command, see following help')
    const name = opts.name
    let type = opts.root ? 'root' : 'sub'
    // let type = data.config.type
    // if(data.type.indexOf(opts.type) != -1)type = opts.type
    let script = data.config.script
    if(data.script.indexOf(opts.script) != -1) script = opts.script
    if(script == 'babel'){
      type += '.babel'
      script = 'js'
    }
    let template = data.config.template
    if(data.template.indexOf(opts.template) != -1) template = opts.template
    let css = data.config.css
    if(data.css.indexOf(opts.css) != -1) css = opts.css

    // console.log process.cwd(), name, type, script, template, css

    mkdirp.sync(name)
    fs.writeFileSync(`${name}/index.${script}`, fs.readFileSync(`${tmplDir}/${type}.${script}`))
    fs.writeFileSync(`${name}/template.${template}`, fs.readFileSync(`${tmplDir}/template.${template}`))
    fs.writeFileSync(`${name}/style.${css}`, fs.readFileSync(`${tmplDir}/style.${css}`))
    process.exit()
  },

  interactive() {
    process.exit()
  },

  setting() {
    process.exit()

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

  show() {
    switch (opts.show) {
      case 'config':
        console.log(data.config)
        break
      case 'script':
        console.log(data.script)
        break
      case 'template':
        console.log(data.template)
        break
      case 'css':
        console.log(data.css)
        break
      default:
        console.log(data)
    }
    process.exit()
  },
}

const commands = [
  ['h', 'help', '        show help', actions.help],
  ['v', 'version', '     show version', actions.version],
  ['c', 'create', '      create component files, use with following options', actions.create],
  ['  name=*', '         component name required', ()=>{}],
  // ['  type=*', '         component type [sub, root] default: sub', ()=>{}],
  ['  script=*', '       choose script type', ()=>{}],
  ['  template=*', '     choose template type', ()=>{}],
  ['  css=*', '          choose css type', ()=>{}],
  ['  root', '           use root type componet', ()=>{}],
  // ['i', 'interactive', ' interactive create mode', actions.interactive],
  // ['s', 'setting', '     interactive config setting mode', actions.setting],
  ['show', 'show=all', ' show all of data', actions.show],
  ['show=config', '      show config', actions.show],
  ['show=script', '      show script type list', actions.show],
  ['show=template', '    show template type list', actions.show],
  ['show=css', '         show css type list', actions.show],
]

for(let command of commands)
  for(let key of command.slice(0, -2))
    if(opts[key]) command[command.length - 1]()

if(args.length)
  error('option error, see following help')
else
  actions.help()
