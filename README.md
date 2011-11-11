Tylus - Titanium Stylus
=======================

Real stylus backed style sheets for Titanium Mobile.  Redux inspired;
RJSS / JSS like, but uses Stylus.  .styl files are compiled to css with
Stylus, then compiled to a Javascript object.  This object is included at
runtime and styles are looked up in the object, so Tylus is fast.  Setting
styles consists of a couple of hash loopus (depending on how specific you
are about your styles).

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

.dashItem
  [iphone]
    top 84
    width 85
  [ipad]
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
