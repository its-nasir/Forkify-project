(function (modules, cache, entry, globalName) {
  /* eslint-disable no-undef */
  var globalObject =
    typeof globalThis !== 'undefined'
      ? globalThis
      : typeof self !== 'undefined'
      ? self
      : typeof window !== 'undefined'
      ? window
      : typeof global !== 'undefined'
      ? global
      : {};

  var previousRequire =
    typeof globalObject.parcelRequire === 'function' &&
    globalObject.parcelRequire;
  var nodeRequire =
    typeof module !== 'undefined' &&
    typeof module.require === 'function' &&
    module.require.bind(module);

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        var currentRequire =
          typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error("Cannot find module '" + name + "'");
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = (cache[name] = new newRequire.Module(name));

      modules[name][0].call(
        module.exports,
        localRequire,
        module,
        module.exports,
        this
      );
    }

    return cache[name].exports;

    function localRequire(x) {
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x) {
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [
      function (require, module) {
        module.exports = exports;
      },
      {},
    ];
  };

  globalObject.parcelRequire = newRequire;

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  if (entry.length) {
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === 'object' && typeof module !== 'undefined') {
      module.exports = mainExports;

      // RequireJS
    } else if (typeof define === 'function' && define.amd) {
      define(function () {
        return mainExports;
      });

      // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }
})(
  {
    '555af8aa4be313c9f17dbaa9955757d8': [
      function (require, module, exports) {
        var global = arguments[3];
        var HMR_HOST = null;
        var HMR_PORT = 1234;
        var HMR_ENV_HASH = 'd751713988987e9331980363e24189ce';
        module.bundle.HMR_BUNDLE_ID = '9d27536ace6de69cc68cf4001f3bf528';

        var OVERLAY_ID = '__parcel__error__overlay__';
        var OldModule = module.bundle.Module;

        function Module(moduleName) {
          OldModule.call(this, moduleName);
          this.hot = {
            data: module.bundle.hotData,
            _acceptCallbacks: [],
            _disposeCallbacks: [],
            accept: function (fn) {
              this._acceptCallbacks.push(fn || function () {});
            },
            dispose: function (fn) {
              this._disposeCallbacks.push(fn);
            },
          };
          module.bundle.hotData = null;
        }

        module.bundle.Module = Module;
        var checkedAssets, assetsToAccept, acceptedAssets;

        var parent = module.bundle.parent;

        if (
          (!parent || !parent.isParcelRequire) &&
          typeof WebSocket !== 'undefined'
        ) {
          var hostname =
            HMR_HOST ||
            (location.protocol.indexOf('http') === 0
              ? location.hostname
              : 'localhost');
          var port = HMR_PORT || location.port;
          var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
          var ws = new WebSocket(
            protocol + '://' + hostname + (port ? ':' + port : '') + '/'
          );

          ws.onmessage = function (event) {
            checkedAssets = {};
            assetsToAccept = [];
            acceptedAssets = {};
            var data = JSON.parse(event.data);

            if (data.type === 'update') {
              // Remove error overlay if there is one
              removeErrorOverlay();
              let assets = data.assets.filter(
                asset => asset.envHash === HMR_ENV_HASH
              );

              var handled = false;
              assets.forEach(asset => {
                var didAccept =
                  asset.type === 'css' ||
                  hmrAcceptCheck(global.parcelRequire, asset.id);

                if (didAccept) {
                  handled = true;
                }
              });

              if (handled) {
                console.clear();
                assets.forEach(function (asset) {
                  hmrApply(global.parcelRequire, asset);
                });

                for (var i = 0; i < assetsToAccept.length; i++) {
                  var id = assetsToAccept[i][1];

                  if (!acceptedAssets[id]) {
                    hmrAcceptRun(assetsToAccept[i][0], id);
                  }
                }
              } else {
                window.location.reload();
              }
            }

            if (data.type === 'error') {
              // Log parcel errors to console
              for (let ansiDiagnostic of data.diagnostics.ansi) {
                let stack = ansiDiagnostic.codeframe
                  ? ansiDiagnostic.codeframe
                  : ansiDiagnostic.stack;
                console.error(
                  '🚨 [parcel]: ' +
                    ansiDiagnostic.message +
                    '\n' +
                    stack +
                    '\n\n' +
                    ansiDiagnostic.hints.join('\n')
                );
              } // Render the fancy html overlay

              removeErrorOverlay();
              var overlay = createErrorOverlay(data.diagnostics.html);
              document.body.appendChild(overlay);
            }
          };

          ws.onerror = function (e) {
            console.error(e.message);
          };

          ws.onclose = function (e) {
            console.warn('[parcel] 🚨 Connection to the HMR server was lost');
          };
        }

        function removeErrorOverlay() {
          var overlay = document.getElementById(OVERLAY_ID);

          if (overlay) {
            overlay.remove();
            console.log('[parcel] ✨ Error resolved');
          }
        }

        function createErrorOverlay(diagnostics) {
          var overlay = document.createElement('div');
          overlay.id = OVERLAY_ID;
          let errorHTML =
            '<div style="background: black; opacity: 0.85; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; font-family: Menlo, Consolas, monospace; z-index: 9999;">';

          for (let diagnostic of diagnostics) {
            let stack = diagnostic.codeframe
              ? diagnostic.codeframe
              : diagnostic.stack;
            errorHTML += `
      <div>
        <div style="font-size: 18px; font-weight: bold; margin-top: 20px;">
          🚨 ${diagnostic.message}
        </div>
        <pre>
          ${stack}
        </pre>
        <div>
          ${diagnostic.hints.map(hint => '<div>' + hint + '</div>').join('')}
        </div>
      </div>
    `;
          }

          errorHTML += '</div>';
          overlay.innerHTML = errorHTML;
          return overlay;
        }

        function getParents(bundle, id) {
          var modules = bundle.modules;

          if (!modules) {
            return [];
          }

          var parents = [];
          var k, d, dep;

          for (k in modules) {
            for (d in modules[k][1]) {
              dep = modules[k][1][d];

              if (
                dep === id ||
                (Array.isArray(dep) && dep[dep.length - 1] === id)
              ) {
                parents.push([bundle, k]);
              }
            }
          }

          if (bundle.parent) {
            parents = parents.concat(getParents(bundle.parent, id));
          }

          return parents;
        }

        function updateLink(link) {
          var newLink = link.cloneNode();

          newLink.onload = function () {
            if (link.parentNode !== null) {
              link.parentNode.removeChild(link);
            }
          };

          newLink.setAttribute(
            'href',
            link.getAttribute('href').split('?')[0] + '?' + Date.now()
          );
          link.parentNode.insertBefore(newLink, link.nextSibling);
        }

        var cssTimeout = null;

        function reloadCSS() {
          if (cssTimeout) {
            return;
          }

          cssTimeout = setTimeout(function () {
            var links = document.querySelectorAll('link[rel="stylesheet"]');

            for (var i = 0; i < links.length; i++) {
              var absolute = /^https?:\/\//i.test(
                links[i].getAttribute('href')
              );

              if (!absolute) {
                updateLink(links[i]);
              }
            }

            cssTimeout = null;
          }, 50);
        }

        function hmrApply(bundle, asset) {
          var modules = bundle.modules;

          if (!modules) {
            return;
          }

          if (modules[asset.id] || !bundle.parent) {
            if (asset.type === 'css') {
              reloadCSS();
            } else {
              var fn = new Function(
                'require',
                'module',
                'exports',
                asset.output
              );
              modules[asset.id] = [
                fn,
                asset.depsByBundle[bundle.HMR_BUNDLE_ID],
              ];
            }
          } else if (bundle.parent) {
            hmrApply(bundle.parent, asset);
          }
        }

        function hmrAcceptCheck(bundle, id) {
          var modules = bundle.modules;

          if (!modules) {
            return;
          }

          if (!modules[id] && bundle.parent) {
            return hmrAcceptCheck(bundle.parent, id);
          }

          if (checkedAssets[id]) {
            return;
          }

          checkedAssets[id] = true;
          var cached = bundle.cache[id];
          assetsToAccept.push([bundle, id]);

          if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
            return true;
          }

          return getParents(global.parcelRequire, id).some(function (v) {
            return hmrAcceptCheck(v[0], v[1]);
          });
        }

        function hmrAcceptRun(bundle, id) {
          var cached = bundle.cache[id];
          bundle.hotData = {};

          if (cached && cached.hot) {
            cached.hot.data = bundle.hotData;
          }

          if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
            cached.hot._disposeCallbacks.forEach(function (cb) {
              cb(bundle.hotData);
            });
          }

          delete bundle.cache[id];
          bundle(id);
          cached = bundle.cache[id];

          if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
            cached.hot._acceptCallbacks.forEach(function (cb) {
              var assetsToAlsoAccept = cb(function () {
                return getParents(global.parcelRequire, id);
              });

              if (assetsToAlsoAccept && assetsToAccept.length) {
                assetsToAccept.push.apply(assetsToAccept, assetsToAlsoAccept);
              }
            });
          }

          acceptedAssets[id] = true;
        }
      },
      {},
    ],
    '175e469a7ea7db1c8c0744d04372621f': [
      function (require, module, exports) {
        'use strict';

        require('core-js/modules/es.string.replace');

        require('core-js/modules/es.typed-array.float32-array');

        require('core-js/modules/es.typed-array.float64-array');

        require('core-js/modules/es.typed-array.int8-array');

        require('core-js/modules/es.typed-array.int16-array');

        require('core-js/modules/es.typed-array.int32-array');

        require('core-js/modules/es.typed-array.uint8-array');

        require('core-js/modules/es.typed-array.uint8-clamped-array');

        require('core-js/modules/es.typed-array.uint16-array');

        require('core-js/modules/es.typed-array.uint32-array');

        require('core-js/modules/es.typed-array.from');

        require('core-js/modules/es.typed-array.of');

        require('core-js/modules/web.immediate');

        require('core-js/modules/web.url');

        require('core-js/modules/web.url.to-json');

        require('core-js/modules/web.url-search-params');

        var _regeneratorRuntime = require('regenerator-runtime');

        const controlRecipes = async function () {
          try {
            const id = window.location.hash.slice(1);
            if (!id) return;
            recipeView.renderSpinner();
            resultsView.update(model.getSearchResultPage());
            bookmarksView.update(model.state.bookmarks);
            await model.loadRecipe(id);
            recipeView.render(model.state.recipe);
          } catch (err) {
            recipeView.renderError();
            console.error(err);
          }
        };

        const controlSearchResults = async function () {
          try {
            resultsView.renderSpinner();
            const query = searchView.getQuery();
            if (!query) return;
            await model.loadSearchResults(query);
            resultsView.render(model.getSearchResultPage());
            paginationView.render(model.state.search);
          } catch (err) {
            console.log(err);
          }
        };

        const controlPagination = function (goToPage) {
          resultsView.render(model.getSearchResultPage(goToPage));
          paginationView.render(model.state.search);
        };

        const controlServings = function (newServings) {
          model.updateServings(newServings);
          recipeView.update(model.state.recipe);
        };

        const controlAddBookmark = function () {
          if (!model.state.recipe.bookmarked)
            model.addBookmark(model.state.recipe);
          else model.deleteBookMark(model.state.recipe.id);
          recipeView.update(model.state.recipe);
          bookmarksView.render(model.state.bookmarks);
        };

        const controlBookmarks = function () {
          bookmarksView.render(model.state.bookmarks);
        };

        const controlAddRecipe = async function (newRecipe) {
          try {
            addRecipeView.renderSpinner();
            await model.uploadRecipe(newRecipe);
            console.log(model.state.recipe);
            recipeView.render(model.state.recipe);
            addRecipeView.renderMessage();
            bookmarksView.render(model.state.bookmarks);
            window.history.pushState(null, '', `#${model.state.recipe.id}`);
            setTimeout(function () {
              addRecipeView.toggleWindow();
            }, MODAL_CLOSE_SEC * 1000);
          } catch (err) {
            console.error(err);
            addRecipeView.renderError(err.message);
          }
        };

        const init = function () {
          bookmarksView.addHandlerRender(controlBookmarks);
          recipeView.addHandlerRender(controlRecipes);
          recipeView.addHandlerUpdateServings(controlServings);
          recipeView.addHandlerAddBookmark(controlAddBookmark);
          searchView.addHandlerSearch(controlSearchResults);
          paginationView.addHandlerClick(controlPagination);
          addRecipeView.addHandlerUpload(controlAddRecipe);
        };

        init();
      },
      {
        'core-js/modules/es.string.replace': 'a41434a38db9af6d2ad868f7a439ab89',
        'core-js/modules/es.typed-array.float32-array':
          'd5ed5e3a2e200dcf66c948e6350ae29c',
        'core-js/modules/es.typed-array.float64-array':
          '49914eeba57759547672886c5961b9e4',
        'core-js/modules/es.typed-array.int8-array':
          '1fc9d0d9e9c4ca72873ee75cc9532911',
        'core-js/modules/es.typed-array.int16-array':
          '6ba53210946e69387b5af65ca70f5602',
        'core-js/modules/es.typed-array.int32-array':
          '52f07ad61480c3da8b1b371346f2b755',
        'core-js/modules/es.typed-array.uint8-array':
          '6042ea91f038c74624be740ff17090b9',
        'core-js/modules/es.typed-array.uint8-clamped-array':
          '47e53ff27a819e98075783d2516842bf',
        'core-js/modules/es.typed-array.uint16-array':
          '20f511ab1a5fbdd3a99ff1f471adbc30',
        'core-js/modules/es.typed-array.uint32-array':
          '8212db3659c5fe8bebc2163b12c9f547',
        'core-js/modules/es.typed-array.from':
          '183d72778e0f99cedb12a04e35ea2d50',
        'core-js/modules/es.typed-array.of': '2ee3ec99d0b3dea4fec9002159200789',
        'core-js/modules/web.immediate': '140df4f8e97a45c53c66fead1f5a9e92',
        'core-js/modules/web.url': 'a66c25e402880ea6b966ee8ece30b6df',
        'core-js/modules/web.url.to-json': '6357c5a053a36e38c0e24243e550dd86',
        'core-js/modules/web.url-search-params':
          '2494aebefd4ca447de0ef4cfdd47509e',
        'regenerator-runtime': 'e155e0d3930b156f86c48e8d05522b16',
      },
    ],
    a41434a38db9af6d2ad868f7a439ab89: [
      function (require, module, exports) {
        'use strict';
        var fixRegExpWellKnownSymbolLogic = require('../internals/fix-regexp-well-known-symbol-logic');
        var anObject = require('../internals/an-object');
        var toObject = require('../internals/to-object');
        var toLength = require('../internals/to-length');
        var toInteger = require('../internals/to-integer');
        var requireObjectCoercible = require('../internals/require-object-coercible');
        var advanceStringIndex = require('../internals/advance-string-index');
        var regExpExec = require('../internals/regexp-exec-abstract');

        var max = Math.max;
        var min = Math.min;
        var floor = Math.floor;
        var SUBSTITUTION_SYMBOLS = /\$([$&'`]|\d\d?|<[^>]*>)/g;
        var SUBSTITUTION_SYMBOLS_NO_NAMED = /\$([$&'`]|\d\d?)/g;

        var maybeToString = function (it) {
          return it === undefined ? it : String(it);
        };

        // @@replace logic
        fixRegExpWellKnownSymbolLogic(
          'replace',
          2,
          function (REPLACE, nativeReplace, maybeCallNative, reason) {
            var REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE =
              reason.REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE;
            var REPLACE_KEEPS_$0 = reason.REPLACE_KEEPS_$0;
            var UNSAFE_SUBSTITUTE = REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE
              ? '$'
              : '$0';

            return [
              function replace(searchValue, replaceValue) {
                var O = requireObjectCoercible(this);
                var replacer =
                  searchValue == undefined ? undefined : searchValue[REPLACE];
                return replacer !== undefined
                  ? replacer.call(searchValue, O, replaceValue)
                  : nativeReplace.call(String(O), searchValue, replaceValue);
              },
              function (regexp, replaceValue) {
                if (
                  (!REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE &&
                    REPLACE_KEEPS_$0) ||
                  (typeof replaceValue === 'string' &&
                    replaceValue.indexOf(UNSAFE_SUBSTITUTE) === -1)
                ) {
                  var res = maybeCallNative(
                    nativeReplace,
                    regexp,
                    this,
                    replaceValue
                  );
                  if (res.done) return res.value;
                }

                var rx = anObject(regexp);
                var S = String(this);

                var functionalReplace = typeof replaceValue === 'function';
                if (!functionalReplace) replaceValue = String(replaceValue);

                var global = rx.global;
                if (global) {
                  var fullUnicode = rx.unicode;
                  rx.lastIndex = 0;
                }
                var results = [];
                while (true) {
                  var result = regExpExec(rx, S);
                  if (result === null) break;

                  results.push(result);
                  if (!global) break;

                  var matchStr = String(result[0]);
                  if (matchStr === '')
                    rx.lastIndex = advanceStringIndex(
                      S,
                      toLength(rx.lastIndex),
                      fullUnicode
                    );
                }

                var accumulatedResult = '';
                var nextSourcePosition = 0;
                for (var i = 0; i < results.length; i++) {
                  result = results[i];

                  var matched = String(result[0]);
                  var position = max(min(toInteger(result.index), S.length), 0);
                  var captures = [];
                  for (var j = 1; j < result.length; j++)
                    captures.push(maybeToString(result[j]));
                  var namedCaptures = result.groups;
                  if (functionalReplace) {
                    var replacerArgs = [matched].concat(captures, position, S);
                    if (namedCaptures !== undefined)
                      replacerArgs.push(namedCaptures);
                    var replacement = String(
                      replaceValue.apply(undefined, replacerArgs)
                    );
                  } else {
                    replacement = getSubstitution(
                      matched,
                      S,
                      position,
                      captures,
                      namedCaptures,
                      replaceValue
                    );
                  }
                  if (position >= nextSourcePosition) {
                    accumulatedResult +=
                      S.slice(nextSourcePosition, position) + replacement;
                    nextSourcePosition = position + matched.length;
                  }
                }
                return accumulatedResult + S.slice(nextSourcePosition);
              },
            ];

            function getSubstitution(
              matched,
              str,
              position,
              captures,
              namedCaptures,
              replacement
            ) {
              var tailPos = position + matched.length;
              var m = captures.length;
              var symbols = SUBSTITUTION_SYMBOLS_NO_NAMED;
              if (namedCaptures !== undefined) {
                namedCaptures = toObject(namedCaptures);
                symbols = SUBSTITUTION_SYMBOLS;
              }
              return nativeReplace.call(
                replacement,
                symbols,
                function (match, ch) {
                  var capture;
                  switch (ch.charAt(0)) {
                    case '$':
                      return '$';
                    case '&':
                      return matched;
                    case '`':
                      return str.slice(0, position);
                    case "'":
                      return str.slice(tailPos);
                    case '<':
                      capture = namedCaptures[ch.slice(1, -1)];
                      break;
                    default: // \d\d?
                      var n = +ch;
                      if (n === 0) return match;
                      if (n > m) {
                        var f = floor(n / 10);
                        if (f === 0) return match;
                        if (f <= m)
                          return captures[f - 1] === undefined
                            ? ch.charAt(1)
                            : captures[f - 1] + ch.charAt(1);
                        return match;
                      }
                      capture = captures[n - 1];
                  }
                  return capture === undefined ? '' : capture;
                }
              );
            }
          }
        );
      },
      {
        '../internals/fix-regexp-well-known-symbol-logic':
          'd8e482793d25d23c0a47ad83f96948ea',
        '../internals/an-object': '4f20fc1a2160760f9e7961d272520cbd',
        '../internals/to-object': '2633fa4da95065e00ff87cc7cbdd56ba',
        '../internals/to-length': '68c0420762f5f4704115d4fb34e0ae7f',
        '../internals/to-integer': 'c0972d049bc20bd69592e8a28601d5ad',
        '../internals/require-object-coercible':
          '5617d8f084e26c58afcbde9a0982cf37',
        '../internals/advance-string-index': 'a82731122e9bc6200670a09300eea37d',
        '../internals/regexp-exec-abstract': 'b0d0f5be4954a41ffb1779e4d139f3ac',
      },
    ],
    d8e482793d25d23c0a47ad83f96948ea: [
      function (require, module, exports) {
        'use strict';
        require('../modules/es.regexp.exec');
        var redefine = require('../internals/redefine');
        var fails = require('../internals/fails');
        var wellKnownSymbol = require('../internals/well-known-symbol');
        var regexpExec = require('../internals/regexp-exec');
        var createNonEnumerableProperty = require('../internals/create-non-enumerable-property');

        var SPECIES = wellKnownSymbol('species');

        var REPLACE_SUPPORTS_NAMED_GROUPS = !fails(function () {
          var re = /./;
          re.exec = function () {
            var result = [];
            result.groups = { a: '7' };
            return result;
          };
          return ''.replace(re, '$<a>') !== '7';
        });

        var REPLACE_KEEPS_$0 = (function () {
          return 'a'.replace(/./, '$0') === '$0';
        })();

        var REPLACE = wellKnownSymbol('replace');
        var REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE = (function () {
          if (/./[REPLACE]) {
            return /./[REPLACE]('a', '$0') === '';
          }
          return false;
        })();

        var SPLIT_WORKS_WITH_OVERWRITTEN_EXEC = !fails(function () {
          var re = /(?:)/;
          var originalExec = re.exec;
          re.exec = function () {
            return originalExec.apply(this, arguments);
          };
          var result = 'ab'.split(re);
          return result.length !== 2 || result[0] !== 'a' || result[1] !== 'b';
        });

        module.exports = function (KEY, length, exec, sham) {
          var SYMBOL = wellKnownSymbol(KEY);

          var DELEGATES_TO_SYMBOL = !fails(function () {
            var O = {};
            O[SYMBOL] = function () {
              return 7;
            };
            return ''[KEY](O) != 7;
          });

          var DELEGATES_TO_EXEC =
            DELEGATES_TO_SYMBOL &&
            !fails(function () {
              var execCalled = false;
              var re = /a/;

              if (KEY === 'split') {
                re = {};
                re.constructor = {};
                re.constructor[SPECIES] = function () {
                  return re;
                };
                re.flags = '';
                re[SYMBOL] = /./[SYMBOL];
              }

              re.exec = function () {
                execCalled = true;
                return null;
              };

              re[SYMBOL]('');
              return !execCalled;
            });

          if (
            !DELEGATES_TO_SYMBOL ||
            !DELEGATES_TO_EXEC ||
            (KEY === 'replace' &&
              !(
                REPLACE_SUPPORTS_NAMED_GROUPS &&
                REPLACE_KEEPS_$0 &&
                !REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE
              )) ||
            (KEY === 'split' && !SPLIT_WORKS_WITH_OVERWRITTEN_EXEC)
          ) {
            var nativeRegExpMethod = /./[SYMBOL];
            var methods = exec(
              SYMBOL,
              ''[KEY],
              function (nativeMethod, regexp, str, arg2, forceStringMethod) {
                if (regexp.exec === regexpExec) {
                  if (DELEGATES_TO_SYMBOL && !forceStringMethod) {
                    return {
                      done: true,
                      value: nativeRegExpMethod.call(regexp, str, arg2),
                    };
                  }
                  return {
                    done: true,
                    value: nativeMethod.call(str, regexp, arg2),
                  };
                }
                return { done: false };
              },
              {
                REPLACE_KEEPS_$0: REPLACE_KEEPS_$0,
                REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE:
                  REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE,
              }
            );
            var stringMethod = methods[0];
            var regexMethod = methods[1];

            redefine(String.prototype, KEY, stringMethod);
            redefine(
              RegExp.prototype,
              SYMBOL,
              length == 2
                ? function (string, arg) {
                    return regexMethod.call(string, this, arg);
                  }
                : function (string) {
                    return regexMethod.call(string, this);
                  }
            );
          }

          if (sham)
            createNonEnumerableProperty(RegExp.prototype[SYMBOL], 'sham', true);
        };
      },
      {
        '../modules/es.regexp.exec': 'c60e58df05dbe67a3d86a0a71176436e',
        '../internals/redefine': 'b8f156ba0e16ecf7371c0d9dbd0a7d60',
        '../internals/fails': 'e16fc2ec92bf0d6254ffef14ea12ad77',
        '../internals/well-known-symbol': 'df9ad61e8404f948b528f2ef2becebe4',
        '../internals/regexp-exec': '23dabdad7fff927134e97d952be0a510',
        '../internals/create-non-enumerable-property':
          'b52adb17d2cebacfac251681882f0a33',
      },
    ],
    c60e58df05dbe67a3d86a0a71176436e: [
      function (require, module, exports) {
        'use strict';
        var $ = require('../internals/export');
        var exec = require('../internals/regexp-exec');

        $(
          { target: 'RegExp', proto: true, forced: /./.exec !== exec },
          {
            exec: exec,
          }
        );
      },
      {
        '../internals/export': '10044f24ecae4059b4af184e71d3fba2',
        '../internals/regexp-exec': '23dabdad7fff927134e97d952be0a510',
      },
    ],
    '10044f24ecae4059b4af184e71d3fba2': [
      function (require, module, exports) {
        var global = require('../internals/global');

        var getOwnPropertyDescriptor =
          require('../internals/object-get-own-property-descriptor').f;

        var createNonEnumerableProperty = require('../internals/create-non-enumerable-property');

        var redefine = require('../internals/redefine');

        var setGlobal = require('../internals/set-global');

        var copyConstructorProperties = require('../internals/copy-constructor-properties');

        var isForced = require('../internals/is-forced');

        module.exports = function (options, source) {
          var TARGET = options.target;
          var GLOBAL = options.global;
          var STATIC = options.stat;
          var FORCED, target, key, targetProperty, sourceProperty, descriptor;

          if (GLOBAL) {
            target = global;
          } else if (STATIC) {
            target = global[TARGET] || setGlobal(TARGET, {});
          } else {
            target = (global[TARGET] || {}).prototype;
          }

          if (target)
            for (key in source) {
              sourceProperty = source[key];

              if (options.noTargetGet) {
                descriptor = getOwnPropertyDescriptor(target, key);
                targetProperty = descriptor && descriptor.value;
              } else targetProperty = target[key];

              FORCED = isForced(
                GLOBAL ? key : TARGET + (STATIC ? '.' : '#') + key,
                options.forced
              );

              if (!FORCED && targetProperty !== undefined) {
                if (typeof sourceProperty === typeof targetProperty) continue;
                copyConstructorProperties(sourceProperty, targetProperty);
              }

              if (options.sham || (targetProperty && targetProperty.sham)) {
                createNonEnumerableProperty(sourceProperty, 'sham', true);
              }

              redefine(target, key, sourceProperty, options);
            }
        };
      },
      {
        '../internals/global': '7e78823454e7f795898745d93279f917',
        '../internals/object-get-own-property-descriptor':
          '5e181b7e7dcb1bb2de0a726b7af1e93d',
        '../internals/create-non-enumerable-property':
          'b52adb17d2cebacfac251681882f0a33',
        '../internals/redefine': 'b8f156ba0e16ecf7371c0d9dbd0a7d60',
        '../internals/set-global': '7e47fd3b4d01808069dad42c38d45146',
        '../internals/copy-constructor-properties':
          'df952df9fa85293fe01bbdf9f7116b1b',
        '../internals/is-forced': '700278f8e2cb4c21784f4e50866ce0e4',
      },
    ],
    '7e78823454e7f795898745d93279f917': [
      function (require, module, exports) {
        var global = arguments[3];

        var check = function (it) {
          return it && it.Math == Math && it;
        };

        module.exports =
          check(typeof globalThis == 'object' && globalThis) ||
          check(typeof window == 'object' && window) ||
          check(typeof self == 'object' && self) ||
          check(typeof global == 'object' && global) ||
          Function('return this')();
      },
      {},
    ],
    '5e181b7e7dcb1bb2de0a726b7af1e93d': [
      function (require, module, exports) {
        var DESCRIPTORS = require('../internals/descriptors');
        var propertyIsEnumerableModule = require('../internals/object-property-is-enumerable');
        var createPropertyDescriptor = require('../internals/create-property-descriptor');
        var toIndexedObject = require('../internals/to-indexed-object');
        var toPrimitive = require('../internals/to-primitive');
        var has = require('../internals/has');
        var IE8_DOM_DEFINE = require('../internals/ie8-dom-define');

        var nativeGetOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

        exports.f = DESCRIPTORS
          ? nativeGetOwnPropertyDescriptor
          : function getOwnPropertyDescriptor(O, P) {
              O = toIndexedObject(O);
              P = toPrimitive(P, true);
              if (IE8_DOM_DEFINE)
                try {
                  return nativeGetOwnPropertyDescriptor(O, P);
                } catch (error) {
                  /* empty */
                }
              if (has(O, P))
                return createPropertyDescriptor(
                  !propertyIsEnumerableModule.f.call(O, P),
                  O[P]
                );
            };
      },
      {
        '../internals/descriptors': '7e006cebe93fc4773e87d3146a8fa81b',
        '../internals/object-property-is-enumerable':
          '6d666488e852af6845747bbd2705cc05',
        '../internals/create-property-descriptor':
          '8c5551ce5a79ddcd7162c3e3c8f33c9a',
        '../internals/to-indexed-object': 'debf68affb1e9f1283fa252d49c32ceb',
        '../internals/to-primitive': '2a7f05f0f9119d3b88a770acfa30cc7b',
        '../internals/has': 'ce850695ec64cefd211ef6863461b802',
        '../internals/ie8-dom-define': 'e03ae13f7b17b2e21331d728bd059d1a',
      },
    ],
    '7e006cebe93fc4773e87d3146a8fa81b': [
      function (require, module, exports) {
        var fails = require('../internals/fails');

        module.exports = !fails(function () {
          return (
            Object.defineProperty({}, 1, {
              get: function () {
                return 7;
              },
            })[1] != 7
          );
        });
      },
      { '../internals/fails': 'e16fc2ec92bf0d6254ffef14ea12ad77' },
    ],
    e16fc2ec92bf0d6254ffef14ea12ad77: [
      function (require, module, exports) {
        module.exports = function (exec) {
          try {
            return !!exec();
          } catch (error) {
            return true;
          }
        };
      },
      {},
    ],
    '6d666488e852af6845747bbd2705cc05': [
      function (require, module, exports) {
        'use strict';
        var nativePropertyIsEnumerable = {}.propertyIsEnumerable;
        var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

        // Nashorn ~ JDK8 bug
        var NASHORN_BUG =
          getOwnPropertyDescriptor &&
          !nativePropertyIsEnumerable.call({ 1: 2 }, 1);

        exports.f = NASHORN_BUG
          ? function propertyIsEnumerable(V) {
              var descriptor = getOwnPropertyDescriptor(this, V);
              return !!descriptor && descriptor.enumerable;
            }
          : nativePropertyIsEnumerable;
      },
      {},
    ],
    '8c5551ce5a79ddcd7162c3e3c8f33c9a': [
      function (require, module, exports) {
        module.exports = function (bitmap, value) {
          return {
            enumerable: !(bitmap & 1),
            configurable: !(bitmap & 2),
            writable: !(bitmap & 4),
            value: value,
          };
        };
      },
      {},
    ],
    debf68affb1e9f1283fa252d49c32ceb: [
      function (require, module, exports) {
        var IndexedObject = require('../internals/indexed-object');
        var requireObjectCoercible = require('../internals/require-object-coercible');

        module.exports = function (it) {
          return IndexedObject(requireObjectCoercible(it));
        };
      },
      {
        '../internals/indexed-object': '35ae890303b620d792cd5faa73776178',
        '../internals/require-object-coercible':
          '5617d8f084e26c58afcbde9a0982cf37',
      },
    ],
    '35ae890303b620d792cd5faa73776178': [
      function (require, module, exports) {
        var fails = require('../internals/fails');
        var classof = require('../internals/classof-raw');

        var split = ''.split;

        module.exports = fails(function () {
          return !Object('z').propertyIsEnumerable(0);
        })
          ? function (it) {
              return classof(it) == 'String' ? split.call(it, '') : Object(it);
            }
          : Object;
      },
      {
        '../internals/fails': 'e16fc2ec92bf0d6254ffef14ea12ad77',
        '../internals/classof-raw': '901e5a25291bac244011feea921975b2',
      },
    ],
    '901e5a25291bac244011feea921975b2': [
      function (require, module, exports) {
        var toString = {}.toString;

        module.exports = function (it) {
          return toString.call(it).slice(8, -1);
        };
      },
      {},
    ],
    '5617d8f084e26c58afcbde9a0982cf37': [
      function (require, module, exports) {
        module.exports = function (it) {
          if (it == undefined) throw TypeError("Can't call method on " + it);
          return it;
        };
      },
      {},
    ],
    '2a7f05f0f9119d3b88a770acfa30cc7b': [
      function (require, module, exports) {
        var isObject = require('../internals/is-object');

        module.exports = function (input, PREFERRED_STRING) {
          if (!isObject(input)) return input;
          var fn, val;
          if (
            PREFERRED_STRING &&
            typeof (fn = input.toString) == 'function' &&
            !isObject((val = fn.call(input)))
          )
            return val;
          if (
            typeof (fn = input.valueOf) == 'function' &&
            !isObject((val = fn.call(input)))
          )
            return val;
          if (
            !PREFERRED_STRING &&
            typeof (fn = input.toString) == 'function' &&
            !isObject((val = fn.call(input)))
          )
            return val;
          throw TypeError("Can't convert object to primitive value");
        };
      },
      { '../internals/is-object': '03244e745134af366d66b74456891052' },
    ],
    '03244e745134af366d66b74456891052': [
      function (require, module, exports) {
        module.exports = function (it) {
          return typeof it === 'object'
            ? it !== null
            : typeof it === 'function';
        };
      },
      {},
    ],
    ce850695ec64cefd211ef6863461b802: [
      function (require, module, exports) {
        var hasOwnProperty = {}.hasOwnProperty;

        module.exports = function (it, key) {
          return hasOwnProperty.call(it, key);
        };
      },
      {},
    ],
    e03ae13f7b17b2e21331d728bd059d1a: [
      function (require, module, exports) {
        var DESCRIPTORS = require('../internals/descriptors');
        var fails = require('../internals/fails');
        var createElement = require('../internals/document-create-element');

        module.exports =
          !DESCRIPTORS &&
          !fails(function () {
            return (
              Object.defineProperty(createElement('div'), 'a', {
                get: function () {
                  return 7;
                },
              }).a != 7
            );
          });
      },
      {
        '../internals/descriptors': '7e006cebe93fc4773e87d3146a8fa81b',
        '../internals/fails': 'e16fc2ec92bf0d6254ffef14ea12ad77',
        '../internals/document-create-element':
          'cbe47a0c6cb67b97db834ad53049114a',
      },
    ],
    cbe47a0c6cb67b97db834ad53049114a: [
      function (require, module, exports) {
        var global = require('../internals/global');

        var isObject = require('../internals/is-object');

        var document = global.document;

        var EXISTS = isObject(document) && isObject(document.createElement);

        module.exports = function (it) {
          return EXISTS ? document.createElement(it) : {};
        };
      },
      {
        '../internals/global': '7e78823454e7f795898745d93279f917',
        '../internals/is-object': '03244e745134af366d66b74456891052',
      },
    ],
    b52adb17d2cebacfac251681882f0a33: [
      function (require, module, exports) {
        var DESCRIPTORS = require('../internals/descriptors');
        var definePropertyModule = require('../internals/object-define-property');
        var createPropertyDescriptor = require('../internals/create-property-descriptor');

        module.exports = DESCRIPTORS
          ? function (object, key, value) {
              return definePropertyModule.f(
                object,
                key,
                createPropertyDescriptor(1, value)
              );
            }
          : function (object, key, value) {
              object[key] = value;
              return object;
            };
      },
      {
        '../internals/descriptors': '7e006cebe93fc4773e87d3146a8fa81b',
        '../internals/object-define-property':
          '645ef963c1e312a12b44589911036a7f',
        '../internals/create-property-descriptor':
          '8c5551ce5a79ddcd7162c3e3c8f33c9a',
      },
    ],
    '645ef963c1e312a12b44589911036a7f': [
      function (require, module, exports) {
        var DESCRIPTORS = require('../internals/descriptors');
        var IE8_DOM_DEFINE = require('../internals/ie8-dom-define');
        var anObject = require('../internals/an-object');
        var toPrimitive = require('../internals/to-primitive');

        var nativeDefineProperty = Object.defineProperty;

        exports.f = DESCRIPTORS
          ? nativeDefineProperty
          : function defineProperty(O, P, Attributes) {
              anObject(O);
              P = toPrimitive(P, true);
              anObject(Attributes);
              if (IE8_DOM_DEFINE)
                try {
                  return nativeDefineProperty(O, P, Attributes);
                } catch (error) {
                  /* empty */
                }
              if ('get' in Attributes || 'set' in Attributes)
                throw TypeError('Accessors not supported');
              if ('value' in Attributes) O[P] = Attributes.value;
              return O;
            };
      },
      {
        '../internals/descriptors': '7e006cebe93fc4773e87d3146a8fa81b',
        '../internals/ie8-dom-define': 'e03ae13f7b17b2e21331d728bd059d1a',
        '../internals/an-object': '4f20fc1a2160760f9e7961d272520cbd',
        '../internals/to-primitive': '2a7f05f0f9119d3b88a770acfa30cc7b',
      },
    ],
    '4f20fc1a2160760f9e7961d272520cbd': [
      function (require, module, exports) {
        var isObject = require('../internals/is-object');

        module.exports = function (it) {
          if (!isObject(it)) {
            throw TypeError(String(it) + ' is not an object');
          }
          return it;
        };
      },
      { '../internals/is-object': '03244e745134af366d66b74456891052' },
    ],
    b8f156ba0e16ecf7371c0d9dbd0a7d60: [
      function (require, module, exports) {
        var global = require('../internals/global');

        var createNonEnumerableProperty = require('../internals/create-non-enumerable-property');

        var has = require('../internals/has');

        var setGlobal = require('../internals/set-global');

        var inspectSource = require('../internals/inspect-source');

        var InternalStateModule = require('../internals/internal-state');

        var getInternalState = InternalStateModule.get;
        var enforceInternalState = InternalStateModule.enforce;
        var TEMPLATE = String(String).split('String');
        (module.exports = function (O, key, value, options) {
          var unsafe = options ? !!options.unsafe : false;
          var simple = options ? !!options.enumerable : false;
          var noTargetGet = options ? !!options.noTargetGet : false;

          if (typeof value == 'function') {
            if (typeof key == 'string' && !has(value, 'name'))
              createNonEnumerableProperty(value, 'name', key);
            enforceInternalState(value).source = TEMPLATE.join(
              typeof key == 'string' ? key : ''
            );
          }

          if (O === global) {
            if (simple) O[key] = value;
            else setGlobal(key, value);
            return;
          } else if (!unsafe) {
            delete O[key];
          } else if (!noTargetGet && O[key]) {
            simple = true;
          }

          if (simple) O[key] = value;
          else createNonEnumerableProperty(O, key, value); // add fake Function#toString for correct work wrapped methods / constructors with methods like LoDash isNative
        })(Function.prototype, 'toString', function toString() {
          return (
            (typeof this == 'function' && getInternalState(this).source) ||
            inspectSource(this)
          );
        });
      },
      {
        '../internals/global': '7e78823454e7f795898745d93279f917',
        '../internals/create-non-enumerable-property':
          'b52adb17d2cebacfac251681882f0a33',
        '../internals/has': 'ce850695ec64cefd211ef6863461b802',
        '../internals/set-global': '7e47fd3b4d01808069dad42c38d45146',
        '../internals/inspect-source': '2632e39e653b5d5a3bae68e9954b90e4',
        '../internals/internal-state': '8b9f5ed7c6f8b05b4cd6ee1eefa801c1',
      },
    ],
    '7e47fd3b4d01808069dad42c38d45146': [
      function (require, module, exports) {
        var global = require('../internals/global');

        var createNonEnumerableProperty = require('../internals/create-non-enumerable-property');

        module.exports = function (key, value) {
          try {
            createNonEnumerableProperty(global, key, value);
          } catch (error) {
            global[key] = value;
          }

          return value;
        };
      },
      {
        '../internals/global': '7e78823454e7f795898745d93279f917',
        '../internals/create-non-enumerable-property':
          'b52adb17d2cebacfac251681882f0a33',
      },
    ],
    '2632e39e653b5d5a3bae68e9954b90e4': [
      function (require, module, exports) {
        var store = require('../internals/shared-store');

        var functionToString = Function.toString;

        if (typeof store.inspectSource != 'function') {
          store.inspectSource = function (it) {
            return functionToString.call(it);
          };
        }

        module.exports = store.inspectSource;
      },
      { '../internals/shared-store': '050f18cf9a95404c13e77ce244078f47' },
    ],
    '050f18cf9a95404c13e77ce244078f47': [
      function (require, module, exports) {
        var global = require('../internals/global');

        var setGlobal = require('../internals/set-global');

        var SHARED = '__core-js_shared__';
        var store = global[SHARED] || setGlobal(SHARED, {});
        module.exports = store;
      },
      {
        '../internals/global': '7e78823454e7f795898745d93279f917',
        '../internals/set-global': '7e47fd3b4d01808069dad42c38d45146',
      },
    ],
    '8b9f5ed7c6f8b05b4cd6ee1eefa801c1': [
      function (require, module, exports) {
        var NATIVE_WEAK_MAP = require('../internals/native-weak-map');

        var global = require('../internals/global');

        var isObject = require('../internals/is-object');

        var createNonEnumerableProperty = require('../internals/create-non-enumerable-property');

        var objectHas = require('../internals/has');

        var sharedKey = require('../internals/shared-key');

        var hiddenKeys = require('../internals/hidden-keys');

        var WeakMap = global.WeakMap;
        var set, get, has;

        var enforce = function (it) {
          return has(it) ? get(it) : set(it, {});
        };

        var getterFor = function (TYPE) {
          return function (it) {
            var state;

            if (!isObject(it) || (state = get(it)).type !== TYPE) {
              throw TypeError('Incompatible receiver, ' + TYPE + ' required');
            }

            return state;
          };
        };

        if (NATIVE_WEAK_MAP) {
          var store = new WeakMap();
          var wmget = store.get;
          var wmhas = store.has;
          var wmset = store.set;

          set = function (it, metadata) {
            wmset.call(store, it, metadata);
            return metadata;
          };

          get = function (it) {
            return wmget.call(store, it) || {};
          };

          has = function (it) {
            return wmhas.call(store, it);
          };
        } else {
          var STATE = sharedKey('state');
          hiddenKeys[STATE] = true;

          set = function (it, metadata) {
            createNonEnumerableProperty(it, STATE, metadata);
            return metadata;
          };

          get = function (it) {
            return objectHas(it, STATE) ? it[STATE] : {};
          };

          has = function (it) {
            return objectHas(it, STATE);
          };
        }

        module.exports = {
          set: set,
          get: get,
          has: has,
          enforce: enforce,
          getterFor: getterFor,
        };
      },
      {
        '../internals/native-weak-map': '3633a06fd667b2a3966200ce5e2edda9',
        '../internals/global': '7e78823454e7f795898745d93279f917',
        '../internals/is-object': '03244e745134af366d66b74456891052',
        '../internals/create-non-enumerable-property':
          'b52adb17d2cebacfac251681882f0a33',
        '../internals/has': 'ce850695ec64cefd211ef6863461b802',
        '../internals/shared-key': '18fb64363b0383efc58d7addc88469cd',
        '../internals/hidden-keys': '7cf9eee6c00d9cc7018f7817cf84e3d6',
      },
    ],
    '3633a06fd667b2a3966200ce5e2edda9': [
      function (require, module, exports) {
        var global = require('../internals/global');

        var inspectSource = require('../internals/inspect-source');

        var WeakMap = global.WeakMap;
        module.exports =
          typeof WeakMap === 'function' &&
          /native code/.test(inspectSource(WeakMap));
      },
      {
        '../internals/global': '7e78823454e7f795898745d93279f917',
        '../internals/inspect-source': '2632e39e653b5d5a3bae68e9954b90e4',
      },
    ],
    '18fb64363b0383efc58d7addc88469cd': [
      function (require, module, exports) {
        var shared = require('../internals/shared');
        var uid = require('../internals/uid');

        var keys = shared('keys');

        module.exports = function (key) {
          return keys[key] || (keys[key] = uid(key));
        };
      },
      {
        '../internals/shared': '1950ed6cf8f0dece2a998d60590e9098',
        '../internals/uid': 'd5b7e7679d9dac163ab327cbf9508501',
      },
    ],
    '1950ed6cf8f0dece2a998d60590e9098': [
      function (require, module, exports) {
        var IS_PURE = require('../internals/is-pure');
        var store = require('../internals/shared-store');

        (module.exports = function (key, value) {
          return store[key] || (store[key] = value !== undefined ? value : {});
        })('versions', []).push({
          version: '3.6.5',
          mode: IS_PURE ? 'pure' : 'global',
          copyright: '© 2020 Denis Pushkarev (zloirock.ru)',
        });
      },
      {
        '../internals/is-pure': 'f767c4b71b5cfe3ee6c1a7e54bdcafa0',
        '../internals/shared-store': '050f18cf9a95404c13e77ce244078f47',
      },
    ],
    f767c4b71b5cfe3ee6c1a7e54bdcafa0: [
      function (require, module, exports) {
        module.exports = false;
      },
      {},
    ],
    d5b7e7679d9dac163ab327cbf9508501: [
      function (require, module, exports) {
        var id = 0;
        var postfix = Math.random();

        module.exports = function (key) {
          return (
            'Symbol(' +
            String(key === undefined ? '' : key) +
            ')_' +
            (++id + postfix).toString(36)
          );
        };
      },
      {},
    ],
    '7cf9eee6c00d9cc7018f7817cf84e3d6': [
      function (require, module, exports) {
        module.exports = {};
      },
      {},
    ],
    df952df9fa85293fe01bbdf9f7116b1b: [
      function (require, module, exports) {
        var has = require('../internals/has');
        var ownKeys = require('../internals/own-keys');
        var getOwnPropertyDescriptorModule = require('../internals/object-get-own-property-descriptor');
        var definePropertyModule = require('../internals/object-define-property');

        module.exports = function (target, source) {
          var keys = ownKeys(source);
          var defineProperty = definePropertyModule.f;
          var getOwnPropertyDescriptor = getOwnPropertyDescriptorModule.f;
          for (var i = 0; i < keys.length; i++) {
            var key = keys[i];
            if (!has(target, key))
              defineProperty(
                target,
                key,
                getOwnPropertyDescriptor(source, key)
              );
          }
        };
      },
      {
        '../internals/has': 'ce850695ec64cefd211ef6863461b802',
        '../internals/own-keys': 'a99313addb30af59e8e5785ab390671c',
        '../internals/object-get-own-property-descriptor':
          '5e181b7e7dcb1bb2de0a726b7af1e93d',
        '../internals/object-define-property':
          '645ef963c1e312a12b44589911036a7f',
      },
    ],
    a99313addb30af59e8e5785ab390671c: [
      function (require, module, exports) {
        var getBuiltIn = require('../internals/get-built-in');
        var getOwnPropertyNamesModule = require('../internals/object-get-own-property-names');
        var getOwnPropertySymbolsModule = require('../internals/object-get-own-property-symbols');
        var anObject = require('../internals/an-object');

        module.exports =
          getBuiltIn('Reflect', 'ownKeys') ||
          function ownKeys(it) {
            var keys = getOwnPropertyNamesModule.f(anObject(it));
            var getOwnPropertySymbols = getOwnPropertySymbolsModule.f;
            return getOwnPropertySymbols
              ? keys.concat(getOwnPropertySymbols(it))
              : keys;
          };
      },
      {
        '../internals/get-built-in': 'a8e7e15d3af5a0a555019aebcf7ed164',
        '../internals/object-get-own-property-names':
          'b422be4dea2e1243d9a0803066cc2d3d',
        '../internals/object-get-own-property-symbols':
          'f759fc76793903b9cadc1e3a84780ff9',
        '../internals/an-object': '4f20fc1a2160760f9e7961d272520cbd',
      },
    ],
    a8e7e15d3af5a0a555019aebcf7ed164: [
      function (require, module, exports) {
        var path = require('../internals/path');

        var global = require('../internals/global');

        var aFunction = function (variable) {
          return typeof variable == 'function' ? variable : undefined;
        };

        module.exports = function (namespace, method) {
          return arguments.length < 2
            ? aFunction(path[namespace]) || aFunction(global[namespace])
            : (path[namespace] && path[namespace][method]) ||
                (global[namespace] && global[namespace][method]);
        };
      },
      {
        '../internals/path': 'da95d5e8f7bf2e6702061407876f0910',
        '../internals/global': '7e78823454e7f795898745d93279f917',
      },
    ],
    da95d5e8f7bf2e6702061407876f0910: [
      function (require, module, exports) {
        var global = require('../internals/global');

        module.exports = global;
      },
      { '../internals/global': '7e78823454e7f795898745d93279f917' },
    ],
    b422be4dea2e1243d9a0803066cc2d3d: [
      function (require, module, exports) {
        var internalObjectKeys = require('../internals/object-keys-internal');
        var enumBugKeys = require('../internals/enum-bug-keys');

        var hiddenKeys = enumBugKeys.concat('length', 'prototype');

        exports.f =
          Object.getOwnPropertyNames ||
          function getOwnPropertyNames(O) {
            return internalObjectKeys(O, hiddenKeys);
          };
      },
      {
        '../internals/object-keys-internal': '87cfa515865c83e03f632cbb3fb5fffb',
        '../internals/enum-bug-keys': 'f973a6d08ba70476eedabcaf4b58c5fb',
      },
    ],
    '87cfa515865c83e03f632cbb3fb5fffb': [
      function (require, module, exports) {
        var has = require('../internals/has');
        var toIndexedObject = require('../internals/to-indexed-object');
        var indexOf = require('../internals/array-includes').indexOf;
        var hiddenKeys = require('../internals/hidden-keys');

        module.exports = function (object, names) {
          var O = toIndexedObject(object);
          var i = 0;
          var result = [];
          var key;
          for (key in O)
            !has(hiddenKeys, key) && has(O, key) && result.push(key);
          while (names.length > i)
            if (has(O, (key = names[i++]))) {
              ~indexOf(result, key) || result.push(key);
            }
          return result;
        };
      },
      {
        '../internals/has': 'ce850695ec64cefd211ef6863461b802',
        '../internals/to-indexed-object': 'debf68affb1e9f1283fa252d49c32ceb',
        '../internals/array-includes': '8d0989f06759b3b2c526a5860656b2fc',
        '../internals/hidden-keys': '7cf9eee6c00d9cc7018f7817cf84e3d6',
      },
    ],
    '8d0989f06759b3b2c526a5860656b2fc': [
      function (require, module, exports) {
        var toIndexedObject = require('../internals/to-indexed-object');
        var toLength = require('../internals/to-length');
        var toAbsoluteIndex = require('../internals/to-absolute-index');

        // `Array.prototype.{ indexOf, includes }` methods implementation
        var createMethod = function (IS_INCLUDES) {
          return function ($this, el, fromIndex) {
            var O = toIndexedObject($this);
            var length = toLength(O.length);
            var index = toAbsoluteIndex(fromIndex, length);
            var value;
            if (IS_INCLUDES && el != el)
              while (length > index) {
                value = O[index++];
                if (value != value) return true;
              }
            else
              for (; length > index; index++) {
                if ((IS_INCLUDES || index in O) && O[index] === el)
                  return IS_INCLUDES || index || 0;
              }
            return !IS_INCLUDES && -1;
          };
        };

        module.exports = {
          includes: createMethod(true),
          indexOf: createMethod(false),
        };
      },
      {
        '../internals/to-indexed-object': 'debf68affb1e9f1283fa252d49c32ceb',
        '../internals/to-length': '68c0420762f5f4704115d4fb34e0ae7f',
        '../internals/to-absolute-index': 'ff996ac5a229620b351a78c404035460',
      },
    ],
    '68c0420762f5f4704115d4fb34e0ae7f': [
      function (require, module, exports) {
        var toInteger = require('../internals/to-integer');

        var min = Math.min;

        module.exports = function (argument) {
          return argument > 0 ? min(toInteger(argument), 0x1fffffffffffff) : 0; // 2 ** 53 - 1 == 9007199254740991
        };
      },
      { '../internals/to-integer': 'c0972d049bc20bd69592e8a28601d5ad' },
    ],
    c0972d049bc20bd69592e8a28601d5ad: [
      function (require, module, exports) {
        var ceil = Math.ceil;
        var floor = Math.floor;

        module.exports = function (argument) {
          return isNaN((argument = +argument))
            ? 0
            : (argument > 0 ? floor : ceil)(argument);
        };
      },
      {},
    ],
    ff996ac5a229620b351a78c404035460: [
      function (require, module, exports) {
        var toInteger = require('../internals/to-integer');

        var max = Math.max;
        var min = Math.min;

        module.exports = function (index, length) {
          var integer = toInteger(index);
          return integer < 0 ? max(integer + length, 0) : min(integer, length);
        };
      },
      { '../internals/to-integer': 'c0972d049bc20bd69592e8a28601d5ad' },
    ],
    f973a6d08ba70476eedabcaf4b58c5fb: [
      function (require, module, exports) {
        module.exports = [
          'constructor',
          'hasOwnProperty',
          'isPrototypeOf',
          'propertyIsEnumerable',
          'toLocaleString',
          'toString',
          'valueOf',
        ];
      },
      {},
    ],
    f759fc76793903b9cadc1e3a84780ff9: [
      function (require, module, exports) {
        exports.f = Object.getOwnPropertySymbols;
      },
      {},
    ],
    '700278f8e2cb4c21784f4e50866ce0e4': [
      function (require, module, exports) {
        var fails = require('../internals/fails');

        var replacement = /#|\.prototype\./;

        var isForced = function (feature, detection) {
          var value = data[normalize(feature)];
          return value == POLYFILL
            ? true
            : value == NATIVE
            ? false
            : typeof detection == 'function'
            ? fails(detection)
            : !!detection;
        };

        var normalize = (isForced.normalize = function (string) {
          return String(string).replace(replacement, '.').toLowerCase();
        });

        var data = (isForced.data = {});
        var NATIVE = (isForced.NATIVE = 'N');
        var POLYFILL = (isForced.POLYFILL = 'P');

        module.exports = isForced;
      },
      { '../internals/fails': 'e16fc2ec92bf0d6254ffef14ea12ad77' },
    ],
    '23dabdad7fff927134e97d952be0a510': [
      function (require, module, exports) {
        'use strict';
        var regexpFlags = require('./regexp-flags');
        var stickyHelpers = require('./regexp-sticky-helpers');

        var nativeExec = RegExp.prototype.exec;
        var nativeReplace = String.prototype.replace;

        var patchedExec = nativeExec;

        var UPDATES_LAST_INDEX_WRONG = (function () {
          var re1 = /a/;
          var re2 = /b*/g;
          nativeExec.call(re1, 'a');
          nativeExec.call(re2, 'a');
          return re1.lastIndex !== 0 || re2.lastIndex !== 0;
        })();

        var UNSUPPORTED_Y =
          stickyHelpers.UNSUPPORTED_Y || stickyHelpers.BROKEN_CARET;

        var NPCG_INCLUDED = /()??/.exec('')[1] !== undefined;

        var PATCH = UPDATES_LAST_INDEX_WRONG || NPCG_INCLUDED || UNSUPPORTED_Y;

        if (PATCH) {
          patchedExec = function exec(str) {
            var re = this;
            var lastIndex, reCopy, match, i;
            var sticky = UNSUPPORTED_Y && re.sticky;
            var flags = regexpFlags.call(re);
            var source = re.source;
            var charsAdded = 0;
            var strCopy = str;

            if (sticky) {
              flags = flags.replace('y', '');
              if (flags.indexOf('g') === -1) {
                flags += 'g';
              }

              strCopy = String(str).slice(re.lastIndex);
              if (
                re.lastIndex > 0 &&
                (!re.multiline ||
                  (re.multiline && str[re.lastIndex - 1] !== '\n'))
              ) {
                source = '(?: ' + source + ')';
                strCopy = ' ' + strCopy;
                charsAdded++;
              }
              reCopy = new RegExp('^(?:' + source + ')', flags);
            }

            if (NPCG_INCLUDED) {
              reCopy = new RegExp('^' + source + '$(?!\\s)', flags);
            }
            if (UPDATES_LAST_INDEX_WRONG) lastIndex = re.lastIndex;

            match = nativeExec.call(sticky ? reCopy : re, strCopy);

            if (sticky) {
              if (match) {
                match.input = match.input.slice(charsAdded);
                match[0] = match[0].slice(charsAdded);
                match.index = re.lastIndex;
                re.lastIndex += match[0].length;
              } else re.lastIndex = 0;
            } else if (UPDATES_LAST_INDEX_WRONG && match) {
              re.lastIndex = re.global
                ? match.index + match[0].length
                : lastIndex;
            }
            if (NPCG_INCLUDED && match && match.length > 1) {
              nativeReplace.call(match[0], reCopy, function () {
                for (i = 1; i < arguments.length - 2; i++) {
                  if (arguments[i] === undefined) match[i] = undefined;
                }
              });
            }

            return match;
          };
        }

        module.exports = patchedExec;
      },
      {
        './regexp-flags': '9ed5cc7a98675b7cdea415f21c6b5f7b',
        './regexp-sticky-helpers': '8cf821686ebf02f1be282c6b0438fc93',
      },
    ],
    '9ed5cc7a98675b7cdea415f21c6b5f7b': [
      function (require, module, exports) {
        'use strict';
        var anObject = require('../internals/an-object');

        module.exports = function () {
          var that = anObject(this);
          var result = '';
          if (that.global) result += 'g';
          if (that.ignoreCase) result += 'i';
          if (that.multiline) result += 'm';
          if (that.dotAll) result += 's';
          if (that.unicode) result += 'u';
          if (that.sticky) result += 'y';
          return result;
        };
      },
      { '../internals/an-object': '4f20fc1a2160760f9e7961d272520cbd' },
    ],
    '8cf821686ebf02f1be282c6b0438fc93': [
      function (require, module, exports) {
        'use strict';

        var fails = require('./fails');

        function RE(s, f) {
          return RegExp(s, f);
        }

        exports.UNSUPPORTED_Y = fails(function () {
          var re = RE('a', 'y');
          re.lastIndex = 2;
          return re.exec('abcd') != null;
        });

        exports.BROKEN_CARET = fails(function () {
          var re = RE('^r', 'gy');
          re.lastIndex = 2;
          return re.exec('str') != null;
        });
      },
      { './fails': 'e16fc2ec92bf0d6254ffef14ea12ad77' },
    ],
    df9ad61e8404f948b528f2ef2becebe4: [
      function (require, module, exports) {
        var global = require('../internals/global');

        var shared = require('../internals/shared');

        var has = require('../internals/has');

        var uid = require('../internals/uid');

        var NATIVE_SYMBOL = require('../internals/native-symbol');

        var USE_SYMBOL_AS_UID = require('../internals/use-symbol-as-uid');

        var WellKnownSymbolsStore = shared('wks');
        var Symbol = global.Symbol;
        var createWellKnownSymbol = USE_SYMBOL_AS_UID
          ? Symbol
          : (Symbol && Symbol.withoutSetter) || uid;

        module.exports = function (name) {
          if (!has(WellKnownSymbolsStore, name)) {
            if (NATIVE_SYMBOL && has(Symbol, name))
              WellKnownSymbolsStore[name] = Symbol[name];
            else
              WellKnownSymbolsStore[name] = createWellKnownSymbol(
                'Symbol.' + name
              );
          }

          return WellKnownSymbolsStore[name];
        };
      },
      {
        '../internals/global': '7e78823454e7f795898745d93279f917',
        '../internals/shared': '1950ed6cf8f0dece2a998d60590e9098',
        '../internals/has': 'ce850695ec64cefd211ef6863461b802',
        '../internals/uid': 'd5b7e7679d9dac163ab327cbf9508501',
        '../internals/native-symbol': 'f4c6561c5780f812466dd472171f0916',
        '../internals/use-symbol-as-uid': 'ea1988735f852716e8c2b0bf1a7f981c',
      },
    ],
    f4c6561c5780f812466dd472171f0916: [
      function (require, module, exports) {
        var fails = require('../internals/fails');

        module.exports =
          !!Object.getOwnPropertySymbols &&
          !fails(function () {
            return !String(Symbol());
          });
      },
      { '../internals/fails': 'e16fc2ec92bf0d6254ffef14ea12ad77' },
    ],
    ea1988735f852716e8c2b0bf1a7f981c: [
      function (require, module, exports) {
        var NATIVE_SYMBOL = require('../internals/native-symbol');

        module.exports =
          NATIVE_SYMBOL && !Symbol.sham && typeof Symbol.iterator == 'symbol';
      },
      { '../internals/native-symbol': 'f4c6561c5780f812466dd472171f0916' },
    ],
    '2633fa4da95065e00ff87cc7cbdd56ba': [
      function (require, module, exports) {
        var requireObjectCoercible = require('../internals/require-object-coercible');

        module.exports = function (argument) {
          return Object(requireObjectCoercible(argument));
        };
      },
      {
        '../internals/require-object-coercible':
          '5617d8f084e26c58afcbde9a0982cf37',
      },
    ],
    a82731122e9bc6200670a09300eea37d: [
      function (require, module, exports) {
        'use strict';
        var charAt = require('../internals/string-multibyte').charAt;

        module.exports = function (S, index, unicode) {
          return index + (unicode ? charAt(S, index).length : 1);
        };
      },
      { '../internals/string-multibyte': '2324ad16ce38cbfde2a3a75c67697ac1' },
    ],
    '2324ad16ce38cbfde2a3a75c67697ac1': [
      function (require, module, exports) {
        var toInteger = require('../internals/to-integer');
        var requireObjectCoercible = require('../internals/require-object-coercible');

        var createMethod = function (CONVERT_TO_STRING) {
          return function ($this, pos) {
            var S = String(requireObjectCoercible($this));
            var position = toInteger(pos);
            var size = S.length;
            var first, second;
            if (position < 0 || position >= size)
              return CONVERT_TO_STRING ? '' : undefined;
            first = S.charCodeAt(position);
            return first < 0xd800 ||
              first > 0xdbff ||
              position + 1 === size ||
              (second = S.charCodeAt(position + 1)) < 0xdc00 ||
              second > 0xdfff
              ? CONVERT_TO_STRING
                ? S.charAt(position)
                : first
              : CONVERT_TO_STRING
              ? S.slice(position, position + 2)
              : ((first - 0xd800) << 10) + (second - 0xdc00) + 0x10000;
          };
        };

        module.exports = {
          codeAt: createMethod(false),
          charAt: createMethod(true),
        };
      },
      {
        '../internals/to-integer': 'c0972d049bc20bd69592e8a28601d5ad',
        '../internals/require-object-coercible':
          '5617d8f084e26c58afcbde9a0982cf37',
      },
    ],
    b0d0f5be4954a41ffb1779e4d139f3ac: [
      function (require, module, exports) {
        var classof = require('./classof-raw');
        var regexpExec = require('./regexp-exec');

        module.exports = function (R, S) {
          var exec = R.exec;
          if (typeof exec === 'function') {
            var result = exec.call(R, S);
            if (typeof result !== 'object') {
              throw TypeError(
                'RegExp exec method returned something other than an Object or null'
              );
            }
            return result;
          }

          if (classof(R) !== 'RegExp') {
            throw TypeError('RegExp#exec called on incompatible receiver');
          }

          return regexpExec.call(R, S);
        };
      },
      {
        './classof-raw': '901e5a25291bac244011feea921975b2',
        './regexp-exec': '23dabdad7fff927134e97d952be0a510',
      },
    ],
    d5ed5e3a2e200dcf66c948e6350ae29c: [
      function (require, module, exports) {
        var createTypedArrayConstructor = require('../internals/typed-array-constructor');

        createTypedArrayConstructor('Float32', function (init) {
          return function Float32Array(data, byteOffset, length) {
            return init(this, data, byteOffset, length);
          };
        });
      },
      {
        '../internals/typed-array-constructor':
          '8c855361f876f3547521c1eb756f5360',
      },
    ],
    '8c855361f876f3547521c1eb756f5360': [
      function (require, module, exports) {
        'use strict';

        var $ = require('../internals/export');

        var global = require('../internals/global');

        var DESCRIPTORS = require('../internals/descriptors');

        var TYPED_ARRAYS_CONSTRUCTORS_REQUIRES_WRAPPERS = require('../internals/typed-array-constructors-require-wrappers');

        var ArrayBufferViewCore = require('../internals/array-buffer-view-core');

        var ArrayBufferModule = require('../internals/array-buffer');

        var anInstance = require('../internals/an-instance');

        var createPropertyDescriptor = require('../internals/create-property-descriptor');

        var createNonEnumerableProperty = require('../internals/create-non-enumerable-property');

        var toLength = require('../internals/to-length');

        var toIndex = require('../internals/to-index');

        var toOffset = require('../internals/to-offset');

        var toPrimitive = require('../internals/to-primitive');

        var has = require('../internals/has');

        var classof = require('../internals/classof');

        var isObject = require('../internals/is-object');

        var create = require('../internals/object-create');

        var setPrototypeOf = require('../internals/object-set-prototype-of');

        var getOwnPropertyNames =
          require('../internals/object-get-own-property-names').f;

        var typedArrayFrom = require('../internals/typed-array-from');

        var forEach = require('../internals/array-iteration').forEach;

        var setSpecies = require('../internals/set-species');

        var definePropertyModule = require('../internals/object-define-property');

        var getOwnPropertyDescriptorModule = require('../internals/object-get-own-property-descriptor');

        var InternalStateModule = require('../internals/internal-state');

        var inheritIfRequired = require('../internals/inherit-if-required');

        var getInternalState = InternalStateModule.get;
        var setInternalState = InternalStateModule.set;
        var nativeDefineProperty = definePropertyModule.f;
        var nativeGetOwnPropertyDescriptor = getOwnPropertyDescriptorModule.f;
        var round = Math.round;
        var RangeError = global.RangeError;
        var ArrayBuffer = ArrayBufferModule.ArrayBuffer;
        var DataView = ArrayBufferModule.DataView;
        var NATIVE_ARRAY_BUFFER_VIEWS =
          ArrayBufferViewCore.NATIVE_ARRAY_BUFFER_VIEWS;
        var TYPED_ARRAY_TAG = ArrayBufferViewCore.TYPED_ARRAY_TAG;
        var TypedArray = ArrayBufferViewCore.TypedArray;
        var TypedArrayPrototype = ArrayBufferViewCore.TypedArrayPrototype;
        var aTypedArrayConstructor = ArrayBufferViewCore.aTypedArrayConstructor;
        var isTypedArray = ArrayBufferViewCore.isTypedArray;
        var BYTES_PER_ELEMENT = 'BYTES_PER_ELEMENT';
        var WRONG_LENGTH = 'Wrong length';

        var fromList = function (C, list) {
          var index = 0;
          var length = list.length;
          var result = new (aTypedArrayConstructor(C))(length);

          while (length > index) result[index] = list[index++];

          return result;
        };

        var addGetter = function (it, key) {
          nativeDefineProperty(it, key, {
            get: function () {
              return getInternalState(this)[key];
            },
          });
        };

        var isArrayBuffer = function (it) {
          var klass;
          return (
            it instanceof ArrayBuffer ||
            (klass = classof(it)) == 'ArrayBuffer' ||
            klass == 'SharedArrayBuffer'
          );
        };

        var isTypedArrayIndex = function (target, key) {
          return (
            isTypedArray(target) &&
            typeof key != 'symbol' &&
            key in target &&
            String(+key) == String(key)
          );
        };

        var wrappedGetOwnPropertyDescriptor = function getOwnPropertyDescriptor(
          target,
          key
        ) {
          return isTypedArrayIndex(target, (key = toPrimitive(key, true)))
            ? createPropertyDescriptor(2, target[key])
            : nativeGetOwnPropertyDescriptor(target, key);
        };

        var wrappedDefineProperty = function defineProperty(
          target,
          key,
          descriptor
        ) {
          if (
            isTypedArrayIndex(target, (key = toPrimitive(key, true))) &&
            isObject(descriptor) &&
            has(descriptor, 'value') &&
            !has(descriptor, 'get') &&
            !has(descriptor, 'set') && // TODO: add validation descriptor w/o calling accessors
            !descriptor.configurable &&
            (!has(descriptor, 'writable') || descriptor.writable) &&
            (!has(descriptor, 'enumerable') || descriptor.enumerable)
          ) {
            target[key] = descriptor.value;
            return target;
          }

          return nativeDefineProperty(target, key, descriptor);
        };

        if (DESCRIPTORS) {
          if (!NATIVE_ARRAY_BUFFER_VIEWS) {
            getOwnPropertyDescriptorModule.f = wrappedGetOwnPropertyDescriptor;
            definePropertyModule.f = wrappedDefineProperty;
            addGetter(TypedArrayPrototype, 'buffer');
            addGetter(TypedArrayPrototype, 'byteOffset');
            addGetter(TypedArrayPrototype, 'byteLength');
            addGetter(TypedArrayPrototype, 'length');
          }

          $(
            {
              target: 'Object',
              stat: true,
              forced: !NATIVE_ARRAY_BUFFER_VIEWS,
            },
            {
              getOwnPropertyDescriptor: wrappedGetOwnPropertyDescriptor,
              defineProperty: wrappedDefineProperty,
            }
          );

          module.exports = function (TYPE, wrapper, CLAMPED) {
            var BYTES = TYPE.match(/\d+$/)[0] / 8;
            var CONSTRUCTOR_NAME = TYPE + (CLAMPED ? 'Clamped' : '') + 'Array';
            var GETTER = 'get' + TYPE;
            var SETTER = 'set' + TYPE;
            var NativeTypedArrayConstructor = global[CONSTRUCTOR_NAME];
            var TypedArrayConstructor = NativeTypedArrayConstructor;
            var TypedArrayConstructorPrototype =
              TypedArrayConstructor && TypedArrayConstructor.prototype;
            var exported = {};

            var getter = function (that, index) {
              var data = getInternalState(that);
              return data.view[GETTER](index * BYTES + data.byteOffset, true);
            };

            var setter = function (that, index, value) {
              var data = getInternalState(that);
              if (CLAMPED)
                value =
                  (value = round(value)) < 0
                    ? 0
                    : value > 0xff
                    ? 0xff
                    : value & 0xff;
              data.view[SETTER](index * BYTES + data.byteOffset, value, true);
            };

            var addElement = function (that, index) {
              nativeDefineProperty(that, index, {
                get: function () {
                  return getter(this, index);
                },
                set: function (value) {
                  return setter(this, index, value);
                },
                enumerable: true,
              });
            };

            if (!NATIVE_ARRAY_BUFFER_VIEWS) {
              TypedArrayConstructor = wrapper(function (
                that,
                data,
                offset,
                $length
              ) {
                anInstance(that, TypedArrayConstructor, CONSTRUCTOR_NAME);
                var index = 0;
                var byteOffset = 0;
                var buffer, byteLength, length;

                if (!isObject(data)) {
                  length = toIndex(data);
                  byteLength = length * BYTES;
                  buffer = new ArrayBuffer(byteLength);
                } else if (isArrayBuffer(data)) {
                  buffer = data;
                  byteOffset = toOffset(offset, BYTES);
                  var $len = data.byteLength;

                  if ($length === undefined) {
                    if ($len % BYTES) throw RangeError(WRONG_LENGTH);
                    byteLength = $len - byteOffset;
                    if (byteLength < 0) throw RangeError(WRONG_LENGTH);
                  } else {
                    byteLength = toLength($length) * BYTES;
                    if (byteLength + byteOffset > $len)
                      throw RangeError(WRONG_LENGTH);
                  }

                  length = byteLength / BYTES;
                } else if (isTypedArray(data)) {
                  return fromList(TypedArrayConstructor, data);
                } else {
                  return typedArrayFrom.call(TypedArrayConstructor, data);
                }

                setInternalState(that, {
                  buffer: buffer,
                  byteOffset: byteOffset,
                  byteLength: byteLength,
                  length: length,
                  view: new DataView(buffer),
                });

                while (index < length) addElement(that, index++);
              });
              if (setPrototypeOf)
                setPrototypeOf(TypedArrayConstructor, TypedArray);
              TypedArrayConstructorPrototype = TypedArrayConstructor.prototype =
                create(TypedArrayPrototype);
            } else if (TYPED_ARRAYS_CONSTRUCTORS_REQUIRES_WRAPPERS) {
              TypedArrayConstructor = wrapper(function (
                dummy,
                data,
                typedArrayOffset,
                $length
              ) {
                anInstance(dummy, TypedArrayConstructor, CONSTRUCTOR_NAME);
                return inheritIfRequired(
                  (function () {
                    if (!isObject(data))
                      return new NativeTypedArrayConstructor(toIndex(data));
                    if (isArrayBuffer(data))
                      return $length !== undefined
                        ? new NativeTypedArrayConstructor(
                            data,
                            toOffset(typedArrayOffset, BYTES),
                            $length
                          )
                        : typedArrayOffset !== undefined
                        ? new NativeTypedArrayConstructor(
                            data,
                            toOffset(typedArrayOffset, BYTES)
                          )
                        : new NativeTypedArrayConstructor(data);
                    if (isTypedArray(data))
                      return fromList(TypedArrayConstructor, data);
                    return typedArrayFrom.call(TypedArrayConstructor, data);
                  })(),
                  dummy,
                  TypedArrayConstructor
                );
              });
              if (setPrototypeOf)
                setPrototypeOf(TypedArrayConstructor, TypedArray);
              forEach(
                getOwnPropertyNames(NativeTypedArrayConstructor),
                function (key) {
                  if (!(key in TypedArrayConstructor)) {
                    createNonEnumerableProperty(
                      TypedArrayConstructor,
                      key,
                      NativeTypedArrayConstructor[key]
                    );
                  }
                }
              );
              TypedArrayConstructor.prototype = TypedArrayConstructorPrototype;
            }

            if (
              TypedArrayConstructorPrototype.constructor !==
              TypedArrayConstructor
            ) {
              createNonEnumerableProperty(
                TypedArrayConstructorPrototype,
                'constructor',
                TypedArrayConstructor
              );
            }

            if (TYPED_ARRAY_TAG) {
              createNonEnumerableProperty(
                TypedArrayConstructorPrototype,
                TYPED_ARRAY_TAG,
                CONSTRUCTOR_NAME
              );
            }

            exported[CONSTRUCTOR_NAME] = TypedArrayConstructor;
            $(
              {
                global: true,
                forced: TypedArrayConstructor != NativeTypedArrayConstructor,
                sham: !NATIVE_ARRAY_BUFFER_VIEWS,
              },
              exported
            );

            if (!(BYTES_PER_ELEMENT in TypedArrayConstructor)) {
              createNonEnumerableProperty(
                TypedArrayConstructor,
                BYTES_PER_ELEMENT,
                BYTES
              );
            }

            if (!(BYTES_PER_ELEMENT in TypedArrayConstructorPrototype)) {
              createNonEnumerableProperty(
                TypedArrayConstructorPrototype,
                BYTES_PER_ELEMENT,
                BYTES
              );
            }

            setSpecies(CONSTRUCTOR_NAME);
          };
        } else module.exports = function () {};
      },
      {
        '../internals/export': '10044f24ecae4059b4af184e71d3fba2',
        '../internals/global': '7e78823454e7f795898745d93279f917',
        '../internals/descriptors': '7e006cebe93fc4773e87d3146a8fa81b',
        '../internals/typed-array-constructors-require-wrappers':
          'c18c6fa7d7a6ea266deebfa9f42416ec',
        '../internals/array-buffer-view-core':
          '1ec92502c86abde7ba5eb9b6cea40afb',
        '../internals/array-buffer': '3466d92de28aaf0afa876d9d5f82bf85',
        '../internals/an-instance': '8b0daff12bd798defdb69ae41eea7f5e',
        '../internals/create-property-descriptor':
          '8c5551ce5a79ddcd7162c3e3c8f33c9a',
        '../internals/create-non-enumerable-property':
          'b52adb17d2cebacfac251681882f0a33',
        '../internals/to-length': '68c0420762f5f4704115d4fb34e0ae7f',
        '../internals/to-index': '0bb880d085cbd3bcde3887ce0606ee2e',
        '../internals/to-offset': '4ef9165a3829f19317eb1411640c1a9c',
        '../internals/to-primitive': '2a7f05f0f9119d3b88a770acfa30cc7b',
        '../internals/has': 'ce850695ec64cefd211ef6863461b802',
        '../internals/classof': 'be2998c5b4d0f20a1cc5fe6807661aae',
        '../internals/is-object': '03244e745134af366d66b74456891052',
        '../internals/object-create': 'a92b509fc5fd0223c7351fe6c6b27164',
        '../internals/object-set-prototype-of':
          '22e756b2221a479eceeccf2a78a39bef',
        '../internals/object-get-own-property-names':
          'b422be4dea2e1243d9a0803066cc2d3d',
        '../internals/typed-array-from': 'b54e61bc75f363ab6afd0d016a887d53',
        '../internals/array-iteration': '5e382939caea5c6e569307d984b5dbfe',
        '../internals/set-species': 'e3f4ec2b9d910d5e576300937f95e2c2',
        '../internals/object-define-property':
          '645ef963c1e312a12b44589911036a7f',
        '../internals/object-get-own-property-descriptor':
          '5e181b7e7dcb1bb2de0a726b7af1e93d',
        '../internals/internal-state': '8b9f5ed7c6f8b05b4cd6ee1eefa801c1',
        '../internals/inherit-if-required': '4d9c0ab06f91ed2da925563ab67ef474',
      },
    ],
    c18c6fa7d7a6ea266deebfa9f42416ec: [
      function (require, module, exports) {
        /* eslint-disable no-new */
        var global = require('../internals/global');

        var fails = require('../internals/fails');

        var checkCorrectnessOfIteration = require('../internals/check-correctness-of-iteration');

        var NATIVE_ARRAY_BUFFER_VIEWS =
          require('../internals/array-buffer-view-core').NATIVE_ARRAY_BUFFER_VIEWS;

        var ArrayBuffer = global.ArrayBuffer;
        var Int8Array = global.Int8Array;
        module.exports =
          !NATIVE_ARRAY_BUFFER_VIEWS ||
          !fails(function () {
            Int8Array(1);
          }) ||
          !fails(function () {
            new Int8Array(-1);
          }) ||
          !checkCorrectnessOfIteration(function (iterable) {
            new Int8Array();
            new Int8Array(null);
            new Int8Array(1.5);
            new Int8Array(iterable);
          }, true) ||
          fails(function () {
            // Safari (11+) bug - a reason why even Safari 13 should load a typed array polyfill
            return new Int8Array(new ArrayBuffer(2), 1, undefined).length !== 1;
          });
      },
      {
        '../internals/global': '7e78823454e7f795898745d93279f917',
        '../internals/fails': 'e16fc2ec92bf0d6254ffef14ea12ad77',
        '../internals/check-correctness-of-iteration':
          '33641ceb9010ed8125d1d18da9ad9225',
        '../internals/array-buffer-view-core':
          '1ec92502c86abde7ba5eb9b6cea40afb',
      },
    ],
    '33641ceb9010ed8125d1d18da9ad9225': [
      function (require, module, exports) {
        var wellKnownSymbol = require('../internals/well-known-symbol');

        var ITERATOR = wellKnownSymbol('iterator');
        var SAFE_CLOSING = false;

        try {
          var called = 0;
          var iteratorWithReturn = {
            next: function () {
              return { done: !!called++ };
            },
            return: function () {
              SAFE_CLOSING = true;
            },
          };
          iteratorWithReturn[ITERATOR] = function () {
            return this;
          };
          // eslint-disable-next-line no-throw-literal
          Array.from(iteratorWithReturn, function () {
            throw 2;
          });
        } catch (error) {}

        module.exports = function (exec, SKIP_CLOSING) {
          if (!SKIP_CLOSING && !SAFE_CLOSING) return false;
          var ITERATION_SUPPORT = false;
          try {
            var object = {};
            object[ITERATOR] = function () {
              return {
                next: function () {
                  return { done: (ITERATION_SUPPORT = true) };
                },
              };
            };
            exec(object);
          } catch (error) {}
          return ITERATION_SUPPORT;
        };
      },
      { '../internals/well-known-symbol': 'df9ad61e8404f948b528f2ef2becebe4' },
    ],
    '1ec92502c86abde7ba5eb9b6cea40afb': [
      function (require, module, exports) {
        'use strict';

        var NATIVE_ARRAY_BUFFER = require('../internals/array-buffer-native');

        var DESCRIPTORS = require('../internals/descriptors');

        var global = require('../internals/global');

        var isObject = require('../internals/is-object');

        var has = require('../internals/has');

        var classof = require('../internals/classof');

        var createNonEnumerableProperty = require('../internals/create-non-enumerable-property');

        var redefine = require('../internals/redefine');

        var defineProperty = require('../internals/object-define-property').f;

        var getPrototypeOf = require('../internals/object-get-prototype-of');

        var setPrototypeOf = require('../internals/object-set-prototype-of');

        var wellKnownSymbol = require('../internals/well-known-symbol');

        var uid = require('../internals/uid');

        var Int8Array = global.Int8Array;
        var Int8ArrayPrototype = Int8Array && Int8Array.prototype;
        var Uint8ClampedArray = global.Uint8ClampedArray;
        var Uint8ClampedArrayPrototype =
          Uint8ClampedArray && Uint8ClampedArray.prototype;
        var TypedArray = Int8Array && getPrototypeOf(Int8Array);
        var TypedArrayPrototype =
          Int8ArrayPrototype && getPrototypeOf(Int8ArrayPrototype);
        var ObjectPrototype = Object.prototype;
        var isPrototypeOf = ObjectPrototype.isPrototypeOf;
        var TO_STRING_TAG = wellKnownSymbol('toStringTag');
        var TYPED_ARRAY_TAG = uid('TYPED_ARRAY_TAG');

        var NATIVE_ARRAY_BUFFER_VIEWS =
          NATIVE_ARRAY_BUFFER &&
          !!setPrototypeOf &&
          classof(global.opera) !== 'Opera';
        var TYPED_ARRAY_TAG_REQIRED = false;
        var NAME;
        var TypedArrayConstructorsList = {
          Int8Array: 1,
          Uint8Array: 1,
          Uint8ClampedArray: 1,
          Int16Array: 2,
          Uint16Array: 2,
          Int32Array: 4,
          Uint32Array: 4,
          Float32Array: 4,
          Float64Array: 8,
        };

        var isView = function isView(it) {
          var klass = classof(it);
          return klass === 'DataView' || has(TypedArrayConstructorsList, klass);
        };

        var isTypedArray = function (it) {
          return isObject(it) && has(TypedArrayConstructorsList, classof(it));
        };

        var aTypedArray = function (it) {
          if (isTypedArray(it)) return it;
          throw TypeError('Target is not a typed array');
        };

        var aTypedArrayConstructor = function (C) {
          if (setPrototypeOf) {
            if (isPrototypeOf.call(TypedArray, C)) return C;
          } else
            for (var ARRAY in TypedArrayConstructorsList)
              if (has(TypedArrayConstructorsList, NAME)) {
                var TypedArrayConstructor = global[ARRAY];

                if (
                  TypedArrayConstructor &&
                  (C === TypedArrayConstructor ||
                    isPrototypeOf.call(TypedArrayConstructor, C))
                ) {
                  return C;
                }
              }

          throw TypeError('Target is not a typed array constructor');
        };

        var exportTypedArrayMethod = function (KEY, property, forced) {
          if (!DESCRIPTORS) return;
          if (forced)
            for (var ARRAY in TypedArrayConstructorsList) {
              var TypedArrayConstructor = global[ARRAY];

              if (
                TypedArrayConstructor &&
                has(TypedArrayConstructor.prototype, KEY)
              ) {
                delete TypedArrayConstructor.prototype[KEY];
              }
            }

          if (!TypedArrayPrototype[KEY] || forced) {
            redefine(
              TypedArrayPrototype,
              KEY,
              forced
                ? property
                : (NATIVE_ARRAY_BUFFER_VIEWS && Int8ArrayPrototype[KEY]) ||
                    property
            );
          }
        };

        var exportTypedArrayStaticMethod = function (KEY, property, forced) {
          var ARRAY, TypedArrayConstructor;
          if (!DESCRIPTORS) return;

          if (setPrototypeOf) {
            if (forced)
              for (ARRAY in TypedArrayConstructorsList) {
                TypedArrayConstructor = global[ARRAY];

                if (TypedArrayConstructor && has(TypedArrayConstructor, KEY)) {
                  delete TypedArrayConstructor[KEY];
                }
              }

            if (!TypedArray[KEY] || forced) {
              try {
                return redefine(
                  TypedArray,
                  KEY,
                  forced
                    ? property
                    : (NATIVE_ARRAY_BUFFER_VIEWS && Int8Array[KEY]) || property
                );
              } catch (error) {}
            } else return;
          }

          for (ARRAY in TypedArrayConstructorsList) {
            TypedArrayConstructor = global[ARRAY];

            if (
              TypedArrayConstructor &&
              (!TypedArrayConstructor[KEY] || forced)
            ) {
              redefine(TypedArrayConstructor, KEY, property);
            }
          }
        };

        for (NAME in TypedArrayConstructorsList) {
          if (!global[NAME]) NATIVE_ARRAY_BUFFER_VIEWS = false;
        }
        if (
          !NATIVE_ARRAY_BUFFER_VIEWS ||
          typeof TypedArray != 'function' ||
          TypedArray === Function.prototype
        ) {
          // eslint-disable-next-line no-shadow
          TypedArray = function TypedArray() {
            throw TypeError('Incorrect invocation');
          };

          if (NATIVE_ARRAY_BUFFER_VIEWS)
            for (NAME in TypedArrayConstructorsList) {
              if (global[NAME]) setPrototypeOf(global[NAME], TypedArray);
            }
        }

        if (
          !NATIVE_ARRAY_BUFFER_VIEWS ||
          !TypedArrayPrototype ||
          TypedArrayPrototype === ObjectPrototype
        ) {
          TypedArrayPrototype = TypedArray.prototype;
          if (NATIVE_ARRAY_BUFFER_VIEWS)
            for (NAME in TypedArrayConstructorsList) {
              if (global[NAME])
                setPrototypeOf(global[NAME].prototype, TypedArrayPrototype);
            }
        }
        if (
          NATIVE_ARRAY_BUFFER_VIEWS &&
          getPrototypeOf(Uint8ClampedArrayPrototype) !== TypedArrayPrototype
        ) {
          setPrototypeOf(Uint8ClampedArrayPrototype, TypedArrayPrototype);
        }

        if (DESCRIPTORS && !has(TypedArrayPrototype, TO_STRING_TAG)) {
          TYPED_ARRAY_TAG_REQIRED = true;
          defineProperty(TypedArrayPrototype, TO_STRING_TAG, {
            get: function () {
              return isObject(this) ? this[TYPED_ARRAY_TAG] : undefined;
            },
          });

          for (NAME in TypedArrayConstructorsList)
            if (global[NAME]) {
              createNonEnumerableProperty(global[NAME], TYPED_ARRAY_TAG, NAME);
            }
        }

        module.exports = {
          NATIVE_ARRAY_BUFFER_VIEWS: NATIVE_ARRAY_BUFFER_VIEWS,
          TYPED_ARRAY_TAG: TYPED_ARRAY_TAG_REQIRED && TYPED_ARRAY_TAG,
          aTypedArray: aTypedArray,
          aTypedArrayConstructor: aTypedArrayConstructor,
          exportTypedArrayMethod: exportTypedArrayMethod,
          exportTypedArrayStaticMethod: exportTypedArrayStaticMethod,
          isView: isView,
          isTypedArray: isTypedArray,
          TypedArray: TypedArray,
          TypedArrayPrototype: TypedArrayPrototype,
        };
      },
      {
        '../internals/array-buffer-native': '54e97eb83124a07837893444bf79b59f',
        '../internals/descriptors': '7e006cebe93fc4773e87d3146a8fa81b',
        '../internals/global': '7e78823454e7f795898745d93279f917',
        '../internals/is-object': '03244e745134af366d66b74456891052',
        '../internals/has': 'ce850695ec64cefd211ef6863461b802',
        '../internals/classof': 'be2998c5b4d0f20a1cc5fe6807661aae',
        '../internals/create-non-enumerable-property':
          'b52adb17d2cebacfac251681882f0a33',
        '../internals/redefine': 'b8f156ba0e16ecf7371c0d9dbd0a7d60',
        '../internals/object-define-property':
          '645ef963c1e312a12b44589911036a7f',
        '../internals/object-get-prototype-of':
          '50d059706e0afa285234c1608d9f7cbf',
        '../internals/object-set-prototype-of':
          '22e756b2221a479eceeccf2a78a39bef',
        '../internals/well-known-symbol': 'df9ad61e8404f948b528f2ef2becebe4',
        '../internals/uid': 'd5b7e7679d9dac163ab327cbf9508501',
      },
    ],
    '54e97eb83124a07837893444bf79b59f': [
      function (require, module, exports) {
        module.exports =
          typeof ArrayBuffer !== 'undefined' && typeof DataView !== 'undefined';
      },
      {},
    ],
    be2998c5b4d0f20a1cc5fe6807661aae: [
      function (require, module, exports) {
        var TO_STRING_TAG_SUPPORT = require('../internals/to-string-tag-support');
        var classofRaw = require('../internals/classof-raw');
        var wellKnownSymbol = require('../internals/well-known-symbol');

        var TO_STRING_TAG = wellKnownSymbol('toStringTag');
        // ES3 wrong here
        var CORRECT_ARGUMENTS =
          classofRaw(
            (function () {
              return arguments;
            })()
          ) == 'Arguments';

        var tryGet = function (it, key) {
          try {
            return it[key];
          } catch (error) {
            /* empty */
          }
        };

        module.exports = TO_STRING_TAG_SUPPORT
          ? classofRaw
          : function (it) {
              var O, tag, result;
              return it === undefined
                ? 'Undefined'
                : it === null
                ? 'Null'
                : // @@toStringTag case
                typeof (tag = tryGet((O = Object(it)), TO_STRING_TAG)) ==
                  'string'
                ? tag
                : CORRECT_ARGUMENTS
                ? classofRaw(O)
                : (result = classofRaw(O)) == 'Object' &&
                  typeof O.callee == 'function'
                ? 'Arguments'
                : result;
            };
      },
      {
        '../internals/to-string-tag-support':
          'db4164dc1ea7e1525cf84b1aa00e80e3',
        '../internals/classof-raw': '901e5a25291bac244011feea921975b2',
        '../internals/well-known-symbol': 'df9ad61e8404f948b528f2ef2becebe4',
      },
    ],
    db4164dc1ea7e1525cf84b1aa00e80e3: [
      function (require, module, exports) {
        var wellKnownSymbol = require('../internals/well-known-symbol');

        var TO_STRING_TAG = wellKnownSymbol('toStringTag');
        var test = {};

        test[TO_STRING_TAG] = 'z';

        module.exports = String(test) === '[object z]';
      },
      { '../internals/well-known-symbol': 'df9ad61e8404f948b528f2ef2becebe4' },
    ],
    '50d059706e0afa285234c1608d9f7cbf': [
      function (require, module, exports) {
        var has = require('../internals/has');
        var toObject = require('../internals/to-object');
        var sharedKey = require('../internals/shared-key');
        var CORRECT_PROTOTYPE_GETTER = require('../internals/correct-prototype-getter');

        var IE_PROTO = sharedKey('IE_PROTO');
        var ObjectPrototype = Object.prototype;

        module.exports = CORRECT_PROTOTYPE_GETTER
          ? Object.getPrototypeOf
          : function (O) {
              O = toObject(O);
              if (has(O, IE_PROTO)) return O[IE_PROTO];
              if (
                typeof O.constructor == 'function' &&
                O instanceof O.constructor
              ) {
                return O.constructor.prototype;
              }
              return O instanceof Object ? ObjectPrototype : null;
            };
      },
      {
        '../internals/has': 'ce850695ec64cefd211ef6863461b802',
        '../internals/to-object': '2633fa4da95065e00ff87cc7cbdd56ba',
        '../internals/shared-key': '18fb64363b0383efc58d7addc88469cd',
        '../internals/correct-prototype-getter':
          '4ac53209b23e730e63e5780536ae74ea',
      },
    ],
    '4ac53209b23e730e63e5780536ae74ea': [
      function (require, module, exports) {
        var fails = require('../internals/fails');

        module.exports = !fails(function () {
          function F() {}
          F.prototype.constructor = null;
          return Object.getPrototypeOf(new F()) !== F.prototype;
        });
      },
      { '../internals/fails': 'e16fc2ec92bf0d6254ffef14ea12ad77' },
    ],
    '22e756b2221a479eceeccf2a78a39bef': [
      function (require, module, exports) {
        var anObject = require('../internals/an-object');
        var aPossiblePrototype = require('../internals/a-possible-prototype');

        module.exports =
          Object.setPrototypeOf ||
          ('__proto__' in {}
            ? (function () {
                var CORRECT_SETTER = false;
                var test = {};
                var setter;
                try {
                  setter = Object.getOwnPropertyDescriptor(
                    Object.prototype,
                    '__proto__'
                  ).set;
                  setter.call(test, []);
                  CORRECT_SETTER = test instanceof Array;
                } catch (error) {
                  /* empty */
                }
                return function setPrototypeOf(O, proto) {
                  anObject(O);
                  aPossiblePrototype(proto);
                  if (CORRECT_SETTER) setter.call(O, proto);
                  else O.__proto__ = proto;
                  return O;
                };
              })()
            : undefined);
      },
      {
        '../internals/an-object': '4f20fc1a2160760f9e7961d272520cbd',
        '../internals/a-possible-prototype': '7ad1739ed58eb8a5f2873ca6b6307773',
      },
    ],
    '7ad1739ed58eb8a5f2873ca6b6307773': [
      function (require, module, exports) {
        var isObject = require('../internals/is-object');

        module.exports = function (it) {
          if (!isObject(it) && it !== null) {
            throw TypeError("Can't set " + String(it) + ' as a prototype');
          }
          return it;
        };
      },
      { '../internals/is-object': '03244e745134af366d66b74456891052' },
    ],
    '3466d92de28aaf0afa876d9d5f82bf85': [
      function (require, module, exports) {
        'use strict';

        var global = require('../internals/global');

        var DESCRIPTORS = require('../internals/descriptors');

        var NATIVE_ARRAY_BUFFER = require('../internals/array-buffer-native');

        var createNonEnumerableProperty = require('../internals/create-non-enumerable-property');

        var redefineAll = require('../internals/redefine-all');

        var fails = require('../internals/fails');

        var anInstance = require('../internals/an-instance');

        var toInteger = require('../internals/to-integer');

        var toLength = require('../internals/to-length');

        var toIndex = require('../internals/to-index');

        var IEEE754 = require('../internals/ieee754');

        var getPrototypeOf = require('../internals/object-get-prototype-of');

        var setPrototypeOf = require('../internals/object-set-prototype-of');

        var getOwnPropertyNames =
          require('../internals/object-get-own-property-names').f;

        var defineProperty = require('../internals/object-define-property').f;

        var arrayFill = require('../internals/array-fill');

        var setToStringTag = require('../internals/set-to-string-tag');

        var InternalStateModule = require('../internals/internal-state');

        var getInternalState = InternalStateModule.get;
        var setInternalState = InternalStateModule.set;
        var ARRAY_BUFFER = 'ArrayBuffer';
        var DATA_VIEW = 'DataView';
        var PROTOTYPE = 'prototype';
        var WRONG_LENGTH = 'Wrong length';
        var WRONG_INDEX = 'Wrong index';
        var NativeArrayBuffer = global[ARRAY_BUFFER];
        var $ArrayBuffer = NativeArrayBuffer;
        var $DataView = global[DATA_VIEW];
        var $DataViewPrototype = $DataView && $DataView[PROTOTYPE];
        var ObjectPrototype = Object.prototype;
        var RangeError = global.RangeError;
        var packIEEE754 = IEEE754.pack;
        var unpackIEEE754 = IEEE754.unpack;

        var packInt8 = function (number) {
          return [number & 0xff];
        };

        var packInt16 = function (number) {
          return [number & 0xff, (number >> 8) & 0xff];
        };

        var packInt32 = function (number) {
          return [
            number & 0xff,
            (number >> 8) & 0xff,
            (number >> 16) & 0xff,
            (number >> 24) & 0xff,
          ];
        };

        var unpackInt32 = function (buffer) {
          return (
            (buffer[3] << 24) | (buffer[2] << 16) | (buffer[1] << 8) | buffer[0]
          );
        };

        var packFloat32 = function (number) {
          return packIEEE754(number, 23, 4);
        };

        var packFloat64 = function (number) {
          return packIEEE754(number, 52, 8);
        };

        var addGetter = function (Constructor, key) {
          defineProperty(Constructor[PROTOTYPE], key, {
            get: function () {
              return getInternalState(this)[key];
            },
          });
        };

        var get = function (view, count, index, isLittleEndian) {
          var intIndex = toIndex(index);
          var store = getInternalState(view);
          if (intIndex + count > store.byteLength)
            throw RangeError(WRONG_INDEX);
          var bytes = getInternalState(store.buffer).bytes;
          var start = intIndex + store.byteOffset;
          var pack = bytes.slice(start, start + count);
          return isLittleEndian ? pack : pack.reverse();
        };

        var set = function (
          view,
          count,
          index,
          conversion,
          value,
          isLittleEndian
        ) {
          var intIndex = toIndex(index);
          var store = getInternalState(view);
          if (intIndex + count > store.byteLength)
            throw RangeError(WRONG_INDEX);
          var bytes = getInternalState(store.buffer).bytes;
          var start = intIndex + store.byteOffset;
          var pack = conversion(+value);

          for (var i = 0; i < count; i++)
            bytes[start + i] = pack[isLittleEndian ? i : count - i - 1];
        };

        if (!NATIVE_ARRAY_BUFFER) {
          $ArrayBuffer = function ArrayBuffer(length) {
            anInstance(this, $ArrayBuffer, ARRAY_BUFFER);
            var byteLength = toIndex(length);
            setInternalState(this, {
              bytes: arrayFill.call(new Array(byteLength), 0),
              byteLength: byteLength,
            });
            if (!DESCRIPTORS) this.byteLength = byteLength;
          };

          $DataView = function DataView(buffer, byteOffset, byteLength) {
            anInstance(this, $DataView, DATA_VIEW);
            anInstance(buffer, $ArrayBuffer, DATA_VIEW);
            var bufferLength = getInternalState(buffer).byteLength;
            var offset = toInteger(byteOffset);
            if (offset < 0 || offset > bufferLength)
              throw RangeError('Wrong offset');
            byteLength =
              byteLength === undefined
                ? bufferLength - offset
                : toLength(byteLength);
            if (offset + byteLength > bufferLength)
              throw RangeError(WRONG_LENGTH);
            setInternalState(this, {
              buffer: buffer,
              byteLength: byteLength,
              byteOffset: offset,
            });

            if (!DESCRIPTORS) {
              this.buffer = buffer;
              this.byteLength = byteLength;
              this.byteOffset = offset;
            }
          };

          if (DESCRIPTORS) {
            addGetter($ArrayBuffer, 'byteLength');
            addGetter($DataView, 'buffer');
            addGetter($DataView, 'byteLength');
            addGetter($DataView, 'byteOffset');
          }

          redefineAll($DataView[PROTOTYPE], {
            getInt8: function getInt8(byteOffset) {
              return (get(this, 1, byteOffset)[0] << 24) >> 24;
            },
            getUint8: function getUint8(byteOffset) {
              return get(this, 1, byteOffset)[0];
            },
            getInt16: function getInt16(byteOffset) {
              var bytes = get(
                this,
                2,
                byteOffset,
                arguments.length > 1 ? arguments[1] : undefined
              );
              return (((bytes[1] << 8) | bytes[0]) << 16) >> 16;
            },
            getUint16: function getUint16(byteOffset) {
              var bytes = get(
                this,
                2,
                byteOffset,
                arguments.length > 1 ? arguments[1] : undefined
              );
              return (bytes[1] << 8) | bytes[0];
            },
            getInt32: function getInt32(byteOffset) {
              return unpackInt32(
                get(
                  this,
                  4,
                  byteOffset,
                  arguments.length > 1 ? arguments[1] : undefined
                )
              );
            },
            getUint32: function getUint32(byteOffset) {
              return (
                unpackInt32(
                  get(
                    this,
                    4,
                    byteOffset,
                    arguments.length > 1 ? arguments[1] : undefined
                  )
                ) >>> 0
              );
            },
            getFloat32: function getFloat32(byteOffset) {
              return unpackIEEE754(
                get(
                  this,
                  4,
                  byteOffset,
                  arguments.length > 1 ? arguments[1] : undefined
                ),
                23
              );
            },
            getFloat64: function getFloat64(byteOffset) {
              return unpackIEEE754(
                get(
                  this,
                  8,
                  byteOffset,
                  arguments.length > 1 ? arguments[1] : undefined
                ),
                52
              );
            },
            setInt8: function setInt8(byteOffset, value) {
              set(this, 1, byteOffset, packInt8, value);
            },
            setUint8: function setUint8(byteOffset, value) {
              set(this, 1, byteOffset, packInt8, value);
            },
            setInt16: function setInt16(byteOffset, value) {
              set(
                this,
                2,
                byteOffset,
                packInt16,
                value,
                arguments.length > 2 ? arguments[2] : undefined
              );
            },
            setUint16: function setUint16(byteOffset, value) {
              set(
                this,
                2,
                byteOffset,
                packInt16,
                value,
                arguments.length > 2 ? arguments[2] : undefined
              );
            },
            setInt32: function setInt32(byteOffset, value) {
              set(
                this,
                4,
                byteOffset,
                packInt32,
                value,
                arguments.length > 2 ? arguments[2] : undefined
              );
            },
            setUint32: function setUint32(byteOffset, value) {
              set(
                this,
                4,
                byteOffset,
                packInt32,
                value,
                arguments.length > 2 ? arguments[2] : undefined
              );
            },
            setFloat32: function setFloat32(byteOffset, value) {
              set(
                this,
                4,
                byteOffset,
                packFloat32,
                value,
                arguments.length > 2 ? arguments[2] : undefined
              );
            },
            setFloat64: function setFloat64(byteOffset, value) {
              set(
                this,
                8,
                byteOffset,
                packFloat64,
                value,
                arguments.length > 2 ? arguments[2] : undefined
              );
            },
          });
        } else {
          if (
            !fails(function () {
              NativeArrayBuffer(1);
            }) ||
            !fails(function () {
              new NativeArrayBuffer(-1);
            }) ||
            fails(function () {
              new NativeArrayBuffer();

              new NativeArrayBuffer(1.5);

              new NativeArrayBuffer(NaN);

              return NativeArrayBuffer.name != ARRAY_BUFFER;
            })
          ) {
            $ArrayBuffer = function ArrayBuffer(length) {
              anInstance(this, $ArrayBuffer);
              return new NativeArrayBuffer(toIndex(length));
            };

            var ArrayBufferPrototype = ($ArrayBuffer[PROTOTYPE] =
              NativeArrayBuffer[PROTOTYPE]);

            for (
              var keys = getOwnPropertyNames(NativeArrayBuffer), j = 0, key;
              keys.length > j;

            ) {
              if (!((key = keys[j++]) in $ArrayBuffer)) {
                createNonEnumerableProperty(
                  $ArrayBuffer,
                  key,
                  NativeArrayBuffer[key]
                );
              }
            }

            ArrayBufferPrototype.constructor = $ArrayBuffer;
          }

          if (
            setPrototypeOf &&
            getPrototypeOf($DataViewPrototype) !== ObjectPrototype
          ) {
            setPrototypeOf($DataViewPrototype, ObjectPrototype);
          }

          var testView = new $DataView(new $ArrayBuffer(2));
          var nativeSetInt8 = $DataViewPrototype.setInt8;
          testView.setInt8(0, 2147483648);
          testView.setInt8(1, 2147483649);
          if (testView.getInt8(0) || !testView.getInt8(1))
            redefineAll(
              $DataViewPrototype,
              {
                setInt8: function setInt8(byteOffset, value) {
                  nativeSetInt8.call(this, byteOffset, (value << 24) >> 24);
                },
                setUint8: function setUint8(byteOffset, value) {
                  nativeSetInt8.call(this, byteOffset, (value << 24) >> 24);
                },
              },
              {
                unsafe: true,
              }
            );
        }

        setToStringTag($ArrayBuffer, ARRAY_BUFFER);
        setToStringTag($DataView, DATA_VIEW);
        module.exports = {
          ArrayBuffer: $ArrayBuffer,
          DataView: $DataView,
        };
      },
      {
        '../internals/global': '7e78823454e7f795898745d93279f917',
        '../internals/descriptors': '7e006cebe93fc4773e87d3146a8fa81b',
        '../internals/array-buffer-native': '54e97eb83124a07837893444bf79b59f',
        '../internals/create-non-enumerable-property':
          'b52adb17d2cebacfac251681882f0a33',
        '../internals/redefine-all': 'ffd35f1bc6f8a9cf26e6fa0389f4748d',
        '../internals/fails': 'e16fc2ec92bf0d6254ffef14ea12ad77',
        '../internals/an-instance': '8b0daff12bd798defdb69ae41eea7f5e',
        '../internals/to-integer': 'c0972d049bc20bd69592e8a28601d5ad',
        '../internals/to-length': '68c0420762f5f4704115d4fb34e0ae7f',
        '../internals/to-index': '0bb880d085cbd3bcde3887ce0606ee2e',
        '../internals/ieee754': '4d8433859e198fb129ffab0f8372c4ab',
        '../internals/object-get-prototype-of':
          '50d059706e0afa285234c1608d9f7cbf',
        '../internals/object-set-prototype-of':
          '22e756b2221a479eceeccf2a78a39bef',
        '../internals/object-get-own-property-names':
          'b422be4dea2e1243d9a0803066cc2d3d',
        '../internals/object-define-property':
          '645ef963c1e312a12b44589911036a7f',
        '../internals/array-fill': 'f859d289ee3bddee8aaf320533aa8737',
        '../internals/set-to-string-tag': 'b474145c0d35c2cab8be2f2358364fc4',
        '../internals/internal-state': '8b9f5ed7c6f8b05b4cd6ee1eefa801c1',
      },
    ],
    ffd35f1bc6f8a9cf26e6fa0389f4748d: [
      function (require, module, exports) {
        var redefine = require('../internals/redefine');

        module.exports = function (target, src, options) {
          for (var key in src) redefine(target, key, src[key], options);
          return target;
        };
      },
      { '../internals/redefine': 'b8f156ba0e16ecf7371c0d9dbd0a7d60' },
    ],
    '8b0daff12bd798defdb69ae41eea7f5e': [
      function (require, module, exports) {
        module.exports = function (it, Constructor, name) {
          if (!(it instanceof Constructor)) {
            throw TypeError(
              'Incorrect ' + (name ? name + ' ' : '') + 'invocation'
            );
          }
          return it;
        };
      },
      {},
    ],
    '0bb880d085cbd3bcde3887ce0606ee2e': [
      function (require, module, exports) {
        var toInteger = require('../internals/to-integer');
        var toLength = require('../internals/to-length');

        module.exports = function (it) {
          if (it === undefined) return 0;
          var number = toInteger(it);
          var length = toLength(number);
          if (number !== length) throw RangeError('Wrong length or index');
          return length;
        };
      },
      {
        '../internals/to-integer': 'c0972d049bc20bd69592e8a28601d5ad',
        '../internals/to-length': '68c0420762f5f4704115d4fb34e0ae7f',
      },
    ],
    '4d8433859e198fb129ffab0f8372c4ab': [
      function (require, module, exports) {
        var Infinity = 1 / 0;
        var abs = Math.abs;
        var pow = Math.pow;
        var floor = Math.floor;
        var log = Math.log;
        var LN2 = Math.LN2;

        var pack = function (number, mantissaLength, bytes) {
          var buffer = new Array(bytes);
          var exponentLength = bytes * 8 - mantissaLength - 1;
          var eMax = (1 << exponentLength) - 1;
          var eBias = eMax >> 1;
          var rt = mantissaLength === 23 ? pow(2, -24) - pow(2, -77) : 0;
          var sign = number < 0 || (number === 0 && 1 / number < 0) ? 1 : 0;
          var index = 0;
          var exponent, mantissa, c;
          number = abs(number);
          if (number != number || number === Infinity) {
            mantissa = number != number ? 1 : 0;
            exponent = eMax;
          } else {
            exponent = floor(log(number) / LN2);
            if (number * (c = pow(2, -exponent)) < 1) {
              exponent--;
              c *= 2;
            }
            if (exponent + eBias >= 1) {
              number += rt / c;
            } else {
              number += rt * pow(2, 1 - eBias);
            }
            if (number * c >= 2) {
              exponent++;
              c /= 2;
            }
            if (exponent + eBias >= eMax) {
              mantissa = 0;
              exponent = eMax;
            } else if (exponent + eBias >= 1) {
              mantissa = (number * c - 1) * pow(2, mantissaLength);
              exponent = exponent + eBias;
            } else {
              mantissa = number * pow(2, eBias - 1) * pow(2, mantissaLength);
              exponent = 0;
            }
          }
          for (
            ;
            mantissaLength >= 8;
            buffer[index++] = mantissa & 255,
              mantissa /= 256,
              mantissaLength -= 8
          );
          exponent = (exponent << mantissaLength) | mantissa;
          exponentLength += mantissaLength;
          for (
            ;
            exponentLength > 0;
            buffer[index++] = exponent & 255,
              exponent /= 256,
              exponentLength -= 8
          );
          buffer[--index] |= sign * 128;
          return buffer;
        };

        var unpack = function (buffer, mantissaLength) {
          var bytes = buffer.length;
          var exponentLength = bytes * 8 - mantissaLength - 1;
          var eMax = (1 << exponentLength) - 1;
          var eBias = eMax >> 1;
          var nBits = exponentLength - 7;
          var index = bytes - 1;
          var sign = buffer[index--];
          var exponent = sign & 127;
          var mantissa;
          sign >>= 7;
          for (
            ;
            nBits > 0;
            exponent = exponent * 256 + buffer[index], index--, nBits -= 8
          );
          mantissa = exponent & ((1 << -nBits) - 1);
          exponent >>= -nBits;
          nBits += mantissaLength;
          for (
            ;
            nBits > 0;
            mantissa = mantissa * 256 + buffer[index], index--, nBits -= 8
          );
          if (exponent === 0) {
            exponent = 1 - eBias;
          } else if (exponent === eMax) {
            return mantissa ? NaN : sign ? -Infinity : Infinity;
          } else {
            mantissa = mantissa + pow(2, mantissaLength);
            exponent = exponent - eBias;
          }
          return (sign ? -1 : 1) * mantissa * pow(2, exponent - mantissaLength);
        };

        module.exports = {
          pack: pack,
          unpack: unpack,
        };
      },
      {},
    ],
    f859d289ee3bddee8aaf320533aa8737: [
      function (require, module, exports) {
        'use strict';
        var toObject = require('../internals/to-object');
        var toAbsoluteIndex = require('../internals/to-absolute-index');
        var toLength = require('../internals/to-length');

        module.exports = function fill(value) {
          var O = toObject(this);
          var length = toLength(O.length);
          var argumentsLength = arguments.length;
          var index = toAbsoluteIndex(
            argumentsLength > 1 ? arguments[1] : undefined,
            length
          );
          var end = argumentsLength > 2 ? arguments[2] : undefined;
          var endPos =
            end === undefined ? length : toAbsoluteIndex(end, length);
          while (endPos > index) O[index++] = value;
          return O;
        };
      },
      {
        '../internals/to-object': '2633fa4da95065e00ff87cc7cbdd56ba',
        '../internals/to-absolute-index': 'ff996ac5a229620b351a78c404035460',
        '../internals/to-length': '68c0420762f5f4704115d4fb34e0ae7f',
      },
    ],
    b474145c0d35c2cab8be2f2358364fc4: [
      function (require, module, exports) {
        var defineProperty = require('../internals/object-define-property').f;
        var has = require('../internals/has');
        var wellKnownSymbol = require('../internals/well-known-symbol');

        var TO_STRING_TAG = wellKnownSymbol('toStringTag');

        module.exports = function (it, TAG, STATIC) {
          if (it && !has((it = STATIC ? it : it.prototype), TO_STRING_TAG)) {
            defineProperty(it, TO_STRING_TAG, {
              configurable: true,
              value: TAG,
            });
          }
        };
      },
      {
        '../internals/object-define-property':
          '645ef963c1e312a12b44589911036a7f',
        '../internals/has': 'ce850695ec64cefd211ef6863461b802',
        '../internals/well-known-symbol': 'df9ad61e8404f948b528f2ef2becebe4',
      },
    ],
    '4ef9165a3829f19317eb1411640c1a9c': [
      function (require, module, exports) {
        var toPositiveInteger = require('../internals/to-positive-integer');

        module.exports = function (it, BYTES) {
          var offset = toPositiveInteger(it);
          if (offset % BYTES) throw RangeError('Wrong offset');
          return offset;
        };
      },
      {
        '../internals/to-positive-integer': '78a692a1c72bccb538efb4a5c2020e6b',
      },
    ],
    '78a692a1c72bccb538efb4a5c2020e6b': [
      function (require, module, exports) {
        var toInteger = require('../internals/to-integer');

        module.exports = function (it) {
          var result = toInteger(it);
          if (result < 0) throw RangeError("The argument can't be less than 0");
          return result;
        };
      },
      { '../internals/to-integer': 'c0972d049bc20bd69592e8a28601d5ad' },
    ],
    a92b509fc5fd0223c7351fe6c6b27164: [
      function (require, module, exports) {
        var anObject = require('../internals/an-object');
        var defineProperties = require('../internals/object-define-properties');
        var enumBugKeys = require('../internals/enum-bug-keys');
        var hiddenKeys = require('../internals/hidden-keys');
        var html = require('../internals/html');
        var documentCreateElement = require('../internals/document-create-element');
        var sharedKey = require('../internals/shared-key');

        var GT = '>';
        var LT = '<';
        var PROTOTYPE = 'prototype';
        var SCRIPT = 'script';
        var IE_PROTO = sharedKey('IE_PROTO');

        var EmptyConstructor = function () {
          /* empty */
        };

        var scriptTag = function (content) {
          return LT + SCRIPT + GT + content + LT + '/' + SCRIPT + GT;
        };

        var NullProtoObjectViaActiveX = function (activeXDocument) {
          activeXDocument.write(scriptTag(''));
          activeXDocument.close();
          var temp = activeXDocument.parentWindow.Object;
          activeXDocument = null;
          return temp;
        };

        var NullProtoObjectViaIFrame = function () {
          // Thrash, waste and sodomy: IE GC bug
          var iframe = documentCreateElement('iframe');
          var JS = 'java' + SCRIPT + ':';
          var iframeDocument;
          iframe.style.display = 'none';
          html.appendChild(iframe);
          iframe.src = String(JS);
          iframeDocument = iframe.contentWindow.document;
          iframeDocument.open();
          iframeDocument.write(scriptTag('document.F=Object'));
          iframeDocument.close();
          return iframeDocument.F;
        };

        var activeXDocument;
        var NullProtoObject = function () {
          try {
            activeXDocument = document.domain && new ActiveXObject('htmlfile');
          } catch (error) {}
          NullProtoObject = activeXDocument
            ? NullProtoObjectViaActiveX(activeXDocument)
            : NullProtoObjectViaIFrame();
          var length = enumBugKeys.length;
          while (length--)
            delete NullProtoObject[PROTOTYPE][enumBugKeys[length]];
          return NullProtoObject();
        };

        hiddenKeys[IE_PROTO] = true;

        module.exports =
          Object.create ||
          function create(O, Properties) {
            var result;
            if (O !== null) {
              EmptyConstructor[PROTOTYPE] = anObject(O);
              result = new EmptyConstructor();
              EmptyConstructor[PROTOTYPE] = null;
              result[IE_PROTO] = O;
            } else result = NullProtoObject();
            return Properties === undefined
              ? result
              : defineProperties(result, Properties);
          };
      },
      {
        '../internals/an-object': '4f20fc1a2160760f9e7961d272520cbd',
        '../internals/object-define-properties':
          '3ad53cd176876675b1da5125e4bdfafb',
        '../internals/enum-bug-keys': 'f973a6d08ba70476eedabcaf4b58c5fb',
        '../internals/hidden-keys': '7cf9eee6c00d9cc7018f7817cf84e3d6',
        '../internals/html': '1918dab06b404ee3e52f081d798c1688',
        '../internals/document-create-element':
          'cbe47a0c6cb67b97db834ad53049114a',
        '../internals/shared-key': '18fb64363b0383efc58d7addc88469cd',
      },
    ],
    '3ad53cd176876675b1da5125e4bdfafb': [
      function (require, module, exports) {
        var DESCRIPTORS = require('../internals/descriptors');
        var definePropertyModule = require('../internals/object-define-property');
        var anObject = require('../internals/an-object');
        var objectKeys = require('../internals/object-keys');

        module.exports = DESCRIPTORS
          ? Object.defineProperties
          : function defineProperties(O, Properties) {
              anObject(O);
              var keys = objectKeys(Properties);
              var length = keys.length;
              var index = 0;
              var key;
              while (length > index)
                definePropertyModule.f(
                  O,
                  (key = keys[index++]),
                  Properties[key]
                );
              return O;
            };
      },
      {
        '../internals/descriptors': '7e006cebe93fc4773e87d3146a8fa81b',
        '../internals/object-define-property':
          '645ef963c1e312a12b44589911036a7f',
        '../internals/an-object': '4f20fc1a2160760f9e7961d272520cbd',
        '../internals/object-keys': 'ec0d9c7c7614ad542f1a79132cefce40',
      },
    ],
    ec0d9c7c7614ad542f1a79132cefce40: [
      function (require, module, exports) {
        var internalObjectKeys = require('../internals/object-keys-internal');
        var enumBugKeys = require('../internals/enum-bug-keys');

        module.exports =
          Object.keys ||
          function keys(O) {
            return internalObjectKeys(O, enumBugKeys);
          };
      },
      {
        '../internals/object-keys-internal': '87cfa515865c83e03f632cbb3fb5fffb',
        '../internals/enum-bug-keys': 'f973a6d08ba70476eedabcaf4b58c5fb',
      },
    ],
    '1918dab06b404ee3e52f081d798c1688': [
      function (require, module, exports) {
        var getBuiltIn = require('../internals/get-built-in');

        module.exports = getBuiltIn('document', 'documentElement');
      },
      { '../internals/get-built-in': 'a8e7e15d3af5a0a555019aebcf7ed164' },
    ],
    b54e61bc75f363ab6afd0d016a887d53: [
      function (require, module, exports) {
        var toObject = require('../internals/to-object');
        var toLength = require('../internals/to-length');
        var getIteratorMethod = require('../internals/get-iterator-method');
        var isArrayIteratorMethod = require('../internals/is-array-iterator-method');
        var bind = require('../internals/function-bind-context');
        var aTypedArrayConstructor =
          require('../internals/array-buffer-view-core').aTypedArrayConstructor;

        module.exports = function from(source /* , mapfn, thisArg */) {
          var O = toObject(source);
          var argumentsLength = arguments.length;
          var mapfn = argumentsLength > 1 ? arguments[1] : undefined;
          var mapping = mapfn !== undefined;
          var iteratorMethod = getIteratorMethod(O);
          var i, length, result, step, iterator, next;
          if (
            iteratorMethod != undefined &&
            !isArrayIteratorMethod(iteratorMethod)
          ) {
            iterator = iteratorMethod.call(O);
            next = iterator.next;
            O = [];
            while (!(step = next.call(iterator)).done) {
              O.push(step.value);
            }
          }
          if (mapping && argumentsLength > 2) {
            mapfn = bind(mapfn, arguments[2], 2);
          }
          length = toLength(O.length);
          result = new (aTypedArrayConstructor(this))(length);
          for (i = 0; length > i; i++) {
            result[i] = mapping ? mapfn(O[i], i) : O[i];
          }
          return result;
        };
      },
      {
        '../internals/to-object': '2633fa4da95065e00ff87cc7cbdd56ba',
        '../internals/to-length': '68c0420762f5f4704115d4fb34e0ae7f',
        '../internals/get-iterator-method': 'ee70e79559122fe97016e526e216278d',
        '../internals/is-array-iterator-method':
          'a65e0e29ed1bf2da6b23fe7f2c1ffad3',
        '../internals/function-bind-context':
          'f9e6dc73b4a152f549e8299150ac260e',
        '../internals/array-buffer-view-core':
          '1ec92502c86abde7ba5eb9b6cea40afb',
      },
    ],
    ee70e79559122fe97016e526e216278d: [
      function (require, module, exports) {
        var classof = require('../internals/classof');
        var Iterators = require('../internals/iterators');
        var wellKnownSymbol = require('../internals/well-known-symbol');

        var ITERATOR = wellKnownSymbol('iterator');

        module.exports = function (it) {
          if (it != undefined)
            return it[ITERATOR] || it['@@iterator'] || Iterators[classof(it)];
        };
      },
      {
        '../internals/classof': 'be2998c5b4d0f20a1cc5fe6807661aae',
        '../internals/iterators': 'c5db2384d76eea25f1bdcd506ac55cef',
        '../internals/well-known-symbol': 'df9ad61e8404f948b528f2ef2becebe4',
      },
    ],
    c5db2384d76eea25f1bdcd506ac55cef: [
      function (require, module, exports) {
        module.exports = {};
      },
      {},
    ],
    a65e0e29ed1bf2da6b23fe7f2c1ffad3: [
      function (require, module, exports) {
        var wellKnownSymbol = require('../internals/well-known-symbol');
        var Iterators = require('../internals/iterators');

        var ITERATOR = wellKnownSymbol('iterator');
        var ArrayPrototype = Array.prototype;

        module.exports = function (it) {
          return (
            it !== undefined &&
            (Iterators.Array === it || ArrayPrototype[ITERATOR] === it)
          );
        };
      },
      {
        '../internals/well-known-symbol': 'df9ad61e8404f948b528f2ef2becebe4',
        '../internals/iterators': 'c5db2384d76eea25f1bdcd506ac55cef',
      },
    ],
    f9e6dc73b4a152f549e8299150ac260e: [
      function (require, module, exports) {
        var aFunction = require('../internals/a-function');

        // optional / simple context binding
        module.exports = function (fn, that, length) {
          aFunction(fn);
          if (that === undefined) return fn;
          switch (length) {
            case 0:
              return function () {
                return fn.call(that);
              };
            case 1:
              return function (a) {
                return fn.call(that, a);
              };
            case 2:
              return function (a, b) {
                return fn.call(that, a, b);
              };
            case 3:
              return function (a, b, c) {
                return fn.call(that, a, b, c);
              };
          }
          return function (/* ...args */) {
            return fn.apply(that, arguments);
          };
        };
      },
      { '../internals/a-function': '89591e5698008ce996ea07a1e38aa687' },
    ],
    '89591e5698008ce996ea07a1e38aa687': [
      function (require, module, exports) {
        module.exports = function (it) {
          if (typeof it != 'function') {
            throw TypeError(String(it) + ' is not a function');
          }
          return it;
        };
      },
      {},
    ],
    '5e382939caea5c6e569307d984b5dbfe': [
      function (require, module, exports) {
        var bind = require('../internals/function-bind-context');
        var IndexedObject = require('../internals/indexed-object');
        var toObject = require('../internals/to-object');
        var toLength = require('../internals/to-length');
        var arraySpeciesCreate = require('../internals/array-species-create');

        var push = [].push;

        var createMethod = function (TYPE) {
          var IS_MAP = TYPE == 1;
          var IS_FILTER = TYPE == 2;
          var IS_SOME = TYPE == 3;
          var IS_EVERY = TYPE == 4;
          var IS_FIND_INDEX = TYPE == 6;
          var NO_HOLES = TYPE == 5 || IS_FIND_INDEX;
          return function ($this, callbackfn, that, specificCreate) {
            var O = toObject($this);
            var self = IndexedObject(O);
            var boundFunction = bind(callbackfn, that, 3);
            var length = toLength(self.length);
            var index = 0;
            var create = specificCreate || arraySpeciesCreate;
            var target = IS_MAP
              ? create($this, length)
              : IS_FILTER
              ? create($this, 0)
              : undefined;
            var value, result;
            for (; length > index; index++)
              if (NO_HOLES || index in self) {
                value = self[index];
                result = boundFunction(value, index, O);
                if (TYPE) {
                  if (IS_MAP) target[index] = result; // map
                  else if (result)
                    switch (TYPE) {
                      case 3:
                        return true; // some
                      case 5:
                        return value; // find
                      case 6:
                        return index; // findIndex
                      case 2:
                        push.call(target, value); // filter
                    }
                  else if (IS_EVERY) return false; // every
                }
              }
            return IS_FIND_INDEX ? -1 : IS_SOME || IS_EVERY ? IS_EVERY : target;
          };
        };

        module.exports = {
          forEach: createMethod(0),
          map: createMethod(1),
          filter: createMethod(2),
          some: createMethod(3),
          every: createMethod(4),
          find: createMethod(5),
          findIndex: createMethod(6),
        };
      },
      {
        '../internals/function-bind-context':
          'f9e6dc73b4a152f549e8299150ac260e',
        '../internals/indexed-object': '35ae890303b620d792cd5faa73776178',
        '../internals/to-object': '2633fa4da95065e00ff87cc7cbdd56ba',
        '../internals/to-length': '68c0420762f5f4704115d4fb34e0ae7f',
        '../internals/array-species-create': '4d2b0edc3e3584142bbbf5c912729f1b',
      },
    ],
    '4d2b0edc3e3584142bbbf5c912729f1b': [
      function (require, module, exports) {
        var isObject = require('../internals/is-object');
        var isArray = require('../internals/is-array');
        var wellKnownSymbol = require('../internals/well-known-symbol');

        var SPECIES = wellKnownSymbol('species');

        module.exports = function (originalArray, length) {
          var C;
          if (isArray(originalArray)) {
            C = originalArray.constructor;
            if (typeof C == 'function' && (C === Array || isArray(C.prototype)))
              C = undefined;
            else if (isObject(C)) {
              C = C[SPECIES];
              if (C === null) C = undefined;
            }
          }
          return new (C === undefined ? Array : C)(length === 0 ? 0 : length);
        };
      },
      {
        '../internals/is-object': '03244e745134af366d66b74456891052',
        '../internals/is-array': '4bcb8b0b07b2c32a8e3e3eda35fd2a4d',
        '../internals/well-known-symbol': 'df9ad61e8404f948b528f2ef2becebe4',
      },
    ],
    '4bcb8b0b07b2c32a8e3e3eda35fd2a4d': [
      function (require, module, exports) {
        var classof = require('../internals/classof-raw');

        module.exports =
          Array.isArray ||
          function isArray(arg) {
            return classof(arg) == 'Array';
          };
      },
      { '../internals/classof-raw': '901e5a25291bac244011feea921975b2' },
    ],
    e3f4ec2b9d910d5e576300937f95e2c2: [
      function (require, module, exports) {
        'use strict';
        var getBuiltIn = require('../internals/get-built-in');
        var definePropertyModule = require('../internals/object-define-property');
        var wellKnownSymbol = require('../internals/well-known-symbol');
        var DESCRIPTORS = require('../internals/descriptors');

        var SPECIES = wellKnownSymbol('species');

        module.exports = function (CONSTRUCTOR_NAME) {
          var Constructor = getBuiltIn(CONSTRUCTOR_NAME);
          var defineProperty = definePropertyModule.f;

          if (DESCRIPTORS && Constructor && !Constructor[SPECIES]) {
            defineProperty(Constructor, SPECIES, {
              configurable: true,
              get: function () {
                return this;
              },
            });
          }
        };
      },
      {
        '../internals/get-built-in': 'a8e7e15d3af5a0a555019aebcf7ed164',
        '../internals/object-define-property':
          '645ef963c1e312a12b44589911036a7f',
        '../internals/well-known-symbol': 'df9ad61e8404f948b528f2ef2becebe4',
        '../internals/descriptors': '7e006cebe93fc4773e87d3146a8fa81b',
      },
    ],
    '4d9c0ab06f91ed2da925563ab67ef474': [
      function (require, module, exports) {
        var isObject = require('../internals/is-object');
        var setPrototypeOf = require('../internals/object-set-prototype-of');

        module.exports = function ($this, dummy, Wrapper) {
          var NewTarget, NewTargetPrototype;
          if (
            setPrototypeOf &&
            typeof (NewTarget = dummy.constructor) == 'function' &&
            NewTarget !== Wrapper &&
            isObject((NewTargetPrototype = NewTarget.prototype)) &&
            NewTargetPrototype !== Wrapper.prototype
          )
            setPrototypeOf($this, NewTargetPrototype);
          return $this;
        };
      },
      {
        '../internals/is-object': '03244e745134af366d66b74456891052',
        '../internals/object-set-prototype-of':
          '22e756b2221a479eceeccf2a78a39bef',
      },
    ],
    '49914eeba57759547672886c5961b9e4': [
      function (require, module, exports) {
        var createTypedArrayConstructor = require('../internals/typed-array-constructor');

        createTypedArrayConstructor('Float64', function (init) {
          return function Float64Array(data, byteOffset, length) {
            return init(this, data, byteOffset, length);
          };
        });
      },
      {
        '../internals/typed-array-constructor':
          '8c855361f876f3547521c1eb756f5360',
      },
    ],
    '1fc9d0d9e9c4ca72873ee75cc9532911': [
      function (require, module, exports) {
        var createTypedArrayConstructor = require('../internals/typed-array-constructor');

        createTypedArrayConstructor('Int8', function (init) {
          return function Int8Array(data, byteOffset, length) {
            return init(this, data, byteOffset, length);
          };
        });
      },
      {
        '../internals/typed-array-constructor':
          '8c855361f876f3547521c1eb756f5360',
      },
    ],
    '6ba53210946e69387b5af65ca70f5602': [
      function (require, module, exports) {
        var createTypedArrayConstructor = require('../internals/typed-array-constructor');

        createTypedArrayConstructor('Int16', function (init) {
          return function Int16Array(data, byteOffset, length) {
            return init(this, data, byteOffset, length);
          };
        });
      },
      {
        '../internals/typed-array-constructor':
          '8c855361f876f3547521c1eb756f5360',
      },
    ],
    '52f07ad61480c3da8b1b371346f2b755': [
      function (require, module, exports) {
        var createTypedArrayConstructor = require('../internals/typed-array-constructor');

        createTypedArrayConstructor('Int32', function (init) {
          return function Int32Array(data, byteOffset, length) {
            return init(this, data, byteOffset, length);
          };
        });
      },
      {
        '../internals/typed-array-constructor':
          '8c855361f876f3547521c1eb756f5360',
      },
    ],
    '6042ea91f038c74624be740ff17090b9': [
      function (require, module, exports) {
        var createTypedArrayConstructor = require('../internals/typed-array-constructor');

        createTypedArrayConstructor('Uint8', function (init) {
          return function Uint8Array(data, byteOffset, length) {
            return init(this, data, byteOffset, length);
          };
        });
      },
      {
        '../internals/typed-array-constructor':
          '8c855361f876f3547521c1eb756f5360',
      },
    ],
    '47e53ff27a819e98075783d2516842bf': [
      function (require, module, exports) {
        var createTypedArrayConstructor = require('../internals/typed-array-constructor');

        createTypedArrayConstructor(
          'Uint8',
          function (init) {
            return function Uint8ClampedArray(data, byteOffset, length) {
              return init(this, data, byteOffset, length);
            };
          },
          true
        );
      },
      {
        '../internals/typed-array-constructor':
          '8c855361f876f3547521c1eb756f5360',
      },
    ],
    '20f511ab1a5fbdd3a99ff1f471adbc30': [
      function (require, module, exports) {
        var createTypedArrayConstructor = require('../internals/typed-array-constructor');

        createTypedArrayConstructor('Uint16', function (init) {
          return function Uint16Array(data, byteOffset, length) {
            return init(this, data, byteOffset, length);
          };
        });
      },
      {
        '../internals/typed-array-constructor':
          '8c855361f876f3547521c1eb756f5360',
      },
    ],
    '8212db3659c5fe8bebc2163b12c9f547': [
      function (require, module, exports) {
        var createTypedArrayConstructor = require('../internals/typed-array-constructor');

        createTypedArrayConstructor('Uint32', function (init) {
          return function Uint32Array(data, byteOffset, length) {
            return init(this, data, byteOffset, length);
          };
        });
      },
      {
        '../internals/typed-array-constructor':
          '8c855361f876f3547521c1eb756f5360',
      },
    ],
    '183d72778e0f99cedb12a04e35ea2d50': [
      function (require, module, exports) {
        'use strict';
        var TYPED_ARRAYS_CONSTRUCTORS_REQUIRES_WRAPPERS = require('../internals/typed-array-constructors-require-wrappers');
        var exportTypedArrayStaticMethod =
          require('../internals/array-buffer-view-core').exportTypedArrayStaticMethod;
        var typedArrayFrom = require('../internals/typed-array-from');

        exportTypedArrayStaticMethod(
          'from',
          typedArrayFrom,
          TYPED_ARRAYS_CONSTRUCTORS_REQUIRES_WRAPPERS
        );
      },
      {
        '../internals/typed-array-constructors-require-wrappers':
          'c18c6fa7d7a6ea266deebfa9f42416ec',
        '../internals/array-buffer-view-core':
          '1ec92502c86abde7ba5eb9b6cea40afb',
        '../internals/typed-array-from': 'b54e61bc75f363ab6afd0d016a887d53',
      },
    ],
    '2ee3ec99d0b3dea4fec9002159200789': [
      function (require, module, exports) {
        'use strict';
        var ArrayBufferViewCore = require('../internals/array-buffer-view-core');
        var TYPED_ARRAYS_CONSTRUCTORS_REQUIRES_WRAPPERS = require('../internals/typed-array-constructors-require-wrappers');

        var aTypedArrayConstructor = ArrayBufferViewCore.aTypedArrayConstructor;
        var exportTypedArrayStaticMethod =
          ArrayBufferViewCore.exportTypedArrayStaticMethod;

        exportTypedArrayStaticMethod(
          'of',
          function of(/* ...items */) {
            var index = 0;
            var length = arguments.length;
            var result = new (aTypedArrayConstructor(this))(length);
            while (length > index) result[index] = arguments[index++];
            return result;
          },
          TYPED_ARRAYS_CONSTRUCTORS_REQUIRES_WRAPPERS
        );
      },
      {
        '../internals/array-buffer-view-core':
          '1ec92502c86abde7ba5eb9b6cea40afb',
        '../internals/typed-array-constructors-require-wrappers':
          'c18c6fa7d7a6ea266deebfa9f42416ec',
      },
    ],
    '140df4f8e97a45c53c66fead1f5a9e92': [
      function (require, module, exports) {
        var $ = require('../internals/export');

        var global = require('../internals/global');

        var task = require('../internals/task');

        var FORCED = !global.setImmediate || !global.clearImmediate;

        $(
          {
            global: true,
            bind: true,
            enumerable: true,
            forced: FORCED,
          },
          {
            setImmediate: task.set,
            clearImmediate: task.clear,
          }
        );
      },
      {
        '../internals/export': '10044f24ecae4059b4af184e71d3fba2',
        '../internals/global': '7e78823454e7f795898745d93279f917',
        '../internals/task': 'dd47ece3e1296f193ccefcf3056d1754',
      },
    ],
    dd47ece3e1296f193ccefcf3056d1754: [
      function (require, module, exports) {
        var global = require('../internals/global');

        var fails = require('../internals/fails');

        var classof = require('../internals/classof-raw');

        var bind = require('../internals/function-bind-context');

        var html = require('../internals/html');

        var createElement = require('../internals/document-create-element');

        var IS_IOS = require('../internals/engine-is-ios');

        var location = global.location;
        var set = global.setImmediate;
        var clear = global.clearImmediate;
        var process = global.process;
        var MessageChannel = global.MessageChannel;
        var Dispatch = global.Dispatch;
        var counter = 0;
        var queue = {};
        var ONREADYSTATECHANGE = 'onreadystatechange';
        var defer, channel, port;

        var run = function (id) {
          if (queue.hasOwnProperty(id)) {
            var fn = queue[id];
            delete queue[id];
            fn();
          }
        };

        var runner = function (id) {
          return function () {
            run(id);
          };
        };

        var listener = function (event) {
          run(event.data);
        };

        var post = function (id) {
          // old engines have not location.origin
          global.postMessage(id + '', location.protocol + '//' + location.host);
        };

        if (!set || !clear) {
          set = function setImmediate(fn) {
            var args = [];
            var i = 1;

            while (arguments.length > i) args.push(arguments[i++]);

            queue[++counter] = function () {
              (typeof fn == 'function' ? fn : Function(fn)).apply(
                undefined,
                args
              );
            };

            defer(counter);
            return counter;
          };

          clear = function clearImmediate(id) {
            delete queue[id];
          };

          if (classof(process) == 'process') {
            defer = function (id) {
              process.nextTick(runner(id));
            };
          } else if (Dispatch && Dispatch.now) {
            defer = function (id) {
              Dispatch.now(runner(id));
            };
          } else if (MessageChannel && !IS_IOS) {
            channel = new MessageChannel();
            port = channel.port2;
            channel.port1.onmessage = listener;
            defer = bind(port.postMessage, port, 1);
          } else if (
            global.addEventListener &&
            typeof postMessage == 'function' &&
            !global.importScripts &&
            !fails(post) &&
            location.protocol !== 'file:'
          ) {
            defer = post;
            global.addEventListener('message', listener, false); // IE8-
          } else if (ONREADYSTATECHANGE in createElement('script')) {
            defer = function (id) {
              html.appendChild(createElement('script'))[ONREADYSTATECHANGE] =
                function () {
                  html.removeChild(this);
                  run(id);
                };
            }; // Rest old browsers
          } else {
            defer = function (id) {
              setTimeout(runner(id), 0);
            };
          }
        }

        module.exports = {
          set: set,
          clear: clear,
        };
      },
      {
        '../internals/global': '7e78823454e7f795898745d93279f917',
        '../internals/fails': 'e16fc2ec92bf0d6254ffef14ea12ad77',
        '../internals/classof-raw': '901e5a25291bac244011feea921975b2',
        '../internals/function-bind-context':
          'f9e6dc73b4a152f549e8299150ac260e',
        '../internals/html': '1918dab06b404ee3e52f081d798c1688',
        '../internals/document-create-element':
          'cbe47a0c6cb67b97db834ad53049114a',
        '../internals/engine-is-ios': '3156eb661c8c8e66a6d95c3b2d979fb4',
      },
    ],
    '3156eb661c8c8e66a6d95c3b2d979fb4': [
      function (require, module, exports) {
        var userAgent = require('../internals/engine-user-agent');

        module.exports = /(iphone|ipod|ipad).*applewebkit/i.test(userAgent);
      },
      { '../internals/engine-user-agent': '143c26fec04440461ecc4dae3ad13828' },
    ],
    '143c26fec04440461ecc4dae3ad13828': [
      function (require, module, exports) {
        var getBuiltIn = require('../internals/get-built-in');

        module.exports = getBuiltIn('navigator', 'userAgent') || '';
      },
      { '../internals/get-built-in': 'a8e7e15d3af5a0a555019aebcf7ed164' },
    ],
    a66c25e402880ea6b966ee8ece30b6df: [
      function (require, module, exports) {
        'use strict';

        require('../modules/es.string.iterator');

        var $ = require('../internals/export');

        var DESCRIPTORS = require('../internals/descriptors');

        var USE_NATIVE_URL = require('../internals/native-url');

        var global = require('../internals/global');

        var defineProperties = require('../internals/object-define-properties');

        var redefine = require('../internals/redefine');

        var anInstance = require('../internals/an-instance');

        var has = require('../internals/has');

        var assign = require('../internals/object-assign');

        var arrayFrom = require('../internals/array-from');

        var codeAt = require('../internals/string-multibyte').codeAt;

        var toASCII = require('../internals/string-punycode-to-ascii');

        var setToStringTag = require('../internals/set-to-string-tag');

        var URLSearchParamsModule = require('../modules/web.url-search-params');

        var InternalStateModule = require('../internals/internal-state');

        var NativeURL = global.URL;
        var URLSearchParams = URLSearchParamsModule.URLSearchParams;
        var getInternalSearchParamsState = URLSearchParamsModule.getState;
        var setInternalState = InternalStateModule.set;
        var getInternalURLState = InternalStateModule.getterFor('URL');
        var floor = Math.floor;
        var pow = Math.pow;
        var INVALID_AUTHORITY = 'Invalid authority';
        var INVALID_SCHEME = 'Invalid scheme';
        var INVALID_HOST = 'Invalid host';
        var INVALID_PORT = 'Invalid port';
        var ALPHA = /[A-Za-z]/;
        var ALPHANUMERIC = /[\d+-.A-Za-z]/;
        var DIGIT = /\d/;
        var HEX_START = /^(0x|0X)/;
        var OCT = /^[0-7]+$/;
        var DEC = /^\d+$/;
        var HEX = /^[\dA-Fa-f]+$/;

        var FORBIDDEN_HOST_CODE_POINT = /[\u0000\u0009\u000A\u000D #%/:?@[\\]]/;

        var FORBIDDEN_HOST_CODE_POINT_EXCLUDING_PERCENT =
          /[\u0000\u0009\u000A\u000D #/:?@[\\]]/;

        var LEADING_AND_TRAILING_C0_CONTROL_OR_SPACE =
          /^[\u0000-\u001F ]+|[\u0000-\u001F ]+$/g;

        var TAB_AND_NEW_LINE = /[\u0009\u000A\u000D]/g;
        var EOF;

        var parseHost = function (url, input) {
          var result, codePoints, index;

          if (input.charAt(0) == '[') {
            if (input.charAt(input.length - 1) != ']') return INVALID_HOST;
            result = parseIPv6(input.slice(1, -1));
            if (!result) return INVALID_HOST;
            url.host = result; // opaque host
          } else if (!isSpecial(url)) {
            if (FORBIDDEN_HOST_CODE_POINT_EXCLUDING_PERCENT.test(input))
              return INVALID_HOST;
            result = '';
            codePoints = arrayFrom(input);

            for (index = 0; index < codePoints.length; index++) {
              result += percentEncode(
                codePoints[index],
                C0ControlPercentEncodeSet
              );
            }

            url.host = result;
          } else {
            input = toASCII(input);
            if (FORBIDDEN_HOST_CODE_POINT.test(input)) return INVALID_HOST;
            result = parseIPv4(input);
            if (result === null) return INVALID_HOST;
            url.host = result;
          }
        };

        var parseIPv4 = function (input) {
          var parts = input.split('.');
          var partsLength, numbers, index, part, radix, number, ipv4;

          if (parts.length && parts[parts.length - 1] == '') {
            parts.pop();
          }

          partsLength = parts.length;
          if (partsLength > 4) return input;
          numbers = [];

          for (index = 0; index < partsLength; index++) {
            part = parts[index];
            if (part == '') return input;
            radix = 10;

            if (part.length > 1 && part.charAt(0) == '0') {
              radix = HEX_START.test(part) ? 16 : 8;
              part = part.slice(radix == 8 ? 1 : 2);
            }

            if (part === '') {
              number = 0;
            } else {
              if (!(radix == 10 ? DEC : radix == 8 ? OCT : HEX).test(part))
                return input;
              number = parseInt(part, radix);
            }

            numbers.push(number);
          }

          for (index = 0; index < partsLength; index++) {
            number = numbers[index];

            if (index == partsLength - 1) {
              if (number >= pow(256, 5 - partsLength)) return null;
            } else if (number > 255) return null;
          }

          ipv4 = numbers.pop();

          for (index = 0; index < numbers.length; index++) {
            ipv4 += numbers[index] * pow(256, 3 - index);
          }

          return ipv4;
        };

        var parseIPv6 = function (input) {
          var address = [0, 0, 0, 0, 0, 0, 0, 0];
          var pieceIndex = 0;
          var compress = null;
          var pointer = 0;
          var value, length, numbersSeen, ipv4Piece, number, swaps, swap;

          var char = function () {
            return input.charAt(pointer);
          };

          if (char() == ':') {
            if (input.charAt(1) != ':') return;
            pointer += 2;
            pieceIndex++;
            compress = pieceIndex;
          }

          while (char()) {
            if (pieceIndex == 8) return;

            if (char() == ':') {
              if (compress !== null) return;
              pointer++;
              pieceIndex++;
              compress = pieceIndex;
              continue;
            }

            value = length = 0;

            while (length < 4 && HEX.test(char())) {
              value = value * 16 + parseInt(char(), 16);
              pointer++;
              length++;
            }

            if (char() == '.') {
              if (length == 0) return;
              pointer -= length;
              if (pieceIndex > 6) return;
              numbersSeen = 0;

              while (char()) {
                ipv4Piece = null;

                if (numbersSeen > 0) {
                  if (char() == '.' && numbersSeen < 4) pointer++;
                  else return;
                }

                if (!DIGIT.test(char())) return;

                while (DIGIT.test(char())) {
                  number = parseInt(char(), 10);
                  if (ipv4Piece === null) ipv4Piece = number;
                  else if (ipv4Piece == 0) return;
                  else ipv4Piece = ipv4Piece * 10 + number;
                  if (ipv4Piece > 255) return;
                  pointer++;
                }

                address[pieceIndex] = address[pieceIndex] * 256 + ipv4Piece;
                numbersSeen++;
                if (numbersSeen == 2 || numbersSeen == 4) pieceIndex++;
              }

              if (numbersSeen != 4) return;
              break;
            } else if (char() == ':') {
              pointer++;
              if (!char()) return;
            } else if (char()) return;

            address[pieceIndex++] = value;
          }

          if (compress !== null) {
            swaps = pieceIndex - compress;
            pieceIndex = 7;

            while (pieceIndex != 0 && swaps > 0) {
              swap = address[pieceIndex];
              address[pieceIndex--] = address[compress + swaps - 1];
              address[compress + --swaps] = swap;
            }
          } else if (pieceIndex != 8) return;

          return address;
        };

        var findLongestZeroSequence = function (ipv6) {
          var maxIndex = null;
          var maxLength = 1;
          var currStart = null;
          var currLength = 0;
          var index = 0;

          for (; index < 8; index++) {
            if (ipv6[index] !== 0) {
              if (currLength > maxLength) {
                maxIndex = currStart;
                maxLength = currLength;
              }

              currStart = null;
              currLength = 0;
            } else {
              if (currStart === null) currStart = index;
              ++currLength;
            }
          }

          if (currLength > maxLength) {
            maxIndex = currStart;
            maxLength = currLength;
          }

          return maxIndex;
        };

        var serializeHost = function (host) {
          var result, index, compress, ignore0;

          if (typeof host == 'number') {
            result = [];

            for (index = 0; index < 4; index++) {
              result.unshift(host % 256);
              host = floor(host / 256);
            }

            return result.join('.');
          } else if (typeof host == 'object') {
            result = '';
            compress = findLongestZeroSequence(host);

            for (index = 0; index < 8; index++) {
              if (ignore0 && host[index] === 0) continue;
              if (ignore0) ignore0 = false;

              if (compress === index) {
                result += index ? ':' : '::';
                ignore0 = true;
              } else {
                result += host[index].toString(16);
                if (index < 7) result += ':';
              }
            }

            return '[' + result + ']';
          }

          return host;
        };

        var C0ControlPercentEncodeSet = {};
        var fragmentPercentEncodeSet = assign({}, C0ControlPercentEncodeSet, {
          ' ': 1,
          '"': 1,
          '<': 1,
          '>': 1,
          '`': 1,
        });
        var pathPercentEncodeSet = assign({}, fragmentPercentEncodeSet, {
          '#': 1,
          '?': 1,
          '{': 1,
          '}': 1,
        });
        var userinfoPercentEncodeSet = assign({}, pathPercentEncodeSet, {
          '/': 1,
          ':': 1,
          ';': 1,
          '=': 1,
          '@': 1,
          '[': 1,
          '\\': 1,
          ']': 1,
          '^': 1,
          '|': 1,
        });

        var percentEncode = function (char, set) {
          var code = codeAt(char, 0);
          return code > 0x20 && code < 0x7f && !has(set, char)
            ? char
            : encodeURIComponent(char);
        };

        var specialSchemes = {
          ftp: 21,
          file: null,
          http: 80,
          https: 443,
          ws: 80,
          wss: 443,
        };

        var isSpecial = function (url) {
          return has(specialSchemes, url.scheme);
        };

        var includesCredentials = function (url) {
          return url.username != '' || url.password != '';
        };

        var cannotHaveUsernamePasswordPort = function (url) {
          return !url.host || url.cannotBeABaseURL || url.scheme == 'file';
        };

        var isWindowsDriveLetter = function (string, normalized) {
          var second;
          return (
            string.length == 2 &&
            ALPHA.test(string.charAt(0)) &&
            ((second = string.charAt(1)) == ':' ||
              (!normalized && second == '|'))
          );
        };

        var startsWithWindowsDriveLetter = function (string) {
          var third;
          return (
            string.length > 1 &&
            isWindowsDriveLetter(string.slice(0, 2)) &&
            (string.length == 2 ||
              (third = string.charAt(2)) === '/' ||
              third === '\\' ||
              third === '?' ||
              third === '#')
          );
        };

        var shortenURLsPath = function (url) {
          var path = url.path;
          var pathSize = path.length;

          if (
            pathSize &&
            (url.scheme != 'file' ||
              pathSize != 1 ||
              !isWindowsDriveLetter(path[0], true))
          ) {
            path.pop();
          }
        };

        var isSingleDot = function (segment) {
          return segment === '.' || segment.toLowerCase() === '%2e';
        };

        var isDoubleDot = function (segment) {
          segment = segment.toLowerCase();
          return (
            segment === '..' ||
            segment === '%2e.' ||
            segment === '.%2e' ||
            segment === '%2e%2e'
          );
        }; // States:

        var SCHEME_START = {};
        var SCHEME = {};
        var NO_SCHEME = {};
        var SPECIAL_RELATIVE_OR_AUTHORITY = {};
        var PATH_OR_AUTHORITY = {};
        var RELATIVE = {};
        var RELATIVE_SLASH = {};
        var SPECIAL_AUTHORITY_SLASHES = {};
        var SPECIAL_AUTHORITY_IGNORE_SLASHES = {};
        var AUTHORITY = {};
        var HOST = {};
        var HOSTNAME = {};
        var PORT = {};
        var FILE = {};
        var FILE_SLASH = {};
        var FILE_HOST = {};
        var PATH_START = {};
        var PATH = {};
        var CANNOT_BE_A_BASE_URL_PATH = {};
        var QUERY = {};
        var FRAGMENT = {}; // eslint-disable-next-line max-statements

        var parseURL = function (url, input, stateOverride, base) {
          var state = stateOverride || SCHEME_START;
          var pointer = 0;
          var buffer = '';
          var seenAt = false;
          var seenBracket = false;
          var seenPasswordToken = false;
          var codePoints, char, bufferCodePoints, failure;

          if (!stateOverride) {
            url.scheme = '';
            url.username = '';
            url.password = '';
            url.host = null;
            url.port = null;
            url.path = [];
            url.query = null;
            url.fragment = null;
            url.cannotBeABaseURL = false;
            input = input.replace(LEADING_AND_TRAILING_C0_CONTROL_OR_SPACE, '');
          }

          input = input.replace(TAB_AND_NEW_LINE, '');
          codePoints = arrayFrom(input);

          while (pointer <= codePoints.length) {
            char = codePoints[pointer];

            switch (state) {
              case SCHEME_START:
                if (char && ALPHA.test(char)) {
                  buffer += char.toLowerCase();
                  state = SCHEME;
                } else if (!stateOverride) {
                  state = NO_SCHEME;
                  continue;
                } else return INVALID_SCHEME;

                break;

              case SCHEME:
                if (
                  char &&
                  (ALPHANUMERIC.test(char) ||
                    char == '+' ||
                    char == '-' ||
                    char == '.')
                ) {
                  buffer += char.toLowerCase();
                } else if (char == ':') {
                  if (
                    stateOverride &&
                    (isSpecial(url) != has(specialSchemes, buffer) ||
                      (buffer == 'file' &&
                        (includesCredentials(url) || url.port !== null)) ||
                      (url.scheme == 'file' && !url.host))
                  )
                    return;
                  url.scheme = buffer;

                  if (stateOverride) {
                    if (
                      isSpecial(url) &&
                      specialSchemes[url.scheme] == url.port
                    )
                      url.port = null;
                    return;
                  }

                  buffer = '';

                  if (url.scheme == 'file') {
                    state = FILE;
                  } else if (
                    isSpecial(url) &&
                    base &&
                    base.scheme == url.scheme
                  ) {
                    state = SPECIAL_RELATIVE_OR_AUTHORITY;
                  } else if (isSpecial(url)) {
                    state = SPECIAL_AUTHORITY_SLASHES;
                  } else if (codePoints[pointer + 1] == '/') {
                    state = PATH_OR_AUTHORITY;
                    pointer++;
                  } else {
                    url.cannotBeABaseURL = true;
                    url.path.push('');
                    state = CANNOT_BE_A_BASE_URL_PATH;
                  }
                } else if (!stateOverride) {
                  buffer = '';
                  state = NO_SCHEME;
                  pointer = 0;
                  continue;
                } else return INVALID_SCHEME;

                break;

              case NO_SCHEME:
                if (!base || (base.cannotBeABaseURL && char != '#'))
                  return INVALID_SCHEME;

                if (base.cannotBeABaseURL && char == '#') {
                  url.scheme = base.scheme;
                  url.path = base.path.slice();
                  url.query = base.query;
                  url.fragment = '';
                  url.cannotBeABaseURL = true;
                  state = FRAGMENT;
                  break;
                }

                state = base.scheme == 'file' ? FILE : RELATIVE;
                continue;

              case SPECIAL_RELATIVE_OR_AUTHORITY:
                if (char == '/' && codePoints[pointer + 1] == '/') {
                  state = SPECIAL_AUTHORITY_IGNORE_SLASHES;
                  pointer++;
                } else {
                  state = RELATIVE;
                  continue;
                }

                break;

              case PATH_OR_AUTHORITY:
                if (char == '/') {
                  state = AUTHORITY;
                  break;
                } else {
                  state = PATH;
                  continue;
                }

              case RELATIVE:
                url.scheme = base.scheme;

                if (char == EOF) {
                  url.username = base.username;
                  url.password = base.password;
                  url.host = base.host;
                  url.port = base.port;
                  url.path = base.path.slice();
                  url.query = base.query;
                } else if (char == '/' || (char == '\\' && isSpecial(url))) {
                  state = RELATIVE_SLASH;
                } else if (char == '?') {
                  url.username = base.username;
                  url.password = base.password;
                  url.host = base.host;
                  url.port = base.port;
                  url.path = base.path.slice();
                  url.query = '';
                  state = QUERY;
                } else if (char == '#') {
                  url.username = base.username;
                  url.password = base.password;
                  url.host = base.host;
                  url.port = base.port;
                  url.path = base.path.slice();
                  url.query = base.query;
                  url.fragment = '';
                  state = FRAGMENT;
                } else {
                  url.username = base.username;
                  url.password = base.password;
                  url.host = base.host;
                  url.port = base.port;
                  url.path = base.path.slice();
                  url.path.pop();
                  state = PATH;
                  continue;
                }

                break;

              case RELATIVE_SLASH:
                if (isSpecial(url) && (char == '/' || char == '\\')) {
                  state = SPECIAL_AUTHORITY_IGNORE_SLASHES;
                } else if (char == '/') {
                  state = AUTHORITY;
                } else {
                  url.username = base.username;
                  url.password = base.password;
                  url.host = base.host;
                  url.port = base.port;
                  state = PATH;
                  continue;
                }

                break;

              case SPECIAL_AUTHORITY_SLASHES:
                state = SPECIAL_AUTHORITY_IGNORE_SLASHES;
                if (char != '/' || buffer.charAt(pointer + 1) != '/') continue;
                pointer++;
                break;

              case SPECIAL_AUTHORITY_IGNORE_SLASHES:
                if (char != '/' && char != '\\') {
                  state = AUTHORITY;
                  continue;
                }

                break;

              case AUTHORITY:
                if (char == '@') {
                  if (seenAt) buffer = '%40' + buffer;
                  seenAt = true;
                  bufferCodePoints = arrayFrom(buffer);

                  for (var i = 0; i < bufferCodePoints.length; i++) {
                    var codePoint = bufferCodePoints[i];

                    if (codePoint == ':' && !seenPasswordToken) {
                      seenPasswordToken = true;
                      continue;
                    }

                    var encodedCodePoints = percentEncode(
                      codePoint,
                      userinfoPercentEncodeSet
                    );
                    if (seenPasswordToken) url.password += encodedCodePoints;
                    else url.username += encodedCodePoints;
                  }

                  buffer = '';
                } else if (
                  char == EOF ||
                  char == '/' ||
                  char == '?' ||
                  char == '#' ||
                  (char == '\\' && isSpecial(url))
                ) {
                  if (seenAt && buffer == '') return INVALID_AUTHORITY;
                  pointer -= arrayFrom(buffer).length + 1;
                  buffer = '';
                  state = HOST;
                } else buffer += char;

                break;

              case HOST:
              case HOSTNAME:
                if (stateOverride && url.scheme == 'file') {
                  state = FILE_HOST;
                  continue;
                } else if (char == ':' && !seenBracket) {
                  if (buffer == '') return INVALID_HOST;
                  failure = parseHost(url, buffer);
                  if (failure) return failure;
                  buffer = '';
                  state = PORT;
                  if (stateOverride == HOSTNAME) return;
                } else if (
                  char == EOF ||
                  char == '/' ||
                  char == '?' ||
                  char == '#' ||
                  (char == '\\' && isSpecial(url))
                ) {
                  if (isSpecial(url) && buffer == '') return INVALID_HOST;
                  if (
                    stateOverride &&
                    buffer == '' &&
                    (includesCredentials(url) || url.port !== null)
                  )
                    return;
                  failure = parseHost(url, buffer);
                  if (failure) return failure;
                  buffer = '';
                  state = PATH_START;
                  if (stateOverride) return;
                  continue;
                } else {
                  if (char == '[') seenBracket = true;
                  else if (char == ']') seenBracket = false;
                  buffer += char;
                }

                break;

              case PORT:
                if (DIGIT.test(char)) {
                  buffer += char;
                } else if (
                  char == EOF ||
                  char == '/' ||
                  char == '?' ||
                  char == '#' ||
                  (char == '\\' && isSpecial(url)) ||
                  stateOverride
                ) {
                  if (buffer != '') {
                    var port = parseInt(buffer, 10);
                    if (port > 0xffff) return INVALID_PORT;
                    url.port =
                      isSpecial(url) && port === specialSchemes[url.scheme]
                        ? null
                        : port;
                    buffer = '';
                  }

                  if (stateOverride) return;
                  state = PATH_START;
                  continue;
                } else return INVALID_PORT;

                break;

              case FILE:
                url.scheme = 'file';
                if (char == '/' || char == '\\') state = FILE_SLASH;
                else if (base && base.scheme == 'file') {
                  if (char == EOF) {
                    url.host = base.host;
                    url.path = base.path.slice();
                    url.query = base.query;
                  } else if (char == '?') {
                    url.host = base.host;
                    url.path = base.path.slice();
                    url.query = '';
                    state = QUERY;
                  } else if (char == '#') {
                    url.host = base.host;
                    url.path = base.path.slice();
                    url.query = base.query;
                    url.fragment = '';
                    state = FRAGMENT;
                  } else {
                    if (
                      !startsWithWindowsDriveLetter(
                        codePoints.slice(pointer).join('')
                      )
                    ) {
                      url.host = base.host;
                      url.path = base.path.slice();
                      shortenURLsPath(url);
                    }

                    state = PATH;
                    continue;
                  }
                } else {
                  state = PATH;
                  continue;
                }
                break;

              case FILE_SLASH:
                if (char == '/' || char == '\\') {
                  state = FILE_HOST;
                  break;
                }

                if (
                  base &&
                  base.scheme == 'file' &&
                  !startsWithWindowsDriveLetter(
                    codePoints.slice(pointer).join('')
                  )
                ) {
                  if (isWindowsDriveLetter(base.path[0], true))
                    url.path.push(base.path[0]);
                  else url.host = base.host;
                }

                state = PATH;
                continue;

              case FILE_HOST:
                if (
                  char == EOF ||
                  char == '/' ||
                  char == '\\' ||
                  char == '?' ||
                  char == '#'
                ) {
                  if (!stateOverride && isWindowsDriveLetter(buffer)) {
                    state = PATH;
                  } else if (buffer == '') {
                    url.host = '';
                    if (stateOverride) return;
                    state = PATH_START;
                  } else {
                    failure = parseHost(url, buffer);
                    if (failure) return failure;
                    if (url.host == 'localhost') url.host = '';
                    if (stateOverride) return;
                    buffer = '';
                    state = PATH_START;
                  }

                  continue;
                } else buffer += char;

                break;

              case PATH_START:
                if (isSpecial(url)) {
                  state = PATH;
                  if (char != '/' && char != '\\') continue;
                } else if (!stateOverride && char == '?') {
                  url.query = '';
                  state = QUERY;
                } else if (!stateOverride && char == '#') {
                  url.fragment = '';
                  state = FRAGMENT;
                } else if (char != EOF) {
                  state = PATH;
                  if (char != '/') continue;
                }

                break;

              case PATH:
                if (
                  char == EOF ||
                  char == '/' ||
                  (char == '\\' && isSpecial(url)) ||
                  (!stateOverride && (char == '?' || char == '#'))
                ) {
                  if (isDoubleDot(buffer)) {
                    shortenURLsPath(url);

                    if (char != '/' && !(char == '\\' && isSpecial(url))) {
                      url.path.push('');
                    }
                  } else if (isSingleDot(buffer)) {
                    if (char != '/' && !(char == '\\' && isSpecial(url))) {
                      url.path.push('');
                    }
                  } else {
                    if (
                      url.scheme == 'file' &&
                      !url.path.length &&
                      isWindowsDriveLetter(buffer)
                    ) {
                      if (url.host) url.host = '';
                      buffer = buffer.charAt(0) + ':'; // normalize windows drive letter
                    }

                    url.path.push(buffer);
                  }

                  buffer = '';

                  if (
                    url.scheme == 'file' &&
                    (char == EOF || char == '?' || char == '#')
                  ) {
                    while (url.path.length > 1 && url.path[0] === '') {
                      url.path.shift();
                    }
                  }

                  if (char == '?') {
                    url.query = '';
                    state = QUERY;
                  } else if (char == '#') {
                    url.fragment = '';
                    state = FRAGMENT;
                  }
                } else {
                  buffer += percentEncode(char, pathPercentEncodeSet);
                }

                break;

              case CANNOT_BE_A_BASE_URL_PATH:
                if (char == '?') {
                  url.query = '';
                  state = QUERY;
                } else if (char == '#') {
                  url.fragment = '';
                  state = FRAGMENT;
                } else if (char != EOF) {
                  url.path[0] += percentEncode(char, C0ControlPercentEncodeSet);
                }

                break;

              case QUERY:
                if (!stateOverride && char == '#') {
                  url.fragment = '';
                  state = FRAGMENT;
                } else if (char != EOF) {
                  if (char == "'" && isSpecial(url)) url.query += '%27';
                  else if (char == '#') url.query += '%23';
                  else
                    url.query += percentEncode(char, C0ControlPercentEncodeSet);
                }

                break;

              case FRAGMENT:
                if (char != EOF)
                  url.fragment += percentEncode(char, fragmentPercentEncodeSet);
                break;
            }

            pointer++;
          }
        };

        var URLConstructor = function URL(
          url
          /* , base */
        ) {
          var that = anInstance(this, URLConstructor, 'URL');
          var base = arguments.length > 1 ? arguments[1] : undefined;
          var urlString = String(url);
          var state = setInternalState(that, {
            type: 'URL',
          });
          var baseState, failure;

          if (base !== undefined) {
            if (base instanceof URLConstructor)
              baseState = getInternalURLState(base);
            else {
              failure = parseURL((baseState = {}), String(base));
              if (failure) throw TypeError(failure);
            }
          }

          failure = parseURL(state, urlString, null, baseState);
          if (failure) throw TypeError(failure);
          var searchParams = (state.searchParams = new URLSearchParams());
          var searchParamsState = getInternalSearchParamsState(searchParams);
          searchParamsState.updateSearchParams(state.query);

          searchParamsState.updateURL = function () {
            state.query = String(searchParams) || null;
          };

          if (!DESCRIPTORS) {
            that.href = serializeURL.call(that);
            that.origin = getOrigin.call(that);
            that.protocol = getProtocol.call(that);
            that.username = getUsername.call(that);
            that.password = getPassword.call(that);
            that.host = getHost.call(that);
            that.hostname = getHostname.call(that);
            that.port = getPort.call(that);
            that.pathname = getPathname.call(that);
            that.search = getSearch.call(that);
            that.searchParams = getSearchParams.call(that);
            that.hash = getHash.call(that);
          }
        };

        var URLPrototype = URLConstructor.prototype;

        var serializeURL = function () {
          var url = getInternalURLState(this);
          var scheme = url.scheme;
          var username = url.username;
          var password = url.password;
          var host = url.host;
          var port = url.port;
          var path = url.path;
          var query = url.query;
          var fragment = url.fragment;
          var output = scheme + ':';

          if (host !== null) {
            output += '//';

            if (includesCredentials(url)) {
              output += username + (password ? ':' + password : '') + '@';
            }

            output += serializeHost(host);
            if (port !== null) output += ':' + port;
          } else if (scheme == 'file') output += '//';

          output += url.cannotBeABaseURL
            ? path[0]
            : path.length
            ? '/' + path.join('/')
            : '';
          if (query !== null) output += '?' + query;
          if (fragment !== null) output += '#' + fragment;
          return output;
        };

        var getOrigin = function () {
          var url = getInternalURLState(this);
          var scheme = url.scheme;
          var port = url.port;
          if (scheme == 'blob')
            try {
              return new URL(scheme.path[0]).origin;
            } catch (error) {
              return 'null';
            }
          if (scheme == 'file' || !isSpecial(url)) return 'null';
          return (
            scheme +
            '://' +
            serializeHost(url.host) +
            (port !== null ? ':' + port : '')
          );
        };

        var getProtocol = function () {
          return getInternalURLState(this).scheme + ':';
        };

        var getUsername = function () {
          return getInternalURLState(this).username;
        };

        var getPassword = function () {
          return getInternalURLState(this).password;
        };

        var getHost = function () {
          var url = getInternalURLState(this);
          var host = url.host;
          var port = url.port;
          return host === null
            ? ''
            : port === null
            ? serializeHost(host)
            : serializeHost(host) + ':' + port;
        };

        var getHostname = function () {
          var host = getInternalURLState(this).host;
          return host === null ? '' : serializeHost(host);
        };

        var getPort = function () {
          var port = getInternalURLState(this).port;
          return port === null ? '' : String(port);
        };

        var getPathname = function () {
          var url = getInternalURLState(this);
          var path = url.path;
          return url.cannotBeABaseURL
            ? path[0]
            : path.length
            ? '/' + path.join('/')
            : '';
        };

        var getSearch = function () {
          var query = getInternalURLState(this).query;
          return query ? '?' + query : '';
        };

        var getSearchParams = function () {
          return getInternalURLState(this).searchParams;
        };

        var getHash = function () {
          var fragment = getInternalURLState(this).fragment;
          return fragment ? '#' + fragment : '';
        };

        var accessorDescriptor = function (getter, setter) {
          return {
            get: getter,
            set: setter,
            configurable: true,
            enumerable: true,
          };
        };

        if (DESCRIPTORS) {
          defineProperties(URLPrototype, {
            href: accessorDescriptor(serializeURL, function (href) {
              var url = getInternalURLState(this);
              var urlString = String(href);
              var failure = parseURL(url, urlString);
              if (failure) throw TypeError(failure);
              getInternalSearchParamsState(url.searchParams).updateSearchParams(
                url.query
              );
            }),

            origin: accessorDescriptor(getOrigin),

            protocol: accessorDescriptor(getProtocol, function (protocol) {
              var url = getInternalURLState(this);
              parseURL(url, String(protocol) + ':', SCHEME_START);
            }),

            username: accessorDescriptor(getUsername, function (username) {
              var url = getInternalURLState(this);
              var codePoints = arrayFrom(String(username));
              if (cannotHaveUsernamePasswordPort(url)) return;
              url.username = '';

              for (var i = 0; i < codePoints.length; i++) {
                url.username += percentEncode(
                  codePoints[i],
                  userinfoPercentEncodeSet
                );
              }
            }),

            password: accessorDescriptor(getPassword, function (password) {
              var url = getInternalURLState(this);
              var codePoints = arrayFrom(String(password));
              if (cannotHaveUsernamePasswordPort(url)) return;
              url.password = '';

              for (var i = 0; i < codePoints.length; i++) {
                url.password += percentEncode(
                  codePoints[i],
                  userinfoPercentEncodeSet
                );
              }
            }),

            host: accessorDescriptor(getHost, function (host) {
              var url = getInternalURLState(this);
              if (url.cannotBeABaseURL) return;
              parseURL(url, String(host), HOST);
            }),

            hostname: accessorDescriptor(getHostname, function (hostname) {
              var url = getInternalURLState(this);
              if (url.cannotBeABaseURL) return;
              parseURL(url, String(hostname), HOSTNAME);
            }),

            port: accessorDescriptor(getPort, function (port) {
              var url = getInternalURLState(this);
              if (cannotHaveUsernamePasswordPort(url)) return;
              port = String(port);
              if (port == '') url.port = null;
              else parseURL(url, port, PORT);
            }),

            pathname: accessorDescriptor(getPathname, function (pathname) {
              var url = getInternalURLState(this);
              if (url.cannotBeABaseURL) return;
              url.path = [];
              parseURL(url, pathname + '', PATH_START);
            }),

            search: accessorDescriptor(getSearch, function (search) {
              var url = getInternalURLState(this);
              search = String(search);

              if (search == '') {
                url.query = null;
              } else {
                if ('?' == search.charAt(0)) search = search.slice(1);
                url.query = '';
                parseURL(url, search, QUERY);
              }

              getInternalSearchParamsState(url.searchParams).updateSearchParams(
                url.query
              );
            }),

            searchParams: accessorDescriptor(getSearchParams),

            hash: accessorDescriptor(getHash, function (hash) {
              var url = getInternalURLState(this);
              hash = String(hash);

              if (hash == '') {
                url.fragment = null;
                return;
              }

              if ('#' == hash.charAt(0)) hash = hash.slice(1);
              url.fragment = '';
              parseURL(url, hash, FRAGMENT);
            }),
          });
        }
        redefine(
          URLPrototype,
          'toJSON',
          function toJSON() {
            return serializeURL.call(this);
          },
          {
            enumerable: true,
          }
        );

        redefine(
          URLPrototype,
          'toString',
          function toString() {
            return serializeURL.call(this);
          },
          {
            enumerable: true,
          }
        );

        if (NativeURL) {
          var nativeCreateObjectURL = NativeURL.createObjectURL;
          var nativeRevokeObjectURL = NativeURL.revokeObjectURL;

          if (nativeCreateObjectURL)
            redefine(
              URLConstructor,
              'createObjectURL',
              function createObjectURL(blob) {
                return nativeCreateObjectURL.apply(NativeURL, arguments);
              }
            );
          if (nativeRevokeObjectURL)
            redefine(
              URLConstructor,
              'revokeObjectURL',
              function revokeObjectURL(url) {
                return nativeRevokeObjectURL.apply(NativeURL, arguments);
              }
            );
        }

        setToStringTag(URLConstructor, 'URL');
        $(
          {
            global: true,
            forced: !USE_NATIVE_URL,
            sham: !DESCRIPTORS,
          },
          {
            URL: URLConstructor,
          }
        );
      },
      {
        '../modules/es.string.iterator': '17203f1447f326bd1ee667e61bac879c',
        '../internals/export': '10044f24ecae4059b4af184e71d3fba2',
        '../internals/descriptors': '7e006cebe93fc4773e87d3146a8fa81b',
        '../internals/native-url': '5e5f16f67bd2b706d5eb103748915db5',
        '../internals/global': '7e78823454e7f795898745d93279f917',
        '../internals/object-define-properties':
          '3ad53cd176876675b1da5125e4bdfafb',
        '../internals/redefine': 'b8f156ba0e16ecf7371c0d9dbd0a7d60',
        '../internals/an-instance': '8b0daff12bd798defdb69ae41eea7f5e',
        '../internals/has': 'ce850695ec64cefd211ef6863461b802',
        '../internals/object-assign': 'ae1f8d2c1cdbd736ba4b5be0b1a1834d',
        '../internals/array-from': 'ca2455971d1c96b7905e2122c9d50dab',
        '../internals/string-multibyte': '2324ad16ce38cbfde2a3a75c67697ac1',
        '../internals/string-punycode-to-ascii':
          'c01f437496192b363cd127030416cd5c',
        '../internals/set-to-string-tag': 'b474145c0d35c2cab8be2f2358364fc4',
        '../modules/web.url-search-params': '2494aebefd4ca447de0ef4cfdd47509e',
        '../internals/internal-state': '8b9f5ed7c6f8b05b4cd6ee1eefa801c1',
      },
    ],
    '17203f1447f326bd1ee667e61bac879c': [
      function (require, module, exports) {
        'use strict';
        var charAt = require('../internals/string-multibyte').charAt;
        var InternalStateModule = require('../internals/internal-state');
        var defineIterator = require('../internals/define-iterator');

        var STRING_ITERATOR = 'String Iterator';
        var setInternalState = InternalStateModule.set;
        var getInternalState = InternalStateModule.getterFor(STRING_ITERATOR);

        defineIterator(
          String,
          'String',
          function (iterated) {
            setInternalState(this, {
              type: STRING_ITERATOR,
              string: String(iterated),
              index: 0,
            });
          },
          function next() {
            var state = getInternalState(this);
            var string = state.string;
            var index = state.index;
            var point;
            if (index >= string.length) return { value: undefined, done: true };
            point = charAt(string, index);
            state.index += point.length;
            return { value: point, done: false };
          }
        );
      },
      {
        '../internals/string-multibyte': '2324ad16ce38cbfde2a3a75c67697ac1',
        '../internals/internal-state': '8b9f5ed7c6f8b05b4cd6ee1eefa801c1',
        '../internals/define-iterator': '89cab28f14b0323e9b7f5add1d23fc79',
      },
    ],
    '89cab28f14b0323e9b7f5add1d23fc79': [
      function (require, module, exports) {
        'use strict';
        var $ = require('../internals/export');
        var createIteratorConstructor = require('../internals/create-iterator-constructor');
        var getPrototypeOf = require('../internals/object-get-prototype-of');
        var setPrototypeOf = require('../internals/object-set-prototype-of');
        var setToStringTag = require('../internals/set-to-string-tag');
        var createNonEnumerableProperty = require('../internals/create-non-enumerable-property');
        var redefine = require('../internals/redefine');
        var wellKnownSymbol = require('../internals/well-known-symbol');
        var IS_PURE = require('../internals/is-pure');
        var Iterators = require('../internals/iterators');
        var IteratorsCore = require('../internals/iterators-core');

        var IteratorPrototype = IteratorsCore.IteratorPrototype;
        var BUGGY_SAFARI_ITERATORS = IteratorsCore.BUGGY_SAFARI_ITERATORS;
        var ITERATOR = wellKnownSymbol('iterator');
        var KEYS = 'keys';
        var VALUES = 'values';
        var ENTRIES = 'entries';

        var returnThis = function () {
          return this;
        };

        module.exports = function (
          Iterable,
          NAME,
          IteratorConstructor,
          next,
          DEFAULT,
          IS_SET,
          FORCED
        ) {
          createIteratorConstructor(IteratorConstructor, NAME, next);

          var getIterationMethod = function (KIND) {
            if (KIND === DEFAULT && defaultIterator) return defaultIterator;
            if (!BUGGY_SAFARI_ITERATORS && KIND in IterablePrototype)
              return IterablePrototype[KIND];
            switch (KIND) {
              case KEYS:
                return function keys() {
                  return new IteratorConstructor(this, KIND);
                };
              case VALUES:
                return function values() {
                  return new IteratorConstructor(this, KIND);
                };
              case ENTRIES:
                return function entries() {
                  return new IteratorConstructor(this, KIND);
                };
            }
            return function () {
              return new IteratorConstructor(this);
            };
          };

          var TO_STRING_TAG = NAME + ' Iterator';
          var INCORRECT_VALUES_NAME = false;
          var IterablePrototype = Iterable.prototype;
          var nativeIterator =
            IterablePrototype[ITERATOR] ||
            IterablePrototype['@@iterator'] ||
            (DEFAULT && IterablePrototype[DEFAULT]);
          var defaultIterator =
            (!BUGGY_SAFARI_ITERATORS && nativeIterator) ||
            getIterationMethod(DEFAULT);
          var anyNativeIterator =
            NAME == 'Array'
              ? IterablePrototype.entries || nativeIterator
              : nativeIterator;
          var CurrentIteratorPrototype, methods, KEY;

          // fix native
          if (anyNativeIterator) {
            CurrentIteratorPrototype = getPrototypeOf(
              anyNativeIterator.call(new Iterable())
            );
            if (
              IteratorPrototype !== Object.prototype &&
              CurrentIteratorPrototype.next
            ) {
              if (
                !IS_PURE &&
                getPrototypeOf(CurrentIteratorPrototype) !== IteratorPrototype
              ) {
                if (setPrototypeOf) {
                  setPrototypeOf(CurrentIteratorPrototype, IteratorPrototype);
                } else if (
                  typeof CurrentIteratorPrototype[ITERATOR] != 'function'
                ) {
                  createNonEnumerableProperty(
                    CurrentIteratorPrototype,
                    ITERATOR,
                    returnThis
                  );
                }
              }
              setToStringTag(
                CurrentIteratorPrototype,
                TO_STRING_TAG,
                true,
                true
              );
              if (IS_PURE) Iterators[TO_STRING_TAG] = returnThis;
            }
          }

          if (
            DEFAULT == VALUES &&
            nativeIterator &&
            nativeIterator.name !== VALUES
          ) {
            INCORRECT_VALUES_NAME = true;
            defaultIterator = function values() {
              return nativeIterator.call(this);
            };
          }

          if (
            (!IS_PURE || FORCED) &&
            IterablePrototype[ITERATOR] !== defaultIterator
          ) {
            createNonEnumerableProperty(
              IterablePrototype,
              ITERATOR,
              defaultIterator
            );
          }
          Iterators[NAME] = defaultIterator;

          if (DEFAULT) {
            methods = {
              values: getIterationMethod(VALUES),
              keys: IS_SET ? defaultIterator : getIterationMethod(KEYS),
              entries: getIterationMethod(ENTRIES),
            };
            if (FORCED)
              for (KEY in methods) {
                if (
                  BUGGY_SAFARI_ITERATORS ||
                  INCORRECT_VALUES_NAME ||
                  !(KEY in IterablePrototype)
                ) {
                  redefine(IterablePrototype, KEY, methods[KEY]);
                }
              }
            else
              $(
                {
                  target: NAME,
                  proto: true,
                  forced: BUGGY_SAFARI_ITERATORS || INCORRECT_VALUES_NAME,
                },
                methods
              );
          }

          return methods;
        };
      },
      {
        '../internals/export': '10044f24ecae4059b4af184e71d3fba2',
        '../internals/create-iterator-constructor':
          'b9bab68ecd62fef0c0fd01853566a2cf',
        '../internals/object-get-prototype-of':
          '50d059706e0afa285234c1608d9f7cbf',
        '../internals/object-set-prototype-of':
          '22e756b2221a479eceeccf2a78a39bef',
        '../internals/set-to-string-tag': 'b474145c0d35c2cab8be2f2358364fc4',
        '../internals/create-non-enumerable-property':
          'b52adb17d2cebacfac251681882f0a33',
        '../internals/redefine': 'b8f156ba0e16ecf7371c0d9dbd0a7d60',
        '../internals/well-known-symbol': 'df9ad61e8404f948b528f2ef2becebe4',
        '../internals/is-pure': 'f767c4b71b5cfe3ee6c1a7e54bdcafa0',
        '../internals/iterators': 'c5db2384d76eea25f1bdcd506ac55cef',
        '../internals/iterators-core': '8a1b93d778cdbd6c63966f348e8ad566',
      },
    ],
    b9bab68ecd62fef0c0fd01853566a2cf: [
      function (require, module, exports) {
        'use strict';
        var IteratorPrototype =
          require('../internals/iterators-core').IteratorPrototype;
        var create = require('../internals/object-create');
        var createPropertyDescriptor = require('../internals/create-property-descriptor');
        var setToStringTag = require('../internals/set-to-string-tag');
        var Iterators = require('../internals/iterators');

        var returnThis = function () {
          return this;
        };

        module.exports = function (IteratorConstructor, NAME, next) {
          var TO_STRING_TAG = NAME + ' Iterator';
          IteratorConstructor.prototype = create(IteratorPrototype, {
            next: createPropertyDescriptor(1, next),
          });
          setToStringTag(IteratorConstructor, TO_STRING_TAG, false, true);
          Iterators[TO_STRING_TAG] = returnThis;
          return IteratorConstructor;
        };
      },
      {
        '../internals/iterators-core': '8a1b93d778cdbd6c63966f348e8ad566',
        '../internals/object-create': 'a92b509fc5fd0223c7351fe6c6b27164',
        '../internals/create-property-descriptor':
          '8c5551ce5a79ddcd7162c3e3c8f33c9a',
        '../internals/set-to-string-tag': 'b474145c0d35c2cab8be2f2358364fc4',
        '../internals/iterators': 'c5db2384d76eea25f1bdcd506ac55cef',
      },
    ],
    '8a1b93d778cdbd6c63966f348e8ad566': [
      function (require, module, exports) {
        'use strict';
        var getPrototypeOf = require('../internals/object-get-prototype-of');
        var createNonEnumerableProperty = require('../internals/create-non-enumerable-property');
        var has = require('../internals/has');
        var wellKnownSymbol = require('../internals/well-known-symbol');
        var IS_PURE = require('../internals/is-pure');

        var ITERATOR = wellKnownSymbol('iterator');
        var BUGGY_SAFARI_ITERATORS = false;

        var returnThis = function () {
          return this;
        };

        var IteratorPrototype, PrototypeOfArrayIteratorPrototype, arrayIterator;

        if ([].keys) {
          arrayIterator = [].keys();
          if (!('next' in arrayIterator)) BUGGY_SAFARI_ITERATORS = true;
          else {
            PrototypeOfArrayIteratorPrototype = getPrototypeOf(
              getPrototypeOf(arrayIterator)
            );
            if (PrototypeOfArrayIteratorPrototype !== Object.prototype)
              IteratorPrototype = PrototypeOfArrayIteratorPrototype;
          }
        }

        if (IteratorPrototype == undefined) IteratorPrototype = {};

        if (!IS_PURE && !has(IteratorPrototype, ITERATOR)) {
          createNonEnumerableProperty(IteratorPrototype, ITERATOR, returnThis);
        }

        module.exports = {
          IteratorPrototype: IteratorPrototype,
          BUGGY_SAFARI_ITERATORS: BUGGY_SAFARI_ITERATORS,
        };
      },
      {
        '../internals/object-get-prototype-of':
          '50d059706e0afa285234c1608d9f7cbf',
        '../internals/create-non-enumerable-property':
          'b52adb17d2cebacfac251681882f0a33',
        '../internals/has': 'ce850695ec64cefd211ef6863461b802',
        '../internals/well-known-symbol': 'df9ad61e8404f948b528f2ef2becebe4',
        '../internals/is-pure': 'f767c4b71b5cfe3ee6c1a7e54bdcafa0',
      },
    ],
    '5e5f16f67bd2b706d5eb103748915db5': [
      function (require, module, exports) {
        var fails = require('../internals/fails');
        var wellKnownSymbol = require('../internals/well-known-symbol');
        var IS_PURE = require('../internals/is-pure');

        var ITERATOR = wellKnownSymbol('iterator');

        module.exports = !fails(function () {
          var url = new URL('b?a=1&b=2&c=3', 'http://a');
          var searchParams = url.searchParams;
          var result = '';
          url.pathname = 'c%20d';
          searchParams.forEach(function (value, key) {
            searchParams['delete']('b');
            result += key + value;
          });
          return (
            (IS_PURE && !url.toJSON) ||
            !searchParams.sort ||
            url.href !== 'http://a/c%20d?a=1&c=3' ||
            searchParams.get('c') !== '3' ||
            String(new URLSearchParams('?a=1')) !== 'a=1' ||
            !searchParams[ITERATOR] ||
            new URL('https://a@b').username !== 'a' ||
            new URLSearchParams(new URLSearchParams('a=b')).get('a') !== 'b' ||
            new URL('http://тест').host !== 'xn--e1aybc' ||
            new URL('http://a#б').hash !== '#%D0%B1' ||
            result !== 'a1c3' ||
            new URL('http://x', undefined).host !== 'x'
          );
        });
      },
      {
        '../internals/fails': 'e16fc2ec92bf0d6254ffef14ea12ad77',
        '../internals/well-known-symbol': 'df9ad61e8404f948b528f2ef2becebe4',
        '../internals/is-pure': 'f767c4b71b5cfe3ee6c1a7e54bdcafa0',
      },
    ],
    ae1f8d2c1cdbd736ba4b5be0b1a1834d: [
      function (require, module, exports) {
        'use strict';
        var DESCRIPTORS = require('../internals/descriptors');
        var fails = require('../internals/fails');
        var objectKeys = require('../internals/object-keys');
        var getOwnPropertySymbolsModule = require('../internals/object-get-own-property-symbols');
        var propertyIsEnumerableModule = require('../internals/object-property-is-enumerable');
        var toObject = require('../internals/to-object');
        var IndexedObject = require('../internals/indexed-object');

        var nativeAssign = Object.assign;
        var defineProperty = Object.defineProperty;

        module.exports =
          !nativeAssign ||
          fails(function () {
            if (
              DESCRIPTORS &&
              nativeAssign(
                { b: 1 },
                nativeAssign(
                  defineProperty({}, 'a', {
                    enumerable: true,
                    get: function () {
                      defineProperty(this, 'b', {
                        value: 3,
                        enumerable: false,
                      });
                    },
                  }),
                  { b: 2 }
                )
              ).b !== 1
            )
              return true;
            var A = {};
            var B = {};
            var symbol = Symbol();
            var alphabet = 'abcdefghijklmnopqrst';
            A[symbol] = 7;
            alphabet.split('').forEach(function (chr) {
              B[chr] = chr;
            });
            return (
              nativeAssign({}, A)[symbol] != 7 ||
              objectKeys(nativeAssign({}, B)).join('') != alphabet
            );
          })
            ? function assign(target, source) {
                var T = toObject(target);
                var argumentsLength = arguments.length;
                var index = 1;
                var getOwnPropertySymbols = getOwnPropertySymbolsModule.f;
                var propertyIsEnumerable = propertyIsEnumerableModule.f;
                while (argumentsLength > index) {
                  var S = IndexedObject(arguments[index++]);
                  var keys = getOwnPropertySymbols
                    ? objectKeys(S).concat(getOwnPropertySymbols(S))
                    : objectKeys(S);
                  var length = keys.length;
                  var j = 0;
                  var key;
                  while (length > j) {
                    key = keys[j++];
                    if (!DESCRIPTORS || propertyIsEnumerable.call(S, key))
                      T[key] = S[key];
                  }
                }
                return T;
              }
            : nativeAssign;
      },
      {
        '../internals/descriptors': '7e006cebe93fc4773e87d3146a8fa81b',
        '../internals/fails': 'e16fc2ec92bf0d6254ffef14ea12ad77',
        '../internals/object-keys': 'ec0d9c7c7614ad542f1a79132cefce40',
        '../internals/object-get-own-property-symbols':
          'f759fc76793903b9cadc1e3a84780ff9',
        '../internals/object-property-is-enumerable':
          '6d666488e852af6845747bbd2705cc05',
        '../internals/to-object': '2633fa4da95065e00ff87cc7cbdd56ba',
        '../internals/indexed-object': '35ae890303b620d792cd5faa73776178',
      },
    ],
    ca2455971d1c96b7905e2122c9d50dab: [
      function (require, module, exports) {
        'use strict';
        var bind = require('../internals/function-bind-context');
        var toObject = require('../internals/to-object');
        var callWithSafeIterationClosing = require('../internals/call-with-safe-iteration-closing');
        var isArrayIteratorMethod = require('../internals/is-array-iterator-method');
        var toLength = require('../internals/to-length');
        var createProperty = require('../internals/create-property');
        var getIteratorMethod = require('../internals/get-iterator-method');

        module.exports = function from(arrayLike) {
          var O = toObject(arrayLike);
          var C = typeof this == 'function' ? this : Array;
          var argumentsLength = arguments.length;
          var mapfn = argumentsLength > 1 ? arguments[1] : undefined;
          var mapping = mapfn !== undefined;
          var iteratorMethod = getIteratorMethod(O);
          var index = 0;
          var length, result, step, iterator, next, value;
          if (mapping)
            mapfn = bind(
              mapfn,
              argumentsLength > 2 ? arguments[2] : undefined,
              2
            );
          if (
            iteratorMethod != undefined &&
            !(C == Array && isArrayIteratorMethod(iteratorMethod))
          ) {
            iterator = iteratorMethod.call(O);
            next = iterator.next;
            result = new C();
            for (; !(step = next.call(iterator)).done; index++) {
              value = mapping
                ? callWithSafeIterationClosing(
                    iterator,
                    mapfn,
                    [step.value, index],
                    true
                  )
                : step.value;
              createProperty(result, index, value);
            }
          } else {
            length = toLength(O.length);
            result = new C(length);
            for (; length > index; index++) {
              value = mapping ? mapfn(O[index], index) : O[index];
              createProperty(result, index, value);
            }
          }
          result.length = index;
          return result;
        };
      },
      {
        '../internals/function-bind-context':
          'f9e6dc73b4a152f549e8299150ac260e',
        '../internals/to-object': '2633fa4da95065e00ff87cc7cbdd56ba',
        '../internals/call-with-safe-iteration-closing':
          '8876d1c56af08599f7b19a406726d554',
        '../internals/is-array-iterator-method':
          'a65e0e29ed1bf2da6b23fe7f2c1ffad3',
        '../internals/to-length': '68c0420762f5f4704115d4fb34e0ae7f',
        '../internals/create-property': '49f209074159e5f6b7cb7c7945792f40',
        '../internals/get-iterator-method': 'ee70e79559122fe97016e526e216278d',
      },
    ],
    '8876d1c56af08599f7b19a406726d554': [
      function (require, module, exports) {
        var anObject = require('../internals/an-object');

        module.exports = function (iterator, fn, value, ENTRIES) {
          try {
            return ENTRIES ? fn(anObject(value)[0], value[1]) : fn(value);
          } catch (error) {
            var returnMethod = iterator['return'];
            if (returnMethod !== undefined)
              anObject(returnMethod.call(iterator));
            throw error;
          }
        };
      },
      { '../internals/an-object': '4f20fc1a2160760f9e7961d272520cbd' },
    ],
    '49f209074159e5f6b7cb7c7945792f40': [
      function (require, module, exports) {
        'use strict';
        var toPrimitive = require('../internals/to-primitive');
        var definePropertyModule = require('../internals/object-define-property');
        var createPropertyDescriptor = require('../internals/create-property-descriptor');

        module.exports = function (object, key, value) {
          var propertyKey = toPrimitive(key);
          if (propertyKey in object)
            definePropertyModule.f(
              object,
              propertyKey,
              createPropertyDescriptor(0, value)
            );
          else object[propertyKey] = value;
        };
      },
      {
        '../internals/to-primitive': '2a7f05f0f9119d3b88a770acfa30cc7b',
        '../internals/object-define-property':
          '645ef963c1e312a12b44589911036a7f',
        '../internals/create-property-descriptor':
          '8c5551ce5a79ddcd7162c3e3c8f33c9a',
      },
    ],
    c01f437496192b363cd127030416cd5c: [
      function (require, module, exports) {
        'use strict';
        var maxInt = 2147483647;
        var base = 36;
        var tMin = 1;
        var tMax = 26;
        var skew = 38;
        var damp = 700;
        var initialBias = 72;
        var initialN = 128;
        var delimiter = '-';
        var regexNonASCII = /[^\0-\u007E]/;
        var regexSeparators = /[.\u3002\uFF0E\uFF61]/g;
        var OVERFLOW_ERROR = 'Overflow: input needs wider integers to process';
        var baseMinusTMin = base - tMin;
        var floor = Math.floor;
        var stringFromCharCode = String.fromCharCode;

        var ucs2decode = function (string) {
          var output = [];
          var counter = 0;
          var length = string.length;
          while (counter < length) {
            var value = string.charCodeAt(counter++);
            if (value >= 0xd800 && value <= 0xdbff && counter < length) {
              var extra = string.charCodeAt(counter++);
              if ((extra & 0xfc00) == 0xdc00) {
                output.push(
                  ((value & 0x3ff) << 10) + (extra & 0x3ff) + 0x10000
                );
              } else {
                output.push(value);
                counter--;
              }
            } else {
              output.push(value);
            }
          }
          return output;
        };

        var digitToBasic = function (digit) {
          return digit + 22 + 75 * (digit < 26);
        };

        var adapt = function (delta, numPoints, firstTime) {
          var k = 0;
          delta = firstTime ? floor(delta / damp) : delta >> 1;
          delta += floor(delta / numPoints);
          for (; delta > (baseMinusTMin * tMax) >> 1; k += base) {
            delta = floor(delta / baseMinusTMin);
          }
          return floor(k + ((baseMinusTMin + 1) * delta) / (delta + skew));
        };

        var encode = function (input) {
          var output = [];

          input = ucs2decode(input);

          var inputLength = input.length;

          // Initialize the state.
          var n = initialN;
          var delta = 0;
          var bias = initialBias;
          var i, currentValue;

          for (i = 0; i < input.length; i++) {
            currentValue = input[i];
            if (currentValue < 0x80) {
              output.push(stringFromCharCode(currentValue));
            }
          }

          var basicLength = output.length;
          var handledCPCount = basicLength;

          if (basicLength) {
            output.push(delimiter);
          }

          // Main encoding loop:
          while (handledCPCount < inputLength) {
            var m = maxInt;
            for (i = 0; i < input.length; i++) {
              currentValue = input[i];
              if (currentValue >= n && currentValue < m) {
                m = currentValue;
              }
            }

            var handledCPCountPlusOne = handledCPCount + 1;
            if (m - n > floor((maxInt - delta) / handledCPCountPlusOne)) {
              throw RangeError(OVERFLOW_ERROR);
            }

            delta += (m - n) * handledCPCountPlusOne;
            n = m;

            for (i = 0; i < input.length; i++) {
              currentValue = input[i];
              if (currentValue < n && ++delta > maxInt) {
                throw RangeError(OVERFLOW_ERROR);
              }
              if (currentValue == n) {
                var q = delta;
                for (var k = base; ; k += base) {
                  var t = k <= bias ? tMin : k >= bias + tMax ? tMax : k - bias;
                  if (q < t) break;
                  var qMinusT = q - t;
                  var baseMinusT = base - t;
                  output.push(
                    stringFromCharCode(digitToBasic(t + (qMinusT % baseMinusT)))
                  );
                  q = floor(qMinusT / baseMinusT);
                }

                output.push(stringFromCharCode(digitToBasic(q)));
                bias = adapt(
                  delta,
                  handledCPCountPlusOne,
                  handledCPCount == basicLength
                );
                delta = 0;
                ++handledCPCount;
              }
            }

            ++delta;
            ++n;
          }
          return output.join('');
        };

        module.exports = function (input) {
          var encoded = [];
          var labels = input
            .toLowerCase()
            .replace(regexSeparators, '\u002E')
            .split('.');
          var i, label;
          for (i = 0; i < labels.length; i++) {
            label = labels[i];
            encoded.push(
              regexNonASCII.test(label) ? 'xn--' + encode(label) : label
            );
          }
          return encoded.join('.');
        };
      },
      {},
    ],
    '2494aebefd4ca447de0ef4cfdd47509e': [
      function (require, module, exports) {
        'use strict';
        require('../modules/es.array.iterator');
        var $ = require('../internals/export');
        var getBuiltIn = require('../internals/get-built-in');
        var USE_NATIVE_URL = require('../internals/native-url');
        var redefine = require('../internals/redefine');
        var redefineAll = require('../internals/redefine-all');
        var setToStringTag = require('../internals/set-to-string-tag');
        var createIteratorConstructor = require('../internals/create-iterator-constructor');
        var InternalStateModule = require('../internals/internal-state');
        var anInstance = require('../internals/an-instance');
        var hasOwn = require('../internals/has');
        var bind = require('../internals/function-bind-context');
        var classof = require('../internals/classof');
        var anObject = require('../internals/an-object');
        var isObject = require('../internals/is-object');
        var create = require('../internals/object-create');
        var createPropertyDescriptor = require('../internals/create-property-descriptor');
        var getIterator = require('../internals/get-iterator');
        var getIteratorMethod = require('../internals/get-iterator-method');
        var wellKnownSymbol = require('../internals/well-known-symbol');

        var $fetch = getBuiltIn('fetch');
        var Headers = getBuiltIn('Headers');
        var ITERATOR = wellKnownSymbol('iterator');
        var URL_SEARCH_PARAMS = 'URLSearchParams';
        var URL_SEARCH_PARAMS_ITERATOR = URL_SEARCH_PARAMS + 'Iterator';
        var setInternalState = InternalStateModule.set;
        var getInternalParamsState =
          InternalStateModule.getterFor(URL_SEARCH_PARAMS);
        var getInternalIteratorState = InternalStateModule.getterFor(
          URL_SEARCH_PARAMS_ITERATOR
        );

        var plus = /\+/g;
        var sequences = Array(4);

        var percentSequence = function (bytes) {
          return (
            sequences[bytes - 1] ||
            (sequences[bytes - 1] = RegExp(
              '((?:%[\\da-f]{2}){' + bytes + '})',
              'gi'
            ))
          );
        };

        var percentDecode = function (sequence) {
          try {
            return decodeURIComponent(sequence);
          } catch (error) {
            return sequence;
          }
        };

        var deserialize = function (it) {
          var result = it.replace(plus, ' ');
          var bytes = 4;
          try {
            return decodeURIComponent(result);
          } catch (error) {
            while (bytes) {
              result = result.replace(percentSequence(bytes--), percentDecode);
            }
            return result;
          }
        };

        var find = /[!'()~]|%20/g;

        var replace = {
          '!': '%21',
          "'": '%27',
          '(': '%28',
          ')': '%29',
          '~': '%7E',
          '%20': '+',
        };

        var replacer = function (match) {
          return replace[match];
        };

        var serialize = function (it) {
          return encodeURIComponent(it).replace(find, replacer);
        };

        var parseSearchParams = function (result, query) {
          if (query) {
            var attributes = query.split('&');
            var index = 0;
            var attribute, entry;
            while (index < attributes.length) {
              attribute = attributes[index++];
              if (attribute.length) {
                entry = attribute.split('=');
                result.push({
                  key: deserialize(entry.shift()),
                  value: deserialize(entry.join('=')),
                });
              }
            }
          }
        };

        var updateSearchParams = function (query) {
          this.entries.length = 0;
          parseSearchParams(this.entries, query);
        };

        var validateArgumentsLength = function (passed, required) {
          if (passed < required) throw TypeError('Not enough arguments');
        };

        var URLSearchParamsIterator = createIteratorConstructor(
          function Iterator(params, kind) {
            setInternalState(this, {
              type: URL_SEARCH_PARAMS_ITERATOR,
              iterator: getIterator(getInternalParamsState(params).entries),
              kind: kind,
            });
          },
          'Iterator',
          function next() {
            var state = getInternalIteratorState(this);
            var kind = state.kind;
            var step = state.iterator.next();
            var entry = step.value;
            if (!step.done) {
              step.value =
                kind === 'keys'
                  ? entry.key
                  : kind === 'values'
                  ? entry.value
                  : [entry.key, entry.value];
            }
            return step;
          }
        );

        var URLSearchParamsConstructor = function URLSearchParams() {
          anInstance(this, URLSearchParamsConstructor, URL_SEARCH_PARAMS);
          var init = arguments.length > 0 ? arguments[0] : undefined;
          var that = this;
          var entries = [];
          var iteratorMethod,
            iterator,
            next,
            step,
            entryIterator,
            entryNext,
            first,
            second,
            key;

          setInternalState(that, {
            type: URL_SEARCH_PARAMS,
            entries: entries,
            updateURL: function () {},
            updateSearchParams: updateSearchParams,
          });

          if (init !== undefined) {
            if (isObject(init)) {
              iteratorMethod = getIteratorMethod(init);
              if (typeof iteratorMethod === 'function') {
                iterator = iteratorMethod.call(init);
                next = iterator.next;
                while (!(step = next.call(iterator)).done) {
                  entryIterator = getIterator(anObject(step.value));
                  entryNext = entryIterator.next;
                  if (
                    (first = entryNext.call(entryIterator)).done ||
                    (second = entryNext.call(entryIterator)).done ||
                    !entryNext.call(entryIterator).done
                  )
                    throw TypeError('Expected sequence with length 2');
                  entries.push({
                    key: first.value + '',
                    value: second.value + '',
                  });
                }
              } else
                for (key in init)
                  if (hasOwn(init, key))
                    entries.push({ key: key, value: init[key] + '' });
            } else {
              parseSearchParams(
                entries,
                typeof init === 'string'
                  ? init.charAt(0) === '?'
                    ? init.slice(1)
                    : init
                  : init + ''
              );
            }
          }
        };

        var URLSearchParamsPrototype = URLSearchParamsConstructor.prototype;

        redefineAll(
          URLSearchParamsPrototype,
          {
            append: function append(name, value) {
              validateArgumentsLength(arguments.length, 2);
              var state = getInternalParamsState(this);
              state.entries.push({ key: name + '', value: value + '' });
              state.updateURL();
            },
            delete: function (name) {
              validateArgumentsLength(arguments.length, 1);
              var state = getInternalParamsState(this);
              var entries = state.entries;
              var key = name + '';
              var index = 0;
              while (index < entries.length) {
                if (entries[index].key === key) entries.splice(index, 1);
                else index++;
              }
              state.updateURL();
            },
            get: function get(name) {
              validateArgumentsLength(arguments.length, 1);
              var entries = getInternalParamsState(this).entries;
              var key = name + '';
              var index = 0;
              for (; index < entries.length; index++) {
                if (entries[index].key === key) return entries[index].value;
              }
              return null;
            },
            getAll: function getAll(name) {
              validateArgumentsLength(arguments.length, 1);
              var entries = getInternalParamsState(this).entries;
              var key = name + '';
              var result = [];
              var index = 0;
              for (; index < entries.length; index++) {
                if (entries[index].key === key)
                  result.push(entries[index].value);
              }
              return result;
            },
            has: function has(name) {
              validateArgumentsLength(arguments.length, 1);
              var entries = getInternalParamsState(this).entries;
              var key = name + '';
              var index = 0;
              while (index < entries.length) {
                if (entries[index++].key === key) return true;
              }
              return false;
            },
            set: function set(name, value) {
              validateArgumentsLength(arguments.length, 1);
              var state = getInternalParamsState(this);
              var entries = state.entries;
              var found = false;
              var key = name + '';
              var val = value + '';
              var index = 0;
              var entry;
              for (; index < entries.length; index++) {
                entry = entries[index];
                if (entry.key === key) {
                  if (found) entries.splice(index--, 1);
                  else {
                    found = true;
                    entry.value = val;
                  }
                }
              }
              if (!found) entries.push({ key: key, value: val });
              state.updateURL();
            },
            sort: function sort() {
              var state = getInternalParamsState(this);
              var entries = state.entries;
              var slice = entries.slice();
              var entry, entriesIndex, sliceIndex;
              entries.length = 0;
              for (sliceIndex = 0; sliceIndex < slice.length; sliceIndex++) {
                entry = slice[sliceIndex];
                for (
                  entriesIndex = 0;
                  entriesIndex < sliceIndex;
                  entriesIndex++
                ) {
                  if (entries[entriesIndex].key > entry.key) {
                    entries.splice(entriesIndex, 0, entry);
                    break;
                  }
                }
                if (entriesIndex === sliceIndex) entries.push(entry);
              }
              state.updateURL();
            },
            forEach: function forEach(callback) {
              var entries = getInternalParamsState(this).entries;
              var boundFunction = bind(
                callback,
                arguments.length > 1 ? arguments[1] : undefined,
                3
              );
              var index = 0;
              var entry;
              while (index < entries.length) {
                entry = entries[index++];
                boundFunction(entry.value, entry.key, this);
              }
            },
            keys: function keys() {
              return new URLSearchParamsIterator(this, 'keys');
            },
            values: function values() {
              return new URLSearchParamsIterator(this, 'values');
            },
            entries: function entries() {
              return new URLSearchParamsIterator(this, 'entries');
            },
          },
          { enumerable: true }
        );

        redefine(
          URLSearchParamsPrototype,
          ITERATOR,
          URLSearchParamsPrototype.entries
        );

        redefine(
          URLSearchParamsPrototype,
          'toString',
          function toString() {
            var entries = getInternalParamsState(this).entries;
            var result = [];
            var index = 0;
            var entry;
            while (index < entries.length) {
              entry = entries[index++];
              result.push(serialize(entry.key) + '=' + serialize(entry.value));
            }
            return result.join('&');
          },
          { enumerable: true }
        );

        setToStringTag(URLSearchParamsConstructor, URL_SEARCH_PARAMS);

        $(
          { global: true, forced: !USE_NATIVE_URL },
          {
            URLSearchParams: URLSearchParamsConstructor,
          }
        );

        if (
          !USE_NATIVE_URL &&
          typeof $fetch == 'function' &&
          typeof Headers == 'function'
        ) {
          $(
            { global: true, enumerable: true, forced: true },
            {
              fetch: function fetch(input /* , init */) {
                var args = [input];
                var init, body, headers;
                if (arguments.length > 1) {
                  init = arguments[1];
                  if (isObject(init)) {
                    body = init.body;
                    if (classof(body) === URL_SEARCH_PARAMS) {
                      headers = init.headers
                        ? new Headers(init.headers)
                        : new Headers();
                      if (!headers.has('content-type')) {
                        headers.set(
                          'content-type',
                          'application/x-www-form-urlencoded;charset=UTF-8'
                        );
                      }
                      init = create(init, {
                        body: createPropertyDescriptor(0, String(body)),
                        headers: createPropertyDescriptor(0, headers),
                      });
                    }
                  }
                  args.push(init);
                }
                return $fetch.apply(this, args);
              },
            }
          );
        }

        module.exports = {
          URLSearchParams: URLSearchParamsConstructor,
          getState: getInternalParamsState,
        };
      },
      {
        '../modules/es.array.iterator': '510aceb4694d90a939f4789a99a0ae3f',
        '../internals/export': '10044f24ecae4059b4af184e71d3fba2',
        '../internals/get-built-in': 'a8e7e15d3af5a0a555019aebcf7ed164',
        '../internals/native-url': '5e5f16f67bd2b706d5eb103748915db5',
        '../internals/redefine': 'b8f156ba0e16ecf7371c0d9dbd0a7d60',
        '../internals/redefine-all': 'ffd35f1bc6f8a9cf26e6fa0389f4748d',
        '../internals/set-to-string-tag': 'b474145c0d35c2cab8be2f2358364fc4',
        '../internals/create-iterator-constructor':
          'b9bab68ecd62fef0c0fd01853566a2cf',
        '../internals/internal-state': '8b9f5ed7c6f8b05b4cd6ee1eefa801c1',
        '../internals/an-instance': '8b0daff12bd798defdb69ae41eea7f5e',
        '../internals/has': 'ce850695ec64cefd211ef6863461b802',
        '../internals/function-bind-context':
          'f9e6dc73b4a152f549e8299150ac260e',
        '../internals/classof': 'be2998c5b4d0f20a1cc5fe6807661aae',
        '../internals/an-object': '4f20fc1a2160760f9e7961d272520cbd',
        '../internals/is-object': '03244e745134af366d66b74456891052',
        '../internals/object-create': 'a92b509fc5fd0223c7351fe6c6b27164',
        '../internals/create-property-descriptor':
          '8c5551ce5a79ddcd7162c3e3c8f33c9a',
        '../internals/get-iterator': '95609b3cd4fe60efb5286ed1595b57b7',
        '../internals/get-iterator-method': 'ee70e79559122fe97016e526e216278d',
        '../internals/well-known-symbol': 'df9ad61e8404f948b528f2ef2becebe4',
      },
    ],
    '510aceb4694d90a939f4789a99a0ae3f': [
      function (require, module, exports) {
        'use strict';
        var toIndexedObject = require('../internals/to-indexed-object');
        var addToUnscopables = require('../internals/add-to-unscopables');
        var Iterators = require('../internals/iterators');
        var InternalStateModule = require('../internals/internal-state');
        var defineIterator = require('../internals/define-iterator');

        var ARRAY_ITERATOR = 'Array Iterator';
        var setInternalState = InternalStateModule.set;
        var getInternalState = InternalStateModule.getterFor(ARRAY_ITERATOR);

        module.exports = defineIterator(
          Array,
          'Array',
          function (iterated, kind) {
            setInternalState(this, {
              type: ARRAY_ITERATOR,
              target: toIndexedObject(iterated),
              index: 0,
              kind: kind,
            });
          },
          function () {
            var state = getInternalState(this);
            var target = state.target;
            var kind = state.kind;
            var index = state.index++;
            if (!target || index >= target.length) {
              state.target = undefined;
              return { value: undefined, done: true };
            }
            if (kind == 'keys') return { value: index, done: false };
            if (kind == 'values') return { value: target[index], done: false };
            return { value: [index, target[index]], done: false };
          },
          'values'
        );

        Iterators.Arguments = Iterators.Array;

        addToUnscopables('keys');
        addToUnscopables('values');
        addToUnscopables('entries');
      },
      {
        '../internals/to-indexed-object': 'debf68affb1e9f1283fa252d49c32ceb',
        '../internals/add-to-unscopables': '885b707d011829ca5d38f6b6f8a535df',
        '../internals/iterators': 'c5db2384d76eea25f1bdcd506ac55cef',
        '../internals/internal-state': '8b9f5ed7c6f8b05b4cd6ee1eefa801c1',
        '../internals/define-iterator': '89cab28f14b0323e9b7f5add1d23fc79',
      },
    ],
    '885b707d011829ca5d38f6b6f8a535df': [
      function (require, module, exports) {
        var wellKnownSymbol = require('../internals/well-known-symbol');
        var create = require('../internals/object-create');
        var definePropertyModule = require('../internals/object-define-property');

        var UNSCOPABLES = wellKnownSymbol('unscopables');
        var ArrayPrototype = Array.prototype;

        if (ArrayPrototype[UNSCOPABLES] == undefined) {
          definePropertyModule.f(ArrayPrototype, UNSCOPABLES, {
            configurable: true,
            value: create(null),
          });
        }

        module.exports = function (key) {
          ArrayPrototype[UNSCOPABLES][key] = true;
        };
      },
      {
        '../internals/well-known-symbol': 'df9ad61e8404f948b528f2ef2becebe4',
        '../internals/object-create': 'a92b509fc5fd0223c7351fe6c6b27164',
        '../internals/object-define-property':
          '645ef963c1e312a12b44589911036a7f',
      },
    ],
    '95609b3cd4fe60efb5286ed1595b57b7': [
      function (require, module, exports) {
        var anObject = require('../internals/an-object');
        var getIteratorMethod = require('../internals/get-iterator-method');

        module.exports = function (it) {
          var iteratorMethod = getIteratorMethod(it);
          if (typeof iteratorMethod != 'function') {
            throw TypeError(String(it) + ' is not iterable');
          }
          return anObject(iteratorMethod.call(it));
        };
      },
      {
        '../internals/an-object': '4f20fc1a2160760f9e7961d272520cbd',
        '../internals/get-iterator-method': 'ee70e79559122fe97016e526e216278d',
      },
    ],
    '6357c5a053a36e38c0e24243e550dd86': [
      function (require, module, exports) {
        'use strict';
        var $ = require('../internals/export');

        $(
          { target: 'URL', proto: true, enumerable: true },
          {
            toJSON: function toJSON() {
              return URL.prototype.toString.call(this);
            },
          }
        );
      },
      { '../internals/export': '10044f24ecae4059b4af184e71d3fba2' },
    ],
    e155e0d3930b156f86c48e8d05522b16: [
      function (require, module, exports) {
        var runtime = (function (exports) {
          'use strict';

          var Op = Object.prototype;
          var hasOwn = Op.hasOwnProperty;
          var undefined;
          var $Symbol = typeof Symbol === 'function' ? Symbol : {};
          var iteratorSymbol = $Symbol.iterator || '@@iterator';
          var asyncIteratorSymbol = $Symbol.asyncIterator || '@@asyncIterator';
          var toStringTagSymbol = $Symbol.toStringTag || '@@toStringTag';

          function define(obj, key, value) {
            Object.defineProperty(obj, key, {
              value: value,
              enumerable: true,
              configurable: true,
              writable: true,
            });
            return obj[key];
          }
          try {
            define({}, '');
          } catch (err) {
            define = function (obj, key, value) {
              return (obj[key] = value);
            };
          }

          function wrap(innerFn, outerFn, self, tryLocsList) {
            var protoGenerator =
              outerFn && outerFn.prototype instanceof Generator
                ? outerFn
                : Generator;
            var generator = Object.create(protoGenerator.prototype);
            var context = new Context(tryLocsList || []);

            generator._invoke = makeInvokeMethod(innerFn, self, context);

            return generator;
          }
          exports.wrap = wrap;

          function tryCatch(fn, obj, arg) {
            try {
              return { type: 'normal', arg: fn.call(obj, arg) };
            } catch (err) {
              return { type: 'throw', arg: err };
            }
          }

          var GenStateSuspendedStart = 'suspendedStart';
          var GenStateSuspendedYield = 'suspendedYield';
          var GenStateExecuting = 'executing';
          var GenStateCompleted = 'completed';

          var ContinueSentinel = {};

          function Generator() {}
          function GeneratorFunction() {}
          function GeneratorFunctionPrototype() {}

          var IteratorPrototype = {};
          IteratorPrototype[iteratorSymbol] = function () {
            return this;
          };

          var getProto = Object.getPrototypeOf;
          var NativeIteratorPrototype =
            getProto && getProto(getProto(values([])));
          if (
            NativeIteratorPrototype &&
            NativeIteratorPrototype !== Op &&
            hasOwn.call(NativeIteratorPrototype, iteratorSymbol)
          ) {
            IteratorPrototype = NativeIteratorPrototype;
          }

          var Gp =
            (GeneratorFunctionPrototype.prototype =
            Generator.prototype =
              Object.create(IteratorPrototype));
          GeneratorFunction.prototype = Gp.constructor =
            GeneratorFunctionPrototype;
          GeneratorFunctionPrototype.constructor = GeneratorFunction;
          GeneratorFunction.displayName = define(
            GeneratorFunctionPrototype,
            toStringTagSymbol,
            'GeneratorFunction'
          );

          function defineIteratorMethods(prototype) {
            ['next', 'throw', 'return'].forEach(function (method) {
              define(prototype, method, function (arg) {
                return this._invoke(method, arg);
              });
            });
          }

          exports.isGeneratorFunction = function (genFun) {
            var ctor = typeof genFun === 'function' && genFun.constructor;
            return ctor
              ? ctor === GeneratorFunction ||
                  (ctor.displayName || ctor.name) === 'GeneratorFunction'
              : false;
          };

          exports.mark = function (genFun) {
            if (Object.setPrototypeOf) {
              Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
            } else {
              genFun.__proto__ = GeneratorFunctionPrototype;
              define(genFun, toStringTagSymbol, 'GeneratorFunction');
            }
            genFun.prototype = Object.create(Gp);
            return genFun;
          };

          exports.awrap = function (arg) {
            return { __await: arg };
          };

          function AsyncIterator(generator, PromiseImpl) {
            function invoke(method, arg, resolve, reject) {
              var record = tryCatch(generator[method], generator, arg);
              if (record.type === 'throw') {
                reject(record.arg);
              } else {
                var result = record.arg;
                var value = result.value;
                if (
                  value &&
                  typeof value === 'object' &&
                  hasOwn.call(value, '__await')
                ) {
                  return PromiseImpl.resolve(value.__await).then(
                    function (value) {
                      invoke('next', value, resolve, reject);
                    },
                    function (err) {
                      invoke('throw', err, resolve, reject);
                    }
                  );
                }

                return PromiseImpl.resolve(value).then(
                  function (unwrapped) {
                    result.value = unwrapped;
                    resolve(result);
                  },
                  function (error) {
                    return invoke('throw', error, resolve, reject);
                  }
                );
              }
            }

            var previousPromise;

            function enqueue(method, arg) {
              function callInvokeWithMethodAndArg() {
                return new PromiseImpl(function (resolve, reject) {
                  invoke(method, arg, resolve, reject);
                });
              }

              return (previousPromise = previousPromise
                ? previousPromise.then(
                    callInvokeWithMethodAndArg,
                    callInvokeWithMethodAndArg
                  )
                : callInvokeWithMethodAndArg());
            }

            this._invoke = enqueue;
          }

          defineIteratorMethods(AsyncIterator.prototype);
          AsyncIterator.prototype[asyncIteratorSymbol] = function () {
            return this;
          };
          exports.AsyncIterator = AsyncIterator;

          exports.async = function (
            innerFn,
            outerFn,
            self,
            tryLocsList,
            PromiseImpl
          ) {
            if (PromiseImpl === void 0) PromiseImpl = Promise;

            var iter = new AsyncIterator(
              wrap(innerFn, outerFn, self, tryLocsList),
              PromiseImpl
            );

            return exports.isGeneratorFunction(outerFn)
              ? iter
              : iter.next().then(function (result) {
                  return result.done ? result.value : iter.next();
                });
          };

          function makeInvokeMethod(innerFn, self, context) {
            var state = GenStateSuspendedStart;

            return function invoke(method, arg) {
              if (state === GenStateExecuting) {
                throw new Error('Generator is already running');
              }

              if (state === GenStateCompleted) {
                if (method === 'throw') {
                  throw arg;
                }

                return doneResult();
              }

              context.method = method;
              context.arg = arg;

              while (true) {
                var delegate = context.delegate;
                if (delegate) {
                  var delegateResult = maybeInvokeDelegate(delegate, context);
                  if (delegateResult) {
                    if (delegateResult === ContinueSentinel) continue;
                    return delegateResult;
                  }
                }

                if (context.method === 'next') {
                  context.sent = context._sent = context.arg;
                } else if (context.method === 'throw') {
                  if (state === GenStateSuspendedStart) {
                    state = GenStateCompleted;
                    throw context.arg;
                  }

                  context.dispatchException(context.arg);
                } else if (context.method === 'return') {
                  context.abrupt('return', context.arg);
                }

                state = GenStateExecuting;

                var record = tryCatch(innerFn, self, context);
                if (record.type === 'normal') {
                  state = context.done
                    ? GenStateCompleted
                    : GenStateSuspendedYield;

                  if (record.arg === ContinueSentinel) {
                    continue;
                  }

                  return {
                    value: record.arg,
                    done: context.done,
                  };
                } else if (record.type === 'throw') {
                  state = GenStateCompleted;
                  context.method = 'throw';
                  context.arg = record.arg;
                }
              }
            };
          }

          function maybeInvokeDelegate(delegate, context) {
            var method = delegate.iterator[context.method];
            if (method === undefined) {
              context.delegate = null;

              if (context.method === 'throw') {
                if (delegate.iterator['return']) {
                  context.method = 'return';
                  context.arg = undefined;
                  maybeInvokeDelegate(delegate, context);

                  if (context.method === 'throw') {
                    return ContinueSentinel;
                  }
                }

                context.method = 'throw';
                context.arg = new TypeError(
                  "The iterator does not provide a 'throw' method"
                );
              }

              return ContinueSentinel;
            }

            var record = tryCatch(method, delegate.iterator, context.arg);

            if (record.type === 'throw') {
              context.method = 'throw';
              context.arg = record.arg;
              context.delegate = null;
              return ContinueSentinel;
            }

            var info = record.arg;

            if (!info) {
              context.method = 'throw';
              context.arg = new TypeError('iterator result is not an object');
              context.delegate = null;
              return ContinueSentinel;
            }

            if (info.done) {
              context[delegate.resultName] = info.value;

              context.next = delegate.nextLoc;

              if (context.method !== 'return') {
                context.method = 'next';
                context.arg = undefined;
              }
            } else {
              return info;
            }

            context.delegate = null;
            return ContinueSentinel;
          }

          defineIteratorMethods(Gp);

          define(Gp, toStringTagSymbol, 'Generator');

          Gp[iteratorSymbol] = function () {
            return this;
          };

          Gp.toString = function () {
            return '[object Generator]';
          };

          function pushTryEntry(locs) {
            var entry = { tryLoc: locs[0] };

            if (1 in locs) {
              entry.catchLoc = locs[1];
            }

            if (2 in locs) {
              entry.finallyLoc = locs[2];
              entry.afterLoc = locs[3];
            }

            this.tryEntries.push(entry);
          }

          function resetTryEntry(entry) {
            var record = entry.completion || {};
            record.type = 'normal';
            delete record.arg;
            entry.completion = record;
          }

          function Context(tryLocsList) {
            this.tryEntries = [{ tryLoc: 'root' }];
            tryLocsList.forEach(pushTryEntry, this);
            this.reset(true);
          }

          exports.keys = function (object) {
            var keys = [];
            for (var key in object) {
              keys.push(key);
            }
            keys.reverse();

            return function next() {
              while (keys.length) {
                var key = keys.pop();
                if (key in object) {
                  next.value = key;
                  next.done = false;
                  return next;
                }
              }

              next.done = true;
              return next;
            };
          };

          function values(iterable) {
            if (iterable) {
              var iteratorMethod = iterable[iteratorSymbol];
              if (iteratorMethod) {
                return iteratorMethod.call(iterable);
              }

              if (typeof iterable.next === 'function') {
                return iterable;
              }

              if (!isNaN(iterable.length)) {
                var i = -1,
                  next = function next() {
                    while (++i < iterable.length) {
                      if (hasOwn.call(iterable, i)) {
                        next.value = iterable[i];
                        next.done = false;
                        return next;
                      }
                    }

                    next.value = undefined;
                    next.done = true;

                    return next;
                  };

                return (next.next = next);
              }
            }

            return { next: doneResult };
          }
          exports.values = values;

          function doneResult() {
            return { value: undefined, done: true };
          }

          Context.prototype = {
            constructor: Context,

            reset: function (skipTempReset) {
              this.prev = 0;
              this.next = 0;
              this.sent = this._sent = undefined;
              this.done = false;
              this.delegate = null;

              this.method = 'next';
              this.arg = undefined;

              this.tryEntries.forEach(resetTryEntry);

              if (!skipTempReset) {
                for (var name in this) {
                  if (
                    name.charAt(0) === 't' &&
                    hasOwn.call(this, name) &&
                    !isNaN(+name.slice(1))
                  ) {
                    this[name] = undefined;
                  }
                }
              }
            },

            stop: function () {
              this.done = true;

              var rootEntry = this.tryEntries[0];
              var rootRecord = rootEntry.completion;
              if (rootRecord.type === 'throw') {
                throw rootRecord.arg;
              }

              return this.rval;
            },

            dispatchException: function (exception) {
              if (this.done) {
                throw exception;
              }

              var context = this;
              function handle(loc, caught) {
                record.type = 'throw';
                record.arg = exception;
                context.next = loc;

                if (caught) {
                  context.method = 'next';
                  context.arg = undefined;
                }

                return !!caught;
              }

              for (var i = this.tryEntries.length - 1; i >= 0; --i) {
                var entry = this.tryEntries[i];
                var record = entry.completion;

                if (entry.tryLoc === 'root') {
                  return handle('end');
                }

                if (entry.tryLoc <= this.prev) {
                  var hasCatch = hasOwn.call(entry, 'catchLoc');
                  var hasFinally = hasOwn.call(entry, 'finallyLoc');

                  if (hasCatch && hasFinally) {
                    if (this.prev < entry.catchLoc) {
                      return handle(entry.catchLoc, true);
                    } else if (this.prev < entry.finallyLoc) {
                      return handle(entry.finallyLoc);
                    }
                  } else if (hasCatch) {
                    if (this.prev < entry.catchLoc) {
                      return handle(entry.catchLoc, true);
                    }
                  } else if (hasFinally) {
                    if (this.prev < entry.finallyLoc) {
                      return handle(entry.finallyLoc);
                    }
                  } else {
                    throw new Error('try statement without catch or finally');
                  }
                }
              }
            },

            abrupt: function (type, arg) {
              for (var i = this.tryEntries.length - 1; i >= 0; --i) {
                var entry = this.tryEntries[i];
                if (
                  entry.tryLoc <= this.prev &&
                  hasOwn.call(entry, 'finallyLoc') &&
                  this.prev < entry.finallyLoc
                ) {
                  var finallyEntry = entry;
                  break;
                }
              }

              if (
                finallyEntry &&
                (type === 'break' || type === 'continue') &&
                finallyEntry.tryLoc <= arg &&
                arg <= finallyEntry.finallyLoc
              ) {
                finallyEntry = null;
              }

              var record = finallyEntry ? finallyEntry.completion : {};
              record.type = type;
              record.arg = arg;

              if (finallyEntry) {
                this.method = 'next';
                this.next = finallyEntry.finallyLoc;
                return ContinueSentinel;
              }

              return this.complete(record);
            },

            complete: function (record, afterLoc) {
              if (record.type === 'throw') {
                throw record.arg;
              }

              if (record.type === 'break' || record.type === 'continue') {
                this.next = record.arg;
              } else if (record.type === 'return') {
                this.rval = this.arg = record.arg;
                this.method = 'return';
                this.next = 'end';
              } else if (record.type === 'normal' && afterLoc) {
                this.next = afterLoc;
              }

              return ContinueSentinel;
            },

            finish: function (finallyLoc) {
              for (var i = this.tryEntries.length - 1; i >= 0; --i) {
                var entry = this.tryEntries[i];
                if (entry.finallyLoc === finallyLoc) {
                  this.complete(entry.completion, entry.afterLoc);
                  resetTryEntry(entry);
                  return ContinueSentinel;
                }
              }
            },

            catch: function (tryLoc) {
              for (var i = this.tryEntries.length - 1; i >= 0; --i) {
                var entry = this.tryEntries[i];
                if (entry.tryLoc === tryLoc) {
                  var record = entry.completion;
                  if (record.type === 'throw') {
                    var thrown = record.arg;
                    resetTryEntry(entry);
                  }
                  return thrown;
                }
              }

              throw new Error('illegal catch attempt');
            },

            delegateYield: function (iterable, resultName, nextLoc) {
              this.delegate = {
                iterator: values(iterable),
                resultName: resultName,
                nextLoc: nextLoc,
              };

              if (this.method === 'next') {
                this.arg = undefined;
              }

              return ContinueSentinel;
            },
          };

          return exports;
        })(typeof module === 'object' ? module.exports : {});

        try {
          regeneratorRuntime = runtime;
        } catch (accidentalStrictMode) {
          Function('r', 'regeneratorRuntime = r')(runtime);
        }
      },
      {},
    ],
  },
  {},
  ['555af8aa4be313c9f17dbaa9955757d8', '175e469a7ea7db1c8c0744d04372621f'],
  null
);
