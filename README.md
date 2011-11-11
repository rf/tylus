Tylus - Titanium Stylus
=======================

Drop lib/tylus.js into your Titanium Resources directory.  Install tylus
with npm

    git clone tylus
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

and you'll have a style.js file.  In your app.js,

    Ti.include('tylus.js');
    T.load('style');
    var win, label ;
    win = T.Window();
    label = T.Label({style: '#hello'});
    win.add(label);
    win.open();

and you're good to go.

Real stylus backed style sheets for Titanium Mobile.  Redux inspired;
RJSS / JSS like, but uses Stylus.  .styl files are compiled to css with
Stylus, then compiled to a Javascript object.  This object is included at
runtime and styles are looked up in the object.

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
