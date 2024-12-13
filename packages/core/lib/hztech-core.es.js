var __defProp = Object.defineProperty;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
const INSTALLED_KEY = Symbol("INSTALLED_KEY");
const makeInstaller = (components = []) => {
  const install = (app, options) => {
    if (app[INSTALLED_KEY])
      return;
    app[INSTALLED_KEY] = true;
    components.forEach((c) => app.use(c));
  };
  return {
    version: "0.1.0",
    install
  };
};
const makePluginInstaller = (install) => ({
  install
});
var Components = [];
function isEmpty$1(value) {
  return value === null || value.trim() === "";
}
function isNotEmpty$1(value) {
  return value !== null && value.trim() !== "";
}
function replace$1(value, data2) {
  return value.replace(/\${([^}]+)}/g, function(match, char, index) {
    if (char in (data2 || {})) {
      return data2[char];
    } else {
      return match;
    }
  });
}
var StringExtend = makePluginInstaller(() => {
  String.replace = replace$1;
  String.isEmpty = isEmpty$1;
  String.isNotEmpty = isNotEmpty$1;
});
function isNullOrZero(value) {
  return isNaN(Number(value)) || Number(value) === 0;
}
function isNotNullOrZero(value) {
  return !isNaN(Number(value)) && Number(value) !== 0;
}
var NumberExtend = makePluginInstaller(() => {
  Number.isNullOrZero = isNullOrZero;
  Number.isNotNullOrZero = isNotNullOrZero;
});
var commonjsGlobal = typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};
function getAugmentedNamespace(n) {
  if (n.__esModule)
    return n;
  var a = Object.defineProperty({}, "__esModule", { value: true });
  Object.keys(n).forEach(function(k) {
    var d = Object.getOwnPropertyDescriptor(n, k);
    Object.defineProperty(a, k, d.get ? d : {
      enumerable: true,
      get: function() {
        return n[k];
      }
    });
  });
  return a;
}
var download = { exports: {} };
(function(module, exports) {
  (function(root, factory) {
    {
      module.exports = factory();
    }
  })(commonjsGlobal, function() {
    return function download2(data2, strFileName, strMimeType) {
      var self2 = window, defaultMime = "application/octet-stream", mimeType = strMimeType || defaultMime, payload = data2, url = !strFileName && !strMimeType && payload, anchor = document.createElement("a"), toString2 = function(a) {
        return String(a);
      }, myBlob = self2.Blob || self2.MozBlob || self2.WebKitBlob || toString2, fileName = strFileName || "download", blob, reader;
      myBlob = myBlob.call ? myBlob.bind(self2) : Blob;
      if (String(this) === "true") {
        payload = [payload, mimeType];
        mimeType = payload[0];
        payload = payload[1];
      }
      if (url && url.length < 2048) {
        fileName = url.split("/").pop().split("?")[0];
        anchor.href = url;
        if (anchor.href.indexOf(url) !== -1) {
          var ajax = new XMLHttpRequest();
          ajax.open("GET", url, true);
          ajax.responseType = "blob";
          ajax.onload = function(e) {
            download2(e.target.response, fileName, defaultMime);
          };
          setTimeout(function() {
            ajax.send();
          }, 0);
          return ajax;
        }
      }
      if (/^data:([\w+-]+\/[\w+.-]+)?[,;]/.test(payload)) {
        if (payload.length > 1024 * 1024 * 1.999 && myBlob !== toString2) {
          payload = dataUrlToBlob2(payload);
          mimeType = payload.type || defaultMime;
        } else {
          return navigator.msSaveBlob ? navigator.msSaveBlob(dataUrlToBlob2(payload), fileName) : saver(payload);
        }
      } else {
        if (/([\x80-\xff])/.test(payload)) {
          var i = 0, tempUiArr = new Uint8Array(payload.length), mx = tempUiArr.length;
          for (i; i < mx; ++i)
            tempUiArr[i] = payload.charCodeAt(i);
          payload = new myBlob([tempUiArr], { type: mimeType });
        }
      }
      blob = payload instanceof myBlob ? payload : new myBlob([payload], { type: mimeType });
      function dataUrlToBlob2(strUrl) {
        var parts = strUrl.split(/[:;,]/), type = parts[1], decoder = parts[2] == "base64" ? atob : decodeURIComponent, binData = decoder(parts.pop()), mx2 = binData.length, i2 = 0, uiArr = new Uint8Array(mx2);
        for (i2; i2 < mx2; ++i2)
          uiArr[i2] = binData.charCodeAt(i2);
        return new myBlob([uiArr], { type });
      }
      function saver(url2, winMode) {
        if ("download" in anchor) {
          anchor.href = url2;
          anchor.setAttribute("download", fileName);
          anchor.className = "download-js-link";
          anchor.innerHTML = "downloading...";
          anchor.style.display = "none";
          document.body.appendChild(anchor);
          setTimeout(function() {
            anchor.click();
            document.body.removeChild(anchor);
            if (winMode === true) {
              setTimeout(function() {
                self2.URL.revokeObjectURL(anchor.href);
              }, 250);
            }
          }, 66);
          return true;
        }
        if (/(Version)\/(\d+)\.(\d+)(?:\.(\d+))?.*Safari\//.test(navigator.userAgent)) {
          if (/^data:/.test(url2))
            url2 = "data:" + url2.replace(/^data:([\w\/\-\+]+)/, defaultMime);
          if (!window.open(url2)) {
            if (confirm("Displaying New Document\n\nUse Save As... to download, then click back to return to this page.")) {
              location.href = url2;
            }
          }
          return true;
        }
        var f = document.createElement("iframe");
        document.body.appendChild(f);
        if (!winMode && /^data:/.test(url2)) {
          url2 = "data:" + url2.replace(/^data:([\w\/\-\+]+)/, defaultMime);
        }
        f.src = url2;
        setTimeout(function() {
          document.body.removeChild(f);
        }, 333);
      }
      if (navigator.msSaveBlob) {
        return navigator.msSaveBlob(blob, fileName);
      }
      if (self2.URL) {
        saver(self2.URL.createObjectURL(blob), true);
      } else {
        if (typeof blob === "string" || blob.constructor === toString2) {
          try {
            return saver("data:" + mimeType + ";base64," + self2.btoa(blob));
          } catch (y) {
            return saver("data:" + mimeType + "," + encodeURIComponent(blob));
          }
        }
        reader = new FileReader();
        reader.onload = function(e) {
          saver(this.result);
        };
        reader.readAsDataURL(blob);
      }
      return true;
    };
  });
})(download);
var DownloadUtil = download.exports;
function definePrototype(target, prop, callback) {
  target.prototype[prop] = function() {
    return callback(this, ...arguments);
  };
}
function defineGetter(target, prop, getter, setter) {
  Object.defineProperty(target, prop, {
    get: getter,
    set: setter,
    writable: false,
    enumerable: false,
    configurable: false
  });
}
function defineReadOnly(target, prop, value) {
  Object.defineProperty(target, prop, {
    value,
    writable: false,
    enumerable: false,
    configurable: false
  });
}
function debounce(func, wait, options) {
  let lastArgs, lastThis, maxWait, result, timerId, lastCallTime;
  let lastInvokeTime = 0;
  let leading = false;
  let maxing = false;
  let trailing = true;
  if (typeof func !== "function") {
    throw new TypeError("Expected a function");
  }
  wait = +wait || 0;
  if (Object.prototype.toString.call(options) === "[object Object]") {
    leading = !!options.leading;
    maxing = "maxWait" in options;
    maxWait = maxing ? Math.max(+options.maxWait || 0, wait) : maxWait;
    trailing = "trailing" in options ? !!options.trailing : trailing;
  }
  function invokeFunc(time) {
    const args = lastArgs;
    const thisArg = lastThis;
    lastArgs = lastThis = void 0;
    lastInvokeTime = time;
    result = func.apply(thisArg, args);
    return result;
  }
  function remainingWait(time) {
    const timeSinceLastCall = time - lastCallTime;
    const timeSinceLastInvoke = time - lastInvokeTime;
    const timeWaiting = wait - timeSinceLastCall;
    return maxing ? Math.min(timeWaiting, maxWait - timeSinceLastInvoke) : timeWaiting;
  }
  function shouldInvoke(time) {
    const timeSinceLastCall = time - lastCallTime;
    const timeSinceLastInvoke = time - lastInvokeTime;
    return lastCallTime === void 0 || timeSinceLastCall >= wait || timeSinceLastCall < 0 || maxing && timeSinceLastInvoke >= maxWait;
  }
  function timerExpired() {
    const time = Date.now();
    if (shouldInvoke(time)) {
      return trailingEdge(time);
    }
    timerId = setTimeout(timerExpired, remainingWait(time));
  }
  function trailingEdge(time) {
    timerId = void 0;
    if (trailing && lastArgs) {
      return invokeFunc(time);
    }
    lastArgs = lastThis = void 0;
    return result;
  }
  function debounced(...args) {
    const time = Date.now();
    const isInvoking = shouldInvoke(time);
    lastArgs = args;
    lastThis = this;
    lastCallTime = time;
    if (isInvoking) {
      if (timerId === void 0) {
        lastInvokeTime = lastCallTime;
        timerId = setTimeout(timerExpired, wait);
        return leading ? invokeFunc(lastCallTime) : result;
      }
      if (maxing) {
        timerId = setTimeout(timerExpired, wait);
        return invokeFunc(lastCallTime);
      }
    }
    if (timerId === void 0) {
      timerId = setTimeout(timerExpired, wait);
    }
    return result;
  }
  debounced.cancel = (id) => {
    clearTimeout(id);
  };
  debounced.flush = () => {
    timerId === void 0 ? result : trailingEdge(Date.now());
  };
  debounced.pending = timerId !== void 0;
  return debounced;
}
function toPlanChains(plans) {
  const context = [];
  const setNextPlan = (prePlan, nextPlan) => {
    return async function(...args) {
      const preResult = await prePlan.call(this, ...args);
      if (preResult !== context)
        context.push(preResult);
      const nextResult = await nextPlan.call(this, ...args);
      if (nextResult !== context)
        context.push(nextResult);
      return context;
    };
  };
  return plans.length > 0 ? plans.reduce(setNextPlan) : () => Promise.resolve(context);
}
function clone(source2, target) {
  const sourceType = Object.prototype.toString.call(source2);
  if (sourceType === "[object Array]") {
    source2.reduce((result, value) => {
      result.push(clone(value));
      return result;
    }, target || (target = []));
  } else if (sourceType === "[object Object]") {
    Object.keys(source2).reduce((result, key) => {
      result[key] = clone(source2[key]);
      return result;
    }, target || (target = {}));
  } else {
    target = source2;
  }
  return target;
}
class Path {
  static toObject(search) {
    const pos = search.indexOf("?");
    if (pos > -1)
      search = search.substring(pos + 1);
    return search.split("&").reduce((result, item) => {
      const [key, value] = item.split("=");
      if (key) {
        result[key] = value;
      }
      return result;
    }, {});
  }
  static toSearch(object) {
    const searchArr = Object.keys(object).reduce((result, key) => {
      result.push(`${key}=${object[key]}`);
      return result;
    }, []);
    return searchArr.join("&");
  }
  static getString(url) {
    const a = document.createElement("a");
    a.href = url;
    return a.search;
  }
  static getSearch(url) {
    const search = Path.getString(url);
    return Path.toObject(search);
  }
  static setSearch(url, data2) {
    const searchObject = Object.assign(Path.getSearch(url), data2);
    const searchString = Path.toSearch(searchObject);
    const a = document.createElement("a");
    a.href = url;
    a.search = searchString;
    return a.href;
  }
  static getSuffix(url) {
    const pos = url.lastIndexOf(".");
    if (pos > -1) {
      return url.substring(pos);
    }
    return null;
  }
}
class Types {
  static parse(arg) {
    return Object.prototype.toString.call(arg);
  }
  static isObject(arg) {
    return this.parse(arg) === "[object Object]";
  }
  static isArray(arg) {
    return this.parse(arg) === "[object Array]";
  }
  static isNumber(arg) {
    return this.parse(arg) === "[object Number]";
  }
  static isString(arg) {
    return this.parse(arg) === "[object String]";
  }
}
__publicField(Types, "Unknown", Symbol("unknown"));
__publicField(Types, "String", Symbol("string"));
__publicField(Types, "Number", Symbol("number"));
__publicField(Types, "Object", Symbol("object"));
__publicField(Types, "Array", Symbol("array"));
function isEmpty(arr) {
  if (Array.isArray(arr)) {
    return arr == null || arr.length === 0;
  }
  return false;
}
function isNotEmpty(arr) {
  return Array.isArray(arr) && arr.length > 0;
}
function unique(arr, field) {
  const apply = (item) => item instanceof Object ? item[field] : item;
  for (let i = 0; i < arr.length; i++) {
    for (let j = i + 1; j < arr.length; ) {
      if (apply(arr[i]) === apply(arr[j])) {
        arr.splice(j, 1);
      } else {
        j++;
      }
    }
  }
}
function remove(arr, selector) {
  if (selector instanceof Function) {
    return arr.filter(selector).reduce((count, item) => {
      return count + remove(arr, item);
    }, 0);
  }
  const pos = arr.indexOf(selector);
  if (pos > -1) {
    return arr.splice(pos, 1).length;
  }
  return 0;
}
var ArrayExtend = makePluginInstaller(() => {
  Array.isEmpty = isEmpty;
  Array.isNotEmpty = isNotEmpty;
  Array.remove = remove;
  definePrototype(Array, "unique", unique);
  definePrototype(Array, "remove", remove);
});
const DateTimeI18n = {
  Week: [
    ["Mon", "Tue", "Wed", "Thur", "Fri", "Sat", "Sun"],
    [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday"
    ],
    ["\u661F\u671F\u4E00", "\u661F\u671F\u4E8C", "\u661F\u671F\u4E09", "\u661F\u671F\u56DB", "\u661F\u671F\u4E94", "\u661F\u671F\u516D", "\u661F\u671F\u65E5"]
  ],
  Month: [
    [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec"
    ],
    [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December"
    ]
  ],
  AP: [
    ["AM", "PM"],
    ["\u4E0A\u5348", "\u4E0B\u5348"]
  ]
};
function toZone(date, zone) {
  if (typeof date === "string")
    date = new Date(date);
  const localTime = date.getTime();
  const localOffset = date.getTimezoneOffset() * 60 * 1e3;
  const gmt = localTime + localOffset;
  return new Date(gmt + zone * 60 * 60 * 1e3);
}
function format(date, format2) {
  if (typeof date === "string")
    date = new Date(date);
  const y = date.getFullYear();
  const m = date.getMonth();
  const d = date.getDate();
  const h = date.getHours();
  const i = date.getMinutes();
  const s = date.getSeconds();
  const w = date.getDay();
  const toReplace = (key, value, maxLength = 0) => {
    if (maxLength > 0) {
      value = String(value).padStart(maxLength, "0");
    }
    format2 = format2.replace(key, String(value));
  };
  toReplace(/yyyy/, y, 4);
  toReplace(/MMMM/, DateTimeI18n.Month[1][m], 2);
  toReplace(/MMM/, DateTimeI18n.Month[0][m], 2);
  toReplace(/MM/, m + 1, 2);
  toReplace(/M/, m + 1);
  toReplace(/dd/, d, 2);
  toReplace(/d/, d);
  toReplace(/HH/, d, 2);
  toReplace(/H/, d, 2);
  toReplace(/hh/, d > 12 ? h - 12 : h, 2);
  toReplace(/h/, d > 12 ? h - 12 : h);
  toReplace(/mm/, i, 2);
  toReplace(/m/, i);
  toReplace(/ss/, s, 2);
  toReplace(/s/, s);
  toReplace(/tt/, DateTimeI18n.AP[1][Number(h > 12)]);
  toReplace(/t/, DateTimeI18n.AP[0][Number(h > 12)]);
  toReplace(/cw/, DateTimeI18n.Week[2][w - 1]);
  toReplace(/www/, DateTimeI18n.Week[1][w - 1]);
  toReplace(/ww/, DateTimeI18n.Week[0][w - 1]);
  toReplace(/w/, w);
  return format2;
}
var DateExtend = makePluginInstaller(() => {
  Date.toZone = toZone;
  Date.format = format;
  definePrototype(Date, "toZone", toZone);
  definePrototype(Date, "format", format);
});
function uuid(separator = "-") {
  const S4 = () => ((1 + Math.random()) * 65536 | 0).toString(16).substring(1);
  const uuid2 = [S4() + S4(), S4(), S4(), S4(), S4() + S4() + S4()];
  return uuid2.join(separator).toLowerCase();
}
function scopeRandom(lower, upper) {
  return Math.floor(Math.random() * (upper - lower + 1)) + lower;
}
var MathExtend = makePluginInstaller(() => {
  Math.uuid = uuid;
  Math.scopeRandom = scopeRandom;
});
const FileTypes = {
  image: [".jpg", ".jpeg", ".png", ".bmp", ".gif"],
  video: [".mp4"],
  doc: [".doc", ".docx"],
  xls: [".xls", ".xlsx"],
  pdf: [".pdf"]
};
const getSuffix = (path) => {
  var _a;
  return ((_a = Path.getSuffix(path)) == null ? void 0 : _a.toLowerCase()) || "";
};
function isImage(filePath) {
  return FileTypes.image.indexOf(getSuffix(filePath)) > -1;
}
function isVideo(filePath) {
  return FileTypes.video.indexOf(getSuffix(filePath)) > -1;
}
function isWord(filePath) {
  return FileTypes.doc.indexOf(getSuffix(filePath)) > -1;
}
function isExcel(filePath) {
  return FileTypes.xls.indexOf(getSuffix(filePath)) > -1;
}
function isPDF(filePath) {
  return FileTypes.pdf.indexOf(getSuffix(filePath)) > -1;
}
function blobToBaseURL(blob) {
  return new Promise((resolve, reject) => {
    if ("FileReader" in window) {
      let reader = new FileReader();
      reader.onload = function(evt) {
        var _a;
        resolve((_a = evt.target) == null ? void 0 : _a.result);
      };
      reader.readAsDataURL(blob);
    } else {
      reject(new Error("FileReader\u5BF9\u8C61\u4E0D\u5B58\u5728\uFF01"));
    }
  });
}
function dataUrlToArrayBuffer(dataUrl) {
  let dataArray = dataUrl.split(",");
  let mimeString = (dataArray[0].match(/:(.*?);/) || [])[1];
  let byteString = atob(dataArray[1]);
  let byteLength = byteString.length;
  let arrayBuffer = new Uint8Array(byteLength);
  while (byteLength--) {
    arrayBuffer[byteLength] = byteString.charCodeAt(byteLength);
  }
  return { arrayBuffer, mimeString };
}
function dataUrlToBlob(dataUrl) {
  const result = dataUrlToArrayBuffer(dataUrl);
  return new Blob([result.arrayBuffer], { type: result.mimeString });
}
function dataUrlToFile(dataUrl, filename) {
  const result = dataUrlToArrayBuffer(dataUrl);
  return new File([result.arrayBuffer], filename, { type: result.mimeString });
}
var FileExtend = makePluginInstaller(() => {
  File.isImage = isImage;
  File.isVideo = isVideo;
  File.isWord = isWord;
  File.isExcel = isExcel;
  File.isPDF = isPDF;
  File.blobToBaseURL = blobToBaseURL;
  File.dataUrlToBlob = dataUrlToBlob;
  File.dataUrlToFile = dataUrlToFile;
  definePrototype(File, "isImage", (file) => isImage(file.name));
  definePrototype(File, "isVideo", (file) => isVideo(file.name));
  definePrototype(File, "isWord", (file) => isWord(file.name));
  definePrototype(File, "isExcel", (file) => isExcel(file.name));
  definePrototype(File, "isPDF", (file) => isPDF(file.name));
  definePrototype(File, "toBaseURL", (file) => blobToBaseURL(file));
});
var Extend = makePluginInstaller((app) => {
  var _a, _b, _c, _d, _e, _f;
  (_a = StringExtend.install) == null ? void 0 : _a.call(StringExtend, app);
  (_b = NumberExtend.install) == null ? void 0 : _b.call(NumberExtend, app);
  (_c = ArrayExtend.install) == null ? void 0 : _c.call(ArrayExtend, app);
  (_d = DateExtend.install) == null ? void 0 : _d.call(DateExtend, app);
  (_e = MathExtend.install) == null ? void 0 : _e.call(MathExtend, app);
  (_f = FileExtend.install) == null ? void 0 : _f.call(FileExtend, app);
});
var Plugins = [
  Extend
];
var installer = makeInstaller([...Components, ...Plugins]);
var axios$2 = { exports: {} };
var bind$4 = function bind(fn, thisArg) {
  return function wrap() {
    var args = new Array(arguments.length);
    for (var i = 0; i < args.length; i++) {
      args[i] = arguments[i];
    }
    return fn.apply(thisArg, args);
  };
};
var bind$3 = bind$4;
var toString = Object.prototype.toString;
var kindOf = function(cache) {
  return function(thing) {
    var str = toString.call(thing);
    return cache[str] || (cache[str] = str.slice(8, -1).toLowerCase());
  };
}(/* @__PURE__ */ Object.create(null));
function kindOfTest(type) {
  type = type.toLowerCase();
  return function isKindOf(thing) {
    return kindOf(thing) === type;
  };
}
function isArray$4(val) {
  return Array.isArray(val);
}
function isUndefined(val) {
  return typeof val === "undefined";
}
function isBuffer$1(val) {
  return val !== null && !isUndefined(val) && val.constructor !== null && !isUndefined(val.constructor) && typeof val.constructor.isBuffer === "function" && val.constructor.isBuffer(val);
}
var isArrayBuffer = kindOfTest("ArrayBuffer");
function isArrayBufferView(val) {
  var result;
  if (typeof ArrayBuffer !== "undefined" && ArrayBuffer.isView) {
    result = ArrayBuffer.isView(val);
  } else {
    result = val && val.buffer && isArrayBuffer(val.buffer);
  }
  return result;
}
function isString$1(val) {
  return typeof val === "string";
}
function isNumber$1(val) {
  return typeof val === "number";
}
function isObject(val) {
  return val !== null && typeof val === "object";
}
function isPlainObject(val) {
  if (kindOf(val) !== "object") {
    return false;
  }
  var prototype2 = Object.getPrototypeOf(val);
  return prototype2 === null || prototype2 === Object.prototype;
}
var isDate$1 = kindOfTest("Date");
var isFile = kindOfTest("File");
var isBlob = kindOfTest("Blob");
var isFileList = kindOfTest("FileList");
function isFunction(val) {
  return toString.call(val) === "[object Function]";
}
function isStream(val) {
  return isObject(val) && isFunction(val.pipe);
}
function isFormData(thing) {
  var pattern = "[object FormData]";
  return thing && (typeof FormData === "function" && thing instanceof FormData || toString.call(thing) === pattern || isFunction(thing.toString) && thing.toString() === pattern);
}
var isURLSearchParams = kindOfTest("URLSearchParams");
function trim$1(str) {
  return str.trim ? str.trim() : str.replace(/^\s+|\s+$/g, "");
}
function isStandardBrowserEnv() {
  if (typeof navigator !== "undefined" && (navigator.product === "ReactNative" || navigator.product === "NativeScript" || navigator.product === "NS")) {
    return false;
  }
  return typeof window !== "undefined" && typeof document !== "undefined";
}
function forEach(obj, fn) {
  if (obj === null || typeof obj === "undefined") {
    return;
  }
  if (typeof obj !== "object") {
    obj = [obj];
  }
  if (isArray$4(obj)) {
    for (var i = 0, l = obj.length; i < l; i++) {
      fn.call(null, obj[i], i, obj);
    }
  } else {
    for (var key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        fn.call(null, obj[key], key, obj);
      }
    }
  }
}
function merge$1() {
  var result = {};
  function assignValue(val, key) {
    if (isPlainObject(result[key]) && isPlainObject(val)) {
      result[key] = merge$1(result[key], val);
    } else if (isPlainObject(val)) {
      result[key] = merge$1({}, val);
    } else if (isArray$4(val)) {
      result[key] = val.slice();
    } else {
      result[key] = val;
    }
  }
  for (var i = 0, l = arguments.length; i < l; i++) {
    forEach(arguments[i], assignValue);
  }
  return result;
}
function extend$1(a, b, thisArg) {
  forEach(b, function assignValue(val, key) {
    if (thisArg && typeof val === "function") {
      a[key] = bind$3(val, thisArg);
    } else {
      a[key] = val;
    }
  });
  return a;
}
function stripBOM(content) {
  if (content.charCodeAt(0) === 65279) {
    content = content.slice(1);
  }
  return content;
}
function inherits(constructor, superConstructor, props, descriptors2) {
  constructor.prototype = Object.create(superConstructor.prototype, descriptors2);
  constructor.prototype.constructor = constructor;
  props && Object.assign(constructor.prototype, props);
}
function toFlatObject(sourceObj, destObj, filter) {
  var props;
  var i;
  var prop;
  var merged = {};
  destObj = destObj || {};
  do {
    props = Object.getOwnPropertyNames(sourceObj);
    i = props.length;
    while (i-- > 0) {
      prop = props[i];
      if (!merged[prop]) {
        destObj[prop] = sourceObj[prop];
        merged[prop] = true;
      }
    }
    sourceObj = Object.getPrototypeOf(sourceObj);
  } while (sourceObj && (!filter || filter(sourceObj, destObj)) && sourceObj !== Object.prototype);
  return destObj;
}
function endsWith(str, searchString, position) {
  str = String(str);
  if (position === void 0 || position > str.length) {
    position = str.length;
  }
  position -= searchString.length;
  var lastIndex = str.indexOf(searchString, position);
  return lastIndex !== -1 && lastIndex === position;
}
function toArray(thing) {
  if (!thing)
    return null;
  var i = thing.length;
  if (isUndefined(i))
    return null;
  var arr = new Array(i);
  while (i-- > 0) {
    arr[i] = thing[i];
  }
  return arr;
}
var isTypedArray = function(TypedArray2) {
  return function(thing) {
    return TypedArray2 && thing instanceof TypedArray2;
  };
}(typeof Uint8Array !== "undefined" && Object.getPrototypeOf(Uint8Array));
var utils$k = {
  isArray: isArray$4,
  isArrayBuffer,
  isBuffer: isBuffer$1,
  isFormData,
  isArrayBufferView,
  isString: isString$1,
  isNumber: isNumber$1,
  isObject,
  isPlainObject,
  isUndefined,
  isDate: isDate$1,
  isFile,
  isBlob,
  isFunction,
  isStream,
  isURLSearchParams,
  isStandardBrowserEnv,
  forEach,
  merge: merge$1,
  extend: extend$1,
  trim: trim$1,
  stripBOM,
  inherits,
  toFlatObject,
  kindOf,
  kindOfTest,
  endsWith,
  toArray,
  isTypedArray,
  isFileList
};
var utils$j = utils$k;
function encode$1(val) {
  return encodeURIComponent(val).replace(/%3A/gi, ":").replace(/%24/g, "$").replace(/%2C/gi, ",").replace(/%20/g, "+").replace(/%5B/gi, "[").replace(/%5D/gi, "]");
}
var buildURL$2 = function buildURL(url, params, paramsSerializer) {
  if (!params) {
    return url;
  }
  var serializedParams;
  if (paramsSerializer) {
    serializedParams = paramsSerializer(params);
  } else if (utils$j.isURLSearchParams(params)) {
    serializedParams = params.toString();
  } else {
    var parts = [];
    utils$j.forEach(params, function serialize(val, key) {
      if (val === null || typeof val === "undefined") {
        return;
      }
      if (utils$j.isArray(val)) {
        key = key + "[]";
      } else {
        val = [val];
      }
      utils$j.forEach(val, function parseValue(v) {
        if (utils$j.isDate(v)) {
          v = v.toISOString();
        } else if (utils$j.isObject(v)) {
          v = JSON.stringify(v);
        }
        parts.push(encode$1(key) + "=" + encode$1(v));
      });
    });
    serializedParams = parts.join("&");
  }
  if (serializedParams) {
    var hashmarkIndex = url.indexOf("#");
    if (hashmarkIndex !== -1) {
      url = url.slice(0, hashmarkIndex);
    }
    url += (url.indexOf("?") === -1 ? "?" : "&") + serializedParams;
  }
  return url;
};
var utils$i = utils$k;
function InterceptorManager$1() {
  this.handlers = [];
}
InterceptorManager$1.prototype.use = function use(fulfilled, rejected, options) {
  this.handlers.push({
    fulfilled,
    rejected,
    synchronous: options ? options.synchronous : false,
    runWhen: options ? options.runWhen : null
  });
  return this.handlers.length - 1;
};
InterceptorManager$1.prototype.eject = function eject(id) {
  if (this.handlers[id]) {
    this.handlers[id] = null;
  }
};
InterceptorManager$1.prototype.forEach = function forEach2(fn) {
  utils$i.forEach(this.handlers, function forEachHandler(h) {
    if (h !== null) {
      fn(h);
    }
  });
};
var InterceptorManager_1 = InterceptorManager$1;
var utils$h = utils$k;
var normalizeHeaderName$1 = function normalizeHeaderName(headers, normalizedName) {
  utils$h.forEach(headers, function processHeader(value, name) {
    if (name !== normalizedName && name.toUpperCase() === normalizedName.toUpperCase()) {
      headers[normalizedName] = value;
      delete headers[name];
    }
  });
};
var utils$g = utils$k;
function AxiosError$5(message, code, config, request2, response) {
  Error.call(this);
  this.message = message;
  this.name = "AxiosError";
  code && (this.code = code);
  config && (this.config = config);
  request2 && (this.request = request2);
  response && (this.response = response);
}
utils$g.inherits(AxiosError$5, Error, {
  toJSON: function toJSON() {
    return {
      message: this.message,
      name: this.name,
      description: this.description,
      number: this.number,
      fileName: this.fileName,
      lineNumber: this.lineNumber,
      columnNumber: this.columnNumber,
      stack: this.stack,
      config: this.config,
      code: this.code,
      status: this.response && this.response.status ? this.response.status : null
    };
  }
});
var prototype = AxiosError$5.prototype;
var descriptors = {};
[
  "ERR_BAD_OPTION_VALUE",
  "ERR_BAD_OPTION",
  "ECONNABORTED",
  "ETIMEDOUT",
  "ERR_NETWORK",
  "ERR_FR_TOO_MANY_REDIRECTS",
  "ERR_DEPRECATED",
  "ERR_BAD_RESPONSE",
  "ERR_BAD_REQUEST",
  "ERR_CANCELED"
].forEach(function(code) {
  descriptors[code] = { value: code };
});
Object.defineProperties(AxiosError$5, descriptors);
Object.defineProperty(prototype, "isAxiosError", { value: true });
AxiosError$5.from = function(error, code, config, request2, response, customProps) {
  var axiosError = Object.create(prototype);
  utils$g.toFlatObject(error, axiosError, function filter(obj) {
    return obj !== Error.prototype;
  });
  AxiosError$5.call(axiosError, error.message, code, config, request2, response);
  axiosError.name = error.name;
  customProps && Object.assign(axiosError, customProps);
  return axiosError;
};
var AxiosError_1 = AxiosError$5;
var transitional = {
  silentJSONParsing: true,
  forcedJSONParsing: true,
  clarifyTimeoutError: false
};
var utils$f = utils$k;
function toFormData$2(obj, formData) {
  formData = formData || new FormData();
  var stack = [];
  function convertValue(value) {
    if (value === null)
      return "";
    if (utils$f.isDate(value)) {
      return value.toISOString();
    }
    if (utils$f.isArrayBuffer(value) || utils$f.isTypedArray(value)) {
      return typeof Blob === "function" ? new Blob([value]) : Buffer.from(value);
    }
    return value;
  }
  function build(data2, parentKey) {
    if (utils$f.isPlainObject(data2) || utils$f.isArray(data2)) {
      if (stack.indexOf(data2) !== -1) {
        throw Error("Circular reference detected in " + parentKey);
      }
      stack.push(data2);
      utils$f.forEach(data2, function each(value, key) {
        if (utils$f.isUndefined(value))
          return;
        var fullKey = parentKey ? parentKey + "." + key : key;
        var arr;
        if (value && !parentKey && typeof value === "object") {
          if (utils$f.endsWith(key, "{}")) {
            value = JSON.stringify(value);
          } else if (utils$f.endsWith(key, "[]") && (arr = utils$f.toArray(value))) {
            arr.forEach(function(el) {
              !utils$f.isUndefined(el) && formData.append(fullKey, convertValue(el));
            });
            return;
          }
        }
        build(value, fullKey);
      });
      stack.pop();
    } else {
      formData.append(parentKey, convertValue(data2));
    }
  }
  build(obj);
  return formData;
}
var toFormData_1 = toFormData$2;
var AxiosError$4 = AxiosError_1;
var settle$1 = function settle(resolve, reject, response) {
  var validateStatus2 = response.config.validateStatus;
  if (!response.status || !validateStatus2 || validateStatus2(response.status)) {
    resolve(response);
  } else {
    reject(new AxiosError$4("Request failed with status code " + response.status, [AxiosError$4.ERR_BAD_REQUEST, AxiosError$4.ERR_BAD_RESPONSE][Math.floor(response.status / 100) - 4], response.config, response.request, response));
  }
};
var utils$e = utils$k;
var cookies$1 = utils$e.isStandardBrowserEnv() ? function standardBrowserEnv() {
  return {
    write: function write(name, value, expires, path, domain, secure) {
      var cookie = [];
      cookie.push(name + "=" + encodeURIComponent(value));
      if (utils$e.isNumber(expires)) {
        cookie.push("expires=" + new Date(expires).toGMTString());
      }
      if (utils$e.isString(path)) {
        cookie.push("path=" + path);
      }
      if (utils$e.isString(domain)) {
        cookie.push("domain=" + domain);
      }
      if (secure === true) {
        cookie.push("secure");
      }
      document.cookie = cookie.join("; ");
    },
    read: function read(name) {
      var match = document.cookie.match(new RegExp("(^|;\\s*)(" + name + ")=([^;]*)"));
      return match ? decodeURIComponent(match[3]) : null;
    },
    remove: function remove2(name) {
      this.write(name, "", Date.now() - 864e5);
    }
  };
}() : function nonStandardBrowserEnv() {
  return {
    write: function write() {
    },
    read: function read() {
      return null;
    },
    remove: function remove2() {
    }
  };
}();
var isAbsoluteURL$1 = function isAbsoluteURL(url) {
  return /^([a-z][a-z\d+\-.]*:)?\/\//i.test(url);
};
var combineURLs$1 = function combineURLs(baseURL, relativeURL) {
  return relativeURL ? baseURL.replace(/\/+$/, "") + "/" + relativeURL.replace(/^\/+/, "") : baseURL;
};
var isAbsoluteURL2 = isAbsoluteURL$1;
var combineURLs2 = combineURLs$1;
var buildFullPath$2 = function buildFullPath(baseURL, requestedURL) {
  if (baseURL && !isAbsoluteURL2(requestedURL)) {
    return combineURLs2(baseURL, requestedURL);
  }
  return requestedURL;
};
var utils$d = utils$k;
var ignoreDuplicateOf = [
  "age",
  "authorization",
  "content-length",
  "content-type",
  "etag",
  "expires",
  "from",
  "host",
  "if-modified-since",
  "if-unmodified-since",
  "last-modified",
  "location",
  "max-forwards",
  "proxy-authorization",
  "referer",
  "retry-after",
  "user-agent"
];
var parseHeaders$1 = function parseHeaders(headers) {
  var parsed = {};
  var key;
  var val;
  var i;
  if (!headers) {
    return parsed;
  }
  utils$d.forEach(headers.split("\n"), function parser(line) {
    i = line.indexOf(":");
    key = utils$d.trim(line.substr(0, i)).toLowerCase();
    val = utils$d.trim(line.substr(i + 1));
    if (key) {
      if (parsed[key] && ignoreDuplicateOf.indexOf(key) >= 0) {
        return;
      }
      if (key === "set-cookie") {
        parsed[key] = (parsed[key] ? parsed[key] : []).concat([val]);
      } else {
        parsed[key] = parsed[key] ? parsed[key] + ", " + val : val;
      }
    }
  });
  return parsed;
};
var utils$c = utils$k;
var isURLSameOrigin$1 = utils$c.isStandardBrowserEnv() ? function standardBrowserEnv2() {
  var msie = /(msie|trident)/i.test(navigator.userAgent);
  var urlParsingNode = document.createElement("a");
  var originURL;
  function resolveURL(url) {
    var href = url;
    if (msie) {
      urlParsingNode.setAttribute("href", href);
      href = urlParsingNode.href;
    }
    urlParsingNode.setAttribute("href", href);
    return {
      href: urlParsingNode.href,
      protocol: urlParsingNode.protocol ? urlParsingNode.protocol.replace(/:$/, "") : "",
      host: urlParsingNode.host,
      search: urlParsingNode.search ? urlParsingNode.search.replace(/^\?/, "") : "",
      hash: urlParsingNode.hash ? urlParsingNode.hash.replace(/^#/, "") : "",
      hostname: urlParsingNode.hostname,
      port: urlParsingNode.port,
      pathname: urlParsingNode.pathname.charAt(0) === "/" ? urlParsingNode.pathname : "/" + urlParsingNode.pathname
    };
  }
  originURL = resolveURL(window.location.href);
  return function isURLSameOrigin2(requestURL) {
    var parsed = utils$c.isString(requestURL) ? resolveURL(requestURL) : requestURL;
    return parsed.protocol === originURL.protocol && parsed.host === originURL.host;
  };
}() : function nonStandardBrowserEnv2() {
  return function isURLSameOrigin2() {
    return true;
  };
}();
var AxiosError$3 = AxiosError_1;
var utils$b = utils$k;
function CanceledError$3(message) {
  AxiosError$3.call(this, message == null ? "canceled" : message, AxiosError$3.ERR_CANCELED);
  this.name = "CanceledError";
}
utils$b.inherits(CanceledError$3, AxiosError$3, {
  __CANCEL__: true
});
var CanceledError_1 = CanceledError$3;
var parseProtocol$1 = function parseProtocol(url) {
  var match = /^([-+\w]{1,25})(:?\/\/|:)/.exec(url);
  return match && match[1] || "";
};
var utils$a = utils$k;
var settle2 = settle$1;
var cookies = cookies$1;
var buildURL$1 = buildURL$2;
var buildFullPath$1 = buildFullPath$2;
var parseHeaders2 = parseHeaders$1;
var isURLSameOrigin = isURLSameOrigin$1;
var transitionalDefaults$1 = transitional;
var AxiosError$2 = AxiosError_1;
var CanceledError$2 = CanceledError_1;
var parseProtocol2 = parseProtocol$1;
var xhr = function xhrAdapter(config) {
  return new Promise(function dispatchXhrRequest(resolve, reject) {
    var requestData = config.data;
    var requestHeaders = config.headers;
    var responseType = config.responseType;
    var onCanceled;
    function done() {
      if (config.cancelToken) {
        config.cancelToken.unsubscribe(onCanceled);
      }
      if (config.signal) {
        config.signal.removeEventListener("abort", onCanceled);
      }
    }
    if (utils$a.isFormData(requestData) && utils$a.isStandardBrowserEnv()) {
      delete requestHeaders["Content-Type"];
    }
    var request2 = new XMLHttpRequest();
    if (config.auth) {
      var username = config.auth.username || "";
      var password = config.auth.password ? unescape(encodeURIComponent(config.auth.password)) : "";
      requestHeaders.Authorization = "Basic " + btoa(username + ":" + password);
    }
    var fullPath = buildFullPath$1(config.baseURL, config.url);
    request2.open(config.method.toUpperCase(), buildURL$1(fullPath, config.params, config.paramsSerializer), true);
    request2.timeout = config.timeout;
    function onloadend() {
      if (!request2) {
        return;
      }
      var responseHeaders = "getAllResponseHeaders" in request2 ? parseHeaders2(request2.getAllResponseHeaders()) : null;
      var responseData = !responseType || responseType === "text" || responseType === "json" ? request2.responseText : request2.response;
      var response = {
        data: responseData,
        status: request2.status,
        statusText: request2.statusText,
        headers: responseHeaders,
        config,
        request: request2
      };
      settle2(function _resolve(value) {
        resolve(value);
        done();
      }, function _reject(err) {
        reject(err);
        done();
      }, response);
      request2 = null;
    }
    if ("onloadend" in request2) {
      request2.onloadend = onloadend;
    } else {
      request2.onreadystatechange = function handleLoad() {
        if (!request2 || request2.readyState !== 4) {
          return;
        }
        if (request2.status === 0 && !(request2.responseURL && request2.responseURL.indexOf("file:") === 0)) {
          return;
        }
        setTimeout(onloadend);
      };
    }
    request2.onabort = function handleAbort() {
      if (!request2) {
        return;
      }
      reject(new AxiosError$2("Request aborted", AxiosError$2.ECONNABORTED, config, request2));
      request2 = null;
    };
    request2.onerror = function handleError() {
      reject(new AxiosError$2("Network Error", AxiosError$2.ERR_NETWORK, config, request2, request2));
      request2 = null;
    };
    request2.ontimeout = function handleTimeout() {
      var timeoutErrorMessage = config.timeout ? "timeout of " + config.timeout + "ms exceeded" : "timeout exceeded";
      var transitional3 = config.transitional || transitionalDefaults$1;
      if (config.timeoutErrorMessage) {
        timeoutErrorMessage = config.timeoutErrorMessage;
      }
      reject(new AxiosError$2(timeoutErrorMessage, transitional3.clarifyTimeoutError ? AxiosError$2.ETIMEDOUT : AxiosError$2.ECONNABORTED, config, request2));
      request2 = null;
    };
    if (utils$a.isStandardBrowserEnv()) {
      var xsrfValue = (config.withCredentials || isURLSameOrigin(fullPath)) && config.xsrfCookieName ? cookies.read(config.xsrfCookieName) : void 0;
      if (xsrfValue) {
        requestHeaders[config.xsrfHeaderName] = xsrfValue;
      }
    }
    if ("setRequestHeader" in request2) {
      utils$a.forEach(requestHeaders, function setRequestHeader(val, key) {
        if (typeof requestData === "undefined" && key.toLowerCase() === "content-type") {
          delete requestHeaders[key];
        } else {
          request2.setRequestHeader(key, val);
        }
      });
    }
    if (!utils$a.isUndefined(config.withCredentials)) {
      request2.withCredentials = !!config.withCredentials;
    }
    if (responseType && responseType !== "json") {
      request2.responseType = config.responseType;
    }
    if (typeof config.onDownloadProgress === "function") {
      request2.addEventListener("progress", config.onDownloadProgress);
    }
    if (typeof config.onUploadProgress === "function" && request2.upload) {
      request2.upload.addEventListener("progress", config.onUploadProgress);
    }
    if (config.cancelToken || config.signal) {
      onCanceled = function(cancel) {
        if (!request2) {
          return;
        }
        reject(!cancel || cancel && cancel.type ? new CanceledError$2() : cancel);
        request2.abort();
        request2 = null;
      };
      config.cancelToken && config.cancelToken.subscribe(onCanceled);
      if (config.signal) {
        config.signal.aborted ? onCanceled() : config.signal.addEventListener("abort", onCanceled);
      }
    }
    if (!requestData) {
      requestData = null;
    }
    var protocol = parseProtocol2(fullPath);
    if (protocol && ["http", "https", "file"].indexOf(protocol) === -1) {
      reject(new AxiosError$2("Unsupported protocol " + protocol + ":", AxiosError$2.ERR_BAD_REQUEST, config));
      return;
    }
    request2.send(requestData);
  });
};
var _null = null;
var utils$9 = utils$k;
var normalizeHeaderName2 = normalizeHeaderName$1;
var AxiosError$1 = AxiosError_1;
var transitionalDefaults = transitional;
var toFormData$1 = toFormData_1;
var DEFAULT_CONTENT_TYPE = {
  "Content-Type": "application/x-www-form-urlencoded"
};
function setContentTypeIfUnset(headers, value) {
  if (!utils$9.isUndefined(headers) && utils$9.isUndefined(headers["Content-Type"])) {
    headers["Content-Type"] = value;
  }
}
function getDefaultAdapter() {
  var adapter;
  if (typeof XMLHttpRequest !== "undefined") {
    adapter = xhr;
  } else if (typeof process !== "undefined" && Object.prototype.toString.call(process) === "[object process]") {
    adapter = xhr;
  }
  return adapter;
}
function stringifySafely(rawValue, parser, encoder) {
  if (utils$9.isString(rawValue)) {
    try {
      (parser || JSON.parse)(rawValue);
      return utils$9.trim(rawValue);
    } catch (e) {
      if (e.name !== "SyntaxError") {
        throw e;
      }
    }
  }
  return (encoder || JSON.stringify)(rawValue);
}
var defaults$5 = {
  transitional: transitionalDefaults,
  adapter: getDefaultAdapter(),
  transformRequest: [function transformRequest(data2, headers) {
    normalizeHeaderName2(headers, "Accept");
    normalizeHeaderName2(headers, "Content-Type");
    if (utils$9.isFormData(data2) || utils$9.isArrayBuffer(data2) || utils$9.isBuffer(data2) || utils$9.isStream(data2) || utils$9.isFile(data2) || utils$9.isBlob(data2)) {
      return data2;
    }
    if (utils$9.isArrayBufferView(data2)) {
      return data2.buffer;
    }
    if (utils$9.isURLSearchParams(data2)) {
      setContentTypeIfUnset(headers, "application/x-www-form-urlencoded;charset=utf-8");
      return data2.toString();
    }
    var isObjectPayload = utils$9.isObject(data2);
    var contentType = headers && headers["Content-Type"];
    var isFileList2;
    if ((isFileList2 = utils$9.isFileList(data2)) || isObjectPayload && contentType === "multipart/form-data") {
      var _FormData = this.env && this.env.FormData;
      return toFormData$1(isFileList2 ? { "files[]": data2 } : data2, _FormData && new _FormData());
    } else if (isObjectPayload || contentType === "application/json") {
      setContentTypeIfUnset(headers, "application/json");
      return stringifySafely(data2);
    }
    return data2;
  }],
  transformResponse: [function transformResponse(data2) {
    var transitional3 = this.transitional || defaults$5.transitional;
    var silentJSONParsing = transitional3 && transitional3.silentJSONParsing;
    var forcedJSONParsing = transitional3 && transitional3.forcedJSONParsing;
    var strictJSONParsing = !silentJSONParsing && this.responseType === "json";
    if (strictJSONParsing || forcedJSONParsing && utils$9.isString(data2) && data2.length) {
      try {
        return JSON.parse(data2);
      } catch (e) {
        if (strictJSONParsing) {
          if (e.name === "SyntaxError") {
            throw AxiosError$1.from(e, AxiosError$1.ERR_BAD_RESPONSE, this, null, this.response);
          }
          throw e;
        }
      }
    }
    return data2;
  }],
  timeout: 0,
  xsrfCookieName: "XSRF-TOKEN",
  xsrfHeaderName: "X-XSRF-TOKEN",
  maxContentLength: -1,
  maxBodyLength: -1,
  env: {
    FormData: _null
  },
  validateStatus: function validateStatus(status) {
    return status >= 200 && status < 300;
  },
  headers: {
    common: {
      "Accept": "application/json, text/plain, */*"
    }
  }
};
utils$9.forEach(["delete", "get", "head"], function forEachMethodNoData(method) {
  defaults$5.headers[method] = {};
});
utils$9.forEach(["post", "put", "patch"], function forEachMethodWithData(method) {
  defaults$5.headers[method] = utils$9.merge(DEFAULT_CONTENT_TYPE);
});
var defaults_1 = defaults$5;
var utils$8 = utils$k;
var defaults$4 = defaults_1;
var transformData$1 = function transformData(data2, headers, fns) {
  var context = this || defaults$4;
  utils$8.forEach(fns, function transform(fn) {
    data2 = fn.call(context, data2, headers);
  });
  return data2;
};
var isCancel$1 = function isCancel(value) {
  return !!(value && value.__CANCEL__);
};
var utils$7 = utils$k;
var transformData2 = transformData$1;
var isCancel2 = isCancel$1;
var defaults$3 = defaults_1;
var CanceledError$1 = CanceledError_1;
function throwIfCancellationRequested(config) {
  if (config.cancelToken) {
    config.cancelToken.throwIfRequested();
  }
  if (config.signal && config.signal.aborted) {
    throw new CanceledError$1();
  }
}
var dispatchRequest$1 = function dispatchRequest(config) {
  throwIfCancellationRequested(config);
  config.headers = config.headers || {};
  config.data = transformData2.call(config, config.data, config.headers, config.transformRequest);
  config.headers = utils$7.merge(config.headers.common || {}, config.headers[config.method] || {}, config.headers);
  utils$7.forEach(["delete", "get", "head", "post", "put", "patch", "common"], function cleanHeaderConfig(method) {
    delete config.headers[method];
  });
  var adapter = config.adapter || defaults$3.adapter;
  return adapter(config).then(function onAdapterResolution(response) {
    throwIfCancellationRequested(config);
    response.data = transformData2.call(config, response.data, response.headers, config.transformResponse);
    return response;
  }, function onAdapterRejection(reason) {
    if (!isCancel2(reason)) {
      throwIfCancellationRequested(config);
      if (reason && reason.response) {
        reason.response.data = transformData2.call(config, reason.response.data, reason.response.headers, config.transformResponse);
      }
    }
    return Promise.reject(reason);
  });
};
var utils$6 = utils$k;
var mergeConfig$2 = function mergeConfig(config1, config2) {
  config2 = config2 || {};
  var config = {};
  function getMergedValue(target, source2) {
    if (utils$6.isPlainObject(target) && utils$6.isPlainObject(source2)) {
      return utils$6.merge(target, source2);
    } else if (utils$6.isPlainObject(source2)) {
      return utils$6.merge({}, source2);
    } else if (utils$6.isArray(source2)) {
      return source2.slice();
    }
    return source2;
  }
  function mergeDeepProperties(prop) {
    if (!utils$6.isUndefined(config2[prop])) {
      return getMergedValue(config1[prop], config2[prop]);
    } else if (!utils$6.isUndefined(config1[prop])) {
      return getMergedValue(void 0, config1[prop]);
    }
  }
  function valueFromConfig2(prop) {
    if (!utils$6.isUndefined(config2[prop])) {
      return getMergedValue(void 0, config2[prop]);
    }
  }
  function defaultToConfig2(prop) {
    if (!utils$6.isUndefined(config2[prop])) {
      return getMergedValue(void 0, config2[prop]);
    } else if (!utils$6.isUndefined(config1[prop])) {
      return getMergedValue(void 0, config1[prop]);
    }
  }
  function mergeDirectKeys(prop) {
    if (prop in config2) {
      return getMergedValue(config1[prop], config2[prop]);
    } else if (prop in config1) {
      return getMergedValue(void 0, config1[prop]);
    }
  }
  var mergeMap = {
    "url": valueFromConfig2,
    "method": valueFromConfig2,
    "data": valueFromConfig2,
    "baseURL": defaultToConfig2,
    "transformRequest": defaultToConfig2,
    "transformResponse": defaultToConfig2,
    "paramsSerializer": defaultToConfig2,
    "timeout": defaultToConfig2,
    "timeoutMessage": defaultToConfig2,
    "withCredentials": defaultToConfig2,
    "adapter": defaultToConfig2,
    "responseType": defaultToConfig2,
    "xsrfCookieName": defaultToConfig2,
    "xsrfHeaderName": defaultToConfig2,
    "onUploadProgress": defaultToConfig2,
    "onDownloadProgress": defaultToConfig2,
    "decompress": defaultToConfig2,
    "maxContentLength": defaultToConfig2,
    "maxBodyLength": defaultToConfig2,
    "beforeRedirect": defaultToConfig2,
    "transport": defaultToConfig2,
    "httpAgent": defaultToConfig2,
    "httpsAgent": defaultToConfig2,
    "cancelToken": defaultToConfig2,
    "socketPath": defaultToConfig2,
    "responseEncoding": defaultToConfig2,
    "validateStatus": mergeDirectKeys
  };
  utils$6.forEach(Object.keys(config1).concat(Object.keys(config2)), function computeConfigValue(prop) {
    var merge3 = mergeMap[prop] || mergeDeepProperties;
    var configValue = merge3(prop);
    utils$6.isUndefined(configValue) && merge3 !== mergeDirectKeys || (config[prop] = configValue);
  });
  return config;
};
var data = {
  "version": "0.27.2"
};
var VERSION$1 = data.version;
var AxiosError = AxiosError_1;
var validators$1 = {};
["object", "boolean", "number", "function", "string", "symbol"].forEach(function(type, i) {
  validators$1[type] = function validator2(thing) {
    return typeof thing === type || "a" + (i < 1 ? "n " : " ") + type;
  };
});
var deprecatedWarnings = {};
validators$1.transitional = function transitional2(validator2, version, message) {
  function formatMessage(opt, desc) {
    return "[Axios v" + VERSION$1 + "] Transitional option '" + opt + "'" + desc + (message ? ". " + message : "");
  }
  return function(value, opt, opts) {
    if (validator2 === false) {
      throw new AxiosError(formatMessage(opt, " has been removed" + (version ? " in " + version : "")), AxiosError.ERR_DEPRECATED);
    }
    if (version && !deprecatedWarnings[opt]) {
      deprecatedWarnings[opt] = true;
      console.warn(formatMessage(opt, " has been deprecated since v" + version + " and will be removed in the near future"));
    }
    return validator2 ? validator2(value, opt, opts) : true;
  };
};
function assertOptions(options, schema, allowUnknown) {
  if (typeof options !== "object") {
    throw new AxiosError("options must be an object", AxiosError.ERR_BAD_OPTION_VALUE);
  }
  var keys = Object.keys(options);
  var i = keys.length;
  while (i-- > 0) {
    var opt = keys[i];
    var validator2 = schema[opt];
    if (validator2) {
      var value = options[opt];
      var result = value === void 0 || validator2(value, opt, options);
      if (result !== true) {
        throw new AxiosError("option " + opt + " must be " + result, AxiosError.ERR_BAD_OPTION_VALUE);
      }
      continue;
    }
    if (allowUnknown !== true) {
      throw new AxiosError("Unknown option " + opt, AxiosError.ERR_BAD_OPTION);
    }
  }
}
var validator$1 = {
  assertOptions,
  validators: validators$1
};
var utils$5 = utils$k;
var buildURL2 = buildURL$2;
var InterceptorManager = InterceptorManager_1;
var dispatchRequest2 = dispatchRequest$1;
var mergeConfig$1 = mergeConfig$2;
var buildFullPath2 = buildFullPath$2;
var validator = validator$1;
var validators = validator.validators;
function Axios$1(instanceConfig) {
  this.defaults = instanceConfig;
  this.interceptors = {
    request: new InterceptorManager(),
    response: new InterceptorManager()
  };
}
Axios$1.prototype.request = function request(configOrUrl, config) {
  if (typeof configOrUrl === "string") {
    config = config || {};
    config.url = configOrUrl;
  } else {
    config = configOrUrl || {};
  }
  config = mergeConfig$1(this.defaults, config);
  if (config.method) {
    config.method = config.method.toLowerCase();
  } else if (this.defaults.method) {
    config.method = this.defaults.method.toLowerCase();
  } else {
    config.method = "get";
  }
  var transitional3 = config.transitional;
  if (transitional3 !== void 0) {
    validator.assertOptions(transitional3, {
      silentJSONParsing: validators.transitional(validators.boolean),
      forcedJSONParsing: validators.transitional(validators.boolean),
      clarifyTimeoutError: validators.transitional(validators.boolean)
    }, false);
  }
  var requestInterceptorChain = [];
  var synchronousRequestInterceptors = true;
  this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
    if (typeof interceptor.runWhen === "function" && interceptor.runWhen(config) === false) {
      return;
    }
    synchronousRequestInterceptors = synchronousRequestInterceptors && interceptor.synchronous;
    requestInterceptorChain.unshift(interceptor.fulfilled, interceptor.rejected);
  });
  var responseInterceptorChain = [];
  this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
    responseInterceptorChain.push(interceptor.fulfilled, interceptor.rejected);
  });
  var promise;
  if (!synchronousRequestInterceptors) {
    var chain = [dispatchRequest2, void 0];
    Array.prototype.unshift.apply(chain, requestInterceptorChain);
    chain = chain.concat(responseInterceptorChain);
    promise = Promise.resolve(config);
    while (chain.length) {
      promise = promise.then(chain.shift(), chain.shift());
    }
    return promise;
  }
  var newConfig = config;
  while (requestInterceptorChain.length) {
    var onFulfilled = requestInterceptorChain.shift();
    var onRejected = requestInterceptorChain.shift();
    try {
      newConfig = onFulfilled(newConfig);
    } catch (error) {
      onRejected(error);
      break;
    }
  }
  try {
    promise = dispatchRequest2(newConfig);
  } catch (error) {
    return Promise.reject(error);
  }
  while (responseInterceptorChain.length) {
    promise = promise.then(responseInterceptorChain.shift(), responseInterceptorChain.shift());
  }
  return promise;
};
Axios$1.prototype.getUri = function getUri(config) {
  config = mergeConfig$1(this.defaults, config);
  var fullPath = buildFullPath2(config.baseURL, config.url);
  return buildURL2(fullPath, config.params, config.paramsSerializer);
};
utils$5.forEach(["delete", "get", "head", "options"], function forEachMethodNoData2(method) {
  Axios$1.prototype[method] = function(url, config) {
    return this.request(mergeConfig$1(config || {}, {
      method,
      url,
      data: (config || {}).data
    }));
  };
});
utils$5.forEach(["post", "put", "patch"], function forEachMethodWithData2(method) {
  function generateHTTPMethod(isForm) {
    return function httpMethod(url, data2, config) {
      return this.request(mergeConfig$1(config || {}, {
        method,
        headers: isForm ? {
          "Content-Type": "multipart/form-data"
        } : {},
        url,
        data: data2
      }));
    };
  }
  Axios$1.prototype[method] = generateHTTPMethod();
  Axios$1.prototype[method + "Form"] = generateHTTPMethod(true);
});
var Axios_1 = Axios$1;
var CanceledError = CanceledError_1;
function CancelToken(executor) {
  if (typeof executor !== "function") {
    throw new TypeError("executor must be a function.");
  }
  var resolvePromise;
  this.promise = new Promise(function promiseExecutor(resolve) {
    resolvePromise = resolve;
  });
  var token = this;
  this.promise.then(function(cancel) {
    if (!token._listeners)
      return;
    var i;
    var l = token._listeners.length;
    for (i = 0; i < l; i++) {
      token._listeners[i](cancel);
    }
    token._listeners = null;
  });
  this.promise.then = function(onfulfilled) {
    var _resolve;
    var promise = new Promise(function(resolve) {
      token.subscribe(resolve);
      _resolve = resolve;
    }).then(onfulfilled);
    promise.cancel = function reject() {
      token.unsubscribe(_resolve);
    };
    return promise;
  };
  executor(function cancel(message) {
    if (token.reason) {
      return;
    }
    token.reason = new CanceledError(message);
    resolvePromise(token.reason);
  });
}
CancelToken.prototype.throwIfRequested = function throwIfRequested() {
  if (this.reason) {
    throw this.reason;
  }
};
CancelToken.prototype.subscribe = function subscribe(listener) {
  if (this.reason) {
    listener(this.reason);
    return;
  }
  if (this._listeners) {
    this._listeners.push(listener);
  } else {
    this._listeners = [listener];
  }
};
CancelToken.prototype.unsubscribe = function unsubscribe(listener) {
  if (!this._listeners) {
    return;
  }
  var index = this._listeners.indexOf(listener);
  if (index !== -1) {
    this._listeners.splice(index, 1);
  }
};
CancelToken.source = function source() {
  var cancel;
  var token = new CancelToken(function executor(c) {
    cancel = c;
  });
  return {
    token,
    cancel
  };
};
var CancelToken_1 = CancelToken;
var spread = function spread2(callback) {
  return function wrap(arr) {
    return callback.apply(null, arr);
  };
};
var utils$4 = utils$k;
var isAxiosError = function isAxiosError2(payload) {
  return utils$4.isObject(payload) && payload.isAxiosError === true;
};
var utils$3 = utils$k;
var bind$2 = bind$4;
var Axios = Axios_1;
var mergeConfig2 = mergeConfig$2;
var defaults$2 = defaults_1;
function createInstance(defaultConfig) {
  var context = new Axios(defaultConfig);
  var instance = bind$2(Axios.prototype.request, context);
  utils$3.extend(instance, Axios.prototype, context);
  utils$3.extend(instance, context);
  instance.create = function create(instanceConfig) {
    return createInstance(mergeConfig2(defaultConfig, instanceConfig));
  };
  return instance;
}
var axios$1 = createInstance(defaults$2);
axios$1.Axios = Axios;
axios$1.CanceledError = CanceledError_1;
axios$1.CancelToken = CancelToken_1;
axios$1.isCancel = isCancel$1;
axios$1.VERSION = data.version;
axios$1.toFormData = toFormData_1;
axios$1.AxiosError = AxiosError_1;
axios$1.Cancel = axios$1.CanceledError;
axios$1.all = function all(promises) {
  return Promise.all(promises);
};
axios$1.spread = spread;
axios$1.isAxiosError = isAxiosError;
axios$2.exports = axios$1;
axios$2.exports.default = axios$1;
var axios = axios$2.exports;
var shams = function hasSymbols() {
  if (typeof Symbol !== "function" || typeof Object.getOwnPropertySymbols !== "function") {
    return false;
  }
  if (typeof Symbol.iterator === "symbol") {
    return true;
  }
  var obj = {};
  var sym = Symbol("test");
  var symObj = Object(sym);
  if (typeof sym === "string") {
    return false;
  }
  if (Object.prototype.toString.call(sym) !== "[object Symbol]") {
    return false;
  }
  if (Object.prototype.toString.call(symObj) !== "[object Symbol]") {
    return false;
  }
  var symVal = 42;
  obj[sym] = symVal;
  for (sym in obj) {
    return false;
  }
  if (typeof Object.keys === "function" && Object.keys(obj).length !== 0) {
    return false;
  }
  if (typeof Object.getOwnPropertyNames === "function" && Object.getOwnPropertyNames(obj).length !== 0) {
    return false;
  }
  var syms = Object.getOwnPropertySymbols(obj);
  if (syms.length !== 1 || syms[0] !== sym) {
    return false;
  }
  if (!Object.prototype.propertyIsEnumerable.call(obj, sym)) {
    return false;
  }
  if (typeof Object.getOwnPropertyDescriptor === "function") {
    var descriptor = Object.getOwnPropertyDescriptor(obj, sym);
    if (descriptor.value !== symVal || descriptor.enumerable !== true) {
      return false;
    }
  }
  return true;
};
var origSymbol = typeof Symbol !== "undefined" && Symbol;
var hasSymbolSham = shams;
var hasSymbols$1 = function hasNativeSymbols() {
  if (typeof origSymbol !== "function") {
    return false;
  }
  if (typeof Symbol !== "function") {
    return false;
  }
  if (typeof origSymbol("foo") !== "symbol") {
    return false;
  }
  if (typeof Symbol("bar") !== "symbol") {
    return false;
  }
  return hasSymbolSham();
};
var ERROR_MESSAGE = "Function.prototype.bind called on incompatible ";
var slice = Array.prototype.slice;
var toStr$1 = Object.prototype.toString;
var funcType = "[object Function]";
var implementation$1 = function bind2(that) {
  var target = this;
  if (typeof target !== "function" || toStr$1.call(target) !== funcType) {
    throw new TypeError(ERROR_MESSAGE + target);
  }
  var args = slice.call(arguments, 1);
  var bound;
  var binder = function() {
    if (this instanceof bound) {
      var result = target.apply(this, args.concat(slice.call(arguments)));
      if (Object(result) === result) {
        return result;
      }
      return this;
    } else {
      return target.apply(that, args.concat(slice.call(arguments)));
    }
  };
  var boundLength = Math.max(0, target.length - args.length);
  var boundArgs = [];
  for (var i = 0; i < boundLength; i++) {
    boundArgs.push("$" + i);
  }
  bound = Function("binder", "return function (" + boundArgs.join(",") + "){ return binder.apply(this,arguments); }")(binder);
  if (target.prototype) {
    var Empty = function Empty2() {
    };
    Empty.prototype = target.prototype;
    bound.prototype = new Empty();
    Empty.prototype = null;
  }
  return bound;
};
var implementation = implementation$1;
var functionBind = Function.prototype.bind || implementation;
var bind$1 = functionBind;
var src = bind$1.call(Function.call, Object.prototype.hasOwnProperty);
var undefined$1;
var $SyntaxError = SyntaxError;
var $Function = Function;
var $TypeError$1 = TypeError;
var getEvalledConstructor = function(expressionSyntax) {
  try {
    return $Function('"use strict"; return (' + expressionSyntax + ").constructor;")();
  } catch (e) {
  }
};
var $gOPD = Object.getOwnPropertyDescriptor;
if ($gOPD) {
  try {
    $gOPD({}, "");
  } catch (e) {
    $gOPD = null;
  }
}
var throwTypeError = function() {
  throw new $TypeError$1();
};
var ThrowTypeError = $gOPD ? function() {
  try {
    arguments.callee;
    return throwTypeError;
  } catch (calleeThrows) {
    try {
      return $gOPD(arguments, "callee").get;
    } catch (gOPDthrows) {
      return throwTypeError;
    }
  }
}() : throwTypeError;
var hasSymbols2 = hasSymbols$1();
var getProto = Object.getPrototypeOf || function(x) {
  return x.__proto__;
};
var needsEval = {};
var TypedArray = typeof Uint8Array === "undefined" ? undefined$1 : getProto(Uint8Array);
var INTRINSICS = {
  "%AggregateError%": typeof AggregateError === "undefined" ? undefined$1 : AggregateError,
  "%Array%": Array,
  "%ArrayBuffer%": typeof ArrayBuffer === "undefined" ? undefined$1 : ArrayBuffer,
  "%ArrayIteratorPrototype%": hasSymbols2 ? getProto([][Symbol.iterator]()) : undefined$1,
  "%AsyncFromSyncIteratorPrototype%": undefined$1,
  "%AsyncFunction%": needsEval,
  "%AsyncGenerator%": needsEval,
  "%AsyncGeneratorFunction%": needsEval,
  "%AsyncIteratorPrototype%": needsEval,
  "%Atomics%": typeof Atomics === "undefined" ? undefined$1 : Atomics,
  "%BigInt%": typeof BigInt === "undefined" ? undefined$1 : BigInt,
  "%Boolean%": Boolean,
  "%DataView%": typeof DataView === "undefined" ? undefined$1 : DataView,
  "%Date%": Date,
  "%decodeURI%": decodeURI,
  "%decodeURIComponent%": decodeURIComponent,
  "%encodeURI%": encodeURI,
  "%encodeURIComponent%": encodeURIComponent,
  "%Error%": Error,
  "%eval%": eval,
  "%EvalError%": EvalError,
  "%Float32Array%": typeof Float32Array === "undefined" ? undefined$1 : Float32Array,
  "%Float64Array%": typeof Float64Array === "undefined" ? undefined$1 : Float64Array,
  "%FinalizationRegistry%": typeof FinalizationRegistry === "undefined" ? undefined$1 : FinalizationRegistry,
  "%Function%": $Function,
  "%GeneratorFunction%": needsEval,
  "%Int8Array%": typeof Int8Array === "undefined" ? undefined$1 : Int8Array,
  "%Int16Array%": typeof Int16Array === "undefined" ? undefined$1 : Int16Array,
  "%Int32Array%": typeof Int32Array === "undefined" ? undefined$1 : Int32Array,
  "%isFinite%": isFinite,
  "%isNaN%": isNaN,
  "%IteratorPrototype%": hasSymbols2 ? getProto(getProto([][Symbol.iterator]())) : undefined$1,
  "%JSON%": typeof JSON === "object" ? JSON : undefined$1,
  "%Map%": typeof Map === "undefined" ? undefined$1 : Map,
  "%MapIteratorPrototype%": typeof Map === "undefined" || !hasSymbols2 ? undefined$1 : getProto((/* @__PURE__ */ new Map())[Symbol.iterator]()),
  "%Math%": Math,
  "%Number%": Number,
  "%Object%": Object,
  "%parseFloat%": parseFloat,
  "%parseInt%": parseInt,
  "%Promise%": typeof Promise === "undefined" ? undefined$1 : Promise,
  "%Proxy%": typeof Proxy === "undefined" ? undefined$1 : Proxy,
  "%RangeError%": RangeError,
  "%ReferenceError%": ReferenceError,
  "%Reflect%": typeof Reflect === "undefined" ? undefined$1 : Reflect,
  "%RegExp%": RegExp,
  "%Set%": typeof Set === "undefined" ? undefined$1 : Set,
  "%SetIteratorPrototype%": typeof Set === "undefined" || !hasSymbols2 ? undefined$1 : getProto((/* @__PURE__ */ new Set())[Symbol.iterator]()),
  "%SharedArrayBuffer%": typeof SharedArrayBuffer === "undefined" ? undefined$1 : SharedArrayBuffer,
  "%String%": String,
  "%StringIteratorPrototype%": hasSymbols2 ? getProto(""[Symbol.iterator]()) : undefined$1,
  "%Symbol%": hasSymbols2 ? Symbol : undefined$1,
  "%SyntaxError%": $SyntaxError,
  "%ThrowTypeError%": ThrowTypeError,
  "%TypedArray%": TypedArray,
  "%TypeError%": $TypeError$1,
  "%Uint8Array%": typeof Uint8Array === "undefined" ? undefined$1 : Uint8Array,
  "%Uint8ClampedArray%": typeof Uint8ClampedArray === "undefined" ? undefined$1 : Uint8ClampedArray,
  "%Uint16Array%": typeof Uint16Array === "undefined" ? undefined$1 : Uint16Array,
  "%Uint32Array%": typeof Uint32Array === "undefined" ? undefined$1 : Uint32Array,
  "%URIError%": URIError,
  "%WeakMap%": typeof WeakMap === "undefined" ? undefined$1 : WeakMap,
  "%WeakRef%": typeof WeakRef === "undefined" ? undefined$1 : WeakRef,
  "%WeakSet%": typeof WeakSet === "undefined" ? undefined$1 : WeakSet
};
var doEval = function doEval2(name) {
  var value;
  if (name === "%AsyncFunction%") {
    value = getEvalledConstructor("async function () {}");
  } else if (name === "%GeneratorFunction%") {
    value = getEvalledConstructor("function* () {}");
  } else if (name === "%AsyncGeneratorFunction%") {
    value = getEvalledConstructor("async function* () {}");
  } else if (name === "%AsyncGenerator%") {
    var fn = doEval2("%AsyncGeneratorFunction%");
    if (fn) {
      value = fn.prototype;
    }
  } else if (name === "%AsyncIteratorPrototype%") {
    var gen = doEval2("%AsyncGenerator%");
    if (gen) {
      value = getProto(gen.prototype);
    }
  }
  INTRINSICS[name] = value;
  return value;
};
var LEGACY_ALIASES = {
  "%ArrayBufferPrototype%": ["ArrayBuffer", "prototype"],
  "%ArrayPrototype%": ["Array", "prototype"],
  "%ArrayProto_entries%": ["Array", "prototype", "entries"],
  "%ArrayProto_forEach%": ["Array", "prototype", "forEach"],
  "%ArrayProto_keys%": ["Array", "prototype", "keys"],
  "%ArrayProto_values%": ["Array", "prototype", "values"],
  "%AsyncFunctionPrototype%": ["AsyncFunction", "prototype"],
  "%AsyncGenerator%": ["AsyncGeneratorFunction", "prototype"],
  "%AsyncGeneratorPrototype%": ["AsyncGeneratorFunction", "prototype", "prototype"],
  "%BooleanPrototype%": ["Boolean", "prototype"],
  "%DataViewPrototype%": ["DataView", "prototype"],
  "%DatePrototype%": ["Date", "prototype"],
  "%ErrorPrototype%": ["Error", "prototype"],
  "%EvalErrorPrototype%": ["EvalError", "prototype"],
  "%Float32ArrayPrototype%": ["Float32Array", "prototype"],
  "%Float64ArrayPrototype%": ["Float64Array", "prototype"],
  "%FunctionPrototype%": ["Function", "prototype"],
  "%Generator%": ["GeneratorFunction", "prototype"],
  "%GeneratorPrototype%": ["GeneratorFunction", "prototype", "prototype"],
  "%Int8ArrayPrototype%": ["Int8Array", "prototype"],
  "%Int16ArrayPrototype%": ["Int16Array", "prototype"],
  "%Int32ArrayPrototype%": ["Int32Array", "prototype"],
  "%JSONParse%": ["JSON", "parse"],
  "%JSONStringify%": ["JSON", "stringify"],
  "%MapPrototype%": ["Map", "prototype"],
  "%NumberPrototype%": ["Number", "prototype"],
  "%ObjectPrototype%": ["Object", "prototype"],
  "%ObjProto_toString%": ["Object", "prototype", "toString"],
  "%ObjProto_valueOf%": ["Object", "prototype", "valueOf"],
  "%PromisePrototype%": ["Promise", "prototype"],
  "%PromiseProto_then%": ["Promise", "prototype", "then"],
  "%Promise_all%": ["Promise", "all"],
  "%Promise_reject%": ["Promise", "reject"],
  "%Promise_resolve%": ["Promise", "resolve"],
  "%RangeErrorPrototype%": ["RangeError", "prototype"],
  "%ReferenceErrorPrototype%": ["ReferenceError", "prototype"],
  "%RegExpPrototype%": ["RegExp", "prototype"],
  "%SetPrototype%": ["Set", "prototype"],
  "%SharedArrayBufferPrototype%": ["SharedArrayBuffer", "prototype"],
  "%StringPrototype%": ["String", "prototype"],
  "%SymbolPrototype%": ["Symbol", "prototype"],
  "%SyntaxErrorPrototype%": ["SyntaxError", "prototype"],
  "%TypedArrayPrototype%": ["TypedArray", "prototype"],
  "%TypeErrorPrototype%": ["TypeError", "prototype"],
  "%Uint8ArrayPrototype%": ["Uint8Array", "prototype"],
  "%Uint8ClampedArrayPrototype%": ["Uint8ClampedArray", "prototype"],
  "%Uint16ArrayPrototype%": ["Uint16Array", "prototype"],
  "%Uint32ArrayPrototype%": ["Uint32Array", "prototype"],
  "%URIErrorPrototype%": ["URIError", "prototype"],
  "%WeakMapPrototype%": ["WeakMap", "prototype"],
  "%WeakSetPrototype%": ["WeakSet", "prototype"]
};
var bind3 = functionBind;
var hasOwn$1 = src;
var $concat$1 = bind3.call(Function.call, Array.prototype.concat);
var $spliceApply = bind3.call(Function.apply, Array.prototype.splice);
var $replace$1 = bind3.call(Function.call, String.prototype.replace);
var $strSlice = bind3.call(Function.call, String.prototype.slice);
var rePropName = /[^%.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|%$))/g;
var reEscapeChar = /\\(\\)?/g;
var stringToPath = function stringToPath2(string) {
  var first = $strSlice(string, 0, 1);
  var last = $strSlice(string, -1);
  if (first === "%" && last !== "%") {
    throw new $SyntaxError("invalid intrinsic syntax, expected closing `%`");
  } else if (last === "%" && first !== "%") {
    throw new $SyntaxError("invalid intrinsic syntax, expected opening `%`");
  }
  var result = [];
  $replace$1(string, rePropName, function(match, number, quote2, subString) {
    result[result.length] = quote2 ? $replace$1(subString, reEscapeChar, "$1") : number || match;
  });
  return result;
};
var getBaseIntrinsic = function getBaseIntrinsic2(name, allowMissing) {
  var intrinsicName = name;
  var alias;
  if (hasOwn$1(LEGACY_ALIASES, intrinsicName)) {
    alias = LEGACY_ALIASES[intrinsicName];
    intrinsicName = "%" + alias[0] + "%";
  }
  if (hasOwn$1(INTRINSICS, intrinsicName)) {
    var value = INTRINSICS[intrinsicName];
    if (value === needsEval) {
      value = doEval(intrinsicName);
    }
    if (typeof value === "undefined" && !allowMissing) {
      throw new $TypeError$1("intrinsic " + name + " exists, but is not available. Please file an issue!");
    }
    return {
      alias,
      name: intrinsicName,
      value
    };
  }
  throw new $SyntaxError("intrinsic " + name + " does not exist!");
};
var getIntrinsic = function GetIntrinsic(name, allowMissing) {
  if (typeof name !== "string" || name.length === 0) {
    throw new $TypeError$1("intrinsic name must be a non-empty string");
  }
  if (arguments.length > 1 && typeof allowMissing !== "boolean") {
    throw new $TypeError$1('"allowMissing" argument must be a boolean');
  }
  var parts = stringToPath(name);
  var intrinsicBaseName = parts.length > 0 ? parts[0] : "";
  var intrinsic = getBaseIntrinsic("%" + intrinsicBaseName + "%", allowMissing);
  var intrinsicRealName = intrinsic.name;
  var value = intrinsic.value;
  var skipFurtherCaching = false;
  var alias = intrinsic.alias;
  if (alias) {
    intrinsicBaseName = alias[0];
    $spliceApply(parts, $concat$1([0, 1], alias));
  }
  for (var i = 1, isOwn = true; i < parts.length; i += 1) {
    var part = parts[i];
    var first = $strSlice(part, 0, 1);
    var last = $strSlice(part, -1);
    if ((first === '"' || first === "'" || first === "`" || (last === '"' || last === "'" || last === "`")) && first !== last) {
      throw new $SyntaxError("property names with quotes must have matching quotes");
    }
    if (part === "constructor" || !isOwn) {
      skipFurtherCaching = true;
    }
    intrinsicBaseName += "." + part;
    intrinsicRealName = "%" + intrinsicBaseName + "%";
    if (hasOwn$1(INTRINSICS, intrinsicRealName)) {
      value = INTRINSICS[intrinsicRealName];
    } else if (value != null) {
      if (!(part in value)) {
        if (!allowMissing) {
          throw new $TypeError$1("base intrinsic for " + name + " exists, but the property is not available.");
        }
        return void 0;
      }
      if ($gOPD && i + 1 >= parts.length) {
        var desc = $gOPD(value, part);
        isOwn = !!desc;
        if (isOwn && "get" in desc && !("originalValue" in desc.get)) {
          value = desc.get;
        } else {
          value = value[part];
        }
      } else {
        isOwn = hasOwn$1(value, part);
        value = value[part];
      }
      if (isOwn && !skipFurtherCaching) {
        INTRINSICS[intrinsicRealName] = value;
      }
    }
  }
  return value;
};
var callBind$1 = { exports: {} };
(function(module) {
  var bind4 = functionBind;
  var GetIntrinsic3 = getIntrinsic;
  var $apply = GetIntrinsic3("%Function.prototype.apply%");
  var $call = GetIntrinsic3("%Function.prototype.call%");
  var $reflectApply = GetIntrinsic3("%Reflect.apply%", true) || bind4.call($call, $apply);
  var $gOPD2 = GetIntrinsic3("%Object.getOwnPropertyDescriptor%", true);
  var $defineProperty = GetIntrinsic3("%Object.defineProperty%", true);
  var $max = GetIntrinsic3("%Math.max%");
  if ($defineProperty) {
    try {
      $defineProperty({}, "a", { value: 1 });
    } catch (e) {
      $defineProperty = null;
    }
  }
  module.exports = function callBind2(originalFunction) {
    var func = $reflectApply(bind4, $call, arguments);
    if ($gOPD2 && $defineProperty) {
      var desc = $gOPD2(func, "length");
      if (desc.configurable) {
        $defineProperty(func, "length", { value: 1 + $max(0, originalFunction.length - (arguments.length - 1)) });
      }
    }
    return func;
  };
  var applyBind = function applyBind2() {
    return $reflectApply(bind4, $apply, arguments);
  };
  if ($defineProperty) {
    $defineProperty(module.exports, "apply", { value: applyBind });
  } else {
    module.exports.apply = applyBind;
  }
})(callBind$1);
var GetIntrinsic$1 = getIntrinsic;
var callBind = callBind$1.exports;
var $indexOf = callBind(GetIntrinsic$1("String.prototype.indexOf"));
var callBound$1 = function callBoundIntrinsic(name, allowMissing) {
  var intrinsic = GetIntrinsic$1(name, !!allowMissing);
  if (typeof intrinsic === "function" && $indexOf(name, ".prototype.") > -1) {
    return callBind(intrinsic);
  }
  return intrinsic;
};
var __viteBrowserExternal = {};
var __viteBrowserExternal$1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  "default": __viteBrowserExternal
}, Symbol.toStringTag, { value: "Module" }));
var require$$0 = /* @__PURE__ */ getAugmentedNamespace(__viteBrowserExternal$1);
var hasMap = typeof Map === "function" && Map.prototype;
var mapSizeDescriptor = Object.getOwnPropertyDescriptor && hasMap ? Object.getOwnPropertyDescriptor(Map.prototype, "size") : null;
var mapSize = hasMap && mapSizeDescriptor && typeof mapSizeDescriptor.get === "function" ? mapSizeDescriptor.get : null;
var mapForEach = hasMap && Map.prototype.forEach;
var hasSet = typeof Set === "function" && Set.prototype;
var setSizeDescriptor = Object.getOwnPropertyDescriptor && hasSet ? Object.getOwnPropertyDescriptor(Set.prototype, "size") : null;
var setSize = hasSet && setSizeDescriptor && typeof setSizeDescriptor.get === "function" ? setSizeDescriptor.get : null;
var setForEach = hasSet && Set.prototype.forEach;
var hasWeakMap = typeof WeakMap === "function" && WeakMap.prototype;
var weakMapHas = hasWeakMap ? WeakMap.prototype.has : null;
var hasWeakSet = typeof WeakSet === "function" && WeakSet.prototype;
var weakSetHas = hasWeakSet ? WeakSet.prototype.has : null;
var hasWeakRef = typeof WeakRef === "function" && WeakRef.prototype;
var weakRefDeref = hasWeakRef ? WeakRef.prototype.deref : null;
var booleanValueOf = Boolean.prototype.valueOf;
var objectToString = Object.prototype.toString;
var functionToString = Function.prototype.toString;
var $match = String.prototype.match;
var $slice = String.prototype.slice;
var $replace = String.prototype.replace;
var $toUpperCase = String.prototype.toUpperCase;
var $toLowerCase = String.prototype.toLowerCase;
var $test = RegExp.prototype.test;
var $concat = Array.prototype.concat;
var $join = Array.prototype.join;
var $arrSlice = Array.prototype.slice;
var $floor = Math.floor;
var bigIntValueOf = typeof BigInt === "function" ? BigInt.prototype.valueOf : null;
var gOPS = Object.getOwnPropertySymbols;
var symToString = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? Symbol.prototype.toString : null;
var hasShammedSymbols = typeof Symbol === "function" && typeof Symbol.iterator === "object";
var toStringTag = typeof Symbol === "function" && Symbol.toStringTag && (typeof Symbol.toStringTag === hasShammedSymbols ? "object" : "symbol") ? Symbol.toStringTag : null;
var isEnumerable = Object.prototype.propertyIsEnumerable;
var gPO = (typeof Reflect === "function" ? Reflect.getPrototypeOf : Object.getPrototypeOf) || ([].__proto__ === Array.prototype ? function(O) {
  return O.__proto__;
} : null);
function addNumericSeparator(num, str) {
  if (num === Infinity || num === -Infinity || num !== num || num && num > -1e3 && num < 1e3 || $test.call(/e/, str)) {
    return str;
  }
  var sepRegex = /[0-9](?=(?:[0-9]{3})+(?![0-9]))/g;
  if (typeof num === "number") {
    var int = num < 0 ? -$floor(-num) : $floor(num);
    if (int !== num) {
      var intStr = String(int);
      var dec = $slice.call(str, intStr.length + 1);
      return $replace.call(intStr, sepRegex, "$&_") + "." + $replace.call($replace.call(dec, /([0-9]{3})/g, "$&_"), /_$/, "");
    }
  }
  return $replace.call(str, sepRegex, "$&_");
}
var inspectCustom = require$$0.custom;
var inspectSymbol = inspectCustom && isSymbol(inspectCustom) ? inspectCustom : null;
var objectInspect = function inspect_(obj, options, depth, seen) {
  var opts = options || {};
  if (has$4(opts, "quoteStyle") && (opts.quoteStyle !== "single" && opts.quoteStyle !== "double")) {
    throw new TypeError('option "quoteStyle" must be "single" or "double"');
  }
  if (has$4(opts, "maxStringLength") && (typeof opts.maxStringLength === "number" ? opts.maxStringLength < 0 && opts.maxStringLength !== Infinity : opts.maxStringLength !== null)) {
    throw new TypeError('option "maxStringLength", if provided, must be a positive integer, Infinity, or `null`');
  }
  var customInspect = has$4(opts, "customInspect") ? opts.customInspect : true;
  if (typeof customInspect !== "boolean" && customInspect !== "symbol") {
    throw new TypeError("option \"customInspect\", if provided, must be `true`, `false`, or `'symbol'`");
  }
  if (has$4(opts, "indent") && opts.indent !== null && opts.indent !== "	" && !(parseInt(opts.indent, 10) === opts.indent && opts.indent > 0)) {
    throw new TypeError('option "indent" must be "\\t", an integer > 0, or `null`');
  }
  if (has$4(opts, "numericSeparator") && typeof opts.numericSeparator !== "boolean") {
    throw new TypeError('option "numericSeparator", if provided, must be `true` or `false`');
  }
  var numericSeparator = opts.numericSeparator;
  if (typeof obj === "undefined") {
    return "undefined";
  }
  if (obj === null) {
    return "null";
  }
  if (typeof obj === "boolean") {
    return obj ? "true" : "false";
  }
  if (typeof obj === "string") {
    return inspectString(obj, opts);
  }
  if (typeof obj === "number") {
    if (obj === 0) {
      return Infinity / obj > 0 ? "0" : "-0";
    }
    var str = String(obj);
    return numericSeparator ? addNumericSeparator(obj, str) : str;
  }
  if (typeof obj === "bigint") {
    var bigIntStr = String(obj) + "n";
    return numericSeparator ? addNumericSeparator(obj, bigIntStr) : bigIntStr;
  }
  var maxDepth = typeof opts.depth === "undefined" ? 5 : opts.depth;
  if (typeof depth === "undefined") {
    depth = 0;
  }
  if (depth >= maxDepth && maxDepth > 0 && typeof obj === "object") {
    return isArray$3(obj) ? "[Array]" : "[Object]";
  }
  var indent = getIndent(opts, depth);
  if (typeof seen === "undefined") {
    seen = [];
  } else if (indexOf(seen, obj) >= 0) {
    return "[Circular]";
  }
  function inspect2(value, from, noIndent) {
    if (from) {
      seen = $arrSlice.call(seen);
      seen.push(from);
    }
    if (noIndent) {
      var newOpts = {
        depth: opts.depth
      };
      if (has$4(opts, "quoteStyle")) {
        newOpts.quoteStyle = opts.quoteStyle;
      }
      return inspect_(value, newOpts, depth + 1, seen);
    }
    return inspect_(value, opts, depth + 1, seen);
  }
  if (typeof obj === "function" && !isRegExp$1(obj)) {
    var name = nameOf(obj);
    var keys = arrObjKeys(obj, inspect2);
    return "[Function" + (name ? ": " + name : " (anonymous)") + "]" + (keys.length > 0 ? " { " + $join.call(keys, ", ") + " }" : "");
  }
  if (isSymbol(obj)) {
    var symString = hasShammedSymbols ? $replace.call(String(obj), /^(Symbol\(.*\))_[^)]*$/, "$1") : symToString.call(obj);
    return typeof obj === "object" && !hasShammedSymbols ? markBoxed(symString) : symString;
  }
  if (isElement(obj)) {
    var s = "<" + $toLowerCase.call(String(obj.nodeName));
    var attrs = obj.attributes || [];
    for (var i = 0; i < attrs.length; i++) {
      s += " " + attrs[i].name + "=" + wrapQuotes(quote(attrs[i].value), "double", opts);
    }
    s += ">";
    if (obj.childNodes && obj.childNodes.length) {
      s += "...";
    }
    s += "</" + $toLowerCase.call(String(obj.nodeName)) + ">";
    return s;
  }
  if (isArray$3(obj)) {
    if (obj.length === 0) {
      return "[]";
    }
    var xs = arrObjKeys(obj, inspect2);
    if (indent && !singleLineValues(xs)) {
      return "[" + indentedJoin(xs, indent) + "]";
    }
    return "[ " + $join.call(xs, ", ") + " ]";
  }
  if (isError(obj)) {
    var parts = arrObjKeys(obj, inspect2);
    if ("cause" in obj && !isEnumerable.call(obj, "cause")) {
      return "{ [" + String(obj) + "] " + $join.call($concat.call("[cause]: " + inspect2(obj.cause), parts), ", ") + " }";
    }
    if (parts.length === 0) {
      return "[" + String(obj) + "]";
    }
    return "{ [" + String(obj) + "] " + $join.call(parts, ", ") + " }";
  }
  if (typeof obj === "object" && customInspect) {
    if (inspectSymbol && typeof obj[inspectSymbol] === "function") {
      return obj[inspectSymbol]();
    } else if (customInspect !== "symbol" && typeof obj.inspect === "function") {
      return obj.inspect();
    }
  }
  if (isMap(obj)) {
    var mapParts = [];
    mapForEach.call(obj, function(value, key) {
      mapParts.push(inspect2(key, obj, true) + " => " + inspect2(value, obj));
    });
    return collectionOf("Map", mapSize.call(obj), mapParts, indent);
  }
  if (isSet(obj)) {
    var setParts = [];
    setForEach.call(obj, function(value) {
      setParts.push(inspect2(value, obj));
    });
    return collectionOf("Set", setSize.call(obj), setParts, indent);
  }
  if (isWeakMap(obj)) {
    return weakCollectionOf("WeakMap");
  }
  if (isWeakSet(obj)) {
    return weakCollectionOf("WeakSet");
  }
  if (isWeakRef(obj)) {
    return weakCollectionOf("WeakRef");
  }
  if (isNumber(obj)) {
    return markBoxed(inspect2(Number(obj)));
  }
  if (isBigInt(obj)) {
    return markBoxed(inspect2(bigIntValueOf.call(obj)));
  }
  if (isBoolean(obj)) {
    return markBoxed(booleanValueOf.call(obj));
  }
  if (isString(obj)) {
    return markBoxed(inspect2(String(obj)));
  }
  if (!isDate(obj) && !isRegExp$1(obj)) {
    var ys = arrObjKeys(obj, inspect2);
    var isPlainObject2 = gPO ? gPO(obj) === Object.prototype : obj instanceof Object || obj.constructor === Object;
    var protoTag = obj instanceof Object ? "" : "null prototype";
    var stringTag = !isPlainObject2 && toStringTag && Object(obj) === obj && toStringTag in obj ? $slice.call(toStr(obj), 8, -1) : protoTag ? "Object" : "";
    var constructorTag = isPlainObject2 || typeof obj.constructor !== "function" ? "" : obj.constructor.name ? obj.constructor.name + " " : "";
    var tag = constructorTag + (stringTag || protoTag ? "[" + $join.call($concat.call([], stringTag || [], protoTag || []), ": ") + "] " : "");
    if (ys.length === 0) {
      return tag + "{}";
    }
    if (indent) {
      return tag + "{" + indentedJoin(ys, indent) + "}";
    }
    return tag + "{ " + $join.call(ys, ", ") + " }";
  }
  return String(obj);
};
function wrapQuotes(s, defaultStyle, opts) {
  var quoteChar = (opts.quoteStyle || defaultStyle) === "double" ? '"' : "'";
  return quoteChar + s + quoteChar;
}
function quote(s) {
  return $replace.call(String(s), /"/g, "&quot;");
}
function isArray$3(obj) {
  return toStr(obj) === "[object Array]" && (!toStringTag || !(typeof obj === "object" && toStringTag in obj));
}
function isDate(obj) {
  return toStr(obj) === "[object Date]" && (!toStringTag || !(typeof obj === "object" && toStringTag in obj));
}
function isRegExp$1(obj) {
  return toStr(obj) === "[object RegExp]" && (!toStringTag || !(typeof obj === "object" && toStringTag in obj));
}
function isError(obj) {
  return toStr(obj) === "[object Error]" && (!toStringTag || !(typeof obj === "object" && toStringTag in obj));
}
function isString(obj) {
  return toStr(obj) === "[object String]" && (!toStringTag || !(typeof obj === "object" && toStringTag in obj));
}
function isNumber(obj) {
  return toStr(obj) === "[object Number]" && (!toStringTag || !(typeof obj === "object" && toStringTag in obj));
}
function isBoolean(obj) {
  return toStr(obj) === "[object Boolean]" && (!toStringTag || !(typeof obj === "object" && toStringTag in obj));
}
function isSymbol(obj) {
  if (hasShammedSymbols) {
    return obj && typeof obj === "object" && obj instanceof Symbol;
  }
  if (typeof obj === "symbol") {
    return true;
  }
  if (!obj || typeof obj !== "object" || !symToString) {
    return false;
  }
  try {
    symToString.call(obj);
    return true;
  } catch (e) {
  }
  return false;
}
function isBigInt(obj) {
  if (!obj || typeof obj !== "object" || !bigIntValueOf) {
    return false;
  }
  try {
    bigIntValueOf.call(obj);
    return true;
  } catch (e) {
  }
  return false;
}
var hasOwn = Object.prototype.hasOwnProperty || function(key) {
  return key in this;
};
function has$4(obj, key) {
  return hasOwn.call(obj, key);
}
function toStr(obj) {
  return objectToString.call(obj);
}
function nameOf(f) {
  if (f.name) {
    return f.name;
  }
  var m = $match.call(functionToString.call(f), /^function\s*([\w$]+)/);
  if (m) {
    return m[1];
  }
  return null;
}
function indexOf(xs, x) {
  if (xs.indexOf) {
    return xs.indexOf(x);
  }
  for (var i = 0, l = xs.length; i < l; i++) {
    if (xs[i] === x) {
      return i;
    }
  }
  return -1;
}
function isMap(x) {
  if (!mapSize || !x || typeof x !== "object") {
    return false;
  }
  try {
    mapSize.call(x);
    try {
      setSize.call(x);
    } catch (s) {
      return true;
    }
    return x instanceof Map;
  } catch (e) {
  }
  return false;
}
function isWeakMap(x) {
  if (!weakMapHas || !x || typeof x !== "object") {
    return false;
  }
  try {
    weakMapHas.call(x, weakMapHas);
    try {
      weakSetHas.call(x, weakSetHas);
    } catch (s) {
      return true;
    }
    return x instanceof WeakMap;
  } catch (e) {
  }
  return false;
}
function isWeakRef(x) {
  if (!weakRefDeref || !x || typeof x !== "object") {
    return false;
  }
  try {
    weakRefDeref.call(x);
    return true;
  } catch (e) {
  }
  return false;
}
function isSet(x) {
  if (!setSize || !x || typeof x !== "object") {
    return false;
  }
  try {
    setSize.call(x);
    try {
      mapSize.call(x);
    } catch (m) {
      return true;
    }
    return x instanceof Set;
  } catch (e) {
  }
  return false;
}
function isWeakSet(x) {
  if (!weakSetHas || !x || typeof x !== "object") {
    return false;
  }
  try {
    weakSetHas.call(x, weakSetHas);
    try {
      weakMapHas.call(x, weakMapHas);
    } catch (s) {
      return true;
    }
    return x instanceof WeakSet;
  } catch (e) {
  }
  return false;
}
function isElement(x) {
  if (!x || typeof x !== "object") {
    return false;
  }
  if (typeof HTMLElement !== "undefined" && x instanceof HTMLElement) {
    return true;
  }
  return typeof x.nodeName === "string" && typeof x.getAttribute === "function";
}
function inspectString(str, opts) {
  if (str.length > opts.maxStringLength) {
    var remaining = str.length - opts.maxStringLength;
    var trailer = "... " + remaining + " more character" + (remaining > 1 ? "s" : "");
    return inspectString($slice.call(str, 0, opts.maxStringLength), opts) + trailer;
  }
  var s = $replace.call($replace.call(str, /(['\\])/g, "\\$1"), /[\x00-\x1f]/g, lowbyte);
  return wrapQuotes(s, "single", opts);
}
function lowbyte(c) {
  var n = c.charCodeAt(0);
  var x = {
    8: "b",
    9: "t",
    10: "n",
    12: "f",
    13: "r"
  }[n];
  if (x) {
    return "\\" + x;
  }
  return "\\x" + (n < 16 ? "0" : "") + $toUpperCase.call(n.toString(16));
}
function markBoxed(str) {
  return "Object(" + str + ")";
}
function weakCollectionOf(type) {
  return type + " { ? }";
}
function collectionOf(type, size, entries, indent) {
  var joinedEntries = indent ? indentedJoin(entries, indent) : $join.call(entries, ", ");
  return type + " (" + size + ") {" + joinedEntries + "}";
}
function singleLineValues(xs) {
  for (var i = 0; i < xs.length; i++) {
    if (indexOf(xs[i], "\n") >= 0) {
      return false;
    }
  }
  return true;
}
function getIndent(opts, depth) {
  var baseIndent;
  if (opts.indent === "	") {
    baseIndent = "	";
  } else if (typeof opts.indent === "number" && opts.indent > 0) {
    baseIndent = $join.call(Array(opts.indent + 1), " ");
  } else {
    return null;
  }
  return {
    base: baseIndent,
    prev: $join.call(Array(depth + 1), baseIndent)
  };
}
function indentedJoin(xs, indent) {
  if (xs.length === 0) {
    return "";
  }
  var lineJoiner = "\n" + indent.prev + indent.base;
  return lineJoiner + $join.call(xs, "," + lineJoiner) + "\n" + indent.prev;
}
function arrObjKeys(obj, inspect2) {
  var isArr = isArray$3(obj);
  var xs = [];
  if (isArr) {
    xs.length = obj.length;
    for (var i = 0; i < obj.length; i++) {
      xs[i] = has$4(obj, i) ? inspect2(obj[i], obj) : "";
    }
  }
  var syms = typeof gOPS === "function" ? gOPS(obj) : [];
  var symMap;
  if (hasShammedSymbols) {
    symMap = {};
    for (var k = 0; k < syms.length; k++) {
      symMap["$" + syms[k]] = syms[k];
    }
  }
  for (var key in obj) {
    if (!has$4(obj, key)) {
      continue;
    }
    if (isArr && String(Number(key)) === key && key < obj.length) {
      continue;
    }
    if (hasShammedSymbols && symMap["$" + key] instanceof Symbol) {
      continue;
    } else if ($test.call(/[^\w$]/, key)) {
      xs.push(inspect2(key, obj) + ": " + inspect2(obj[key], obj));
    } else {
      xs.push(key + ": " + inspect2(obj[key], obj));
    }
  }
  if (typeof gOPS === "function") {
    for (var j = 0; j < syms.length; j++) {
      if (isEnumerable.call(obj, syms[j])) {
        xs.push("[" + inspect2(syms[j]) + "]: " + inspect2(obj[syms[j]], obj));
      }
    }
  }
  return xs;
}
var GetIntrinsic2 = getIntrinsic;
var callBound = callBound$1;
var inspect = objectInspect;
var $TypeError = GetIntrinsic2("%TypeError%");
var $WeakMap = GetIntrinsic2("%WeakMap%", true);
var $Map = GetIntrinsic2("%Map%", true);
var $weakMapGet = callBound("WeakMap.prototype.get", true);
var $weakMapSet = callBound("WeakMap.prototype.set", true);
var $weakMapHas = callBound("WeakMap.prototype.has", true);
var $mapGet = callBound("Map.prototype.get", true);
var $mapSet = callBound("Map.prototype.set", true);
var $mapHas = callBound("Map.prototype.has", true);
var listGetNode = function(list, key) {
  for (var prev = list, curr; (curr = prev.next) !== null; prev = curr) {
    if (curr.key === key) {
      prev.next = curr.next;
      curr.next = list.next;
      list.next = curr;
      return curr;
    }
  }
};
var listGet = function(objects, key) {
  var node = listGetNode(objects, key);
  return node && node.value;
};
var listSet = function(objects, key, value) {
  var node = listGetNode(objects, key);
  if (node) {
    node.value = value;
  } else {
    objects.next = {
      key,
      next: objects.next,
      value
    };
  }
};
var listHas = function(objects, key) {
  return !!listGetNode(objects, key);
};
var sideChannel = function getSideChannel() {
  var $wm;
  var $m;
  var $o;
  var channel = {
    assert: function(key) {
      if (!channel.has(key)) {
        throw new $TypeError("Side channel does not contain " + inspect(key));
      }
    },
    get: function(key) {
      if ($WeakMap && key && (typeof key === "object" || typeof key === "function")) {
        if ($wm) {
          return $weakMapGet($wm, key);
        }
      } else if ($Map) {
        if ($m) {
          return $mapGet($m, key);
        }
      } else {
        if ($o) {
          return listGet($o, key);
        }
      }
    },
    has: function(key) {
      if ($WeakMap && key && (typeof key === "object" || typeof key === "function")) {
        if ($wm) {
          return $weakMapHas($wm, key);
        }
      } else if ($Map) {
        if ($m) {
          return $mapHas($m, key);
        }
      } else {
        if ($o) {
          return listHas($o, key);
        }
      }
      return false;
    },
    set: function(key, value) {
      if ($WeakMap && key && (typeof key === "object" || typeof key === "function")) {
        if (!$wm) {
          $wm = new $WeakMap();
        }
        $weakMapSet($wm, key, value);
      } else if ($Map) {
        if (!$m) {
          $m = new $Map();
        }
        $mapSet($m, key, value);
      } else {
        if (!$o) {
          $o = { key: {}, next: null };
        }
        listSet($o, key, value);
      }
    }
  };
  return channel;
};
var replace = String.prototype.replace;
var percentTwenties = /%20/g;
var Format = {
  RFC1738: "RFC1738",
  RFC3986: "RFC3986"
};
var formats$3 = {
  "default": Format.RFC3986,
  formatters: {
    RFC1738: function(value) {
      return replace.call(value, percentTwenties, "+");
    },
    RFC3986: function(value) {
      return String(value);
    }
  },
  RFC1738: Format.RFC1738,
  RFC3986: Format.RFC3986
};
var formats$2 = formats$3;
var has$3 = Object.prototype.hasOwnProperty;
var isArray$2 = Array.isArray;
var hexTable = function() {
  var array = [];
  for (var i = 0; i < 256; ++i) {
    array.push("%" + ((i < 16 ? "0" : "") + i.toString(16)).toUpperCase());
  }
  return array;
}();
var compactQueue = function compactQueue2(queue) {
  while (queue.length > 1) {
    var item = queue.pop();
    var obj = item.obj[item.prop];
    if (isArray$2(obj)) {
      var compacted = [];
      for (var j = 0; j < obj.length; ++j) {
        if (typeof obj[j] !== "undefined") {
          compacted.push(obj[j]);
        }
      }
      item.obj[item.prop] = compacted;
    }
  }
};
var arrayToObject = function arrayToObject2(source2, options) {
  var obj = options && options.plainObjects ? /* @__PURE__ */ Object.create(null) : {};
  for (var i = 0; i < source2.length; ++i) {
    if (typeof source2[i] !== "undefined") {
      obj[i] = source2[i];
    }
  }
  return obj;
};
var merge = function merge2(target, source2, options) {
  if (!source2) {
    return target;
  }
  if (typeof source2 !== "object") {
    if (isArray$2(target)) {
      target.push(source2);
    } else if (target && typeof target === "object") {
      if (options && (options.plainObjects || options.allowPrototypes) || !has$3.call(Object.prototype, source2)) {
        target[source2] = true;
      }
    } else {
      return [target, source2];
    }
    return target;
  }
  if (!target || typeof target !== "object") {
    return [target].concat(source2);
  }
  var mergeTarget = target;
  if (isArray$2(target) && !isArray$2(source2)) {
    mergeTarget = arrayToObject(target, options);
  }
  if (isArray$2(target) && isArray$2(source2)) {
    source2.forEach(function(item, i) {
      if (has$3.call(target, i)) {
        var targetItem = target[i];
        if (targetItem && typeof targetItem === "object" && item && typeof item === "object") {
          target[i] = merge2(targetItem, item, options);
        } else {
          target.push(item);
        }
      } else {
        target[i] = item;
      }
    });
    return target;
  }
  return Object.keys(source2).reduce(function(acc, key) {
    var value = source2[key];
    if (has$3.call(acc, key)) {
      acc[key] = merge2(acc[key], value, options);
    } else {
      acc[key] = value;
    }
    return acc;
  }, mergeTarget);
};
var assign = function assignSingleSource(target, source2) {
  return Object.keys(source2).reduce(function(acc, key) {
    acc[key] = source2[key];
    return acc;
  }, target);
};
var decode = function(str, decoder, charset) {
  var strWithoutPlus = str.replace(/\+/g, " ");
  if (charset === "iso-8859-1") {
    return strWithoutPlus.replace(/%[0-9a-f]{2}/gi, unescape);
  }
  try {
    return decodeURIComponent(strWithoutPlus);
  } catch (e) {
    return strWithoutPlus;
  }
};
var encode = function encode2(str, defaultEncoder, charset, kind, format2) {
  if (str.length === 0) {
    return str;
  }
  var string = str;
  if (typeof str === "symbol") {
    string = Symbol.prototype.toString.call(str);
  } else if (typeof str !== "string") {
    string = String(str);
  }
  if (charset === "iso-8859-1") {
    return escape(string).replace(/%u[0-9a-f]{4}/gi, function($0) {
      return "%26%23" + parseInt($0.slice(2), 16) + "%3B";
    });
  }
  var out = "";
  for (var i = 0; i < string.length; ++i) {
    var c = string.charCodeAt(i);
    if (c === 45 || c === 46 || c === 95 || c === 126 || c >= 48 && c <= 57 || c >= 65 && c <= 90 || c >= 97 && c <= 122 || format2 === formats$2.RFC1738 && (c === 40 || c === 41)) {
      out += string.charAt(i);
      continue;
    }
    if (c < 128) {
      out = out + hexTable[c];
      continue;
    }
    if (c < 2048) {
      out = out + (hexTable[192 | c >> 6] + hexTable[128 | c & 63]);
      continue;
    }
    if (c < 55296 || c >= 57344) {
      out = out + (hexTable[224 | c >> 12] + hexTable[128 | c >> 6 & 63] + hexTable[128 | c & 63]);
      continue;
    }
    i += 1;
    c = 65536 + ((c & 1023) << 10 | string.charCodeAt(i) & 1023);
    out += hexTable[240 | c >> 18] + hexTable[128 | c >> 12 & 63] + hexTable[128 | c >> 6 & 63] + hexTable[128 | c & 63];
  }
  return out;
};
var compact = function compact2(value) {
  var queue = [{ obj: { o: value }, prop: "o" }];
  var refs = [];
  for (var i = 0; i < queue.length; ++i) {
    var item = queue[i];
    var obj = item.obj[item.prop];
    var keys = Object.keys(obj);
    for (var j = 0; j < keys.length; ++j) {
      var key = keys[j];
      var val = obj[key];
      if (typeof val === "object" && val !== null && refs.indexOf(val) === -1) {
        queue.push({ obj, prop: key });
        refs.push(val);
      }
    }
  }
  compactQueue(queue);
  return value;
};
var isRegExp = function isRegExp2(obj) {
  return Object.prototype.toString.call(obj) === "[object RegExp]";
};
var isBuffer = function isBuffer2(obj) {
  if (!obj || typeof obj !== "object") {
    return false;
  }
  return !!(obj.constructor && obj.constructor.isBuffer && obj.constructor.isBuffer(obj));
};
var combine = function combine2(a, b) {
  return [].concat(a, b);
};
var maybeMap = function maybeMap2(val, fn) {
  if (isArray$2(val)) {
    var mapped = [];
    for (var i = 0; i < val.length; i += 1) {
      mapped.push(fn(val[i]));
    }
    return mapped;
  }
  return fn(val);
};
var utils$2 = {
  arrayToObject,
  assign,
  combine,
  compact,
  decode,
  encode,
  isBuffer,
  isRegExp,
  maybeMap,
  merge
};
var getSideChannel2 = sideChannel;
var utils$1 = utils$2;
var formats$1 = formats$3;
var has$2 = Object.prototype.hasOwnProperty;
var arrayPrefixGenerators = {
  brackets: function brackets(prefix) {
    return prefix + "[]";
  },
  comma: "comma",
  indices: function indices(prefix, key) {
    return prefix + "[" + key + "]";
  },
  repeat: function repeat(prefix) {
    return prefix;
  }
};
var isArray$1 = Array.isArray;
var split = String.prototype.split;
var push = Array.prototype.push;
var pushToArray = function(arr, valueOrArray) {
  push.apply(arr, isArray$1(valueOrArray) ? valueOrArray : [valueOrArray]);
};
var toISO = Date.prototype.toISOString;
var defaultFormat = formats$1["default"];
var defaults$1 = {
  addQueryPrefix: false,
  allowDots: false,
  charset: "utf-8",
  charsetSentinel: false,
  delimiter: "&",
  encode: true,
  encoder: utils$1.encode,
  encodeValuesOnly: false,
  format: defaultFormat,
  formatter: formats$1.formatters[defaultFormat],
  indices: false,
  serializeDate: function serializeDate(date) {
    return toISO.call(date);
  },
  skipNulls: false,
  strictNullHandling: false
};
var isNonNullishPrimitive = function isNonNullishPrimitive2(v) {
  return typeof v === "string" || typeof v === "number" || typeof v === "boolean" || typeof v === "symbol" || typeof v === "bigint";
};
var sentinel = {};
var stringify$1 = function stringify(object, prefix, generateArrayPrefix, strictNullHandling, skipNulls, encoder, filter, sort, allowDots, serializeDate2, format2, formatter, encodeValuesOnly, charset, sideChannel2) {
  var obj = object;
  var tmpSc = sideChannel2;
  var step = 0;
  var findFlag = false;
  while ((tmpSc = tmpSc.get(sentinel)) !== void 0 && !findFlag) {
    var pos = tmpSc.get(object);
    step += 1;
    if (typeof pos !== "undefined") {
      if (pos === step) {
        throw new RangeError("Cyclic object value");
      } else {
        findFlag = true;
      }
    }
    if (typeof tmpSc.get(sentinel) === "undefined") {
      step = 0;
    }
  }
  if (typeof filter === "function") {
    obj = filter(prefix, obj);
  } else if (obj instanceof Date) {
    obj = serializeDate2(obj);
  } else if (generateArrayPrefix === "comma" && isArray$1(obj)) {
    obj = utils$1.maybeMap(obj, function(value2) {
      if (value2 instanceof Date) {
        return serializeDate2(value2);
      }
      return value2;
    });
  }
  if (obj === null) {
    if (strictNullHandling) {
      return encoder && !encodeValuesOnly ? encoder(prefix, defaults$1.encoder, charset, "key", format2) : prefix;
    }
    obj = "";
  }
  if (isNonNullishPrimitive(obj) || utils$1.isBuffer(obj)) {
    if (encoder) {
      var keyValue = encodeValuesOnly ? prefix : encoder(prefix, defaults$1.encoder, charset, "key", format2);
      if (generateArrayPrefix === "comma" && encodeValuesOnly) {
        var valuesArray = split.call(String(obj), ",");
        var valuesJoined = "";
        for (var i = 0; i < valuesArray.length; ++i) {
          valuesJoined += (i === 0 ? "" : ",") + formatter(encoder(valuesArray[i], defaults$1.encoder, charset, "value", format2));
        }
        return [formatter(keyValue) + "=" + valuesJoined];
      }
      return [formatter(keyValue) + "=" + formatter(encoder(obj, defaults$1.encoder, charset, "value", format2))];
    }
    return [formatter(prefix) + "=" + formatter(String(obj))];
  }
  var values = [];
  if (typeof obj === "undefined") {
    return values;
  }
  var objKeys;
  if (generateArrayPrefix === "comma" && isArray$1(obj)) {
    objKeys = [{ value: obj.length > 0 ? obj.join(",") || null : void 0 }];
  } else if (isArray$1(filter)) {
    objKeys = filter;
  } else {
    var keys = Object.keys(obj);
    objKeys = sort ? keys.sort(sort) : keys;
  }
  for (var j = 0; j < objKeys.length; ++j) {
    var key = objKeys[j];
    var value = typeof key === "object" && typeof key.value !== "undefined" ? key.value : obj[key];
    if (skipNulls && value === null) {
      continue;
    }
    var keyPrefix = isArray$1(obj) ? typeof generateArrayPrefix === "function" ? generateArrayPrefix(prefix, key) : prefix : prefix + (allowDots ? "." + key : "[" + key + "]");
    sideChannel2.set(object, step);
    var valueSideChannel = getSideChannel2();
    valueSideChannel.set(sentinel, sideChannel2);
    pushToArray(values, stringify(value, keyPrefix, generateArrayPrefix, strictNullHandling, skipNulls, encoder, filter, sort, allowDots, serializeDate2, format2, formatter, encodeValuesOnly, charset, valueSideChannel));
  }
  return values;
};
var normalizeStringifyOptions = function normalizeStringifyOptions2(opts) {
  if (!opts) {
    return defaults$1;
  }
  if (opts.encoder !== null && typeof opts.encoder !== "undefined" && typeof opts.encoder !== "function") {
    throw new TypeError("Encoder has to be a function.");
  }
  var charset = opts.charset || defaults$1.charset;
  if (typeof opts.charset !== "undefined" && opts.charset !== "utf-8" && opts.charset !== "iso-8859-1") {
    throw new TypeError("The charset option must be either utf-8, iso-8859-1, or undefined");
  }
  var format2 = formats$1["default"];
  if (typeof opts.format !== "undefined") {
    if (!has$2.call(formats$1.formatters, opts.format)) {
      throw new TypeError("Unknown format option provided.");
    }
    format2 = opts.format;
  }
  var formatter = formats$1.formatters[format2];
  var filter = defaults$1.filter;
  if (typeof opts.filter === "function" || isArray$1(opts.filter)) {
    filter = opts.filter;
  }
  return {
    addQueryPrefix: typeof opts.addQueryPrefix === "boolean" ? opts.addQueryPrefix : defaults$1.addQueryPrefix,
    allowDots: typeof opts.allowDots === "undefined" ? defaults$1.allowDots : !!opts.allowDots,
    charset,
    charsetSentinel: typeof opts.charsetSentinel === "boolean" ? opts.charsetSentinel : defaults$1.charsetSentinel,
    delimiter: typeof opts.delimiter === "undefined" ? defaults$1.delimiter : opts.delimiter,
    encode: typeof opts.encode === "boolean" ? opts.encode : defaults$1.encode,
    encoder: typeof opts.encoder === "function" ? opts.encoder : defaults$1.encoder,
    encodeValuesOnly: typeof opts.encodeValuesOnly === "boolean" ? opts.encodeValuesOnly : defaults$1.encodeValuesOnly,
    filter,
    format: format2,
    formatter,
    serializeDate: typeof opts.serializeDate === "function" ? opts.serializeDate : defaults$1.serializeDate,
    skipNulls: typeof opts.skipNulls === "boolean" ? opts.skipNulls : defaults$1.skipNulls,
    sort: typeof opts.sort === "function" ? opts.sort : null,
    strictNullHandling: typeof opts.strictNullHandling === "boolean" ? opts.strictNullHandling : defaults$1.strictNullHandling
  };
};
var stringify_1 = function(object, opts) {
  var obj = object;
  var options = normalizeStringifyOptions(opts);
  var objKeys;
  var filter;
  if (typeof options.filter === "function") {
    filter = options.filter;
    obj = filter("", obj);
  } else if (isArray$1(options.filter)) {
    filter = options.filter;
    objKeys = filter;
  }
  var keys = [];
  if (typeof obj !== "object" || obj === null) {
    return "";
  }
  var arrayFormat;
  if (opts && opts.arrayFormat in arrayPrefixGenerators) {
    arrayFormat = opts.arrayFormat;
  } else if (opts && "indices" in opts) {
    arrayFormat = opts.indices ? "indices" : "repeat";
  } else {
    arrayFormat = "indices";
  }
  var generateArrayPrefix = arrayPrefixGenerators[arrayFormat];
  if (!objKeys) {
    objKeys = Object.keys(obj);
  }
  if (options.sort) {
    objKeys.sort(options.sort);
  }
  var sideChannel2 = getSideChannel2();
  for (var i = 0; i < objKeys.length; ++i) {
    var key = objKeys[i];
    if (options.skipNulls && obj[key] === null) {
      continue;
    }
    pushToArray(keys, stringify$1(obj[key], key, generateArrayPrefix, options.strictNullHandling, options.skipNulls, options.encode ? options.encoder : null, options.filter, options.sort, options.allowDots, options.serializeDate, options.format, options.formatter, options.encodeValuesOnly, options.charset, sideChannel2));
  }
  var joined = keys.join(options.delimiter);
  var prefix = options.addQueryPrefix === true ? "?" : "";
  if (options.charsetSentinel) {
    if (options.charset === "iso-8859-1") {
      prefix += "utf8=%26%2310003%3B&";
    } else {
      prefix += "utf8=%E2%9C%93&";
    }
  }
  return joined.length > 0 ? prefix + joined : "";
};
var utils = utils$2;
var has$1 = Object.prototype.hasOwnProperty;
var isArray = Array.isArray;
var defaults = {
  allowDots: false,
  allowPrototypes: false,
  allowSparse: false,
  arrayLimit: 20,
  charset: "utf-8",
  charsetSentinel: false,
  comma: false,
  decoder: utils.decode,
  delimiter: "&",
  depth: 5,
  ignoreQueryPrefix: false,
  interpretNumericEntities: false,
  parameterLimit: 1e3,
  parseArrays: true,
  plainObjects: false,
  strictNullHandling: false
};
var interpretNumericEntities = function(str) {
  return str.replace(/&#(\d+);/g, function($0, numberStr) {
    return String.fromCharCode(parseInt(numberStr, 10));
  });
};
var parseArrayValue = function(val, options) {
  if (val && typeof val === "string" && options.comma && val.indexOf(",") > -1) {
    return val.split(",");
  }
  return val;
};
var isoSentinel = "utf8=%26%2310003%3B";
var charsetSentinel = "utf8=%E2%9C%93";
var parseValues = function parseQueryStringValues(str, options) {
  var obj = {};
  var cleanStr = options.ignoreQueryPrefix ? str.replace(/^\?/, "") : str;
  var limit = options.parameterLimit === Infinity ? void 0 : options.parameterLimit;
  var parts = cleanStr.split(options.delimiter, limit);
  var skipIndex = -1;
  var i;
  var charset = options.charset;
  if (options.charsetSentinel) {
    for (i = 0; i < parts.length; ++i) {
      if (parts[i].indexOf("utf8=") === 0) {
        if (parts[i] === charsetSentinel) {
          charset = "utf-8";
        } else if (parts[i] === isoSentinel) {
          charset = "iso-8859-1";
        }
        skipIndex = i;
        i = parts.length;
      }
    }
  }
  for (i = 0; i < parts.length; ++i) {
    if (i === skipIndex) {
      continue;
    }
    var part = parts[i];
    var bracketEqualsPos = part.indexOf("]=");
    var pos = bracketEqualsPos === -1 ? part.indexOf("=") : bracketEqualsPos + 1;
    var key, val;
    if (pos === -1) {
      key = options.decoder(part, defaults.decoder, charset, "key");
      val = options.strictNullHandling ? null : "";
    } else {
      key = options.decoder(part.slice(0, pos), defaults.decoder, charset, "key");
      val = utils.maybeMap(parseArrayValue(part.slice(pos + 1), options), function(encodedVal) {
        return options.decoder(encodedVal, defaults.decoder, charset, "value");
      });
    }
    if (val && options.interpretNumericEntities && charset === "iso-8859-1") {
      val = interpretNumericEntities(val);
    }
    if (part.indexOf("[]=") > -1) {
      val = isArray(val) ? [val] : val;
    }
    if (has$1.call(obj, key)) {
      obj[key] = utils.combine(obj[key], val);
    } else {
      obj[key] = val;
    }
  }
  return obj;
};
var parseObject = function(chain, val, options, valuesParsed) {
  var leaf = valuesParsed ? val : parseArrayValue(val, options);
  for (var i = chain.length - 1; i >= 0; --i) {
    var obj;
    var root = chain[i];
    if (root === "[]" && options.parseArrays) {
      obj = [].concat(leaf);
    } else {
      obj = options.plainObjects ? /* @__PURE__ */ Object.create(null) : {};
      var cleanRoot = root.charAt(0) === "[" && root.charAt(root.length - 1) === "]" ? root.slice(1, -1) : root;
      var index = parseInt(cleanRoot, 10);
      if (!options.parseArrays && cleanRoot === "") {
        obj = { 0: leaf };
      } else if (!isNaN(index) && root !== cleanRoot && String(index) === cleanRoot && index >= 0 && (options.parseArrays && index <= options.arrayLimit)) {
        obj = [];
        obj[index] = leaf;
      } else if (cleanRoot !== "__proto__") {
        obj[cleanRoot] = leaf;
      }
    }
    leaf = obj;
  }
  return leaf;
};
var parseKeys = function parseQueryStringKeys(givenKey, val, options, valuesParsed) {
  if (!givenKey) {
    return;
  }
  var key = options.allowDots ? givenKey.replace(/\.([^.[]+)/g, "[$1]") : givenKey;
  var brackets2 = /(\[[^[\]]*])/;
  var child = /(\[[^[\]]*])/g;
  var segment = options.depth > 0 && brackets2.exec(key);
  var parent = segment ? key.slice(0, segment.index) : key;
  var keys = [];
  if (parent) {
    if (!options.plainObjects && has$1.call(Object.prototype, parent)) {
      if (!options.allowPrototypes) {
        return;
      }
    }
    keys.push(parent);
  }
  var i = 0;
  while (options.depth > 0 && (segment = child.exec(key)) !== null && i < options.depth) {
    i += 1;
    if (!options.plainObjects && has$1.call(Object.prototype, segment[1].slice(1, -1))) {
      if (!options.allowPrototypes) {
        return;
      }
    }
    keys.push(segment[1]);
  }
  if (segment) {
    keys.push("[" + key.slice(segment.index) + "]");
  }
  return parseObject(keys, val, options, valuesParsed);
};
var normalizeParseOptions = function normalizeParseOptions2(opts) {
  if (!opts) {
    return defaults;
  }
  if (opts.decoder !== null && opts.decoder !== void 0 && typeof opts.decoder !== "function") {
    throw new TypeError("Decoder has to be a function.");
  }
  if (typeof opts.charset !== "undefined" && opts.charset !== "utf-8" && opts.charset !== "iso-8859-1") {
    throw new TypeError("The charset option must be either utf-8, iso-8859-1, or undefined");
  }
  var charset = typeof opts.charset === "undefined" ? defaults.charset : opts.charset;
  return {
    allowDots: typeof opts.allowDots === "undefined" ? defaults.allowDots : !!opts.allowDots,
    allowPrototypes: typeof opts.allowPrototypes === "boolean" ? opts.allowPrototypes : defaults.allowPrototypes,
    allowSparse: typeof opts.allowSparse === "boolean" ? opts.allowSparse : defaults.allowSparse,
    arrayLimit: typeof opts.arrayLimit === "number" ? opts.arrayLimit : defaults.arrayLimit,
    charset,
    charsetSentinel: typeof opts.charsetSentinel === "boolean" ? opts.charsetSentinel : defaults.charsetSentinel,
    comma: typeof opts.comma === "boolean" ? opts.comma : defaults.comma,
    decoder: typeof opts.decoder === "function" ? opts.decoder : defaults.decoder,
    delimiter: typeof opts.delimiter === "string" || utils.isRegExp(opts.delimiter) ? opts.delimiter : defaults.delimiter,
    depth: typeof opts.depth === "number" || opts.depth === false ? +opts.depth : defaults.depth,
    ignoreQueryPrefix: opts.ignoreQueryPrefix === true,
    interpretNumericEntities: typeof opts.interpretNumericEntities === "boolean" ? opts.interpretNumericEntities : defaults.interpretNumericEntities,
    parameterLimit: typeof opts.parameterLimit === "number" ? opts.parameterLimit : defaults.parameterLimit,
    parseArrays: opts.parseArrays !== false,
    plainObjects: typeof opts.plainObjects === "boolean" ? opts.plainObjects : defaults.plainObjects,
    strictNullHandling: typeof opts.strictNullHandling === "boolean" ? opts.strictNullHandling : defaults.strictNullHandling
  };
};
var parse$1 = function(str, opts) {
  var options = normalizeParseOptions(opts);
  if (str === "" || str === null || typeof str === "undefined") {
    return options.plainObjects ? /* @__PURE__ */ Object.create(null) : {};
  }
  var tempObj = typeof str === "string" ? parseValues(str, options) : str;
  var obj = options.plainObjects ? /* @__PURE__ */ Object.create(null) : {};
  var keys = Object.keys(tempObj);
  for (var i = 0; i < keys.length; ++i) {
    var key = keys[i];
    var newObj = parseKeys(key, tempObj[key], options, typeof str === "string");
    obj = utils.merge(obj, newObj, options);
  }
  if (options.allowSparse === true) {
    return obj;
  }
  return utils.compact(obj);
};
var stringify2 = stringify_1;
var parse = parse$1;
var formats = formats$3;
var lib = {
  formats,
  parse,
  stringify: stringify2
};
axios.defaults.timeout = 15 * 1e3;
const cancelToken = axios.CancelToken;
let cancelSource = cancelToken.source();
function setHttpTimeout(timeout) {
  axios.defaults.timeout = timeout;
}
function toFormData(data2) {
  if (data2 instanceof FormData)
    return data2;
  const formData = new FormData();
  if (data2 instanceof Object) {
    const mapToFormData = (key, value, index) => {
      if (Types.isArray(value)) {
        value.forEach((itemValue, itemIndex) => {
          return mapToFormData(`${key}`, itemValue, itemIndex);
        });
      }
      if (Types.isObject(value)) {
        key = key.replace(/\[]$/, `[${index}]`);
        Object.keys(value).forEach((itemKey, itemIndex) => {
          return mapToFormData(`${key}.${itemKey}`, value[itemKey], itemIndex);
        });
      } else {
        formData.append(key, value);
      }
    };
    Object.keys(data2).forEach((key, index) => {
      mapToFormData(key, data2[key], index);
    });
  }
  return formData;
}
function fuzzyMatching(value, prop) {
  const key = Object.keys(value).find((e) => e.toLowerCase() === (prop == null ? void 0 : prop.toLowerCase())) || "";
  return value[key];
}
function downloadBlob(response) {
  var _a, _b;
  try {
    const content = response.data;
    const headers = response.headers;
    const filename = decodeURI((_b = (_a = headers["content-disposition"]) == null ? void 0 : _a.split(";")[1]) == null ? void 0 : _b.split("filename=")[1]);
    DownloadUtil(content, filename);
    return response;
  } catch (error) {
    return Promise.reject(error);
  }
}
class HttpLibrary {
  constructor() {
    __publicField(this, "instance");
    this.instance = axios.create();
    this.interceptors();
  }
  interceptors() {
    const onRequestFulfilled = (config) => {
      config.cancelToken = cancelSource.token;
      return this.onRequestFulfilled(config);
    };
    const onRequestRejected = (error) => {
      return this.onRequestRejected(error);
    };
    this.instance.interceptors.request.use(onRequestFulfilled, onRequestRejected);
    const onResponseFulfilled = (response) => {
      return this.onResponseFulfilled(response);
    };
    const onResponseRejected = (error) => {
      return this.onResponseRejected(error);
    };
    this.instance.interceptors.response.use(onResponseFulfilled, onResponseRejected);
  }
  onRequestBefore(config) {
    const headers = config.headers || {};
    const contentType = fuzzyMatching(headers, "content-type");
    if (String(contentType).toLowerCase() === "application/x-www-form-urlencoded") {
      if (config.transformRequest === void 0) {
        config.transformRequest = [];
      }
      if (config.transformRequest instanceof Function) {
        config.transformRequest = [config.transformRequest];
      }
      config.transformRequest.push((data2, headers2) => {
        return data2 instanceof Object ? lib.stringify(data2) : data2;
      });
    }
    return Promise.resolve(config);
  }
  onRequestFulfilled(config) {
    return Promise.resolve(config);
  }
  onRequestRejected(error) {
    return Promise.reject(error);
  }
  onResponseFulfilled(response) {
    return Promise.resolve(response);
  }
  onResponseRejected(error) {
    if (error instanceof axios.Cancel) {
      error = new Error(error.message);
      error.cancel = true;
    }
    return Promise.reject(error);
  }
  request(config) {
    return this.onRequestBefore(config || {}).then((config2) => {
      return this.instance(config2);
    });
  }
  get(url, data2, config) {
    return this.request(__spreadValues({
      method: "GET",
      url,
      params: data2
    }, config));
  }
  post(url, data2, config) {
    return this.request(__spreadValues({
      method: "POST",
      url,
      data: data2
    }, config));
  }
  put(url, data2, config) {
    return this.request(__spreadValues({
      method: "PUT",
      url,
      data: data2
    }, config));
  }
  delete(url, data2, config) {
    return this.request(__spreadValues({
      method: "DELETE",
      url,
      data: data2
    }, config));
  }
  form(url, data2, config) {
    return this.request(__spreadValues({
      method: "POST",
      url,
      data: toFormData(data2),
      headers: { "Content-Type": "multipart/form-data" }
    }, config));
  }
  download(url, data2, config) {
    const method = ((config == null ? void 0 : config.method) || "GET").toUpperCase();
    return this.request(__spreadValues({
      method,
      url,
      [method === "GET" ? "params" : "data"]: data2,
      responseType: "blob"
    }, config)).then(downloadBlob);
  }
  cancel(message) {
    cancelSource.cancel(message || "Interrupt call chain");
    cancelSource = cancelToken.source();
  }
}
class AsyncEvent {
  constructor(events) {
    __publicField(this, "events");
    this.events = events ? events : {};
  }
  on(event, evtFn) {
    (this.events[event] || (this.events[event] = [])).push(evtFn);
    return this;
  }
  off(event, evtFn) {
    const events = this.events;
    if (events[event]) {
      if (evtFn) {
        const fns = events[event];
        const pos = fns.indexOf(evtFn);
        if (pos > -1) {
          fns.splice(pos, 1);
        }
      } else {
        delete events[event];
      }
    }
    return this;
  }
  emit(event, ...args) {
    const events = this.events;
    if (events[event]) {
      const evtFns = events[event].slice();
      let evtFn;
      while (evtFn = evtFns.shift()) {
        evtFn(...args);
      }
    }
    return this;
  }
  async emitAsync(event, ...args) {
    const events = this.events;
    const result = [];
    if (events[event]) {
      const evtFns = events[event].slice();
      let evtFn;
      while (evtFn = evtFns.shift()) {
        result.push(await evtFn(...args));
      }
    }
    return result;
  }
  once(event, evtFn) {
    const once = (...args) => {
      this.off(event, once);
      evtFn(...args);
    };
    this.on(event, once);
    return this;
  }
  before(event, evtFn) {
    (this.events[event] || (this.events[event] = [])).unshift(evtFn);
    return this;
  }
  subscribe(event, evtFn) {
    this.on(event, evtFn);
    return () => this.off(event, evtFn);
  }
}
class Application extends AsyncEvent {
  constructor(mount) {
    super(mount);
    __publicField(this, "opts");
    __publicField(this, "prop");
    __publicField(this, "isReady");
    this.isReady = false;
    this.opts = {};
    this.prop = this.initProp(this);
    this.prop("prop", this.prop);
  }
  async bootstrap(opts) {
    return this.init(opts).then(this.start.bind(this)).catch(this.halt.bind(this));
  }
  async init(opts) {
    Object.assign(this.opts, opts);
  }
  async start() {
    this.isReady = true;
    await this.emitAsync("ready", this);
  }
  ready(callback) {
    if (this.isReady) {
      callback(this, (fn) => fn(this));
    }
    this.on("ready", callback);
  }
  halt(error) {
  }
  initProp(target) {
    return (key, value, opts = {}) => {
      opts.value = value;
      opts.writable = false;
      opts.enumerable = false;
      opts.configurable = false;
      Object.defineProperty(target, key, opts);
    };
  }
}
function cloneRoute(source2) {
  const target = {};
  if (source2.name)
    target.name = clone(source2.name);
  if (source2.path)
    target.path = clone(source2.path);
  if (source2.meta)
    target.meta = clone(source2.meta);
  if (source2.alias)
    target.alias = clone(source2.alias);
  if (source2.redirect)
    target.redirect = clone(source2.redirect);
  if (source2.component)
    target.component = source2.component;
  return target;
}
class RouterFactory {
  constructor(routes, raiseRoute, raiseChild, emptyRoute) {
    __publicField(this, "routes");
    __publicField(this, "raiseRoute");
    __publicField(this, "raiseChild");
    __publicField(this, "emptyRoute");
    this.routes = routes || [];
    this.raiseRoute = raiseRoute || new Function();
    this.raiseChild = raiseChild || new Function();
    this.emptyRoute = emptyRoute;
  }
  register(route) {
    if (route instanceof Array) {
      route.map((r) => this.recursive(r, this.routes));
    } else {
      this.recursive(route, this.routes);
    }
    return this;
  }
  recursive(route, routes) {
    const newRoute = cloneRoute(route);
    this.raiseRoute(newRoute, routes);
    routes.push(newRoute);
    if (route.route) {
      const redirectRoute = cloneRoute(newRoute);
      newRoute.redirect = { name: redirectRoute.name };
      newRoute.component = this.emptyRoute;
      routes.push(redirectRoute);
      delete newRoute.name;
    }
    if (route.children instanceof Array && route.children.length > 0) {
      const children = newRoute.children = [];
      route.children.map((item) => {
        return this.recursive(item, children);
      });
      this.raiseChild(children, newRoute);
    }
  }
  exists(target, prop) {
    const predicate = (route) => {
      if (route[prop] === target[prop])
        return true;
      if (route.children instanceof Array && route.children.length > 0)
        return route.children.some(predicate);
      return false;
    };
    return this.routes.some(predicate);
  }
  clean() {
    this.routes.splice(0, this.routes.length);
    return this;
  }
}
const extend = function(regexes2, extensions) {
  const mergedRegexes = {
    browser: [],
    cpu: [],
    device: [],
    engine: [],
    os: []
  };
  for (const i in regexes2) {
    if (extensions[i] && extensions[i].length % 2 === 0) {
      mergedRegexes[i] = extensions[i].concat(regexes2[i]);
    } else {
      mergedRegexes[i] = regexes2[i];
    }
  }
  return mergedRegexes;
};
const toEnumeration = function(arr) {
  const enums = {};
  for (let i = 0; i < arr.length; i++) {
    enums[arr[i].toUpperCase()] = arr[i];
  }
  return enums;
};
const has = function(str1, str2) {
  return toLowerCase(str2).indexOf(toLowerCase(str1)) !== -1;
};
const toLowerCase = function(str) {
  return (str || "").toLowerCase();
};
const toMajor = function(version) {
  return (version || "").replace(/[^\d\.]/g, EMPTY).split(".")[0];
};
const trim = function(str, len) {
  if (typeof str === STR_TYPE) {
    str = str.replace(/^\s\s*/, EMPTY).replace(/\s\s*$/, EMPTY);
    return typeof len === UNDEF_TYPE ? str : str.substring(0, UA_MAX_LENGTH);
  }
  return "";
};
const rgxMapper = function(ua, arrays) {
  let i = 0, j, k, p, q, matches, match;
  while (i < arrays.length && !matches) {
    const regex = arrays[i], props = arrays[i + 1];
    j = k = 0;
    while (j < regex.length && !matches) {
      matches = regex[j++].exec(ua);
      if (!!matches) {
        for (p = 0; p < props.length; p++) {
          match = matches[++k];
          q = props[p];
          if (typeof q === OBJ_TYPE && q.length > 0) {
            if (q.length === 2) {
              if (typeof q[1] == FUNC_TYPE) {
                this[q[0]] = q[1].call(this, match);
              } else {
                this[q[0]] = q[1];
              }
            } else if (q.length === 3) {
              if (typeof q[1] === FUNC_TYPE && !(q[1].exec && q[1].test)) {
                this[q[0]] = match ? q[1].call(this, match, q[2]) : void 0;
              } else {
                this[q[0]] = match ? match.replace(q[1], q[2]) : void 0;
              }
            } else if (q.length === 4) {
              this[q[0]] = match ? q[3].call(this, match.replace(q[1], q[2])) : void 0;
            }
          } else {
            this[q] = match ? match : void 0;
          }
        }
      }
    }
    i += 2;
  }
};
const strMapper = function(str, map) {
  for (const i in map) {
    if (typeof map[i] === OBJ_TYPE && map[i].length > 0) {
      for (let j = 0; j < map[i].length; j++) {
        if (has(map[i][j], str)) {
          return i === UNKNOWN ? void 0 : i;
        }
      }
    } else if (has(map[i], str)) {
      return i === UNKNOWN ? void 0 : i;
    }
  }
  return str;
};
const LIBVERSION = "0.7.31", EMPTY = "", UNKNOWN = "?", FUNC_TYPE = "function", UNDEF_TYPE = "undefined", OBJ_TYPE = "object", STR_TYPE = "string", MAJOR = "major", MODEL = "model", NAME = "name", TYPE = "type", VENDOR = "vendor", VERSION = "version", ARCHITECTURE = "architecture", CONSOLE = "console", MOBILE = "mobile", TABLET = "tablet", SMARTTV = "smarttv", WEARABLE = "wearable", EMBEDDED = "embedded", UA_MAX_LENGTH = 275;
const AMAZON = "Amazon", APPLE = "Apple", ASUS = "ASUS", BLACKBERRY = "BlackBerry", BROWSER = "Browser", CHROME = "Chrome", EDGE = "Edge", FIREFOX = "Firefox", GOOGLE = "Google", HUAWEI = "Huawei", LG = "LG", MICROSOFT = "Microsoft", MOTOROLA = "Motorola", OPERA = "Opera", SAMSUNG = "Samsung", SONY = "Sony", XIAOMI = "Xiaomi", ZEBRA = "Zebra", FACEBOOK = "Facebook";
const oldSafariMap = {
  "1.0": "/8",
  1.2: "/1",
  1.3: "/3",
  "2.0": "/412",
  "2.0.2": "/416",
  "2.0.3": "/417",
  "2.0.4": "/419",
  "?": "/"
};
const windowsVersionMap = {
  ME: "4.90",
  "NT 3.11": "NT3.51",
  "NT 4.0": "NT4.0",
  2e3: "NT 5.0",
  XP: ["NT 5.1", "NT 5.2"],
  Vista: "NT 6.0",
  7: "NT 6.1",
  8: "NT 6.2",
  8.1: "NT 6.3",
  10: ["NT 6.4", "NT 10.0"],
  RT: "ARM"
};
const regexes = {
  browser: [
    [
      /\b(?:crmo|crios)\/([\w\.]+)/i
    ],
    [VERSION, [NAME, "Chrome"]],
    [
      /edg(?:e|ios|a)?\/([\w\.]+)/i
    ],
    [VERSION, [NAME, "Edge"]],
    [
      /(opera mini)\/([-\w\.]+)/i,
      /(opera [mobiletab]{3,6})\b.+version\/([-\w\.]+)/i,
      /(opera)(?:.+version\/|[\/ ]+)([\w\.]+)/i
    ],
    [NAME, VERSION],
    [
      /opios[\/ ]+([\w\.]+)/i
    ],
    [VERSION, [NAME, OPERA + " Mini"]],
    [
      /\bopr\/([\w\.]+)/i
    ],
    [VERSION, [NAME, OPERA]],
    [
      /(kindle)\/([\w\.]+)/i,
      /(lunascape|maxthon|netfront|jasmine|blazer)[\/ ]?([\w\.]*)/i,
      /(avant |iemobile|slim)(?:browser)?[\/ ]?([\w\.]*)/i,
      /(ba?idubrowser)[\/ ]?([\w\.]+)/i,
      /(?:ms|\()(ie) ([\w\.]+)/i,
      /(flock|rockmelt|midori|epiphany|silk|skyfire|ovibrowser|bolt|iron|vivaldi|iridium|phantomjs|bowser|quark|qupzilla|falkon|rekonq|puffin|brave|whale|qqbrowserlite|qq)\/([-\w\.]+)/i,
      /(weibo)__([\d\.]+)/i
    ],
    [NAME, VERSION],
    [
      /(?:\buc? ?browser|(?:juc.+)ucweb)[\/ ]?([\w\.]+)/i
    ],
    [VERSION, [NAME, "UC" + BROWSER]],
    [
      /\bqbcore\/([\w\.]+)/i
    ],
    [VERSION, [NAME, "WeChat(Win) Desktop"]],
    [
      /micromessenger\/([\w\.]+)/i
    ],
    [VERSION, [NAME, "WeChat"]],
    [
      /konqueror\/([\w\.]+)/i
    ],
    [VERSION, [NAME, "Konqueror"]],
    [
      /trident.+rv[: ]([\w\.]{1,9})\b.+like gecko/i
    ],
    [VERSION, [NAME, "IE"]],
    [
      /yabrowser\/([\w\.]+)/i
    ],
    [VERSION, [NAME, "Yandex"]],
    [
      /(avast|avg)\/([\w\.]+)/i
    ],
    [[NAME, /(.+)/, "$1 Secure " + BROWSER], VERSION],
    [
      /\bfocus\/([\w\.]+)/i
    ],
    [VERSION, [NAME, FIREFOX + " Focus"]],
    [
      /\bopt\/([\w\.]+)/i
    ],
    [VERSION, [NAME, OPERA + " Touch"]],
    [
      /coc_coc\w+\/([\w\.]+)/i
    ],
    [VERSION, [NAME, "Coc Coc"]],
    [
      /dolfin\/([\w\.]+)/i
    ],
    [VERSION, [NAME, "Dolphin"]],
    [
      /coast\/([\w\.]+)/i
    ],
    [VERSION, [NAME, OPERA + " Coast"]],
    [
      /miuibrowser\/([\w\.]+)/i
    ],
    [VERSION, [NAME, "MIUI " + BROWSER]],
    [
      /fxios\/([-\w\.]+)/i
    ],
    [VERSION, [NAME, FIREFOX]],
    [
      /\bqihu|(qi?ho?o?|360)browser/i
    ],
    [[NAME, "360 " + BROWSER]],
    [/(oculus|samsung|sailfish)browser\/([\w\.]+)/i],
    [[NAME, /(.+)/, "$1 " + BROWSER], VERSION],
    [
      /(comodo_dragon)\/([\w\.]+)/i
    ],
    [[NAME, /_/g, " "], VERSION],
    [
      /(electron)\/([\w\.]+) safari/i,
      /(tesla)(?: qtcarbrowser|\/(20\d\d\.[-\w\.]+))/i,
      /m?(qqbrowser|baiduboxapp|2345Explorer)[\/ ]?([\w\.]+)/i
    ],
    [NAME, VERSION],
    [
      /(metasr)[\/ ]?([\w\.]+)/i,
      /(lbbrowser)/i
    ],
    [NAME],
    [
      /((?:fban\/fbios|fb_iab\/fb4a)(?!.+fbav)|;fbav\/([\w\.]+);)/i
    ],
    [[NAME, FACEBOOK], VERSION],
    [
      /safari (line)\/([\w\.]+)/i,
      /\b(line)\/([\w\.]+)\/iab/i,
      /(chromium|instagram)[\/ ]([-\w\.]+)/i
    ],
    [NAME, VERSION],
    [
      /\bgsa\/([\w\.]+) .*safari\//i
    ],
    [VERSION, [NAME, "GSA"]],
    [
      /headlesschrome(?:\/([\w\.]+)| )/i
    ],
    [VERSION, [NAME, CHROME + " Headless"]],
    [
      / wv\).+(chrome)\/([\w\.]+)/i
    ],
    [[NAME, CHROME + " WebView"], VERSION],
    [
      /droid.+ version\/([\w\.]+)\b.+(?:mobile safari|safari)/i
    ],
    [VERSION, [NAME, "Android " + BROWSER]],
    [
      /(chrome|omniweb|arora|[tizenoka]{5} ?browser)\/v?([\w\.]+)/i
    ],
    [NAME, VERSION],
    [
      /version\/([\w\.]+) .*mobile\/\w+ (safari)/i
    ],
    [VERSION, [NAME, "Mobile Safari"]],
    [
      /version\/([\w\.]+) .*(mobile ?safari|safari)/i
    ],
    [VERSION, NAME],
    [
      /webkit.+?(mobile ?safari|safari)(\/[\w\.]+)/i
    ],
    [NAME, [VERSION, strMapper, oldSafariMap]],
    [/(webkit|khtml)\/([\w\.]+)/i],
    [NAME, VERSION],
    [
      /(navigator|netscape\d?)\/([-\w\.]+)/i
    ],
    [[NAME, "Netscape"], VERSION],
    [
      /mobile vr; rv:([\w\.]+)\).+firefox/i
    ],
    [VERSION, [NAME, FIREFOX + " Reality"]],
    [
      /ekiohf.+(flow)\/([\w\.]+)/i,
      /(swiftfox)/i,
      /(icedragon|iceweasel|camino|chimera|fennec|maemo browser|minimo|conkeror|klar)[\/ ]?([\w\.\+]+)/i,
      /(seamonkey|k-meleon|icecat|iceape|firebird|phoenix|palemoon|basilisk|waterfox)\/([-\w\.]+)$/i,
      /(firefox)\/([\w\.]+)/i,
      /(mozilla)\/([\w\.]+) .+rv\:.+gecko\/\d+/i,
      /(polaris|lynx|dillo|icab|doris|amaya|w3m|netsurf|sleipnir|obigo|mosaic|(?:go|ice|up)[\. ]?browser)[-\/ ]?v?([\w\.]+)/i,
      /(links) \(([\w\.]+)/i
    ],
    [NAME, VERSION]
  ],
  cpu: [
    [
      /(?:(amd|x(?:(?:86|64)[-_])?|wow|win)64)[;\)]/i
    ],
    [[ARCHITECTURE, "amd64"]],
    [
      /(ia32(?=;))/i
    ],
    [[ARCHITECTURE, toLowerCase]],
    [
      /((?:i[346]|x)86)[;\)]/i
    ],
    [[ARCHITECTURE, "ia32"]],
    [
      /\b(aarch64|arm(v?8e?l?|_?64))\b/i
    ],
    [[ARCHITECTURE, "arm64"]],
    [
      /\b(arm(?:v[67])?ht?n?[fl]p?)\b/i
    ],
    [[ARCHITECTURE, "armhf"]],
    [
      /windows (ce|mobile); ppc;/i
    ],
    [[ARCHITECTURE, "arm"]],
    [
      /((?:ppc|powerpc)(?:64)?)(?: mac|;|\))/i
    ],
    [[ARCHITECTURE, /ower/, EMPTY, toLowerCase]],
    [
      /(sun4\w)[;\)]/i
    ],
    [[ARCHITECTURE, "sparc"]],
    [
      /((?:avr32|ia64(?=;))|68k(?=\))|\barm(?=v(?:[1-7]|[5-7]1)l?|;|eabi)|(?=atmel )avr|(?:irix|mips|sparc)(?:64)?\b|pa-risc)/i
    ],
    [[ARCHITECTURE, toLowerCase]]
  ],
  device: [
    [
      /\b(sch-i[89]0\d|shw-m380s|sm-[pt]\w{2,4}|gt-[pn]\d{2,4}|sgh-t8[56]9|nexus 10)/i
    ],
    [MODEL, [VENDOR, SAMSUNG], [TYPE, TABLET]],
    [
      /\b((?:s[cgp]h|gt|sm)-\w+|galaxy nexus)/i,
      /samsung[- ]([-\w]+)/i,
      /sec-(sgh\w+)/i
    ],
    [MODEL, [VENDOR, SAMSUNG], [TYPE, MOBILE]],
    [
      /\((ip(?:hone|od)[\w ]*);/i
    ],
    [MODEL, [VENDOR, APPLE], [TYPE, MOBILE]],
    [
      /\((ipad);[-\w\),; ]+apple/i,
      /applecoremedia\/[\w\.]+ \((ipad)/i,
      /\b(ipad)\d\d?,\d\d?[;\]].+ios/i
    ],
    [MODEL, [VENDOR, APPLE], [TYPE, TABLET]],
    [
      /\b((?:ag[rs][23]?|bah2?|sht?|btv)-a?[lw]\d{2})\b(?!.+d\/s)/i
    ],
    [MODEL, [VENDOR, HUAWEI], [TYPE, TABLET]],
    [
      /(?:huawei|honor)([-\w ]+)[;\)]/i,
      /\b(nexus 6p|\w{2,4}e?-[atu]?[ln][\dx][012359c][adn]?)\b(?!.+d\/s)/i
    ],
    [MODEL, [VENDOR, HUAWEI], [TYPE, MOBILE]],
    [
      /\b(poco[\w ]+)(?: bui|\))/i,
      /\b; (\w+) build\/hm\1/i,
      /\b(hm[-_ ]?note?[_ ]?(?:\d\w)?) bui/i,
      /\b(redmi[\-_ ]?(?:note|k)?[\w_ ]+)(?: bui|\))/i,
      /\b(mi[-_ ]?(?:a\d|one|one[_ ]plus|note lte|max|cc)?[_ ]?(?:\d?\w?)[_ ]?(?:plus|se|lite)?)(?: bui|\))/i
    ],
    [
      [MODEL, /_/g, " "],
      [VENDOR, XIAOMI],
      [TYPE, MOBILE]
    ],
    [
      /\b(mi[-_ ]?(?:pad)(?:[\w_ ]+))(?: bui|\))/i
    ],
    [
      [MODEL, /_/g, " "],
      [VENDOR, XIAOMI],
      [TYPE, TABLET]
    ],
    [
      /; (\w+) bui.+ oppo/i,
      /\b(cph[12]\d{3}|p(?:af|c[al]|d\w|e[ar])[mt]\d0|x9007|a101op)\b/i
    ],
    [MODEL, [VENDOR, "OPPO"], [TYPE, MOBILE]],
    [
      /vivo (\w+)(?: bui|\))/i,
      /\b(v[12]\d{3}\w?[at])(?: bui|;)/i
    ],
    [MODEL, [VENDOR, "Vivo"], [TYPE, MOBILE]],
    [
      /\b(rmx[12]\d{3})(?: bui|;|\))/i
    ],
    [MODEL, [VENDOR, "Realme"], [TYPE, MOBILE]],
    [
      /\b(milestone|droid(?:[2-4x]| (?:bionic|x2|pro|razr))?:?( 4g)?)\b[\w ]+build\//i,
      /\bmot(?:orola)?[- ](\w*)/i,
      /((?:moto[\w\(\) ]+|xt\d{3,4}|nexus 6)(?= bui|\)))/i
    ],
    [MODEL, [VENDOR, MOTOROLA], [TYPE, MOBILE]],
    [/\b(mz60\d|xoom[2 ]{0,2}) build\//i],
    [MODEL, [VENDOR, MOTOROLA], [TYPE, TABLET]],
    [
      /((?=lg)?[vl]k\-?\d{3}) bui| 3\.[-\w; ]{10}lg?-([06cv9]{3,4})/i
    ],
    [MODEL, [VENDOR, LG], [TYPE, TABLET]],
    [
      /(lm(?:-?f100[nv]?|-[\w\.]+)(?= bui|\))|nexus [45])/i,
      /\blg[-e;\/ ]+((?!browser|netcast|android tv)\w+)/i,
      /\blg-?([\d\w]+) bui/i
    ],
    [MODEL, [VENDOR, LG], [TYPE, MOBILE]],
    [
      /(ideatab[-\w ]+)/i,
      /lenovo ?(s[56]000[-\w]+|tab(?:[\w ]+)|yt[-\d\w]{6}|tb[-\d\w]{6})/i
    ],
    [MODEL, [VENDOR, "Lenovo"], [TYPE, TABLET]],
    [
      /(?:maemo|nokia).*(n900|lumia \d+)/i,
      /nokia[-_ ]?([-\w\.]*)/i
    ],
    [
      [MODEL, /_/g, " "],
      [VENDOR, "Nokia"],
      [TYPE, MOBILE]
    ],
    [
      /(pixel c)\b/i
    ],
    [MODEL, [VENDOR, GOOGLE], [TYPE, TABLET]],
    [
      /droid.+; (pixel[\daxl ]{0,6})(?: bui|\))/i
    ],
    [MODEL, [VENDOR, GOOGLE], [TYPE, MOBILE]],
    [
      /droid.+ (a?\d[0-2]{2}so|[c-g]\d{4}|so[-gl]\w+|xq-a\w[4-7][12])(?= bui|\).+chrome\/(?![1-6]{0,1}\d\.))/i
    ],
    [MODEL, [VENDOR, SONY], [TYPE, MOBILE]],
    [/sony tablet [ps]/i, /\b(?:sony)?sgp\w+(?: bui|\))/i],
    [
      [MODEL, "Xperia Tablet"],
      [VENDOR, SONY],
      [TYPE, TABLET]
    ],
    [
      / (kb2005|in20[12]5|be20[12][59])\b/i,
      /(?:one)?(?:plus)? (a\d0\d\d)(?: b|\))/i
    ],
    [MODEL, [VENDOR, "OnePlus"], [TYPE, MOBILE]],
    [
      /(alexa)webm/i,
      /(kf[a-z]{2}wi)( bui|\))/i,
      /(kf[a-z]+)( bui|\)).+silk\//i
    ],
    [MODEL, [VENDOR, AMAZON], [TYPE, TABLET]],
    [
      /((?:sd|kf)[0349hijorstuw]+)( bui|\)).+silk\//i
    ],
    [
      [MODEL, /(.+)/g, "Fire Phone $1"],
      [VENDOR, AMAZON],
      [TYPE, MOBILE]
    ],
    [
      /(playbook);[-\w\),; ]+(rim)/i
    ],
    [MODEL, VENDOR, [TYPE, TABLET]],
    [
      /\b((?:bb[a-f]|st[hv])100-\d)/i,
      /\(bb10; (\w+)/i
    ],
    [MODEL, [VENDOR, BLACKBERRY], [TYPE, MOBILE]],
    [
      /(?:\b|asus_)(transfo[prime ]{4,10} \w+|eeepc|slider \w+|nexus 7|padfone|p00[cj])/i
    ],
    [MODEL, [VENDOR, ASUS], [TYPE, TABLET]],
    [/ (z[bes]6[027][012][km][ls]|zenfone \d\w?)\b/i],
    [MODEL, [VENDOR, ASUS], [TYPE, MOBILE]],
    [
      /(nexus 9)/i
    ],
    [MODEL, [VENDOR, "HTC"], [TYPE, TABLET]],
    [
      /(htc)[-;_ ]{1,2}([\w ]+(?=\)| bui)|\w+)/i,
      /(zte)[- ]([\w ]+?)(?: bui|\/|\))/i,
      /(alcatel|geeksphone|nexian|panasonic|sony(?!-bra))[-_ ]?([-\w]*)/i
    ],
    [VENDOR, [MODEL, /_/g, " "], [TYPE, MOBILE]],
    [
      /droid.+; ([ab][1-7]-?[0178a]\d\d?)/i
    ],
    [MODEL, [VENDOR, "Acer"], [TYPE, TABLET]],
    [
      /droid.+; (m[1-5] note) bui/i,
      /\bmz-([-\w]{2,})/i
    ],
    [MODEL, [VENDOR, "Meizu"], [TYPE, MOBILE]],
    [
      /\b(sh-?[altvz]?\d\d[a-ekm]?)/i
    ],
    [MODEL, [VENDOR, "Sharp"], [TYPE, MOBILE]],
    [
      /(blackberry|benq|palm(?=\-)|sonyericsson|acer|asus|dell|meizu|motorola|polytron)[-_ ]?([-\w]*)/i,
      /(hp) ([\w ]+\w)/i,
      /(asus)-?(\w+)/i,
      /(microsoft); (lumia[\w ]+)/i,
      /(lenovo)[-_ ]?([-\w]+)/i,
      /(jolla)/i,
      /(oppo) ?([\w ]+) bui/i
    ],
    [VENDOR, MODEL, [TYPE, MOBILE]],
    [
      /(archos) (gamepad2?)/i,
      /(hp).+(touchpad(?!.+tablet)|tablet)/i,
      /(kindle)\/([\w\.]+)/i,
      /(nook)[\w ]+build\/(\w+)/i,
      /(dell) (strea[kpr\d ]*[\dko])/i,
      /(le[- ]+pan)[- ]+(\w{1,9}) bui/i,
      /(trinity)[- ]*(t\d{3}) bui/i,
      /(gigaset)[- ]+(q\w{1,9}) bui/i,
      /(vodafone) ([\w ]+)(?:\)| bui)/i
    ],
    [VENDOR, MODEL, [TYPE, TABLET]],
    [
      /(surface duo)/i
    ],
    [MODEL, [VENDOR, MICROSOFT], [TYPE, TABLET]],
    [
      /droid [\d\.]+; (fp\du?)(?: b|\))/i
    ],
    [MODEL, [VENDOR, "Fairphone"], [TYPE, MOBILE]],
    [
      /(u304aa)/i
    ],
    [MODEL, [VENDOR, "AT&T"], [TYPE, MOBILE]],
    [
      /\bsie-(\w*)/i
    ],
    [MODEL, [VENDOR, "Siemens"], [TYPE, MOBILE]],
    [
      /\b(rct\w+) b/i
    ],
    [MODEL, [VENDOR, "RCA"], [TYPE, TABLET]],
    [
      /\b(venue[\d ]{2,7}) b/i
    ],
    [MODEL, [VENDOR, "Dell"], [TYPE, TABLET]],
    [
      /\b(q(?:mv|ta)\w+) b/i
    ],
    [MODEL, [VENDOR, "Verizon"], [TYPE, TABLET]],
    [
      /\b(?:barnes[& ]+noble |bn[rt])([\w\+ ]*) b/i
    ],
    [MODEL, [VENDOR, "Barnes & Noble"], [TYPE, TABLET]],
    [/\b(tm\d{3}\w+) b/i],
    [MODEL, [VENDOR, "NuVision"], [TYPE, TABLET]],
    [
      /\b(k88) b/i
    ],
    [MODEL, [VENDOR, "ZTE"], [TYPE, TABLET]],
    [
      /\b(nx\d{3}j) b/i
    ],
    [MODEL, [VENDOR, "ZTE"], [TYPE, MOBILE]],
    [
      /\b(gen\d{3}) b.+49h/i
    ],
    [MODEL, [VENDOR, "Swiss"], [TYPE, MOBILE]],
    [
      /\b(zur\d{3}) b/i
    ],
    [MODEL, [VENDOR, "Swiss"], [TYPE, TABLET]],
    [
      /\b((zeki)?tb.*\b) b/i
    ],
    [MODEL, [VENDOR, "Zeki"], [TYPE, TABLET]],
    [
      /\b([yr]\d{2}) b/i,
      /\b(dragon[- ]+touch |dt)(\w{5}) b/i
    ],
    [[VENDOR, "Dragon Touch"], MODEL, [TYPE, TABLET]],
    [
      /\b(ns-?\w{0,9}) b/i
    ],
    [MODEL, [VENDOR, "Insignia"], [TYPE, TABLET]],
    [
      /\b((nxa|next)-?\w{0,9}) b/i
    ],
    [MODEL, [VENDOR, "NextBook"], [TYPE, TABLET]],
    [
      /\b(xtreme\_)?(v(1[045]|2[015]|[3469]0|7[05])) b/i
    ],
    [[VENDOR, "Voice"], MODEL, [TYPE, MOBILE]],
    [
      /\b(lvtel\-)?(v1[12]) b/i
    ],
    [[VENDOR, "LvTel"], MODEL, [TYPE, MOBILE]],
    [
      /\b(ph-1) /i
    ],
    [MODEL, [VENDOR, "Essential"], [TYPE, MOBILE]],
    [
      /\b(v(100md|700na|7011|917g).*\b) b/i
    ],
    [MODEL, [VENDOR, "Envizen"], [TYPE, TABLET]],
    [
      /\b(trio[-\w\. ]+) b/i
    ],
    [MODEL, [VENDOR, "MachSpeed"], [TYPE, TABLET]],
    [
      /\btu_(1491) b/i
    ],
    [MODEL, [VENDOR, "Rotor"], [TYPE, TABLET]],
    [
      /(shield[\w ]+) b/i
    ],
    [MODEL, [VENDOR, "Nvidia"], [TYPE, TABLET]],
    [
      /(sprint) (\w+)/i
    ],
    [VENDOR, MODEL, [TYPE, MOBILE]],
    [
      /(kin\.[onetw]{3})/i
    ],
    [
      [MODEL, /\./g, " "],
      [VENDOR, MICROSOFT],
      [TYPE, MOBILE]
    ],
    [
      /droid.+; (cc6666?|et5[16]|mc[239][23]x?|vc8[03]x?)\)/i
    ],
    [MODEL, [VENDOR, ZEBRA], [TYPE, TABLET]],
    [/droid.+; (ec30|ps20|tc[2-8]\d[kx])\)/i],
    [MODEL, [VENDOR, ZEBRA], [TYPE, MOBILE]],
    [
      /(ouya)/i,
      /(nintendo) ([wids3utch]+)/i
    ],
    [VENDOR, MODEL, [TYPE, CONSOLE]],
    [
      /droid.+; (shield) bui/i
    ],
    [MODEL, [VENDOR, "Nvidia"], [TYPE, CONSOLE]],
    [
      /(playstation [345portablevi]+)/i
    ],
    [MODEL, [VENDOR, SONY], [TYPE, CONSOLE]],
    [
      /\b(xbox(?: one)?(?!; xbox))[\); ]/i
    ],
    [MODEL, [VENDOR, MICROSOFT], [TYPE, CONSOLE]],
    [
      /smart-tv.+(samsung)/i
    ],
    [VENDOR, [TYPE, SMARTTV]],
    [/hbbtv.+maple;(\d+)/i],
    [
      [MODEL, /^/, "SmartTV"],
      [VENDOR, SAMSUNG],
      [TYPE, SMARTTV]
    ],
    [
      /(nux; netcast.+smarttv|lg (netcast\.tv-201\d|android tv))/i
    ],
    [
      [VENDOR, LG],
      [TYPE, SMARTTV]
    ],
    [
      /(apple) ?tv/i
    ],
    [VENDOR, [MODEL, APPLE + " TV"], [TYPE, SMARTTV]],
    [
      /crkey/i
    ],
    [
      [MODEL, CHROME + "cast"],
      [VENDOR, GOOGLE],
      [TYPE, SMARTTV]
    ],
    [
      /droid.+aft(\w)( bui|\))/i
    ],
    [MODEL, [VENDOR, AMAZON], [TYPE, SMARTTV]],
    [
      /\(dtv[\);].+(aquos)/i
    ],
    [MODEL, [VENDOR, "Sharp"], [TYPE, SMARTTV]],
    [
      /(bravia[\w- ]+) bui/i
    ],
    [MODEL, [VENDOR, SONY], [TYPE, SMARTTV]],
    [
      /\b(roku)[\dx]*[\)\/]((?:dvp-)?[\d\.]*)/i,
      /hbbtv\/\d+\.\d+\.\d+ +\([\w ]*; *(\w[^;]*);([^;]*)/i
    ],
    [
      [VENDOR, trim],
      [MODEL, trim],
      [TYPE, SMARTTV]
    ],
    [
      /\b(android tv|smart[- ]?tv|opera tv|tv; rv:)\b/i
    ],
    [[TYPE, SMARTTV]],
    [
      /((pebble))app/i
    ],
    [VENDOR, MODEL, [TYPE, WEARABLE]],
    [
      /droid.+; (glass) \d/i
    ],
    [MODEL, [VENDOR, GOOGLE], [TYPE, WEARABLE]],
    [/droid.+; (wt63?0{2,3})\)/i],
    [MODEL, [VENDOR, ZEBRA], [TYPE, WEARABLE]],
    [
      /(quest( 2)?)/i
    ],
    [MODEL, [VENDOR, FACEBOOK], [TYPE, WEARABLE]],
    [
      /(tesla)(?: qtcarbrowser|\/[-\w\.]+)/i
    ],
    [VENDOR, [TYPE, EMBEDDED]],
    [
      /droid .+?; ([^;]+?)(?: bui|\) applew).+? mobile safari/i
    ],
    [MODEL, [TYPE, MOBILE]],
    [
      /droid .+?; ([^;]+?)(?: bui|\) applew).+?(?! mobile) safari/i
    ],
    [MODEL, [TYPE, TABLET]],
    [
      /\b((tablet|tab)[;\/]|focus\/\d(?!.+mobile))/i
    ],
    [[TYPE, TABLET]],
    [
      /(phone|mobile(?:[;\/]| safari)|pda(?=.+windows ce))/i
    ],
    [[TYPE, MOBILE]],
    [
      /(android[-\w\. ]{0,9});.+buil/i
    ],
    [MODEL, [VENDOR, "Generic"]]
  ],
  engine: [
    [
      /windows.+ edge\/([\w\.]+)/i
    ],
    [VERSION, [NAME, EDGE + "HTML"]],
    [
      /webkit\/537\.36.+chrome\/(?!27)([\w\.]+)/i
    ],
    [VERSION, [NAME, "Blink"]],
    [
      /(presto)\/([\w\.]+)/i,
      /(webkit|trident|netfront|netsurf|amaya|lynx|w3m|goanna)\/([\w\.]+)/i,
      /ekioh(flow)\/([\w\.]+)/i,
      /(khtml|tasman|links)[\/ ]\(?([\w\.]+)/i,
      /(icab)[\/ ]([23]\.[\d\.]+)/i
    ],
    [NAME, VERSION],
    [
      /rv\:([\w\.]{1,9})\b.+(gecko)/i
    ],
    [VERSION, NAME]
  ],
  os: [
    [
      /microsoft (windows) (vista|xp)/i
    ],
    [NAME, VERSION],
    [
      /(windows) nt 6\.2; (arm)/i,
      /(windows (?:phone(?: os)?|mobile))[\/ ]?([\d\.\w ]*)/i,
      /(windows)[\/ ]?([ntce\d\. ]+\w)(?!.+xbox)/i
    ],
    [NAME, [VERSION, strMapper, windowsVersionMap]],
    [/(win(?=3|9|n)|win 9x )([nt\d\.]+)/i],
    [
      [NAME, "Windows"],
      [VERSION, strMapper, windowsVersionMap]
    ],
    [
      /ip[honead]{2,4}\b(?:.*os ([\w]+) like mac|; opera)/i,
      /cfnetwork\/.+darwin/i
    ],
    [
      [VERSION, /_/g, "."],
      [NAME, "iOS"]
    ],
    [
      /(mac os x) ?([\w\. ]*)/i,
      /(macintosh|mac_powerpc\b)(?!.+haiku)/i
    ],
    [
      [NAME, "Mac OS"],
      [VERSION, /_/g, "."]
    ],
    [
      /droid ([\w\.]+)\b.+(android[- ]x86)/i
    ],
    [VERSION, NAME],
    [
      /(android|webos|qnx|bada|rim tablet os|maemo|meego|sailfish)[-\/ ]?([\w\.]*)/i,
      /(blackberry)\w*\/([\w\.]*)/i,
      /(tizen|kaios)[\/ ]([\w\.]+)/i,
      /\((series40);/i
    ],
    [NAME, VERSION],
    [
      /\(bb(10);/i
    ],
    [VERSION, [NAME, BLACKBERRY]],
    [
      /(?:symbian ?os|symbos|s60(?=;)|series60)[-\/ ]?([\w\.]*)/i
    ],
    [VERSION, [NAME, "Symbian"]],
    [
      /mozilla\/[\d\.]+ \((?:mobile|tablet|tv|mobile; [\w ]+); rv:.+ gecko\/([\w\.]+)/i
    ],
    [VERSION, [NAME, FIREFOX + " OS"]],
    [
      /web0s;.+rt(tv)/i,
      /\b(?:hp)?wos(?:browser)?\/([\w\.]+)/i
    ],
    [VERSION, [NAME, "webOS"]],
    [
      /crkey\/([\d\.]+)/i
    ],
    [VERSION, [NAME, CHROME + "cast"]],
    [
      /(cros) [\w]+ ([\w\.]+\w)/i
    ],
    [[NAME, "Chromium OS"], VERSION],
    [
      /(nintendo|playstation) ([wids345portablevuch]+)/i,
      /(xbox); +xbox ([^\);]+)/i,
      /\b(joli|palm)\b ?(?:os)?\/?([\w\.]*)/i,
      /(mint)[\/\(\) ]?(\w*)/i,
      /(mageia|vectorlinux)[; ]/i,
      /([kxln]?ubuntu|debian|suse|opensuse|gentoo|arch(?= linux)|slackware|fedora|mandriva|centos|pclinuxos|red ?hat|zenwalk|linpus|raspbian|plan 9|minix|risc os|contiki|deepin|manjaro|elementary os|sabayon|linspire)(?: gnu\/linux)?(?: enterprise)?(?:[- ]linux)?(?:-gnu)?[-\/ ]?(?!chrom|package)([-\w\.]*)/i,
      /(hurd|linux) ?([\w\.]*)/i,
      /(gnu) ?([\w\.]*)/i,
      /\b([-frentopcghs]{0,5}bsd|dragonfly)[\/ ]?(?!amd|[ix346]{1,2}86)([\w\.]*)/i,
      /(haiku) (\w+)/i
    ],
    [NAME, VERSION],
    [
      /(sunos) ?([\w\.\d]*)/i
    ],
    [[NAME, "Solaris"], VERSION],
    [
      /((?:open)?solaris)[-\/ ]?([\w\.]*)/i,
      /(aix) ((\d)(?=\.|\)| )[\w\.])*/i,
      /\b(beos|os\/2|amigaos|morphos|openvms|fuchsia|hp-ux)/i,
      /(unix) ?([\w\.]*)/i
    ],
    [NAME, VERSION]
  ]
};
class UAParser {
  constructor(ua, extensions) {
    __publicField(this, "ua");
    __publicField(this, "extensions");
    __publicField(this, "_ua");
    __publicField(this, "_regMap");
    if (typeof ua === OBJ_TYPE) {
      this.extensions = ua;
      this.ua = void 0;
    }
    this._ua = this.ua || (typeof window !== UNDEF_TYPE && window.navigator && window.navigator.userAgent ? window.navigator.userAgent : EMPTY);
    this._regMap = extensions ? extend(regexes, extensions) : regexes;
  }
  getBrowser() {
    const _browser = {};
    _browser[NAME] = void 0;
    _browser[VERSION] = void 0;
    rgxMapper.call(_browser, this._ua, this._regMap.browser);
    _browser.major = toMajor(_browser.version);
    return _browser;
  }
  getCPU() {
    const _cpu = {};
    _cpu[ARCHITECTURE] = void 0;
    rgxMapper.call(_cpu, this._ua, this._regMap.cpu);
    return _cpu;
  }
  getDevice() {
    const _device = {};
    _device[VENDOR] = void 0;
    _device[MODEL] = void 0;
    _device[TYPE] = void 0;
    rgxMapper.call(_device, this._ua, this._regMap.device);
    return _device;
  }
  getEngine() {
    const _engine = {};
    _engine[NAME] = void 0;
    _engine[VERSION] = void 0;
    rgxMapper.call(_engine, this._ua, this._regMap.engine);
    return _engine;
  }
  getOS() {
    const _os = {};
    _os[NAME] = void 0;
    _os[VERSION] = void 0;
    rgxMapper.call(_os, this._ua, this._regMap.os);
    return _os;
  }
  getResult() {
    return {
      ua: this.getUA(),
      browser: this.getBrowser(),
      engine: this.getEngine(),
      os: this.getOS(),
      device: this.getDevice(),
      cpu: this.getCPU()
    };
  }
  getUA() {
    return this._ua;
  }
  setUA(ua) {
    this._ua = typeof ua === STR_TYPE && ua.length > UA_MAX_LENGTH ? trim(ua, UA_MAX_LENGTH) : ua;
    return this;
  }
}
__publicField(UAParser, "VERSION", LIBVERSION);
__publicField(UAParser, "BROWSER", toEnumeration([NAME, VERSION, MAJOR]));
__publicField(UAParser, "CPU", toEnumeration([ARCHITECTURE]));
__publicField(UAParser, "DEVICE", toEnumeration([
  MODEL,
  VENDOR,
  TYPE,
  CONSOLE,
  MOBILE,
  SMARTTV,
  TABLET,
  WEARABLE,
  EMBEDDED
]));
__publicField(UAParser, "ENGINE", toEnumeration([NAME, VERSION]));
__publicField(UAParser, "OS", toEnumeration([NAME, VERSION]));
const userAgent = (ua, extensions) => new UAParser(ua, extensions).getResult();
export { Application, AsyncEvent, DownloadUtil, HttpLibrary, Path, RouterFactory, Types, clone, debounce, installer as default, defineGetter, definePrototype, defineReadOnly, setHttpTimeout, toPlanChains, userAgent };
