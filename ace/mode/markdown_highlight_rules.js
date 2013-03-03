/* ***** BEGIN LICENSE BLOCK *****
 * Distributed under the BSD license:
 *
 * Copyright (c) 2010, Ajax.org B.V.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *     * Redistributions of source code must retain the above copyright
 *       notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above copyright
 *       notice, this list of conditions and the following disclaimer in the
 *       documentation and/or other materials provided with the distribution.
 *     * Neither the name of Ajax.org B.V. nor the
 *       names of its contributors may be used to endorse or promote products
 *       derived from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL AJAX.ORG B.V. BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 * ***** END LICENSE BLOCK ***** */

define(function(require, exports, module) {
"use strict";

var oop = require("../lib/oop");
var AbapHighlightRules = require("./abap_highlight_rules").AbapHighlightRules;
var AsciidocHighlightRules = require("./asciidoc_highlight_rules").AsciidocHighlightRules;
var C9SearchHighlightRules = require("./c9search_highlight_rules").C9SearchHighlightRules;
var c_cppHighlightRules = require("./c_cpp_highlight_rules").c_cppHighlightRules;
var ClojureHighlightRules = require("./clojure_highlight_rules").ClojureHighlightRules;
var CoffeeHighlightRules = require("./coffee_highlight_rules").CoffeeHighlightRules;
var ColdfusionHighlightRules = require("./coldfusion_highlight_rules").ColdfusionHighlightRules;
var CSharpHighlightRules = require("./csharp_highlight_rules").CSharpHighlightRules;
var CssHighlightRules = require("./css_highlight_rules").CssHighlightRules;
var CurlyHighlightRules = require("./curly_highlight_rules").CurlyHighlightRules;
var DartHighlightRules = require("./dart_highlight_rules").DartHighlightRules;
var DiffHighlightRules = require("./diff_highlight_rules").DiffHighlightRules;
var DotHighlightRules = require("./dot_highlight_rules").DotHighlightRules;
var glslHighlightRules = require("./glsl_highlight_rules").glslHighlightRules;
var GolangHighlightRules = require("./golang_highlight_rules").GolangHighlightRules;
var GroovyHighlightRules = require("./groovy_highlight_rules").GroovyHighlightRules;
var HamlHighlightRules = require("./haml_highlight_rules").HamlHighlightRules;
var HaxeHighlightRules = require("./haxe_highlight_rules").HaxeHighlightRules;
var HtmlHighlightRules = require("./html_highlight_rules").HtmlHighlightRules;
var JadeHighlightRules = require("./jade_highlight_rules").JadeHighlightRules;
var JavaHighlightRules = require("./java_highlight_rules").JavaHighlightRules;
var JavaScriptHighlightRules = require("./javascript_highlight_rules").JavaScriptHighlightRules;
var JspHighlightRules = require("./jsp_highlight_rules").JspHighlightRules;
var JsxHighlightRules = require("./jsx_highlight_rules").JsxHighlightRules;
var LatexHighlightRules = require("./latex_highlight_rules").LatexHighlightRules;
var LessHighlightRules = require("./less_highlight_rules").LessHighlightRules;
var LiquidHighlightRules = require("./liquid_highlight_rules").LiquidHighlightRules;
var LispHighlightRules = require("./lisp_highlight_rules").LispHighlightRules;
var LuaHighlightRules = require("./lua_highlight_rules").LuaHighlightRules;
var LuaPageHighlightRules = require("./luapage_highlight_rules").LuaPageHighlightRules;
var LuceneHighlightRules = require("./lucene_highlight_rules").LuceneHighlightRules;
var MakefileHighlightRules = require("./makefile_highlight_rules").MakefileHighlightRules;
var ObjectiveCHighlightRules = require("./objectivec_highlight_rules").ObjectiveCHighlightRules;
var OcamlHighlightRules = require("./ocaml_highlight_rules").OcamlHighlightRules;
var PascalHighlightRules = require("./pascal_highlight_rules").PascalHighlightRules;
var PerlHighlightRules = require("./perl_highlight_rules").PerlHighlightRules;
var PgsqlHighlightRules = require("./pgsql_highlight_rules").PgsqlHighlightRules;
var PhpHighlightRules = require("./php_highlight_rules").PhpHighlightRules;
var PowershellHighlightRules = require("./powershell_highlight_rules").PowershellHighlightRules;
var PythonHighlightRules = require("./python_highlight_rules").PythonHighlightRules;
var RHighlightRules = require("./r_highlight_rules").RHighlightRules;
var RDocHighlightRules = require("./rdoc_highlight_rules").RDocHighlightRules;
var RHtmlHighlightRules = require("./rhtml_highlight_rules").RHtmlHighlightRules;
var RubyHighlightRules = require("./ruby_highlight_rules").RubyHighlightRules;
var SassHighlightRules = require("./sass_highlight_rules").SassHighlightRules;
var scadHighlightRules = require("./scad_highlight_rules").scadHighlightRules;
var ScalaHighlightRules = require("./scala_highlight_rules").ScalaHighlightRules;
var SchemeHighlightRules = require("./scheme_highlight_rules").SchemeHighlightRules;
var ScssHighlightRules = require("./scss_highlight_rules").ScssHighlightRules;
var ShHighlightRules = require("./sh_highlight_rules").ShHighlightRules;
var SqlHighlightRules = require("./sql_highlight_rules").SqlHighlightRules;
var StylusHighlightRules = require("./stylus_highlight_rules").StylusHighlightRules;
var SvgHighlightRules = require("./svg_highlight_rules").SvgHighlightRules;
var TclHighlightRules = require("./tcl_highlight_rules").TclHighlightRules;
var TexHighlightRules = require("./tex_highlight_rules").TexHighlightRules;
var TextHighlightRules = require("./text_highlight_rules").TextHighlightRules;
var TextileHighlightRules = require("./textile_highlight_rules").TextileHighlightRules;
var TypeScriptHighlightRules = require("./typescript_highlight_rules").TypeScriptHighlightRules;
var VBScriptHighlightRules = require("./vbscript_highlight_rules").VBScriptHighlightRules;
var XmlHighlightRules = require("./xml_highlight_rules").XmlHighlightRules;
var YamlHighlightRules = require("./yaml_highlight_rules").YamlHighlightRules;


function github_embed(tag, prefix) {
    return { // Github style block
        token : "support.function",
        regex : "^```" + tag + "\\s*$",
        next  : prefix + "start"
    };
}

var MarkdownHighlightRules = function() {

    // regexp must not have capturing parentheses
    // regexps are ordered -> the first match is used

    this.$rules = {
        "basic" : [{ // code span `
            token : "support.function",
            regex : "(`+)(.*?[^`])(\\1)"
        }, { // reference
            token : ["text", "constant", "text", "url", "string", "text"],
            regex : "^([ ]{0,3}\\[)([^\\]]+)(\\]:\\s*)([^ ]+)(\\s*(?:[\"][^\"]+[\"])?(\\s*))$"
        }, { // link by reference
            token : ["text", "string", "text", "constant", "text"],
            regex : "(\\[)((?:[[^\\]]*\\]|[^\\[\\]])*)(\\][ ]?(?:\\n[ ]*)?\\[)(.*?)(\\])"
        }, { // link by url
            token : ["text", "string", "text", "markup.underline", "string", "text"],
            regex : "(\\[)"+
                    "(\\[[^\\]]*\\]|[^\\[\\]]*)"+
                    "(\\]\\([ \\t]*)"+
                    "(<?(?:(?:[^\\(]*?\\([^\\)]*?\\)\\S*?)|(?:.*?))>?)"+
                    "((?:[ \t]*\"(?:.*?)\"[ \\t]*)?)"+
                    "(\\))"
        }, { // strong ** __
            token : "string",
            regex : "([*]{2}|[_]{2}(?=\\S))(.*?\\S[*_]*)(\\1)"
        }, { // emphasis * _
            token : "string",
            regex : "([*]|[_](?=\\S))(.*?\\S[*_]*)(\\1)"
        }, { //
            token : ["text", "url", "text"],
            regex : "(<)("+
                      "(?:https?|ftp|dict):[^'\">\\s]+"+
                      "|"+
                      "(?:mailto:)?[-.\\w]+\\@[-a-z0-9]+(?:\\.[-a-z0-9]+)*\\.[a-z]+"+
                    ")(>)"
        }],

        // code block
        "allowBlock": [
            {token : "support.function", regex : "^ {4}.+", next : "allowBlock"},
            {token : "empty", regex : "", next : "start"}
        ],

        "start" : [{
            token : "empty_line",
            regex : '^$',
            next: "allowBlock"
        }, { // h1
            token: "markup.heading.1",
            regex: "^=+(?=\\s*$)"
        }, { // h2
            token: "markup.heading.2",
            regex: "^\\-+(?=\\s*$)"
        }, {
            token : function(value) {
                return "markup.heading." + value.length;
            },
            regex : /^#{1,6}(?=\s*[^ #]|\s+#.)/,
            next : "header"
        },
        github_embed("abap", "abap-"),
        github_embed("asciidoc", "asciidoc-"),
        github_embed("c9search", "c9search-"),
        github_embed("(?:cpp|c)", "c_cpp-"),
        github_embed("clojure", "clojure-"),
        github_embed("(?:coffeescrit|coffee)", "coffee-"),
        github_embed("coldfusion", "coldfusion-"),
        github_embed("csharp", "csharp-"),
        github_embed("curly", "curly-"),
        github_embed("css", "css-"),
        github_embed("dart", "dart-"),
        github_embed("diff", "diff-"),
        github_embed("dot", "dot-"),
        github_embed("glsl", "glsl-"),
        github_embed("(?:golang|go)", "golang-"),
        github_embed("groovy", "groovy-"),
        github_embed("haml", "haml-"),
        github_embed("haxe", "haxe-"),
        github_embed("html", "html-"),
        github_embed("jade", "jade-"),
        github_embed("java", "java-"),
        github_embed("(?:javascript|js)", "js-"),
        github_embed("jsp", "jsp-"),
        github_embed("jsx", "jsx-"),
        github_embed("latex", "latex-"),
        github_embed("less", "less-"),
        github_embed("liquid", "liquid-"),
        github_embed("lisp", "lisp-"),
        github_embed("lua", "lua-"),
        github_embed("luapage", "luapage-"),
        github_embed("lucene", "lucene-"),
        github_embed("makefile", "makefile-"),
        // github_embed("markdown", "markdown-"),
        github_embed("(?:objectivec|objc)", "objectivec-"),
        github_embed("ocaml", "ocaml-"),
        github_embed("pascal", "pascal-"),
        github_embed("perl", "perl-"),
        github_embed("pgsql", "pgsql-"),
        github_embed("php", "php-"),
        github_embed("powershell", "powershell-"),
        github_embed("python", "python-"),
        github_embed("r", "r-"),
        github_embed("rdoc", "rdoc-"),
        github_embed("rhtml", "rhtml-"),
        github_embed("ruby", "ruby-"),
        github_embed("sass", "sass-"),
        github_embed("scad", "scad-"),
        github_embed("scala", "scala-"),
        github_embed("scheme", "scheme-"),
        github_embed("scss", "scss-"),
        github_embed("sh", "sh-"),
        github_embed("sql", "sql-"),
        github_embed("stylus", "stylus-"),
        github_embed("svg", "svg-"),
        github_embed("tcl", "tcl-"),
        github_embed("tex", "tex-"),
        github_embed("textile", "textile-"),
        github_embed("(?:typescript|ts)", "typescript-"),
        github_embed("(?:vbscript|vb)", "vbscript-"),
        github_embed("xml", "xml-"),
        github_embed("yaml", "yaml-"),
        { // Github style block
            token : "support.function",
            regex : "^```\\s*[a-zA-Z]*(?:{.*?\\})?\\s*$",
            next  : "githubblock"
        }, { // block quote
            token : "string",
            regex : "^>[ ].+$",
            next  : "blockquote"
        }, { // HR * - _
            token : "constant",
            regex : "^ {0,2}(?:(?: ?\\* ?){3,}|(?: ?\\- ?){3,}|(?: ?\\_ ?){3,})\\s*$",
            next: "allowBlock"
        }, { // list
            token : "markup.list",
            regex : "^\\s{0,3}(?:[*+-]|\\d+\\.)\\s+",
            next  : "listblock-start"
        }, {
            include : "basic"
        }],
        
        "header" : [{
            regex: "$",
            next : "start"
        }, {
            include: "basic"
        }, {
            defaultToken : "markup.heading"
        } ],

        "listblock-start" : [{
            token : "support.variable",
            regex : /(?:\[[ x]\])?/,
            next  : "listblock"
        }],

        "listblock" : [ { // Lists only escape on completely blank lines.
            token : "empty_line",
            regex : "^$",
            next  : "start"
        }, {
            include : "basic", noEscape: true
        }, { // list
            token : "markup.list",
            regex : "^\\s{0,3}(?:[*+-]|\\d+\\.)\\s+",
            next  : "listblock-start"
        }, {
            defaultToken : "markup.list"
        } ],

        "blockquote" : [ { // BLockquotes only escape on blank lines.
            token : "empty_line",
            regex : "^\\s*$",
            next  : "start"
        }, {
            token : "string",
            regex : ".+"
        } ],

        "githubblock" : [ {
            token : "support.function",
            regex : "^```",
            next  : "start"
        }, {
            token : "support.function",
            regex : ".+"
        } ]
    };

    [
        [AbapHighlightRules, "abap-"],
        [AsciidocHighlightRules, "asciidoc-"],
        [C9SearchHighlightRules, "c9search-"],
        [c_cppHighlightRules, "c_cpp-"],
        [ClojureHighlightRules, "clojure-"],
        [CoffeeHighlightRules, "coffee-"],
        [ColdfusionHighlightRules, "coldfusion-"],
        [CSharpHighlightRules, "csharp-"],
        [CssHighlightRules, "curly-"],
        [CurlyHighlightRules, "css-"],
        [DartHighlightRules, "dart-"],
        [DiffHighlightRules, "diff-"],
        [DotHighlightRules, "dot-"],
        [glslHighlightRules, "glsl-"],
        [GolangHighlightRules, "golang-"],
        [GroovyHighlightRules, "groovy-"],
        [HamlHighlightRules, "haml-"],
        [HaxeHighlightRules, "haxe-"],
        [HtmlHighlightRules, "html-"],
        [JadeHighlightRules, "jade-"],
        [JavaHighlightRules, "java-"],
        [JavaScriptHighlightRules, "js-"],
        [JspHighlightRules, "jsp-"],
        [JsxHighlightRules, "jsx-"],
        [LatexHighlightRules, "latex-"],
        [LessHighlightRules, "less-"],
        [LiquidHighlightRules, "liquid-"],
        [LispHighlightRules, "lisp-"],
        [LuaHighlightRules, "lua-"],
        [LuaPageHighlightRules, "luapage-"],
        [LuceneHighlightRules, "lucene-"],
        [MakefileHighlightRules, "makefile-"],
        // [MarkdownHighlightRules, "markdown-"],
        [ObjectiveCHighlightRules, "objectivec-"],
        [OcamlHighlightRules, "ocaml-"],
        [PascalHighlightRules, "pascal-"],
        [PerlHighlightRules, "perl-"],
        [PgsqlHighlightRules, "pgsql-"],
        [PhpHighlightRules, "php-"],
        [PowershellHighlightRules, "powershell-"],
        [PythonHighlightRules, "python-"],
        [RHighlightRules, "r-"],
        [RDocHighlightRules, "rdoc-"],
        [RHtmlHighlightRules, "rhtml-"],
        [RubyHighlightRules, "ruby-"],
        [SassHighlightRules, "sass-"],
        [scadHighlightRules, "scad-"],
        [ScalaHighlightRules, "scala-"],
        [SchemeHighlightRules, "scheme-"],
        [ScssHighlightRules, "scss-"],
        [ShHighlightRules, "sh-"],
        [SqlHighlightRules, "sql-"],
        [StylusHighlightRules, "stylus-"],
        [SvgHighlightRules, "svg-"],
        [TclHighlightRules, "tcl-"],
        [TexHighlightRules, "tex-"],
        [TextileHighlightRules, "textile-"],
        [TypeScriptHighlightRules , "typescript-"],
        [VBScriptHighlightRules, "vbscript-"],
        [XmlHighlightRules, "xml-"],
        [YamlHighlightRules, "yaml-"]
    ].forEach(function(v){
        this.embedRules(v[0], v[1], [{
            token : "support.function",
            regex : "^```",
            next  : "start"
        }]);
    }.bind(this));

    var html = new HtmlHighlightRules().getRules();
    for (var i in html) {
        if (this.$rules[i])
            this.$rules[i] = this.$rules[i].concat(html[i]);
        else
            this.$rules[i] = html[i];
    }

    this.normalizeRules();
};
oop.inherits(MarkdownHighlightRules, TextHighlightRules);

exports.MarkdownHighlightRules = MarkdownHighlightRules;
});
