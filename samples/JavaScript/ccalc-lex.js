/* generated by jison-lex 0.3.4-159 */
var ccalcLex = (function () {
// See also:
// http://stackoverflow.com/questions/1382107/whats-a-good-way-to-extend-error-in-javascript/#35881508
// but we keep the prototype.constructor and prototype.name assignment lines too for compatibility
// with userland code which might access the derived class in a 'classic' way.
function JisonLexerError(msg, hash) {
    Object.defineProperty(this, 'name', {
        enumerable: false,
        writable: false,
        value: 'JisonLexerError'
    });

    if (msg == null) msg = '???';

    Object.defineProperty(this, 'message', {
        enumerable: false,
        writable: true,
        value: msg
    });

    this.hash = hash;

    var stacktrace;
    if (hash && hash.exception instanceof Error) {
        var ex2 = hash.exception;
        this.message = ex2.message || msg;
        stacktrace = ex2.stack;
    }
    if (!stacktrace) {
        if (Error.hasOwnProperty('captureStackTrace')) { // V8
            Error.captureStackTrace(this, this.constructor);
        } else {
            stacktrace = (new Error(msg)).stack;
        }
    }
    if (stacktrace) {
        Object.defineProperty(this, 'stack', {
            enumerable: false,
            writable: false,
            value: stacktrace
        });
    }
}

if (typeof Object.setPrototypeOf === 'function') {
    Object.setPrototypeOf(JisonLexerError.prototype, Error.prototype);
} else {
    JisonLexerError.prototype = Object.create(Error.prototype);
}
JisonLexerError.prototype.constructor = JisonLexerError;
JisonLexerError.prototype.name = 'JisonLexerError';


var lexer = {
    EOF: 1,
    ERROR: 2,

    // JisonLexerError: JisonLexerError,        // <-- injected by the code generator

    // options: {},                             // <-- injected by the code generator

    // yy: ...,                                 // <-- injected by setInput()

    __currentRuleSet__: null,                   // <-- internal rule set cache for the current lexer state

    __error_infos: [],                          // INTERNAL USE ONLY: the set of lexErrorInfo objects created since the last cleanup

    __decompressed: false,                      // INTERNAL USE ONLY: mark whether the lexer instance has been 'unfolded' completely and is now ready for use

    done: false,                                // INTERNAL USE ONLY
    _backtrack: false,                          // INTERNAL USE ONLY
    _input: '',                                 // INTERNAL USE ONLY
    _more: false,                               // INTERNAL USE ONLY
    _signaled_error_token: false,               // INTERNAL USE ONLY

    conditionStack: [],                         // INTERNAL USE ONLY; managed via `pushState()`, `popState()`, `topState()` and `stateStackSize()`

    match: '',                                  // READ-ONLY EXTERNAL ACCESS - ADVANCED USE ONLY: tracks input which has been matched so far for the lexer token under construction. `match` is identical to `yytext` except that this one still contains the matched input string after `lexer.performAction()` has been invoked, where userland code MAY have changed/replaced the `yytext` value entirely!
    matched: '',                                // READ-ONLY EXTERNAL ACCESS - ADVANCED USE ONLY: tracks entire input which has been matched so far
    matches: false,                             // READ-ONLY EXTERNAL ACCESS - ADVANCED USE ONLY: tracks RE match result for last (successful) match attempt
    yytext: '',                                 // ADVANCED USE ONLY: tracks input which has been matched so far for the lexer token under construction; this value is transferred to the parser as the 'token value' when the parser consumes the lexer token produced through a call to the `lex()` API.
    offset: 0,                                  // READ-ONLY EXTERNAL ACCESS - ADVANCED USE ONLY: tracks the 'cursor position' in the input string, i.e. the number of characters matched so far
    yyleng: 0,                                  // READ-ONLY EXTERNAL ACCESS - ADVANCED USE ONLY: length of matched input for the token under construction (`yytext`)
    yylineno: 0,                                // READ-ONLY EXTERNAL ACCESS - ADVANCED USE ONLY: 'line number' at which the token under construction is located
    yylloc: null,                               // READ-ONLY EXTERNAL ACCESS - ADVANCED USE ONLY: tracks location info (lines + columns) for the token under construction

    // INTERNAL USE: construct a suitable error info hash object instance for `parseError`.
    constructLexErrorInfo: function lexer_constructLexErrorInfo(msg, recoverable) {
        var pei = {
            errStr: msg,
            recoverable: !!recoverable,
            text: this.match,           // This one MAY be empty; userland code should use the `upcomingInput` API to obtain more text which follows the 'lexer cursor position'...
            token: null,
            line: this.yylineno,
            loc: this.yylloc,
            yy: this.yy,
            lexer: this,

            // and make sure the error info doesn't stay due to potential
            // ref cycle via userland code manipulations.
            // These would otherwise all be memory leak opportunities!
            //
            // Note that only array and object references are nuked as those
            // constitute the set of elements which can produce a cyclic ref.
            // The rest of the members is kept intact as they are harmless.
            destroy: function destructLexErrorInfo() {
                // remove cyclic references added to error info:
                // info.yy = null;
                // info.lexer = null;
                // ...
                var rec = !!this.recoverable;
                for (var key in this) {
                    if (this.hasOwnProperty(key) && typeof key === 'object') {
                        this[key] = undefined;
                    }
                }
                this.recoverable = rec;
            }
        };
        // track this instance so we can `destroy()` it once we deem it superfluous and ready for garbage collection!
        this.__error_infos.push(pei);
        return pei;
    },

    parseError: function lexer_parseError(str, hash) {
        if (this.yy.parser && typeof this.yy.parser.parseError === 'function') {
            return this.yy.parser.parseError(str, hash) || this.ERROR;
        } else if (typeof this.yy.parseError === 'function') {
            return this.yy.parseError.call(this, str, hash) || this.ERROR;
        } else {
            throw new this.JisonLexerError(str);
        }
    },

    // final cleanup function for when we have completed lexing the input; 
    // make it an API so that external code can use this one once userland
    // code has decided it's time to destroy any lingering lexer error
    // hash object instances and the like: this function helps to clean
    // up these constructs, which *may* carry cyclic references which would
    // otherwise prevent the instances from being properly and timely
    // garbage-collected, i.e. this function helps prevent memory leaks!
    cleanupAfterLex: function lexer_cleanupAfterLex(do_not_nuke_errorinfos) {
        var rv;

        // prevent lingering circular references from causing memory leaks:
        this.setInput('', {});

        // nuke the error hash info instances created during this run.
        // Userland code must COPY any data/references
        // in the error hash instance(s) it is more permanently interested in.
        if (!do_not_nuke_errorinfos) {
            for (var i = this.__error_infos.length - 1; i >= 0; i--) {
                var el = this.__error_infos[i];
                if (el && typeof el.destroy === 'function') {
                    el.destroy();
                }
            }
            this.__error_infos.length = 0;
        }

        return this;
    },

    // clear the lexer token context; intended for internal use only
    clear: function lexer_clear() {
        this.yytext = '';
        this.yyleng = 0;
        this.match = '';
        this.matches = false;
        this._more = false;
        this._backtrack = false;
    },

    // resets the lexer, sets new input
    setInput: function lexer_setInput(input, yy) {
        this.yy = yy || this.yy || {};

        // also check if we've fully initialized the lexer instance,
        // including expansion work to be done to go from a loaded
        // lexer to a usable lexer:
        if (!this.__decompressed) {
          // step 1: decompress the regex list:
          var rules = this.rules;
          for (var i = 0, len = rules.length; i < len; i++) {
            var rule_re = rules[i];

            // compression: is the RE an xref to another RE slot in the rules[] table?
            if (typeof rule_re === 'number') {
              rules[i] = rules[rule_re];
            }
          }

          // step 2: unfold the conditions[] set to make these ready for use:
          var conditions = this.conditions;
          for (var k in conditions) {
            var spec = conditions[k];

            var rule_ids = spec.rules;

            var len = rule_ids.length;
            var rule_regexes = new Array(len + 1);            // slot 0 is unused; we use a 1-based index approach here to keep the hottest code in `lexer_next()` fast and simple!
            var rule_new_ids = new Array(len + 1);

            if (this.rules_prefix1) {
                var rule_prefixes = new Array(65536);
                var first_catch_all_index = 0;

                for (var i = 0; i < len; i++) {
                  var idx = rule_ids[i];
                  var rule_re = rules[idx];
                  rule_regexes[i + 1] = rule_re;
                  rule_new_ids[i + 1] = idx;

                  var prefix = this.rules_prefix1[idx];
                  // compression: is the PREFIX-STRING an xref to another PREFIX-STRING slot in the rules_prefix1[] table?
                  if (typeof prefix === 'number') {
                    prefix = this.rules_prefix1[prefix];
                  }
                  // init the prefix lookup table: first come, first serve...
                  if (!prefix) {
                    if (!first_catch_all_index) {
                      first_catch_all_index = i + 1;
                    }
                  } else {
                    for (var j = 0, pfxlen = prefix.length; j < pfxlen; j++) {
                      var pfxch = prefix.charCodeAt(j);
                      // first come, first serve:
                      if (!rule_prefixes[pfxch]) {
                        rule_prefixes[pfxch] = i + 1;
                      }  
                    }
                  }
                }

                // if no catch-all prefix has been encountered yet, it means all
                // rules have limited prefix sets and it MAY be that particular
                // input characters won't be recognized by any rule in this 
                // condition state.
                // 
                // To speed up their discovery at run-time while keeping the
                // remainder of the lexer kernel code very simple (and fast),
                // we point these to an 'illegal' rule set index *beyond*
                // the end of the rule set.
                if (!first_catch_all_index) {
                  first_catch_all_index = len + 1;
                }

                for (var i = 0; i < 65536; i++) {
                  if (!rule_prefixes[i]) {
                    rule_prefixes[i] = first_catch_all_index; 
                  }
                }

                spec.__dispatch_lut = rule_prefixes;
            } else {
                for (var i = 0; i < len; i++) {
                  var idx = rule_ids[i];
                  var rule_re = rules[idx];
                  rule_regexes[i + 1] = rule_re;
                  rule_new_ids[i + 1] = idx;
                }
            }

            spec.rules = rule_new_ids;
            spec.__rule_regexes = rule_regexes;
            spec.__rule_count = len;
          }

          this.__decompressed = true;
        }

        this._input = input || '';
        this.clear();
        this._signaled_error_token = false;
        this.done = false;
        this.yylineno = 0;
        this.matched = '';
        this.conditionStack = ['INITIAL'];
        this.__currentRuleSet__ = null;
        this.yylloc = {
            first_line: 1,
            first_column: 0,
            last_line: 1,
            last_column: 0
        };
        if (this.options.ranges) {
            this.yylloc.range = [0, 0];
        }
        this.offset = 0;
        return this;
    },

    // consumes and returns one char from the input
    input: function lexer_input() {
        if (!this._input) {
            this.done = true;
            return null;
        }
        var ch = this._input[0];
        this.yytext += ch;
        this.yyleng++;
        this.offset++;
        this.match += ch;
        this.matched += ch;
        // Count the linenumber up when we hit the LF (or a stand-alone CR).
        // On CRLF, the linenumber is incremented when you fetch the CR or the CRLF combo
        // and we advance immediately past the LF as well, returning both together as if
        // it was all a single 'character' only.
        var slice_len = 1;
        var lines = false;
        if (ch === '\n') {
            lines = true;
        } else if (ch === '\r') {
            lines = true;
            var ch2 = this._input[1];
            if (ch2 === '\n') {
                slice_len++;
                ch += ch2;
                this.yytext += ch2;
                this.yyleng++;
                this.offset++;
                this.match += ch2;
                this.matched += ch2;
                if (this.options.ranges) {
                    this.yylloc.range[1]++;
                }
            }
        }
        if (lines) {
            this.yylineno++;
            this.yylloc.last_line++;
        } else {
            this.yylloc.last_column++;
        }
        if (this.options.ranges) {
            this.yylloc.range[1]++;
        }

        this._input = this._input.slice(slice_len);
        return ch;
    },

    // unshifts one char (or a string) into the input
    unput: function lexer_unput(ch) {
        var len = ch.length;
        var lines = ch.split(/(?:\r\n?|\n)/g);

        this._input = ch + this._input;
        this.yytext = this.yytext.substr(0, this.yytext.length - len);
        //this.yyleng -= len;
        this.offset -= len;
        var oldLines = this.match.split(/(?:\r\n?|\n)/g);
        this.match = this.match.substr(0, this.match.length - len);
        this.matched = this.matched.substr(0, this.matched.length - len);

        if (lines.length - 1) {
            this.yylineno -= lines.length - 1;
        }

        this.yylloc.last_line = this.yylineno + 1;
        this.yylloc.last_column = (lines ?
                (lines.length === oldLines.length ? this.yylloc.first_column : 0)
                + oldLines[oldLines.length - lines.length].length - lines[0].length :
                this.yylloc.first_column - len);

        if (this.options.ranges) {
            this.yylloc.range[1] = this.yylloc.range[0] + this.yyleng - len;
        }
        this.yyleng = this.yytext.length;
        this.done = false;
        return this;
    },

    // When called from action, caches matched text and appends it on next action
    more: function lexer_more() {
        this._more = true;
        return this;
    },

    // When called from action, signals the lexer that this rule fails to match the input, so the next matching rule (regex) should be tested instead.
    reject: function lexer_reject() {
        if (this.options.backtrack_lexer) {
            this._backtrack = true;
        } else {
            // when the parseError() call returns, we MUST ensure that the error is registered.
            // We accomplish this by signaling an 'error' token to be produced for the current
            // .lex() run.
            var p = this.constructLexErrorInfo('Lexical error on line ' + (this.yylineno + 1) + '. You can only invoke reject() in the lexer when the lexer is of the backtracking persuasion (options.backtrack_lexer = true).\n' + this.showPosition(), false);
            this._signaled_error_token = (this.parseError(p.errStr, p) || this.ERROR);
        }
        return this;
    },

    // retain first n characters of the match
    less: function lexer_less(n) {
        return this.unput(this.match.slice(n));
    },

    // return (part of the) already matched input, i.e. for error messages.
    // Limit the returned string length to `maxSize` (default: 20).
    // Limit the returned string to the `maxLines` number of lines of input (default: 1).
    // Negative limit values equal *unlimited*.
    pastInput: function lexer_pastInput(maxSize, maxLines) {
        var past = this.matched.substring(0, this.matched.length - this.match.length);
        if (maxSize < 0)
            maxSize = past.length;
        else if (!maxSize)
            maxSize = 20;
        if (maxLines < 0)
            maxLines = past.length;         // can't ever have more input lines than this!
        else if (!maxLines)
            maxLines = 1;
        // `substr` anticipation: treat \r\n as a single character and take a little
        // more than necessary so that we can still properly check against maxSize
        // after we've transformed and limited the newLines in here:
        past = past.substr(-maxSize * 2 - 2);
        // now that we have a significantly reduced string to process, transform the newlines
        // and chop them, then limit them:
        var a = past.replace(/\r\n|\r/g, '\n').split('\n');
        a = a.slice(-maxLines);
        past = a.join('\n');
        // When, after limiting to maxLines, we still have too much to return, 
        // do add an ellipsis prefix...
        if (past.length > maxSize) {
            past = '...' + past.substr(-maxSize);
        }
        return past;
    },

    // return (part of the) upcoming input, i.e. for error messages.
    // Limit the returned string length to `maxSize` (default: 20).
    // Limit the returned string to the `maxLines` number of lines of input (default: 1).
    // Negative limit values equal *unlimited*.
    upcomingInput: function lexer_upcomingInput(maxSize, maxLines) {
        var next = this.match;
        if (maxSize < 0)
            maxSize = next.length + this._input.length;
        else if (!maxSize)
            maxSize = 20;
        if (maxLines < 0)
            maxLines = maxSize;         // can't ever have more input lines than this!
        else if (!maxLines)
            maxLines = 1;
        // `substring` anticipation: treat \r\n as a single character and take a little
        // more than necessary so that we can still properly check against maxSize
        // after we've transformed and limited the newLines in here:
        if (next.length < maxSize * 2 + 2) {
            next += this._input.substring(0, maxSize * 2 + 2);  // substring is faster on Chrome/V8
        }
        // now that we have a significantly reduced string to process, transform the newlines
        // and chop them, then limit them:
        var a = next.replace(/\r\n|\r/g, '\n').split('\n');
        a = a.slice(0, maxLines);
        next = a.join('\n');
        // When, after limiting to maxLines, we still have too much to return, 
        // do add an ellipsis postfix...
        if (next.length > maxSize) {
            next = next.substring(0, maxSize) + '...';
        }
        return next;
    },

    // return a string which displays the character position where the lexing error occurred, i.e. for error messages
    showPosition: function lexer_showPosition(maxPrefix, maxPostfix) {
        var pre = this.pastInput(maxPrefix).replace(/\s/g, ' ');
        var c = new Array(pre.length + 1).join('-');
        return pre + this.upcomingInput(maxPostfix).replace(/\s/g, ' ') + '\n' + c + '^';
    },

    // helper function, used to produce a human readable description as a string, given
    // the input `yylloc` location object. 
    // Set `display_range_too` to TRUE to include the string character index position(s)
    // in the description if the `yylloc.range` is available. 
    describeYYLLOC: function lexer_describe_yylloc(yylloc, display_range_too) {
        var l1 = yylloc.first_line;
        var l2 = yylloc.last_line;
        var o1 = yylloc.first_column;
        var o2 = yylloc.last_column - 1;
        var dl = l2 - l1;
        var d_o = (dl === 0 ? o2 - o1 : 1000);
        var rv;
        if (dl === 0) {
            rv = 'line ' + l1 + ', ';
            if (d_o === 0) {
                rv += 'column ' + o1;
            } else {
                rv += 'columns ' + o1 + ' .. ' + o2;
            }
        } else {
            rv = 'lines ' + l1 + '(column ' + o1 + ') .. ' + l2 + '(column ' + o2 + ')';
        }
        if (yylloc.range && display_range_too) {
            var r1 = yylloc.range[0];
            var r2 = yylloc.range[1] - 1;
            if (r2 === r1) {
                rv += ' {String Offset: ' + r1 + '}';
            } else {
                rv += ' {String Offset range: ' + r1 + ' .. ' + r2 + '}';
            }
        }
        return rv;
        // return JSON.stringify(yylloc);
    },

    // test the lexed token: return FALSE when not a match, otherwise return token.
    //
    // `match` is supposed to be an array coming out of a regex match, i.e. `match[0]`
    // contains the actually matched text string.
    //
    // Also move the input cursor forward and update the match collectors:
    // - yytext
    // - yyleng
    // - match
    // - matches
    // - yylloc
    // - offset
    test_match: function lexer_test_match(match, indexed_rule) {
        var token,
            lines,
            backup,
            match_str;

        if (this.options.backtrack_lexer) {
            // save context
            backup = {
                yylineno: this.yylineno,
                yylloc: {
                    first_line: this.yylloc.first_line,
                    last_line: this.last_line,
                    first_column: this.yylloc.first_column,
                    last_column: this.yylloc.last_column
                },
                yytext: this.yytext,
                match: this.match,
                matches: this.matches,
                matched: this.matched,
                yyleng: this.yyleng,
                offset: this.offset,
                _more: this._more,
                _input: this._input,
                yy: this.yy,
                conditionStack: this.conditionStack.slice(0),
                done: this.done
            };
            if (this.options.ranges) {
                backup.yylloc.range = this.yylloc.range.slice(0);
            }
        }

        match_str = match[0];
        lines = match_str.match(/(?:\r\n?|\n).*/g);
        if (lines) {
            this.yylineno += lines.length;
        }
        this.yylloc = {
            first_line: this.yylloc.last_line,
            last_line: this.yylineno + 1,
            first_column: this.yylloc.last_column,
            last_column: lines ?
                         lines[lines.length - 1].length - lines[lines.length - 1].match(/\r?\n?/)[0].length :
                         this.yylloc.last_column + match_str.length
        };
        this.yytext += match_str;
        this.match += match_str;
        this.matches = match;
        this.yyleng = this.yytext.length;
        if (this.options.ranges) {
            this.yylloc.range = [this.offset, this.offset + this.yyleng];
        }
        // previous lex rules MAY have invoked the `more()` API rather than producing a token:
        // those rules will already have moved this `offset` forward matching their match lengths,
        // hence we must only add our own match length now:
        this.offset += match_str.length;
        this._more = false;
        this._backtrack = false;
        this._input = this._input.slice(match_str.length);
        this.matched += match_str;

        // calling this method: 
        //
        //   function lexer__performAction(yy, yy_, $avoiding_name_collisions, YY_START) {...}
        token = this.performAction.call(this, this.yy, this, indexed_rule, this.conditionStack[this.conditionStack.length - 1] /* = YY_START */);
        // otherwise, when the action codes are all simple return token statements:
        //token = this.simpleCaseActionClusters[indexed_rule];

        if (this.done && this._input) {
            this.done = false;
        }
        if (token) {
            return token;
        } else if (this._backtrack) {
            // recover context
            for (var k in backup) {
                this[k] = backup[k];
            }
            this.__currentRuleSet__ = null;
            return false; // rule action called reject() implying the next rule should be tested instead.
        } else if (this._signaled_error_token) {
            // produce one 'error' token as .parseError() in reject() did not guarantee a failure signal by throwing an exception!
            token = this._signaled_error_token;
            this._signaled_error_token = false;
            return token;
        }
        return false;
    },

    // return next match in input
    next: function lexer_next() {
        if (this.done) {
            this.clear();
            return this.EOF;
        }
        if (!this._input) {
            this.done = true;
        }

        var token,
            match,
            tempMatch,
            index;
        if (!this._more) {
            this.clear();
        }
        var spec = this.__currentRuleSet__;
        if (!spec) {
            // Update the ruleset cache as we apparently encountered a state change or just started lexing.
            // The cache is set up for fast lookup -- we assume a lexer will switch states much less often than it will
            // invoke the `lex()` token-producing API and related APIs, hence caching the set for direct access helps
            // speed up those activities a tiny bit.
            spec = this.__currentRuleSet__ = this._currentRules();
        }

        var rule_ids = spec.rules;
//        var dispatch = spec.__dispatch_lut;
        var regexes = spec.__rule_regexes;
        var len = spec.__rule_count;

//        var c0 = this._input[0];

        // Note: the arrays are 1-based, while `len` itself is a valid index, 
        // hence the non-standard less-or-equal check in the next loop condition!
        // 
        // `dispatch` is a lookup table which lists the *first* rule which matches the 1-char *prefix* of the rule-to-match.
        // By using that array as a jumpstart, we can cut down on the otherwise O(n*m) behaviour of this lexer, down to
        // O(n) ideally, where:
        // 
        // - N is the number of input particles -- which is not precisely characters 
        //   as we progress on a per-regex-match basis rather than on a per-character basis
        //   
        // - M is the number of rules (regexes) to test in the active condition state.
        //  
        for (var i = 1 /* (dispatch[c0] || 1) */ ; i <= len; i++) {
            tempMatch = this._input.match(regexes[i]);
            if (tempMatch && (!match || tempMatch[0].length > match[0].length)) {
                match = tempMatch;
                index = i;
                if (this.options.backtrack_lexer) {
                    token = this.test_match(tempMatch, rule_ids[i]);
                    if (token !== false) {
                        return token;
                    } else if (this._backtrack) {
                        match = undefined;
                        continue; // rule action called reject() implying a rule MISmatch.
                    } else {
                        // else: this is a lexer rule which consumes input without producing a token (e.g. whitespace)
                        return false;
                    }
                } else if (!this.options.flex) {
                    break;
                }
            }
        }
        if (match) {
            token = this.test_match(match, rule_ids[index]);
            if (token !== false) {
                return token;
            }
            // else: this is a lexer rule which consumes input without producing a token (e.g. whitespace)
            return false;
        }
        if (this._input === '') {
            this.done = true;
            return this.EOF;
        } else {
            var p = this.constructLexErrorInfo('Lexical error on line ' + (this.yylineno + 1) + '. Unrecognized text.\n' + this.showPosition(), this.options.lexer_errors_are_recoverable);
            token = (this.parseError(p.errStr, p) || this.ERROR);
            if (token === this.ERROR) {
                // we can try to recover from a lexer error that parseError() did not 'recover' for us, by moving forward at least one character at a time:
                if (!this.match.length) {
                    this.input();
                }
            }
            return token;
        }
    },

    // return next match that has a token
    lex: function lexer_lex() {
        var r;
        // allow the PRE/POST handlers set/modify the return token for maximum flexibility of the generated lexer:
        if (typeof this.options.pre_lex === 'function') {
            r = this.options.pre_lex.call(this);
        }
        while (!r) {
            r = this.next();
        }
        if (typeof this.options.post_lex === 'function') {
            // (also account for a userdef function which does not return any value: keep the token as is)
            r = this.options.post_lex.call(this, r) || r;
        }
        return r;
    },

    // backwards compatible alias for `pushState()`;
    // the latter is symmetrical with `popState()` and we advise to use
    // those APIs in any modern lexer code, rather than `begin()`.
    begin: function lexer_begin(condition) {
        return this.pushState(condition);
    },

    // activates a new lexer condition state (pushes the new lexer condition state onto the condition stack)
    pushState: function lexer_pushState(condition) {
        this.conditionStack.push(condition);
        this.__currentRuleSet__ = null;
        return this;
    },

    // pop the previously active lexer condition state off the condition stack
    popState: function lexer_popState() {
        var n = this.conditionStack.length - 1;
        if (n > 0) {
            this.__currentRuleSet__ = null;
            return this.conditionStack.pop();
        } else {
            return this.conditionStack[0];
        }
    },

    // return the currently active lexer condition state; when an index argument is provided it produces the N-th previous condition state, if available
    topState: function lexer_topState(n) {
        n = this.conditionStack.length - 1 - Math.abs(n || 0);
        if (n >= 0) {
            return this.conditionStack[n];
        } else {
            return 'INITIAL';
        }
    },

    // (internal) determine the lexer rule set which is active for the currently active lexer condition state
    _currentRules: function lexer__currentRules() {
        if (this.conditionStack.length && this.conditionStack[this.conditionStack.length - 1]) {
            return this.conditions[this.conditionStack[this.conditionStack.length - 1]];
        } else {
            return this.conditions['INITIAL'];
        }
    },

    // return the number of states currently on the stack
    stateStackSize: function lexer_stateStackSize() {
        return this.conditionStack.length;
    },
options: {},
JisonLexerError: JisonLexerError,
performAction: function lexer__performAction(yy, yy_, $avoiding_name_collisions, YY_START) {

var YYSTATE = YY_START;
switch($avoiding_name_collisions) {
case 0 : 
/*! Conditions:: INITIAL */ 
/*! Rule::       [ \t\r\n]+ */ 
 
    /* eat up whitespace */
    BeginToken(yy_.yytext); 
     
break;
case 1 : 
/*! Conditions:: INITIAL */ 
/*! Rule::       {DIGIT}+ */ 
 
    BeginToken(yy_.yytext); 
    yylval.value = atof(yy_.yytext);
    return VALUE;
     
break;
case 2 : 
/*! Conditions:: INITIAL */ 
/*! Rule::       {DIGIT}+\.{DIGIT}* */ 
 
    BeginToken(yy_.yytext);
    yylval.value = atof(yy_.yytext);
    return VALUE;
     
break;
case 3 : 
/*! Conditions:: INITIAL */ 
/*! Rule::       {DIGIT}+[eE]["+""-"]?{DIGIT}* */ 
 
    BeginToken(yy_.yytext);
    yylval.value = atof(yy_.yytext);
    return VALUE;
     
break;
case 4 : 
/*! Conditions:: INITIAL */ 
/*! Rule::       {DIGIT}+\.{DIGIT}*[eE]["+""-"]?{DIGIT}* */ 
 
    BeginToken(yy_.yytext);
    yylval.value = atof(yy_.yytext);
    return VALUE;
     
break;
case 5 : 
/*! Conditions:: INITIAL */ 
/*! Rule::       {ID} */ 
 
    BeginToken(yy_.yytext);
    yylval.string = malloc(strlen(yy_.yytext)+1);
    strcpy(yylval.string, yy_.yytext);
    return IDENTIFIER;
     
break;
case 6 : 
/*! Conditions:: INITIAL */ 
/*! Rule::       \+ */ 
  BeginToken(yy_.yytext); return ADD;  
break;
case 7 : 
/*! Conditions:: INITIAL */ 
/*! Rule::       - */ 
  BeginToken(yy_.yytext); return SUB;  
break;
case 8 : 
/*! Conditions:: INITIAL */ 
/*! Rule::       \* */ 
  BeginToken(yy_.yytext); return MULT;  
break;
case 9 : 
/*! Conditions:: INITIAL */ 
/*! Rule::       \/ */ 
  BeginToken(yy_.yytext); return DIV;  
break;
case 10 : 
/*! Conditions:: INITIAL */ 
/*! Rule::       \( */ 
  BeginToken(yy_.yytext); return LBRACE;  
break;
case 11 : 
/*! Conditions:: INITIAL */ 
/*! Rule::       \) */ 
  BeginToken(yy_.yytext); return RBRACE;  
break;
case 12 : 
/*! Conditions:: INITIAL */ 
/*! Rule::       ; */ 
  BeginToken(yy_.yytext); return SEMICOLON;  
break;
case 13 : 
/*! Conditions:: INITIAL */ 
/*! Rule::       = */ 
  BeginToken(yy_.yytext); return ASSIGN;  
break;
case 14 : 
/*! Conditions:: INITIAL */ 
/*! Rule::       . */ 
 
    BeginToken(yy_.yytext);
    return yy_.yytext[0];
     
break;
default:
  return this.simpleCaseActionClusters[$avoiding_name_collisions];
}
},
simpleCaseActionClusters: {

},
rules: [
/^(?:[ \t\r\n]+)/,
/^(?:(\d)+)/,
/^(?:(\d)+\.(\d)*)/,
/^(?:(\d)+[Ee]["+]?(\d)*)/,
/^(?:(\d)+\.(\d)*[Ee]["+]?(\d)*)/,
/^(?:([^\W\d]\w*))/,
/^(?:\+)/,
/^(?:-)/,
/^(?:\*)/,
/^(?:\/)/,
/^(?:\()/,
/^(?:\))/,
/^(?:;)/,
/^(?:=)/,
/^(?:.)/
],
conditions: {
  "INITIAL": {
    rules: [
      0,
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      9,
      10,
      11,
      12,
      13,
      14
    ],
    inclusive: true
  }
}
};

/*--------------------------------------------------------------------
 * lex.l
 *------------------------------------------------------------------*/;
return lexer;
})();