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

const Gio = imports.gi.Gio;
const { GObject, St } = imports.gi;

const Lang = imports.lang;

const PanelMenu = imports.ui.panelMenu;
const PopupMenu = imports.ui.popupMenu;
const Slider    = imports.ui.slider;

const ExtensionUtils = imports.misc.extensionUtils;
const Me             = ExtensionUtils.getCurrentExtension();

const ShaderList     = Me.imports.shaderList;



var ShaderMenu = GObject.registerClass({ GTypeName: 'ShaderMenu' },
class ShaderMenu extends PanelMenu.Button {

  constructor(shaderModifier) {
    super(0.0, "ShaderMenu");
    this._shaderModifier = shaderModifier;
    this._shaderLister = new ShaderList.ShaderList();
    this._initDefaultLogo();
    this._createMenu();
  }

  _initDefaultLogo() {
    let gicon = Gio.icon_new_for_string(Me.path + "/" + "logo.png");
    this._logo = new St.Icon({ gicon: gicon});
    this.actor.add_actor(this._logo);
  }

  _createMenu() {
    this.menu.addMenuItem(new PopupMenu.PopupSeparatorMenuItem());
    this._addShaderList();
    this._addSeparator();
  }

  _addSeparator() {
    let item = new PopupMenu.PopupSeparatorMenuItem('');
    this.menu.addMenuItem(item);
  }

  _addShaderList(config, output) {
    let  item = new PopupMenu.PopupMenuItem(_("Shader menu"));
    item.label.add_style_class_name('display-subtitle');
    item.actor.reactive = false;
    item.actor.can_focus = false;
    this.menu.addMenuItem(item);
    this._callbacks = [];
    let shaderList = this._shaderLister.getShaderList();
    for ( var i = 0; i <  shaderList.length; i++) {
      let shader  =  shaderList[i];
      let item = new PopupMenu.PopupMenuItem(shader.name);

      this._callbacks.push( function() {
        this._shaderModifier._changeShader(shader);
        this._removeSlider()
        if (this._shaderModifier.hasSlider()) this._addSlider();
        this._sliderChanged(this._slider, 0.5);
        this._slider.value = 0.5;
      });
      item.connect('activate', Lang.bind(this, this._callbacks[i]));
      this.menu.addMenuItem(item);
    }
  }

  _addSlider() {
    this._item = new PopupMenu.PopupBaseMenuItem({ activate: false });
    this.menu.addMenuItem(this._item);

    this._slider = new Slider.Slider(.5);
    this._slider.connect('notify::value', Lang.bind(this, this._sliderChanged));
    this._slider.can_focus = false;
    this._slider.value = 0.5;
    this._sliderChanged(this._slider, this._slider._value);

    let icon = new St.Icon({ icon_name: 'view-refresh',
                             style_class: 'popup-menu-icon' });
    this._item.actor.add(icon);
    this._item.actor.add(this._slider.actor);
  }

  _removeSlider() {
    if (this._item) {
      this._item.destroy();
      delete this._item;
    }
  }

  _clamp(num, min, max) {
    return num < min ? min : num > max ? max : num;
  }

  _sliderChanged(slider) {
    //clamp fixing issue with cogl
    this._shaderModifier.updateSliderValue(this._clamp(slider.value, 0.001, 0.999));
  }
});
