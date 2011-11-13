Tylus - Titanium Stylus
=======================

Note: this is super super beta.  It might be crappy, slow, and mess things up.
Please test and report issues!

Note 2: Don't put a device conditional
in the root, it will break things.  Make these the children of other objects.

Install tylus with npm

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
    label = T.Label({style: '#hello'});
    win.add(label);
    win.open();

and you're good to go.

Features
--------

Supports creation
of objects with a style property or with id, class, classNames, or classes
property:

    label = T.Label({style: '#mylabel .special'});
    win = T.Window({id: 'Settings'});

Conditioning on device type:

    Label
      [device=iphone]
        text 'iphone'
      [device=ipad]
        text 'ipad'

and in your app.js:

    label = T.Label();
    // will say 'iphone' on iphone and 'ipad' on ipad

Object properties are also supported:

    Label
      font
        fontSize 20
        fontWeight bold

even though it doesn't make sense from a css standpoint, it's still quite
intuitive.

And, of course, all of the awesome features of [Stylus](http://learnboost.github.com/stylus/)

Functional construction of all ti objects in the T namespace
------------------------------------------------------------

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

See tylus.js in lib/ (ie, the file that should be in your Titanium Resources
directory) for the map of nice names to crappy Titanium names.  Some are
slightly modified.  'View' is usually removed.  The matrices specify dimension
on the end.  PickerColumn is shortened to PickerCol, etc.

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

Stylus example
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

License
-------

MIT.
