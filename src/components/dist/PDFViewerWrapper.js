"use client";
"use strict";
exports.__esModule = true;
var dynamic_1 = require("next/dynamic");
// Dynamically import PDFViewer with no SSR to avoid pdfjs server-side issues
var PDFViewer = dynamic_1["default"](function () { return Promise.resolve().then(function () { return require('./PDFViewer'); }); }, {
    ssr: false,
    loading: function () { return (React.createElement("div", { className: "flex items-center justify-center h-full" },
        React.createElement("div", { className: "animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" }))); }
});
function PDFViewerWrapper(_a) {
    var pdfURL = _a.pdfURL;
    return React.createElement(PDFViewer, { pdfURL: pdfURL });
}
exports["default"] = PDFViewerWrapper;
