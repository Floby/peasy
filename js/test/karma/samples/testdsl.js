var exports, module, require, _ref;

if (typeof window === 'object') {
  _ref = twoside('/test/karma//testdsl'), require = _ref.require, exports = _ref.exports, module = _ref.module;
}

(function(require, exports, module) {
  var Listizer, Textualizer, Transformer, jsTemplates, parseTemplate, _ref1;
  _ref1 = require('../../../samples/dsl'), parseTemplate = _ref1.parseTemplate, Textualizer = _ref1.Textualizer, Listizer = _ref1.Listizer, Transformer = _ref1.Transformer, jsTemplates = _ref1.jsTemplates;
  describe("run samples/testdsl:", function() {
    return it('', function() {});
  });
  return describe("parse template", function() {
    it("parse @) shold throw error", function() {
      return expect(function() {
        return parseTemplate('@)');
      }).toThrow();
    });
    it("parse @x()) shold throw error", function() {
      return expect(function() {
        return parseTemplate('@x())');
      }).toThrow();
    });
    it("should parse 'x'", function() {
      return expect(parseTemplate('x')).toBe('t.transform(e.x)');
    });
    it("should parse 'x!y'", function() {
      return expect(parseTemplate('x!y')).toBe('t.transform(e.x),t.transform(e.y)');
    });
    it("should parse '@if_(x!y)'", function() {
      return expect(parseTemplate('@if_(x!y)')).toBe('t.if_(t.transform(e.x),t.transform(e.y))');
    });
    it("should parse '@if_(x!!!y)'", function() {
      return expect(parseTemplate('@if_(x!!!y)')).toBe('t.if_(t.transform(e.x),"!",t.transform(e.y))');
    });
    it("should parse '@x", function() {
      return expect(parseTemplate('@x')).toBe('t.x');
    });
    it("should parse '@x@y", function() {
      return expect(parseTemplate('@x@y')).toBe('t.x,t.y');
    });
    it("should parsen !)", function() {
      return expect(parseTemplate('!)')).toBe('")"');
    });
    it("should parsen ;23445", function() {
      return expect(parseTemplate(';23445')).toBe('";23445"');
    });
    it("should parsen ;23445qwe", function() {
      return expect(parseTemplate(';23445qwe')).toBe('";23445",t.transform(e.qwe)');
    });
    it("should parsen ;23445!qwe", function() {
      return expect(parseTemplate(';23445!qwe')).toBe('";23445qwe"');
    });
    it("should parsen ;23445!!qwe", function() {
      return expect(parseTemplate(';23445!!qwe')).toBe('";23445!",t.transform(e.qwe)');
    });
    it("should parsen @whileLoop(!while @paren(item)\n@block(body))", function() {
      return expect(parseTemplate('@whileLoop(!while @paren(item)\n@block(body))')).toBe("t.whileLoop(\"while \",t.paren(t.transform(e.item)),\"\\n\",t.block(t.transform(e.body)))");
    });
    it('should parse "value"', function() {
      return expect(parseTemplate('"value"')).toBe('\'"\',t.transform(e.value),\'"\'');
    });
    it("should parse @array(items)", function() {
      return expect(parseTemplate('@array(items)')).toBe('t.array(t.transform(e.items))');
    });
    it("should parse @if_(!if @paren(test)\n@block(then_)@may(\n!else @block(else_)))", function() {
      return expect(parseTemplate('@if_(!if @paren(test)\n@block(then_)@may(\n!else @block(else_)))')).toBe('t.if_("if ",t.paren(t.transform(e.test)),"\\n",t.block(t.transform(e.then_)),t.may("\\nelse ",t.block(t.transform(e.else_))))');
    });
    it("should parse '@forInLoop(!for @paren(item !in range)\n@block(body))'", function() {
      return expect(parseTemplate('@forInLoop(!for @paren(item !in range)\n@block(body))')).toBe('t.forInLoop("for ",t.paren(t.transform(e.item)," in ",t.transform(e.range)),"\\n",t.block(t.transform(e.body)))');
    });
    it("should parse @whileLoop(!while @paren(item)\n@block(body))", function() {
      return expect(parseTemplate('@whileLoop(!while @paren(item)\n@block(body))')).toBe('t.whileLoop("while ",t.paren(t.transform(e.item)),"\\n",t.block(t.transform(e.body)))');
    });
    it("should parse @tryCatch(!try @block(test)\ncatcher@may(\n!finally @block(final)))", function() {
      return expect(parseTemplate('@tryCatch(!try @block(test)\ncatcher@may(\n!finally @block(final)))')).toBe('t.tryCatch("try ",t.block(t.transform(e.test)),"\\n",t.transform(e.catcher),t.may("\\nfinally ",t.block(t.transform(e.final))))');
    });
    it("should parsen !catch @paren(variable@may(!if test))@block(\nbody)", function() {
      return expect(parseTemplate('!catch @paren(variable@may(!if test))@block(\nbody)')).toBe('"catch ",t.paren(t.transform(e.variable),t.may("if ",t.transform(e.test))),t.block("\\n",t.transform(e.body))');
    });
    it("should parsen !throw value", function() {
      return expect(parseTemplate('!throw value')).toBe('"throw ",t.transform(e.value)');
    });
    it("should parsen caller@paren(@list(args))", function() {
      return expect(parseTemplate('caller@paren(@list(args))')).toBe('t.transform(e.caller),t.paren(t.list(t.transform(e.args)))');
    });
    it("should parsen !var @list(vars)", function() {
      return expect(parseTemplate('left = right')).toBe('t.transform(e.left)," = ",t.transform(e.right)');
    });
    it("left @op(operator) = right", function() {
      return expect(parseTemplate('left @op(operator) = right')).toBe('t.transform(e.left)," ",t.op(t.transform(e.operator))," = ",t.transform(e.right)');
    });
    it("should parsen @switch_(!switch @paren(expression) \n@block(@list(cases @empty)) @may(\n!default: @block(else)))", function() {
      return expect(parseTemplate('@switch_(!switch @paren(expression) \n@block(@list(cases @empty)) @may(\n!default: @block(else)))')).toBe('t.switch_("switch ",t.paren(t.transform(e.expression))," \\n",t.block(t.list(t.transform(e.cases)," ",t.empty))," ",t.may("\\ndefault: ",t.block(t.transform(e.else))))');
    });
    return it("!case test: \n@block(body)", function() {
      return expect(parseTemplate('!case test: \n@block(body)')).toBe('"case ",t.transform(e.test),": \\n",t.block(t.transform(e.body))');
    });
  });
})(require, exports, module);
