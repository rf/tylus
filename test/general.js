var vows = require('vows'),
    assert = require('assert'),
    T = require('../lib/tylus'),
    _ = require('underscore'),
    suite = vows.describe('tylus'),
    exec = require('child_process').exec;

function styleLookupTests (type) {
   return {
      class1: {
         topic: function () {
            T.setProperty('someprop', 'someval');
            return T.getProps(type, {tyle: '.class1'});
         },

         'class property': function (topic) {
            assert.equal(topic.text, "why hello there");
         },

         'base property': function (topic) {
            assert.equal(topic.color, '#00f');
         },

         'object property': function (topic) {
            assert.equal(topic.font.fontSize, 15);
            assert.equal(topic.font.fontStyle, 'bold');
         },

         'iphone conditional': function (topic) {
            assert.equal(topic.top, 40);
         },

         'nested version conditional': function (topic) {
            assert.equal(topic.left, 27);
         },

         'nested custom conditional': function (topic) {
            assert.equal(topic.backgroundColor, '#fefefe');
         }
      },

      'someid class2': {
         topic: function () {
            return T.getProps(type, {tyle: '#someid .class2', strings: {message: "foo123"}});
         },

         'class property': function (topic) {
            assert.equal(topic.right, 34);
         },

         'string interpolation': function (topic) {
            assert.equal(topic.text, "hello there foo123");
         },

         'evaluation': function (topic) {
            assert.equal(topic.computedProperty, "[object Object] is great");
         }
      }
   };
}

suite.addBatch({
   tylus: { 
      topic: function () {
         exec('tylus general', this.callback);
      },

      runs: function (err, stdout, stderr) {
         assert.isNull(err);
      },

      output: {
         topic: function () {
            return T.load(require('./general/style').styles);
         },

         'valid': function (topic) {
            assert.isTrue(topic);
         } 
      },

      stylus: styleLookupTests('Label'),
      less: styleLookupTests('DashItem')
   }
});

suite.export(module);
