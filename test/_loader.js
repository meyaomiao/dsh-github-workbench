// 共享 ModuleLoader 桩:require 解析 react UMD / jsx-runtime shim / 平台桩
window.__ModuleLoader__ = { load({ factory }) {
  const R = window.React;
  const jsxShim = function (type, props, key) {
    const p = Object.assign({}, props);
    const kids = p.children;
    delete p.children;
    return kids === undefined
      ? R.createElement(type, Object.assign({ key: key }, p))
      : R.createElement(type, Object.assign({ key: key }, p), kids);
  };
  const reg = {
    'react': R,
    'react-dom/client': { createRoot: function () { return window.ReactDOM.createRoot.apply(window.ReactDOM, arguments); } },
    'react/jsx-runtime': { jsx: jsxShim, jsxs: jsxShim, Fragment: R.Fragment },
    '@deepseek-ai/dsh-client-runtime': {},
  };
  window.__exports__ = factory(function (name) {
    if (!(name in reg)) throw new Error('unexpected require: ' + name);
    return reg[name];
  });
}};
