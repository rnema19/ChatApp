import React from 'react'
import { Page, Text, View, Document, StyleSheet, PDFViewer as Viewer } from '@react-pdf/renderer';

type Props = {
    pdfURL : string
}

const PDFViewer = ({pdfURL}: Props) => {
  return (
    // /*
    <iframe
        // src={`https://docs.google.com/document/${encodeURIComponent(pdfURL)}/view`}
        src={`https://docs.google.com/viewer?url=${encodeURIComponent(pdfURL)}&embedded=true`}
        // src={`https://drive.google.com/file/d/${encodeURIComponent(pdfURL)}/view`}

        className='w-full h-full'
        sandbox='allow-scripts allow-same-origin allow-popups'
    >    
    </iframe>
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

  )
  
}

export default PDFViewer