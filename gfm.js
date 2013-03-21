define(function(require, exports, module) {

var Markdown = require('./markdown').Markdown;

Markdown.dialects.GFM = Markdown.subclassDialect(Markdown.dialects.Gruber);

Markdown.dialects.GFM.block.code_syntax_highlighting = function(block, next) {
  var ret = [],
    startRe = /^```(.*)\n?((.|\n)*)/,
    endRe = /(.|\n)*```\n?$/,
    m = block.match(startRe),
    lang, code, lineRe, isEnd;

  if(!block.match(startRe)) return undefined;

  lang = m[1];
  code = m[2];
  lineRe = new RegExp('^(?:' + (code.match(/(\s*)/)[1] || '') + ')(.*)\\n?');

  block_search:
  do {

    if(isEnd = endRe.test(code)) code = code.substring(0, code.length - 3);

    var b = this.loop_re_over_block(lineRe, code, function(m) {ret.push(m[1])});

    if(b.length) ret.push(b);

    if(next.length && !isEnd) {
      ret.push ( block.trailing.replace(/[^\n]/g, '').substring(2) );
      block = next.shift();
      code = block.valueOf();
    } else {
      break block_search;
    }

  } while(!isEnd);

  return [['code_block', {'lang': lang}, ret.join('\n')]];
};

Markdown.dialects.GFM.block.table = function(block, next) {
  var self = this,
    lines = block.split('\n'),
    cellSepalater = /\s*\|\s*/,
    thead = ['thead'],
    tbody = ['tbody'],
    cellAligns,
    tr,
    i, n;

  if(/^    /.test(lines[0])) return undefined;
  if(lines.length < 3) return undefined;
  if(!lines[0].match(cellSepalater)) return undefined;
  if(!lines[1].match(/^\s*[|:-]+\s*$/)) return undefined;
  if(!lines[2].match(cellSepalater)) return undefined;

  //normalize
  lines = lines.map(function(line) {
    return line.replace(/^\s*\|\s*/, '').replace(/\s*\|\s*$/, '');
  });

  cellAligns = lines[1].split(cellSepalater).map(function(cell) {
    if(/^:-*:$/.test(cell)) {
      return 'center';
    } else if(/^-+:$/.test(cell)) {
      return 'right';
    } else {
      return 'left';
    }
  });

  function createCell(text, align) {
    return ['td', {align: align || 'left'}].concat(self.processInline(text));
  }

  //thead cells
  tr = ['tr'].concat(lines[0].split(cellSepalater).map(function(text) {
    return createCell(text, 'center');
  }));
  thead = thead.concat([tr]);

  //tbody cells
  for(i = 2, n = lines.length; i < n; ++i) {
    tr = ['tr'].concat(lines[i].split(cellSepalater).map(function(text, i) {
      return createCell(text, cellAligns[i]);
    }));
    tbody = tbody.concat([tr]);
  }

  return [['table', thead, tbody]];
};

Markdown.buildBlockOrder(Markdown.dialects.GFM.block);
Markdown.buildInlinePatterns(Markdown.dialects.GFM.inline);

});