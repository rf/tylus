var vows = require('vows'),
    assert = require('assert'),
    T = require('../lib/tylus'),
    _ = require('underscore'),
    suite = vows.describe('tylus'),
    exec = require('child_process').exec;

suite.addBatch({
   tylus: { 
      topic: function () {
         exec('tylus general', this.callback);
      },

      runs: function (err, sterr, stdout) {
         assert.isNull(err);
      },

      output: {
         topic: T.load(require('./general/style').styles),

         'is good': function (topic) {
            assert.isTrue(topic);
         } 
      },

      lookup: {
         class1: {
            topic: T.getStyles('Label', {tyle: '.class1'}),

            'handled class property': function (topic) {
               assert.equal(topic.text, "why hello there");
            },

            'handled base property': function (topic) {
               assert.equal(topic.color, '#00f');
            },

            'handled object property': function (topic) {
               assert.equal(topic.font.fontSize, 15);
               assert.equal(topic.font.fontStyle, 'bold');
            },

            'handled iphone conditional': function (topic) {
               assert.equal(topic.top, 40);
            },

            'handled nested version conditional': function (topic) {
               assert.equal(topic.left, 27);
            }
         }

      }
   }
});

suite.export(module);
