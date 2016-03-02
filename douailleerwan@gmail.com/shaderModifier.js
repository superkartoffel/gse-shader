//  GNOME Shell Extension Shader
//  Copyright (C) 2016 douaille
//
//  This program is free software: you can redistribute it and/or modify
//  it under the terms of the GNU General Public License as published by
//  the Free Software Foundation, either version 3 of the License, or
//  (at your option) any later version.
//
//  This program is distributed in the hope that it will be useful,
//  but WITHOUT ANY WARRANTY; without even the implied warranty of
//  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
//  GNU General Public License for more details.
//
//  You should have received a copy of the GNU General Public License
//  along with this program.  If not, see <https://www.gnu.org/licenses/>.
//
//  Douaille Erwan <douailleerwan@gmail.com>

const Shell   = imports.gi.Shell;
const Clutter = imports.gi.Clutter;
const GLib    = imports.gi.GLib;
const Config = imports.misc.config;

const Lang = imports.lang;

const ExtensionUtils = imports.misc.extensionUtils;
const Me             = ExtensionUtils.getCurrentExtension();

const ShaderModifier = new Lang.Class({
  Name : 'ShaderModifier',

  _init : function(actor) {
    this._actor = actor;
    this._currentShader = {name : "default", fileName : "default.frag" } ;
    this._sliderValue = 0.0;
    this._date = new GLib.DateTime();
    this._applyCurrentShader();
  },

  _changeShader : function(shaderItem) {
    this._removeShader();
    this._currentShader = shaderItem;
    this._applyCurrentShader();
  },

  _applyCurrentShader : function() {
      try {
        this._shaderSource = Shell.get_file_contents_utf8_sync(Me.path + "/" + this._currentShader.fileName);
      } catch (e) {
        this._shaderSourcer = null;
      }

      if(this._actor) {
        if (!this._actor.get_effect('shader')) {
          // Shader Effect
          this._fx = new Clutter.ShaderEffect({
            shader_type: Clutter.ShaderType.FRAGMENT_SHADER });
          this._fx.set_shader_source(this._shaderSource);
          this._fx.set_uniform_value('height', this._actor.get_height());
          this._fx.set_uniform_value('width', this._actor.get_width());
          this._fx.set_uniform_value('slider', this._sliderValue);
          this._actor.add_effect_with_name('shader',  this._fx);

          this._timeline = new Clutter.Timeline({ duration: 1, repeat_count: -1 });
          this._timeline.connect('new-frame', Lang.bind(this, this._newFrame));
          this._timeline.start();
        }
      }
  },

  _newFrame: function() {
    this._fx.set_uniform_value('height', this._actor.get_height());
    this._fx.set_uniform_value('width', this._actor.get_width());
    this._fx.set_uniform_value('mouseX',global.get_pointer()[0]);
    this._fx.set_uniform_value('mouseY',global.get_pointer()[1]);
    this._fx.set_uniform_value('globalTime', (new GLib.DateTime()).get_seconds());
    this._fx.set_uniform_value('slider', this._sliderValue);
    this._actor.scale_y = 1.0;
  },

  _removeShader : function() {
    this._removeShaderNamed('shader');
  },

  _removeShaderNamed : function(aShaderName) {
    this._actor.remove_effect_by_name(aShaderName);
  },

  updateSliderValue : function(value) {
    this._sliderValue = value;
  }
});
