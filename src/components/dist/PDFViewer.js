"use strict";
exports.__esModule = true;
var react_1 = require("react");
var PDFViewer = function (_a) {
    var pdfURL = _a.pdfURL;
    return (
    // /*
    react_1["default"].createElement("iframe", { 
        // src={`https://docs.google.com/document/${encodeURIComponent(pdfURL)}/view`}
        src: "https://docs.google.com/viewer?url=" + encodeURIComponent(pdfURL) + "&embedded=true", 
        // src={`https://drive.google.com/file/d/${encodeURIComponent(pdfURL)}/view`}
        className: 'w-full h-full', sandbox: 'allow-scripts allow-same-origin allow-popups' })
    // */
    /*
    <object
    data={pdfURL}
    type="application/pdf"
    className='w-full h-full'
    >
        <p>Your browser does not support PDFs.
            <a href={pdfURL}>Download the PDF</a>
        </p>
    </object>
    */
    );
};
exports["default"] = PDFViewer;
