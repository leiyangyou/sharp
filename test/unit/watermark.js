'use strict';

var assert = require('assert');
var fixtures = require('../fixtures');
var sharp = require('../../index');

sharp.cache(0);

// Helpers
var getPaths = function(baseName, extension) {
  if (typeof extension === 'undefined') {
    extension = 'png';
  }
  return {
    actual: fixtures.path('output.' + baseName + '.' + extension),
    expected: fixtures.expected(baseName + '.' + extension),
  };
};

// Test
describe('Watermarking', function() {
  it('Adds a watermark to a opaque image', function (done) {
    var paths = getPaths('watermark-opaque');

    sharp(fixtures.inputJpg).
      resize(256).
      watermark({text: 'Hello\nWorld', color: 'rgba(0, 0, 0, 0.3)', width: 200, font: 'Arial 10', lineSpacing: 5, dpi: 500}).
      toFile(paths.actual, function (error) {
        if (error) return done(error);
        fixtures.assertMaxColourDistance(paths.actual, paths.expected);
        done();
      });
  });

  it('Adds a watermark to a transparent image', function (done) {
    var paths = getPaths('watermark-transparent');

    sharp(fixtures.inputPngAlphaPremultiplicationSmall).
      resize(256).
      watermark({text: 'Hello\nWorld', color: 'rgba(0, 0, 0, 0.3)', width: 200, font: 'Arial 10', lineSpacing: 50, dpi: 500}).
      toFile(paths.actual, function (error) {
        if (error) return done(error);
        fixtures.assertMaxColourDistance(paths.actual, paths.expected);
        done();
      });
  });

  it('Fails with non object parameter', function() {
    assert.throws(function() {
      sharp().watermark();
    });
  });

  it('Fails when watermark text is empty or not a string', function() {
    assert.throws(function() {
      sharp().watermark({text: null});
    });

    assert.throws(function() {
      sharp().watermark({text: ''});
    });
  });
});
