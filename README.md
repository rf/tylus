Tylus - Titanium Stylus
=======================

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
    T.load('style');
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

    // something.styl
    Label
      [device=iphone]
        text 'iphone'
      [device=ipad]
        text 'ipad'


    // app.js
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

    T.DashItem()
    T.Dash()
    T.Table()
    T.TableRow()
    T.TableSection()
    T.Label()
    T.Button()
    T.ImageView()
    T.Picker()
    T.Tab()
    T.Window()

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
