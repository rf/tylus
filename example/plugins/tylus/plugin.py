#!/usr/bin/env python

import subprocess

# this simple plugin will just run tylus (expected to be in path) on your
# Resources dir.  Assuming you have your js setup correctly, this will update
# the styles you use inyour app

def compile(config):
   # run the command
   command = ["tylus", config['project_dir'] + '/Resources']
   proc = subprocess.Popen(command, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
   out, err = proc.communicate()
   code = proc.returncode
   # if the code is nonzero, raise an Exception to stop the build process
   if code != 0 :
      print err
      raise Exception('Stylus compile failed, check output')
   # otherwise, just print the stdout of the process
   else :
      print out
