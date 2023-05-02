!function (a, b) {
    "function" == typeof define && define.amd ? define(["jQuery"], b) : b("object" == typeof exports ? require("jQuery") : a.jQuery)
}(this, function () {
    var a = function () {
        var a = {}
            , b = 4
            , c = new RegExp("{{([^}]+)}}", "g")
            , d = function (a) {
                for (var b, d = []; b = c.exec(a);)
                    d.push(b);
                return d
            };
        return a.parse = function (a) {
            var c = {
                inpts: {},
                chars: {}
            }
                , e = d(a)
                , f = a.length
                , g = 0
                , h = 0
                , i = 0
                , j = function (a) {
                    for (var d = a.length, e = 0; d > e; e++)
                        c.inpts[h] = a.charAt(e),
                            h++;
                    g++,
                        i += a.length + b - 1
                };
            for (i; f > i; i++)
                g < e.length && i === e[g].index ? j(e[g][1]) : c.chars[i - g * b] = a.charAt(i);
            return c.mLength = i - g * b,
                c
        }
            ,
            a
    }()
        , b = function () {
            {
                var a = {};
                "undefined" != typeof navigator ? navigator.userAgent : null
            }
            return a.extend = function (a) {
                for (var b = 1; b < arguments.length; b++)
                    for (var c in arguments[b])
                        a[c] = arguments[b][c];
                return a
            }
                ,
                a.addChars = function (a, b, c) {
                    return a.substr(0, c) + b + a.substr(c, a.length)
                }
                ,
                a.removeChars = function (a, b, c) {
                    return a.substr(0, b) + a.substr(c, a.length)
                }
                ,
                a.isBetween = function (a, b) {
                    return b.sort(function (a, b) {
                        return a - b
                    }),
                        a > b[0] && a < b[1]
                }
                ,
                a.addListener = function (a, b, c) {
                    return "undefined" != typeof a.addEventListener ? a.addEventListener(b, c, !1) : a.attachEvent("on" + b, c)
                }
                ,
                a.preventDefault = function (a) {
                    return a.preventDefault ? a.preventDefault() : a.returnValue = !1
                }
                ,
                a.getClip = function (a) {
                    return a.clipboardData ? a.clipboardData.getData("Text") : window.clipboardData ? window.clipboardData.getData("Text") : void 0
                }
                ,
                a.getMatchingKey = function (a, b, c) {
                    for (var d in c) {
                        var e = c[d];
                        if (a === e.which && b === e.keyCode)
                            return d
                    }
                }
                ,
                a.isDelKeyDown = function (b, c) {
                    var d = {
                        backspace: {
                            which: 8,
                            keyCode: 8
                        },
                        "delete": {
                            which: 46,
                            keyCode: 46
                        }
                    };
                    return a.getMatchingKey(b, c, d)
                }
                ,
                a.isDelKeyPress = function (b, c) {
                    var d = {
                        backspace: {
                            which: 8,
                            keyCode: 8,
                            shiftKey: !1
                        },
                        "delete": {
                            which: 0,
                            keyCode: 46
                        }
                    };
                    return a.getMatchingKey(b, c, d)
                }
                ,
                a.isSpecialKeyPress = function (b, c) {
                    var d = {
                        tab: {
                            which: 0,
                            keyCode: 9
                        },
                        enter: {
                            which: 13,
                            keyCode: 13
                        },
                        end: {
                            which: 0,
                            keyCode: 35
                        },
                        home: {
                            which: 0,
                            keyCode: 36
                        },
                        leftarrow: {
                            which: 0,
                            keyCode: 37
                        },
                        uparrow: {
                            which: 0,
                            keyCode: 38
                        },
                        rightarrow: {
                            which: 0,
                            keyCode: 39
                        },
                        downarrow: {
                            which: 0,
                            keyCode: 40
                        },
                        F5: {
                            which: 116,
                            keyCode: 116
                        }
                    };
                    return a.getMatchingKey(b, c, d)
                }
                ,
                a.isModifier = function (a) {
                    return a.ctrlKey || a.altKey || a.metaKey
                }
                ,
                a.forEach = function (a, b, c) {
                    if (a.hasOwnProperty("length"))
                        for (var d = 0, e = a.length; e > d && b.call(c, a[d], d, a) !== !1; d++)
                            ;
                    else
                        for (var f in a)
                            if (a.hasOwnProperty(f) && b.call(c, a[f], f, a) === !1)
                                break
                }
                ,
                a
        }()
        , c = function (a, b) {
            function c(c) {
                var e = []
                    , f = [];
                b.forEach(c, function (c) {
                    b.forEach(c, function (b, c) {
                        var g = a.parse(b)
                            , h = d(c);
                        return e.push(h),
                            f.push(g),
                            !1
                    })
                });
                var g = function (a) {
                    var c;
                    return b.forEach(e, function (b, d) {
                        return b.test(a) ? (c = d,
                            !1) : void 0
                    }),
                        void 0 === c ? null : f[c]
                };
                return {
                    getPattern: g,
                    patterns: f,
                    matchers: e
                }
            }
            var d = function (a) {
                return "*" === a ? /.*/ : new RegExp(a)
            };
            return c
        }(a, b)
        , d = function () {
            var a = {};
            return a.get = function (a) {
                if ("number" == typeof a.selectionStart)
                    return {
                        begin: a.selectionStart,
                        end: a.selectionEnd
                    };
                var b = document.selection.createRange();
                if (b && b.parentElement() === a) {
                    var c = a.createTextRange()
                        , d = a.createTextRange()
                        , e = a.value.length;
                    return c.moveToBookmark(b.getBookmark()),
                        d.collapse(!1),
                        c.compareEndPoints("StartToEnd", d) > -1 ? {
                            begin: e,
                            end: e
                        } : {
                            begin: -c.moveStart("character", -e),
                            end: -c.moveEnd("character", -e)
                        }
                }
                return {
                    begin: 0,
                    end: 0
                }
            }
                ,
                a.set = function (a, b) {
                    if ("object" != typeof b && (b = {
                        begin: b,
                        end: b
                    }),
                        a.setSelectionRange)
                        a.focus(),
                            a.setSelectionRange(b.begin, b.end);
                    else if (a.createTextRange) {
                        var c = a.createTextRange();
                        c.collapse(!0),
                            c.moveEnd("character", b.end),
                            c.moveStart("character", b.begin),
                            c.select()
                    }
                }
                ,
                a
        }()
        , e = function (a, b, c) {
            function d(b, d) {
                var f = this;
                if (f.el = b,
                    !f.el)
                    throw new TypeError("Must provide an existing element");
                if (f.opts = c.extend({}, e, d),
                    "undefined" != typeof f.opts.pattern && (f.opts.patterns = f._specFromSinglePattern(f.opts.pattern),
                        delete f.opts.pattern),
                    "undefined" == typeof f.opts.patterns)
                    throw new TypeError("Must provide a pattern or array of patterns");
                f.patternMatcher = a(f.opts.patterns),
                    f._updatePattern(),
                    f.hldrs = {},
                    f.focus = 0,
                    c.addListener(f.el, "keydown", function (a) {
                        f._keyDown(a)
                    }),
                    c.addListener(f.el, "keypress", function (a) {
                        f._keyPress(a)
                    }),
                    c.addListener(f.el, "paste", function (a) {
                        f._paste(a)
                    }),
                    f.opts.persistent && (f._processKey("", !1),
                        f.el.blur(),
                        c.addListener(f.el, "focus", function (a) {
                            f._focus(a)
                        }),
                        c.addListener(f.el, "click", function (a) {
                            f._focus(a)
                        }),
                        c.addListener(f.el, "touchstart", function (a) {
                            f._focus(a)
                        }))
            }
            var e = {
                persistent: !1,
                repeat: !1,
                placeholder: " "
            }
                , f = {
                    9: /[0-9]/,
                    a: /[A-Za-z]/,
                    "*": /[A-Za-z0-9]/
                };
            return d.addInptType = function (a, b) {
                f[a] = b
            }
                ,
                d.prototype.resetPattern = function (c) {
                    this.opts.patterns = c ? this._specFromSinglePattern(c) : this.opts.patterns,
                        this.sel = b.get(this.el),
                        this.val = this.el.value,
                        this.delta = 0,
                        this._removeChars(),
                        this.patternMatcher = a(this.opts.patterns);
                    var d = this.patternMatcher.getPattern(this.val);
                    this.mLength = d.mLength,
                        this.chars = d.chars,
                        this.inpts = d.inpts,
                        this._processKey("", !1, !0)
                }
                ,
                d.prototype._updatePattern = function () {
                    var a = this.patternMatcher.getPattern(this.val);
                    a && (this.mLength = a.mLength,
                        this.chars = a.chars,
                        this.inpts = a.inpts)
                }
                ,
                d.prototype._keyDown = function (a) {
                    var b = a.which || a.keyCode;
                    return b && c.isDelKeyDown(a.which, a.keyCode) ? (this._processKey(null, b),
                        c.preventDefault(a)) : void 0
                }
                ,
                d.prototype._keyPress = function (a) {
                    var b, d;
                    return b = a.which || a.keyCode,
                        d = c.isSpecialKeyPress(a.which, a.keyCode),
                        c.isDelKeyPress(a.which, a.keyCode) || d || c.isModifier(a) ? void 0 : (this._processKey(String.fromCharCode(b), !1),
                            c.preventDefault(a))
                }
                ,
                d.prototype._paste = function (a) {
                    return this._processKey(c.getClip(a), !1),
                        c.preventDefault(a)
                }
                ,
                d.prototype._focus = function () {
                    var a = this;
                    setTimeout(function () {
                        var c = b.get(a.el)
                            , d = c.end > a.focus
                            , e = 0 === c.end;
                        (d || e) && b.set(a.el, a.focus)
                    }, 0)
                }
                ,
                d.prototype._processKey = function (a, d, e) {
                    if (this.sel = b.get(this.el),
                        this.val = this.el.value,
                        this.delta = 0,
                        this.sel.begin !== this.sel.end)
                        this.delta = -1 * Math.abs(this.sel.begin - this.sel.end),
                            this.val = c.removeChars(this.val, this.sel.begin, this.sel.end);
                    else if (d && 46 === d)
                        this._delete();
                    else if (d && this.sel.begin - 1 >= 0)
                        this.val = c.removeChars(this.val, this.sel.end - 1, this.sel.end),
                            this.delta -= 1;
                    else if (d)
                        return !0;
                    d || (this.val = c.addChars(this.val, a, this.sel.begin),
                        this.delta += a.length),
                        this._formatValue(e)
                }
                ,
                d.prototype._delete = function () {
                    for (; this.chars[this.sel.begin];)
                        this._nextPos();
                    this.sel.begin < this.val.length && (this._nextPos(),
                        this.val = c.removeChars(this.val, this.sel.end - 1, this.sel.end),
                        this.delta = -1)
                }
                ,
                d.prototype._nextPos = function () {
                    this.sel.end++,
                        this.sel.begin++
                }
                ,
                d.prototype._formatValue = function (a) {
                    this.newPos = this.sel.end + this.delta,
                        this._removeChars(),
                        this._updatePattern(),
                        this._validateInpts(),
                        this._addChars(),
                        this.el.value = this.val.substr(0, this.mLength),
                        ("undefined" == typeof a || a === !1) && b.set(this.el, this.newPos)
                }
                ,
                d.prototype._removeChars = function () {
                    this.sel.end > this.focus && (this.delta += this.sel.end - this.focus);
                    for (var a = 0, b = 0; b <= this.mLength; b++) {
                        var d, e = this.chars[b], f = this.hldrs[b], g = b + a;
                        g = b >= this.sel.begin ? g + this.delta : g,
                            d = this.val.charAt(g),
                            (e && e === d || f && f === d) && (this.val = c.removeChars(this.val, g, g + 1),
                                a--)
                    }
                    this.hldrs = {},
                        this.focus = this.val.length
                }
                ,
                d.prototype._validateInpts = function () {
                    for (var a = 0; a < this.val.length; a++) {
                        var b = this.inpts[a]
                            , d = !f[b]
                            , e = !d && !f[b].test(this.val.charAt(a))
                            , g = this.inpts[a];
                        (d || e) && g && (this.val = c.removeChars(this.val, a, a + 1),
                            this.focusStart--,
                            this.newPos--,
                            this.delta--,
                            a--)
                    }
                }
                ,
                d.prototype._addChars = function () {
                    if (this.opts.persistent) {
                        for (var a = 0; a <= this.mLength; a++)
                            this.val.charAt(a) || (this.val = c.addChars(this.val, this.opts.placeholder, a),
                                this.hldrs[a] = this.opts.placeholder),
                                this._addChar(a);
                        for (; this.chars[this.focus];)
                            this.focus++
                    } else
                        for (var b = 0; b <= this.val.length; b++) {
                            if (this.delta <= 0 && b === this.focus)
                                return !0;
                            this._addChar(b)
                        }
                }
                ,
                d.prototype._addChar = function (a) {
                    var b = this.chars[a];
                    return b ? (c.isBetween(a, [this.sel.begin - 1, this.newPos + 1]) && (this.newPos++,
                        this.delta++),
                        a <= this.focus && this.focus++,
                        this.hldrs[a] && (delete this.hldrs[a],
                            this.hldrs[a + 1] = this.opts.placeholder),
                        void (this.val = c.addChars(this.val, b, a))) : !0
                }
                ,
                d.prototype._specFromSinglePattern = function (a) {
                    return [{
                        "*": a
                    }]
                }
                ,
                d
        }(c, d, b)
        , f = "formatter";
    $.fn[f] = function (a) {
        return "object" == typeof a && this.each(function () {
            $.data(this, "plugin_" + f) || $.data(this, "plugin_" + f, new e(this, a))
        }),
            this.resetPattern = function (a) {
                return this.each(function () {
                    var b = $.data(this, "plugin_" + f);
                    b && b.resetPattern(a)
                }),
                    this
            }
            ,
            this
    }
        ,
        $.fn[f].addInptType = function (a, b) {
            e.addInptType(a, b)
        }
});
