import { Turbo } from '@hotwired/turbo-rails'
import './channels'
import './controllers'
require('@rails/activestorage').start()
window.Turbo = Turbo

import * as ace from 'ace-builds/src-noconflict/ace';
import "@fortawesome/fontawesome-free/js/all"
import "@hotwired/turbo-rails"
import Rails from "rails-ujs"
import jquery from 'jquery'
window.jQuery = jquery
window.$ = jquery

require('./assembly_z80')
// require('ace-builds/src-noconflict/theme-monokai')
// require('ace-builds')

import('./jvgsc')
// require('./jsspeccy/jsspeccy')
import { saveAs } from 'file-saver'

Rails.start()
// ActiveStorage.start()
// let emu = JSSpeccy(document.getElementById('jsspeccy'), { zoom: 2, machine: 48 })
// emu.openFileDialog();

// var editor = ace.edit("textarea");
// editor.setTheme("ace/theme/monokai");
// editor.session.setMode("ace/mode/assembly_x86");
// editor.setOptions({
//     autoScrollEditorIntoView: true,
//     copyWithEmptySelection: true,
// });
//
// ace.edit("textarea", {
//   mode: "ace-builds/src/assembly_x86",
//   theme: "ace-builds/src/monokai",
//   maxLines: 50,
//   minLines: 20,
//   fontSize: 12,
//   autoScrollEditorIntoView: true,
//   copyWithEmptySelection: true
// });
