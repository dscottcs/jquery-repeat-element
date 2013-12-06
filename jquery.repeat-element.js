/*
 * jQuery Repeat Element Plugin v0.0.2
 * https://github.com/dscottcs/jquery-repeat-element
 *
 * This document is licensed as free software under the terms of the
 * MIT License: http://www.opensource.org/licenses/mit-license.php
 *
 * Copyright (c) 2013 by dscottcs (David Scott).
 */

(function($){
  var version = 'jQuery.repeat-element 0.0.2';

  // By default we bind data based on class names on subelements of the repeated element
  // More sophisticated bindings (including form element binding) will require a custom bindFn

  var defaultBind = function(el, dataObj) {
    $.each(dataObj, function(key, value) {
      var subEl = el.find('.' + key);
      if (subEl) {
        subEl.text(value);
      }
    });
  };

  // Generate repeats, bind data

  var bindToData = function(jq, bindData, bindFn, idAttr) {
    if (bindData.length == 0) {
      return;
    }
    // Pull proto from jq object cache;
    var proto = jq.data('proto');
    var protoClass = proto.attr('id');
    // Get rid of repeats from previous execution if any
    jq.empty();
    // If there are more than one object, add repeats and bind them
    $.each(bindData, function(index, dataObj) {
      var id = dataObj[idAttr];
      var copy = proto.clone();
      copy.attr('id', protoClass + '_' + id);
      copy.addClass(protoClass);
      jq.append(copy);
      bindFn(copy, dataObj);
    });
  };

  // Generate repeats, provide unique ID for each, do not bind any data

  var generateRaw = function(jq, rawNum) {
    // Pull proto from jq object cache;
    var proto = jq.data('proto');
    var protoClass = proto.attr('id');
    // Get rid of repeats from previous execution, if any
    jq.empty();
    // If we need repeats add them and set their IDs
    for (var i = 0; i < rawNum; i++) {
      var copy = proto.clone();
      copy.attr('id', protoClass + '_' + i);
      copy.addClass(protoClass);
      jq.append(copy);
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

    var bindData = opts.bindData;
    var raw = opts.raw;
    if (bindData === undefined && raw === undefined) {
      throw '"bindData" object or numeric "raw" value required';
    }
    if (raw && ((! $.isNumeric(raw)) || (raw < 0))) {
      throw '"raw" option must be a nonnegative integer';
    }
    if (raw === undefined && ! $.isArray(bindData)) {
      throw '"bindData" option must be a list'
    }
    // If object has been used before, the prototype will be cached in the 'data' hash
    // Otherwise we clone the prototype subelement and cache it
    var proto = this.data('proto');
    if (! proto) {
      var kids = this.children();
      if (! kids) {
        throw 'Element must include a prototype for repeat';
      }
      var firstChild = kids.first();
      this.data('proto', firstChild.clone());
    }

    // Use the 'idAttr' option value as ID if present, otherwise 'id'
    var idAttr = (!!opts.idAttr) ? opts.idAttr : 'id';

    // 'repeat' phase: bind to a data array or generate raw, as befits
    if ($.isArray(bindData)) {
      var bindFn = ('function' == typeof opts.bindFn) ? opts.bindFn : defaultBind;
      bindToData(this, bindData, bindFn, idAttr);
    }
    else {
      generateRaw(this, raw);
    }

    // That's it
    return this;
  }
})(jQuery);
