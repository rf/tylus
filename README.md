Tylus - Titanium Stylus
=======================

Note: Device conditionals now work as expected.

Note 2: if you need a newline, use `<br>`.

New: less support now passes all tests!

Tylus requires [node and npm](https://github.com/creationix/nvm).  Install tylus with npm

    git clone git://github.com/russfrank/tylus.git
    npm install tylus

Make a test .styl file

    Label
      #hello
        textAlign center
        color #00ffff
        font
          fontSize 20
          fontWeight bold
        [device=iphone]
          text 'Hello from iPhone'
        [device=ipad]
          text 'Hello from iPad'

and place it in your Titanium Resources directory.  Then run

    tylus path/to/Resources

and you'll have a style.js file.  Copy tylus/lib/tylus.js into your Resources
directory, then, in app.js:

    Ti.include('tylus.js');
    var win, label ;
    win = T.Window();
    label = T.Label({tyle: '#hello'});
    win.add(label);
    win.open();

and you're good to go.  Note that the property is `tyle`, not `style`, to
avoid a conflict with Titanium properties called `style`.

Features
--------

Supports creation
of objects with a `tyle` property or with id, class, classNames, or classes
property:

    label = T.Label({tyle: '#mylabel .special'});
    win = T.Window({id: 'Settings'});

### Platform Conditioning

Conditioning on device type:

    Label
      [device=iphone]
        text 'iphone'
      [device=ipad]
        text 'ipad'

and in your app.js:

    label = T.Label();
    // will say 'iphone' on iphone and 'ipad' on ipad

You can also condition on other Ti.Platform variables:

    Label
      [version=5.0]
         text 'ios 5.0 is great huh'
      [version=4.0]
         text 'you should upgrade to get newwstand its the best'

You can also set such conditionable properties manually with the
`setProperty` function.  See the 'Reference' section below for details.

### Object Properties

Object properties are also supported:

    Label
      font
        fontSize 20
        fontWeight bold

even though it doesn't make sense from a css standpoint, it's still quite
intuitive.

And, of course, all of the awesome features of [Stylus](http://learnboost.github.com/stylus/)

### JS Evaluation

If you need to have a style consist of javascript, wrap it in quotes and
backticks:

    Table
        .grouped
            [device=iphone]
                style "`Ti.UI.iPhone.TableViewStyle.GROUPED`"
                backgroundColor transparent
                rowBackgroundColor white

The javascript will be evaluated the first time the style is looked up.

### String Interpolation

If tylus can find underscore.js, underscore's string interpolation will be
applied to your objects' `title` and `text` properties.  You specify the
strings in a `strings` object passed into the constructor.  For example:

```
Label
   .special
      text "This special label says <%=message%>!"
```

meanwhile, in some javascript file

```
var stuff = T.Label({tyle: '.special', strings: {message: 'awesome stuff'}});
```

### camelCase or dash-separation

The less css compiler assumes that any property name that is camelCased is a
syntax error, since no actual css property names are camel cased.  To work around
this, tylus supports the use of dash-separated properties; these will be converted
to camelCased properties upon compilation.  See the test suite for an example.

### Factory Methods for UI Creation

These much nicer looking constructors are not only a reasonable length but
also will lookup styles before generating the object.

    T.Dash()
    T.Table()
    T.TableRow()
    T.Label()
    T.Button()
    T.Image()
    T.Tab()
    T.Window()
    T.ScrollAble()
    T.AlertDialog()

They also provide nicer functions for add/removeEventListener and fireEvent:

    object.on('event', handler);
    object.off('event', handler);
    object.fire('event');

The `.on` function will also wrap the handler in an exception handler. This
exception handler will simply `alert()` the exception when it is caught. When
exceptions occur in an event callback, Titanium logs an error to the console
but does not display an error message; this can make debugging on a device
difficult.  The `T` object exposes a function `setDebugMode()` which can be
used to enable or disable this feature.  It's disabled by default.

This feature will make removing event handlers slow, since we have to lookup
the wrapper function that was created when the event handler was added. Make
sure to disable it in production modes, unless you're okay with a small
performance hit when removing handlers in exchange for the exception handling.

See tylus.js in lib/ (ie, the file that should be in your Titanium Resources
directory) for the map of nice names to crappy Titanium names.  Some are
slightly modified.  'View' is usually removed.  The matrices specify dimension
on the end.  PickerColumn is shortened to PickerCol, etc.

Unfortunately, replacing constructors like this *will cause some problems*.
The Titanium build system attempts to detect which portions of the framework
you are using by essentially greping your source for the 
`Ti.xx.createSomeObject` factory methods.  Since you're using the factory
methods I provide in `T`, Titanium will think you aren't using those
components.  So, in some file of your project, simply list out the
constructors you'll need.  You can do this per-file or once in a single file
of your project:

    Ti.UI.createLabel
    Ti.UI.createTableView
    Ti.UI.createTableViewRow

These references to Javascript functions will be ignored by the interpreter
on the device, but will let the Ti build system know to include those
parts of the framework in the build.

Titanium Build Plugin
---------------------

Assuming you have Tylus setup correctly in your path, you can use the plugin in
the plugins/ directory of the source tree with Titanium to automate the stylus
compilation every time Titanium compiles your app.  To use this, copy the
plugins directory into your application project directory.  It should be next
to Resources and your tiapp.xml:

    Resources
    build
    plugins
    tiapp.xml
    manifest

etc.  Then, edit your tiapp.xml, adding the following into your <ti:app>:

    <plugins>
          <plugin version="0.0">tylus</plugin> 
    </plugins>

Now, when you compile your app, your .styl files will be compiled into 
style.js!


Manual Compilation
-------------------

You can manually compile styles by running `tylus` with your Resources
directory as the parameter:

    tylus Resources

Example
--------------

    #myitem
      [device=phone]
        top 84
        width 85
      [device=ipad]
        top 90
        width 90
      font
        fontSize 13
        fontWeight bold
        fontFamily 'Helvetica Neue'
    
    Label
       width 100
       height 200
       [device=iphone]
          text "This is an iPhone!"
       [device=ipad]
          text "this is an ipad!"
       #myid
         text "some id label thing"

### Reference

#### UI Creation

* Matrix2D - create2DMatrix
* Matrix3D - create3DMatrix
* Indicator - createActivityIndicator
* AlertDialog - createAlertDialog
* Animation - createAnimation
* Button - createButton
* ButtonBar - createButtonBar
* CoverFlow - createCoverFlow
* DashItem - createDashboardItem
* Dash - createDashboardView
* EmailDialog - createEmailDialog
* Image - createImageView
* OptionDialog - createOptionDialog
* Label - createLabel
* Picker - createPicker
* PickerRow - createPickerRow
* PickerCol - createPickerCol
* ProgressBar - createProgressBar
* Scroll - createScrollView
* Scrollable - createScrollableView
* SearchBar - createSearchBar
* Slider - createSlider
* Switch - createSwitch
* Tab - createTab 
* TabGroup - createTabGroup
* TabbedBar - createTabbedBar
* Table - createTableView
* TableRow - createTableViewRow
* TableSection - createTableViewSection
* TextArea - createTextArea
* TextField - createTextField
* Toolbar - createToolbar
* View - createView
* Web - createWebView
* Window - createWindow

#### Other Methods

* wrapEmitter (emitter) - adds .on, .off, .fire to a Titanium event emitter
* apply (obj, type, style) - augments obj with styles.  `type` is a string
  describing a shortened Titanium type (ie Label, DashItem). `style` is a
  `tyle`; a style lookup string like `#id .class1` or an object with `tyle`
  or `id` or `className` or `classNames` properties.
* load (file) - tries to load styles from `file`. Note that `file` is
  `require()`ed and as such should not have an extension.  Returns true on
  success, false on error.
* getProps (type, args) - gets computed style properties. `type` is a
  shorthand Titanium type; `args` is the arguments it was created with for
  extracting the `tyle` or `id` etc properties.
* setDebugMode (value) - sets the debug mode to `value`.  If `value` is
  truthy, event handlers placed on emitters will be wrapped in an
  exception handler.  Defaults to false.
* setProperty (prop, val) - sets `prop` to `val` in the internal property
  list used for condition resolution.  So, if we `setPropert('foo', 'bar')`
  we can then have a `[foo=bar]` rule in the style files.

#### Ti Platform Properties

By default, Tylus can condition on these Ti.Platform properties:

* osname (alias device)
* density
* dpi
* username
* version

License
-------

[MIT](https://github.com/russfrank/tylus/blob/master/LICENSE).
