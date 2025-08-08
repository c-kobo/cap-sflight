"use strict";

sap.ui.define(["./library", "./summary/types"], function (___library, ___summary_types) {
  "use strict";

  var __exports = {
    __esModule: true
  };
  __exports.summarize = ___library.summarize;
  function extendExports(exports, obj) {
    obj && Object.keys(obj).forEach(function (key) {
      if (key === "default" || key === "__esModule") return;
      Object.defineProperty(exports, key, {
        enumerable: true,
        get: function get() {
          return obj[key];
        }
      });
    });
  }
  extendExports(__exports, ___summary_types);
  return __exports;
});
//# sourceMappingURL=index-dbg-dbg.js.map
