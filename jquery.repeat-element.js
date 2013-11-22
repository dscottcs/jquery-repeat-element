/*
 * jQuery Repeat Element Plugin v0.0.1
 * https://github.com/dscottcs/jquery-repeat-element
 *
 * This document is licensed as free software under the terms of the
 * MIT License: http://www.opensource.org/licenses/mit-license.php
 *
 * Copyright (c) 2013 by dscottcs (David Scott).
 */

(function($){
  var version = 'jQuery.repeat-element 0.0.1';

  // By default we bind data to the innerText attribute of the element
  // More sophisticated bindings (including form element binding) will require a custom bindFun

  var defaultBind = function(element, dataObj) {
    var el = $(element);
    $.each(dataObj, function(key, value) {
      var subEl = el.find('.' + key);
      if (subEl) {
        subEl.text(value);
      }
    });
  };

  // Generate repeats, bind data

  var bindToData = function(data, proto, bindFunc, idAttr) {
    var protoClass = proto.attr('class') || 'repeat';
    var parent = proto.parent();
    parent.empty();
    $.each(data, function(index, dataObj) {
      var id = dataObj[idAttr];
      var copy = proto.clone();
      copy.attr('id', protoClass + '_' + id);
      parent.append(copy);
      bindFunc(copy, dataObj);
    })
  };

  // Generate repeats, provide unique ID for each, do not bind any data

  var generateRaw = function(rawNum, proto) {
    var protoClass = proto.attr('class') || 'repeat';
    var parent = proto.parent();
    parent.empty();
    for (var i = 0; i < rawNum; i++) {
      var copy = proto.clone();
      copy.attr('id', protoClass + '_' + i);
      parent.append(copy);
    }
  };

  $.fn.repeatElement = function(opts) {

    // Repeat can occur in one of two ways: by binding a list of data objects
    // (one repeated element per data object) or in 'raw' mode, where the
    // elements are simply repeated and no data binding takes place.
    //
    // 'data' option, if present,  must be a list of data objects.
    // By default, each object is ID'd by its 'id' attribute.
    // This can be changed using the idAttr option.
    //
    // 'raw' option, if present must be a nonnegative integer.
    //
    // If both 'data' and 'raw' are defined, 'raw' is ignored.

    var data = opts.data;
    var raw = opts.raw;
    if (data === undefined && raw === undefined) {
      throw '"data" object or numeric "raw" value required';
    }
    if (raw && ((! $.isNumeric(raw)) || (raw < 0))) {
      throw '"raw" option must be a nonnegative integer';
    }
    if (raw === undefined && ! $.isArray(data)) {
      throw '"data" option must be a list'
    }
    var protoClass = this.attr('class');
    if (protoClass && protoClass.indexOf(' ') > -1) {
      throw 'Prototype object must have only one class name';
    }

    var idAttr = (!!opts.idAttr) ? opts.idAttr : 'id';

    // A bit of jQuery wizardry here: we remove the prototype from the parent
    // and insert a bunch of clones (optionally bound to data).
    // But 'this' points to the prototype that goes away when we do the generation/data binding
    // So we keep a reference to the prototype's parent before doing the transformation.
    // The parent is always well defined, and is what we're most interested in anyway
    // The return value becomes the set of repeated elements (the parent's children).

    var parent = this.parent();
    if ($.isArray(data)) {
      var bindFunc = ('function' == typeof opts.bindFunc) ? opts.bindFund : defaultBind;
      bindToData(data, this, bindFunc, idAttr);
    }
    else {
      generateRaw(raw, this);
    }

    var repeated = parent.find('.' + protoClass);
    return repeated;
  }
})(jQuery);
