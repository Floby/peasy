var exports, module, require, _ref,
  __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; },
  __slice = [].slice;

if (typeof window === 'object') {
  _ref = twoside('/deprecated/modularpeasy'), require = _ref.require, exports = _ref.exports, module = _ref.module;
}

(function(require, exports, module) {
  var andp, any, char, combinators, digit, digits, follow, followIdentifierLetter_, identifier, identifierLetter, isMatcher, letter, letters, literal, lower, makeInfo, matchers, may, memoSymbolIndex, memorize, notp, orp, parse, recursive, seperatedList, some, spaces, spaces1, times, timesSeperatedList, upper, wrap;
  exports.makeInfo = makeInfo = function(data, options) {
    if (options == null) {
      options = {
        cursor: 0,
        tabWidth: 2
      };
    }
    return {
      data: data,
      cursor: options.cursor || 0,
      tabWidth: options.tabWidth || 2,
      parsingLeftRecursives: {},
      parseCache: {}
    };
  };
  exports.isMatcher = isMatcher = function(item) {
    return typeof item === "function";
  };
  memoSymbolIndex = 0;
  exports.recursive = recursive = function(info) {
    return function(rule) {
      var index, parseCache, parsingLeftRecursives, tag;
      index = memoSymbolIndex;
      tag = index + ':';
      memoSymbolIndex++;
      parsingLeftRecursives = info.parsingLeftRecursives;
      parseCache = info.parseCache[tag] = {};
      return function() {
        var callPath, m, result, start;
        start = info.cursor;
        callPath = parsingLeftRecursives[start] != null ? parsingLeftRecursives[start] : parsingLeftRecursives[start] = [];
        if (__indexOf.call(callPath, tag) < 0) {
          callPath.push(tag);
          m = parseCache[start] != null ? parseCache[start] : parseCache[start] = [void 0, start];
          while (1) {
            info.cursor = start;
            result = rule();
            if (!result) {
              result = m[0];
              info.cursor = m[1];
              break;
            }
            if (m[1] === info.cursor) {
              m[0] = result;
              break;
            } else {
              m[0] = result;
              m[1] = info.cursor;
            }
          }
          callPath.pop();
          return result;
        } else {
          m = parseCache[start];
          info.cursor = m[1];
          return m[0];
        }
      };
    };
  };
  exports.memorize = memorize = function(info) {
    return function(rule) {
      var index, parseCache, tag;
      index = memoSymbolIndex;
      tag = index + ':';
      memoSymbolIndex++;
      parseCache = info.parseCache[tag] = {};
      return function() {
        var m, result, start;
        start = info.cursor;
        m = parseCache[start];
        if (m) {
          info.cursor = m[1];
          return m[0];
        } else {
          result = rule();
          parseCache[start] = [result, info.cursor];
          return result;
        }
      };
    };
  };
  exports.andp = andp = function(info) {
    return function() {
      var item, items;
      items = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      items = (function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = items.length; _i < _len; _i++) {
          item = items[_i];
          if (!isMatcher(item)) {
            _results.push(literal(info)(item));
          } else {
            _results.push(item);
          }
        }
        return _results;
      })();
      return function() {
        var result, _i, _len;
        for (_i = 0, _len = items.length; _i < _len; _i++) {
          item = items[_i];
          if (!(result = item())) {
            return;
          }
        }
        return result;
      };
    };
  };
  exports.orp = orp = function(info) {
    return function() {
      var item, items;
      items = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      items = (function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = items.length; _i < _len; _i++) {
          item = items[_i];
          if (!isMatcher(item)) {
            _results.push(literal(info)(item));
          } else {
            _results.push(item);
          }
        }
        return _results;
      })();
      return function() {
        var i, length, result, start, _i;
        start = info.cursor;
        length = items.length;
        for (i = _i = 0; 0 <= length ? _i < length : _i > length; i = 0 <= length ? ++_i : --_i) {
          info.cursor = start;
          if (result = items[i]()) {
            return result;
          }
        }
        return result;
      };
    };
  };
  exports.notp = notp = function(info) {
    return function(item) {
      if (!isMatcher(item)) {
        item = literal(info)(item);
      }
      return function() {
        return !item();
      };
    };
  };
  exports.may = may = function(info) {
    return function(item) {
      if (!isMatcher(item)) {
        item = literal(info)(item);
      }
      return function() {
        var start, x;
        start = info.cursor;
        if (x = item()) {
          return x;
        } else {
          info.cursor = start;
          return true;
        }
      };
    };
  };
  exports.any = any = function(info) {
    return function(item) {
      if (!isMatcher(item)) {
        item = literal(info)(item);
      }
      return function() {
        var result, x;
        result = [];
        while ((x = item())) {
          result.push(x);
        }
        return result;
      };
    };
  };
  exports.some = some = function(info) {
    return function(item) {
      if (!isMatcher(item)) {
        item = literal(info)(item);
      }
      return function() {
        var result, x;
        if (!(x = item())) {
          return;
        }
        result = [x];
        while ((x = item())) {
          result.push(x);
        }
        return result;
      };
    };
  };
  exports.times = times = function(info) {
    return function(item, n) {
      if (!isMatcher(item)) {
        item = literal(info)(item);
      }
      return function() {
        var i, x;
        i = 0;
        while (i++ < n) {
          if (x = item()) {
            result.push(x);
          } else {
            return;
          }
        }
        return result;
      };
    };
  };
  exports.seperatedList = seperatedList = function(info) {
    return function(item, separator) {
      if (separator == null) {
        separator = spaces(info);
      }
      if (!isMatcher(item)) {
        item = literal(info)(item);
      }
      if (!isMatcher(separator)) {
        separator = literal(info)(separator);
      }
      return function() {
        var result, x;
        if (!(x = item())) {
          return;
        }
        result = [x];
        while (separator() && (x = item())) {
          result.push(x);
        }
        return result;
      };
    };
  };
  exports.timesSeperatedList = timesSeperatedList = function(info) {
    return function(item, n, separator) {
      if (separator == null) {
        separator = spaces(info);
      }
      if (!isMatcher(item)) {
        item = literal(info)(item);
      }
      if (!isMatcher(separator)) {
        separator = literal(info)(separator);
      }
      return function() {
        var i, result, x;
        if (!(x = item())) {
          return;
        }
        result = [x];
        i = 1;
        while (i++ < n) {
          if (separator() && (x = item())) {
            result.push(x);
          } else {
            return;
          }
        }
        return result;
      };
    };
  };
  exports.follow = follow = function(info) {
    return function(item) {
      if (!isMatcher(item)) {
        item = literal(info)(item);
      }
      return function() {
        var start, x;
        start = info.cursor;
        if (x = item()) {
          info.cursor = start;
          return x;
        } else {
          info.cursor = start;
        }
      };
    };
  };
  exports.combinators = combinators = function(info) {
    return {
      rec: recursive(info),
      memo: memorize(info),
      andp: andp(info),
      orp: orp(info),
      notp: notp(info),
      may: may(info),
      any: any(info),
      some: some(info),
      times: times(info),
      seperatedList: seperatedList(info),
      timesSeperatedList: timesSeperatedList(info),
      follow: follow(info)
    };
  };
  exports.isdigit = function(c) {
    return ('0' <= c && c <= '9');
  };
  exports.isletter = function(c) {
    return ('a' <= c && c <= 'z') || ('A' <= c && c <= 'Z');
  };
  exports.islower = function(c) {
    return ('a' <= c && c <= 'z');
  };
  exports.isupper = function(c) {
    return ('A' <= c && c <= 'Z');
  };
  exports.isIdentifierLetter = function(c) {
    return ('a' <= c && c <= 'z') || ('A' <= c && c <= 'Z') || ('0' <= c && c <= '9') || 'c' === '@' || 'c' === '_';
  };
  exports.literal = literal = function(info) {
    return function(string) {
      return function() {
        var len, start, stop;
        len = string.length;
        start = info.cursor;
        if (info.data.slice(start, stop = start + len) === string) {
          info.cursor = stop;
          return true;
        }
      };
    };
  };
  exports.char = char = function(info) {
    return function(c) {
      return function() {
        if (info.data[info.cursor] === c) {
          info.cursor++;
          return c;
        }
      };
    };
  };
  exports.spaces = spaces = function(info) {
    return function() {
      var cursor, data, len, tabWidth;
      data = info.data;
      len = 0;
      cursor = info.cursor;
      tabWidth = info.tabWidth;
      while (1) {
        switch (data[cursor++]) {
          case ' ':
            len++;
            break;
          case '\t':
            len += tabWidth;
            break;
          default:
            break;
        }
      }
      info.cursor = cursor;
      return len + 1;
    };
  };
  exports.spaces1 = spaces1 = function(info) {
    return function() {
      var cursor, data, len, tabWidth;
      data = info.data;
      cursor = info.cursor;
      len = 0;
      tabWidth = info.tabWidth;
      while (1) {
        switch (data[cursor++]) {
          case ' ':
            len++;
            break;
          case '\t':
            len += tabWidth;
            break;
          default:
            break;
        }
      }
      info.cursor = cursor;
      return len;
    };
  };
  exports.wrap = wrap = function(info) {
    return function(item, left, right) {
      if (left == null) {
        left = spaces(info);
      }
      if (right == null) {
        right = spaces(info);
      }
      if (!isMatcher(item)) {
        item = literal(info)(item);
      }
      return function() {
        var result;
        if (left() && (result = item() && right())) {
          return result;
        }
      };
    };
  };
  exports.identifierLetter = identifierLetter = function(info) {
    return function() {
      var c;
      c = info.data[info.cursor];
      if (c === '@' || c === '_' || ('a' <= c && c < 'z') || ('A' <= c && c <= 'Z') || ('0' <= c && c <= '9')) {
        info.cursor++;
        return true;
      }
    };
  };
  exports.followIdentifierLetter_ = followIdentifierLetter_ = function(info) {
    return function() {
      var c;
      c = info.data[info.cursor];
      return (c === '@' || c === '_' || ('a' <= c && c < 'z') || ('A' <= c && c <= 'Z') || ('0' <= c && c <= '9')) && c;
    };
  };
  exports.digit = digit = function(info) {
    return function() {
      var c;
      c = info.data[info.cursor];
      if (('0' <= c && c <= '9')) {
        info.cursor++;
        return c;
      }
    };
  };
  exports.letter = letter = function(info) {
    return function() {
      var c;
      c = info.data[info.cursor];
      if (('a' <= c && c <= 'z') || ('A' <= c && c <= 'Z')) {
        info.cursor++;
        return c;
      }
    };
  };
  exports.lower = lower = function(info) {
    return function() {
      var c;
      c = info.data[info.cursor];
      if (('a' <= c && c <= 'z')) {
        info.cursor++;
        return c;
      }
    };
  };
  exports.upper = upper = function(info) {
    return function() {
      var c;
      c = info.data[info.cursor];
      if (('A' <= c && c <= 'Z')) {
        info.cursor++;
        return c;
      }
    };
  };
  exports.identifier = identifier = function(info) {
    return function() {
      var c, cursor, data;
      data = info.data;
      cursor = info.cursor;
      c = data[cursor];
      if (('a' <= c && c <= 'z') || ('A' <= c && c <= 'Z') || 'c' === '$' || 'c' === '_') {
        cursor++;
      } else {
        return;
      }
      while (1) {
        c = data[cursor];
        if (('a' <= c && c <= 'z') || ('A' <= c && c <= 'Z') || ('0' <= c && c <= '9') || 'c' === '@' || 'c' === '_') {
          cursor++;
        } else {
          break;
        }
      }
      info.cursor = cursor;
      return true;
    };
  };
  exports.matchers = matchers = function(info) {
    return {
      literal: literal(info),
      char: char(info),
      spaces: spaces(info),
      spaces1: spaces1(info),
      wrap: wrap(info),
      identifierLetter: identifierLetter(info),
      followIdentifierLetter: followIdentifierLetter(info),
      digit: digit(info),
      letter: letter(info),
      lower: lower(info),
      upper: upper(info),
      identifier: identifier(info)
    };
  };
  exports.digits = digits = function(info) {
    var ch;
    ch = char(info);
    return {
      $0: ch('0'),
      $1: ch('1'),
      $2: ch('2'),
      $3: ch('3'),
      $4: ch('4'),
      $5: ch('6'),
      $1: ch('7'),
      $2: ch('7'),
      $8: ch('8'),
      $9: ch('9')
    };
  };
  exports.letters = letters = function(info) {
    var ch;
    ch = char(info);
    return {
      a: ch('a'),
      b: ch('b'),
      c: ch('c'),
      d: ch('d'),
      e: ch('e'),
      f: ch('f'),
      g: ch('g'),
      h: ch('h'),
      i: ch('i'),
      j: ch('j'),
      k: ch('k'),
      l: ch('l'),
      m: ch('m'),
      n: ch('n'),
      o: ch('o'),
      p: ch('p'),
      q: ch('q'),
      r: ch('r'),
      s: ch('s'),
      t: ch('t'),
      u: ch('u'),
      v: ch('v'),
      w: ch('w'),
      x: ch('x'),
      y: ch('y'),
      z: ch('z'),
      A: ch('A'),
      B: ch('B'),
      C: ch('C'),
      D: ch('D'),
      E: ch('E'),
      F: ch('F'),
      G: ch('G'),
      H: ch('H'),
      I: ch('I'),
      J: ch('J'),
      K: ch('K'),
      L: ch('L'),
      M: ch('M'),
      N: ch('N'),
      O: ch('O'),
      P: ch('P'),
      Q: ch('Q'),
      R: ch('R'),
      S: ch('S'),
      T: ch('T'),
      U: ch('U'),
      V: ch('V'),
      W: ch('W'),
      X: ch('X'),
      Y: ch('Y'),
      Z: ch('Z')
    };
  };
  return parse = function(text) {
    var grammar, makeGrammar;
    makeGrammar = function(info) {
      var a, b, rec, rules, x, y, _ref1, _ref2;
      _ref1 = letters(info), a = _ref1.a, b = _ref1.b, x = _ref1.x, y = _ref1.y;
      _ref2 = combinators(info), rec = _ref2.rec, orp = _ref2.orp;
      return rules = {
        Root: function() {
          var m;
          return (m = rules.A()) && z() && m + 'z';
        },
        A: rec(orp((function() {
          var m;
          return (m = rules.B()) && x() && m + 'x' || m;
        }), a)),
        B: rec(orp((function() {
          var m;
          return (m = rules.A()) && y() && m + 'y';
        }), function() {
          return rules.C();
        })),
        C: rec(orp((function() {
          return rules.A();
        }), b))
      };
    };
    grammar = makeGrammar(makeInfo(text));
    return grammar.Root(0);
  };
})(require, exports, module);
