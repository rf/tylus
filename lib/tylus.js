/* Class: T
 * Main tylus namespace.
 */
var T = (function () {
   var exports = {},
       styles = {},
       device = Ti.Platform.osname,
       density = Ti.Platform.density,
       ctorMap,
       debugMode = false,
       _;

   // try to require underscore
   try { _ = require('vendor/underscore'); } catch (e) {}
   try { _ = require('underscore'); } catch (e) {}
   try { _ = require('../underscore'); } catch (e) {}
   try { _ = require('../../underscore'); } catch (e) {}

   // map nice names to ugly titanium factory names
   ctorMap = {
      Matrix2D    : 'create2DMatrix',
      Matrix3D    : 'create3DMatrix',
      Indicator   : 'createActivityIndicator',
      AlertDialog : 'createAlertDialog',
      Animation   : 'createAnimation',
      Button      : 'createButton',
      ButtonBar   : 'createButtonBar',
      CoverFlow   : 'createCoverFlow',
      DashItem    : 'createDashboardItem',
      Dash        : 'createDashboardView',
      EmailDialog : 'createEmailDialog',
      Image       : 'createImageView',
      OptionDialog: 'createOptionDialog',
      Label       : 'createLabel',
      Picker      : 'createPicker',
      PickerRow   : 'createPickerRow',
      PickerCol   : 'createPickerCol',
      ProgressBar : 'createProgressBar',
      Scroll      : 'createScrollView',
      Scrollable  : 'createScrollableView',
      SearchBar   : 'createSearchBar',
      Slider      : 'createSlider',
      Switch      : 'createSwitch',
      Tab         : 'createTab', 
      TabGroup    : 'createTabGroup',
      TabbedBar   : 'createTabbedBar',
      Table       : 'createTableView',
      TableRow    : 'createTableViewRow',
      TableSection: 'createTableViewSection',
      TextArea    : 'createTextArea',
      TextField   : 'createTextField',
      Toolbar     : 'createToolbar',
      View        : 'createView',
      Web         : 'createWebView',
      Window      : 'createWindow'
   };

   /* Function: combineSelectors
    * Combines selectors into a string to use for searching with getProps
    *
    * Parameters:
    *    type     - *string* type of the item, such as Label, DashItem, Window,
    *               etc
    *    args     - *object* with id, className, classes, or classNames
    *               properties which will be used to resolve to styles
    *
    * Returns:
    *    *array* of selectors to be searched in the style tree
    */   

   function combineSelectors (type, args) {
      var out = [], c;
      out.push(type);
      if (args.id) {
         out.push('#' + args.id);
      }
      if (args.className) {
         out.push('.' + args.className);
      }
      if (c = args.classes || args.classNames) {
         c.forEach(function (value) {
            out.push('.' + value);
         });
      }
      return out;
   }

   /* Function: extend
    * Extends an object with the properties of another.  
    *
    * Parameters:
    *    to    - *object* to put properties into
    *    from  - *object* to take properties from
    */

   function extend (to, from) {
      var item;
      for (item in from) {
         if (from.hasOwnProperty(item)) {
            if (typeof from[item] === 'object' && from[item] !== null) {
               to[item] = to[item] || {}; 
               extend(to[item], from[item]); // recurse
            } else {
               to[item] = from[item];
            }   
         }         
      }
   }    

   /* Function: weakExtend
    * Extends an object with the properties of another.  Does not recurse,
    * which is important because recursing into Titanium proxies will break
    * those proxies.
    *
    * Parameters:
    *    to    - *object* to put properties into
    *    from  - *object* to take properties from
    */

   function weakExtend (to, from) {
      var item;
      for (item in from) {
         if (from.hasOwnProperty(item)) {
            to[item] = from[item];
         }
      }
   }

   /* Function: wrapEmitter
    * Wraps an emitter with alternative names for event functions. In debug
    * mode
    *
    * Parameters:
    *    emitter  - *object* the emitter to wrap.  This parameter will be
    *               modified.
    */

   function wrapEmitter (emitter) {
      // if we're in debug mode we'll wrap event handlers with a try/catch.

      if (debugMode) {
         alert('wrapping emitte rlike an idiot');
         emitter.on = function (event, handler) {
            var wrapper = function (ev) {
               try {
                  handler(ev);
               } catch (e) {
                  e['function'] = handler.name || 'anonymous function';
                  var str = JSON.stringify(e, null, 4);
                  alert(str);
                  Ti.API.log(str);
               }
            };

            // we have to remember which handlers map to which wrappers.
            // can't just use a hash because we can't index the hash with a
            // function.

            emitter.__registry = emitter.__registry || [];
            emitter.__registry.push({wrapper: wrapper, handler: handler});
            emitter.addEventListener(event, wrapper);
         };

         emitter.off = function (event, handler) {
            var item;
            emitter.__registry.forEach(function (item) {
               if (handler === item.handler) {
                  emitter.removeEventListener(item.wrapper);
               }
            });
            emitter.removeEventListener(item.wrapper);
         };
      } 

      else {
         emitter.on = function (event, handler) {
            emitter.addEventListener(event, handler);
         };

         emitter.off = emitter.removeListener = function (name, handler) {
            emitter.removeEventListener(name, handler);
         };
      }

      // emitter.fire = emitter.removeEventListner doesnt work, I've tried it
      emitter.fire = emitter.emit = function (name, data) {
         emitter.fireEvent(name, data);
      };

      return emitter;
   }

   /* Function: getProps
    * Gets the properties for a given type and argument string.  If args.style
    * is specified, uses that for the search (should look like
    * '#id .class1 .class2'.  If args.style is undefined, uses combineSelectors
    * to find a list of selectors to use.  Then, searches the tree for styles
    * and returns them.
    *
    * Parameters:
    *    type     - *string* type of the item, such as Label, DashItem, Window
    *    args     - *string* args passed to factory, should have either style
    *               property or id/classes/classNames/className for style
    *               retreival.
    *
    * Returns:
    *    *object* properties to be added into the new object.
    */

   function getProps (type, args) {
      var selectors, out = {}, i, j, curr, style, selStr, styleVal;
      if (typeof args.tyle === 'string') {
         selectors = args.tyle.split(' ');
         selectors.unshift(type);
      } else {
         selectors = combineSelectors(type, args);
      }

      selStr = selectors.join('|');
      getProps.memo = getProps.memo || {};
      if (getProps.memo[selStr]) {
         return getProps.memo[selStr];
      }

      for (i = 0; i < selectors.length; i++) {
         j = i;
         curr = selectors[i];
         style = styles;
         while (style !== undefined) {

            // if we find a device or density conditional, we copy everything
            // in it into its parent.  This has the affect of 'applying' the
            // conditional.  Then, we continue processing as normal.

            if (style.device && style.device[device]) {
               if (style.device[device].self) {
                  extend(style, style.device[device]);
               }

               delete style.device;
            }

            if (style.density && style.density[density]) {
               if (style.density[density].self) {
                  extend(style, style.density[density]);
               }

               delete style.density;
            }

            if (style.self !== undefined) {
               extend(out, style.self);
            }

            // walk down the tree
            style = style[curr];
            // move to the next selector
            j += 1;
            curr = selectors[j];
         }
      }

      for (style in out) {
         if (out.hasOwnProperty(style) && typeof style == 'string') {
            styleVal = out[style];
            if (styleVal.charAt && 
                styleVal.charAt(0) == '`' && 
                styleVal.charAt(styleVal.length-1) == '`') {
               styleVal = styleVal.slice(1, styleVal.length - 1);
               out[style] = eval(styleVal);
            }
         }
      }

      if (out.text) {
         out.text = out.text.replace("<br>", "\n"); 
      }

      getProps.memo[selStr] = out;
      return out;
   }

   /* Function: load
    * Loads styles out of a .js file via commonjs require
    *
    * Parameters:
    *    name     - *string* name of the .js file
    */

   function load (name) {
      styles = require(name).styles;
   }

   /* Function: makeCtor
    * Makes a functional constructor for a Titanium object, getting properties
    * first from the style information
    *
    * Parameters:
    *    name     - *string* nice name of the Titanium object
    *
    * Returns:
    *    *function (args)* factory method which tries to get properties first
    */

   function makeCtor (name) {
      return function (args) {
         var ret, computedStyle, newStyle;
         args = args || {};
         computedStyle = getProps(name, args);
         newStyle = {};

         // copy styles from the computed styles first, then from the args
         // this way, computed styles are the 'defaults' and can be
         // overwritten by arguments

         // we can't just extend style with args because that would
         // overwrite the computed style in the memo of the getProps function

         // we have to use weakExtend on Titanium objects because recursing
         // into them will likely break them.

         extend(newStyle, computedStyle);
         weakExtend(newStyle, args);

         // string interpolation via underscore.js, if we found it
         if (_ && newStyle.strings) {
            _(['text', 'title']).each(function (prop) {
               if (newStyle[prop]) {
                  newStyle[prop] = _.template(newStyle[prop], newStyle.strings);
               }
            });
         }

         // actually construct the damn thing
         ret = Ti.UI[ctorMap[name]](newStyle);

         wrapEmitter(ret);
         return ret;
      };
   }

   /* Function: apply
    * Applies style information into obj.
    *
    * Parameters:
    *    obj      - *object* to add properties into
    *    type     - *string* type of ti object, like Label
    *    style    - *object* describing styles to be inserted.  Should look
    *               like {style: '#id .class1'} or {id: 'someid', className: 
    *               'class1'}.
    */
   function apply (obj, type, style) {
      style = getProps(type, style);
      extend(obj, style);
   }

   function setDebugMode (value) {
      value = value || true;
      debugMode = value;
   }

   var name;
   for (name in ctorMap) if (ctorMap.hasOwnProperty(name)) {
      exports[name] = makeCtor(name);
   }

   exports.apply = apply;
   exports.load = load;
   exports.getProps = getProps;
   exports.setDebugMode = setDebugMode;
   exports.wrapEmitter = wrapEmitter;

   try {
      styles = require('style').styles;
   } catch(e) {
      // do nothing; the user must have his own plan
   }

   return exports;
}());

// add to exports if we were required
try {
   module.exports = T;
} catch (e) {}
