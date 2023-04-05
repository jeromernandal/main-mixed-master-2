"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _Showcase = _interopRequireDefault(require("./src/Showcase"));
var _MyComponent = _interopRequireDefault(require("./src/MyComponent"));
var _index = _interopRequireDefault(require("./src/index"));
var _ethers = require("ethers");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function App() {
  return /*#__PURE__*/React.createElement("div", {
    className: "App"
  }, /*#__PURE__*/React.createElement(_Showcase["default"], null), /*#__PURE__*/React.createElement(_MyComponent["default"], {
    isConnected: true,
    mint: function mint() {}
  }));
}
var _default = App;
exports["default"] = _default;