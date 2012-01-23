/* Class: T
 * Main tylus namespace.
 */
var T = (function () {
   var exports = {},
       styles = {},
       device = Ti.Platform.osname,
       ctorMap,
       debugMode = false;

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
    * Extends an object with the properties of another.  Not guarded against
    * additions to Object.prototype, but you shouldn't be doing that anyway.
    *
    * Parameters:
    *    to    - *object* to put properties into
    *    from  - *object* to take properties from
    */
   function extend (to, from) {
      var item;
      for (item in from) {
         if (typeof from[item] === 'object' && from[item] !== null) {
            to[item] = to[item] || {}; 
            extend(to[item], from[item]); // recurse                                                
         } else {
            to[item] = from[item];
         }   
      }         
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
      if (typeof args.style === 'string') {
         selectors = args.style.split(' ');
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
            if (style.self !== undefined) {
               extend(out, style.self);
            }
            if (style.device && style.device[device]) {
               if (style.device[device].self) {
                  extend(out, style.device[device].self);
               }
               // if we just hit a device conditional, we want to continue
               // walking down the tree, but we don't want to advance the
               // selector yet since a device conditional isn't matched by a
               // selector but is instead matched by the system itself.
               style = style.device[device];
               continue;
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
         var ret;
         args = args || {};
         var style = getProps(name, args);
         extend(args, style);
         ret = Ti.UI[ctorMap[name]](args);

         ret.on = function (event, handler) {
            var wrapper = function (e) {
               try {
                  handler(e);
               } catch (ex) {
                  if (debugMode) {
                     alert(JSON.stringify(ex, null, 3));
                  }
               }
            };
            ret.addEventListener(event, wrapper);
         };

         // ret.fire = ret.removeEventListner doesnt work, I've tried it
         ret.fire = function (name, data) {
            ret.fireEvent(name, data);
         };
         ret.off = function (name, handler) {
            ret.removeEventListener(name, handler);
         };
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

   try {
      styles = require('style').styles;
   } catch(e) {
      // do nothing; the user must have his own plan
   }

   return exports;
}());

