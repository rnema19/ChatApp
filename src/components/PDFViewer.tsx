"use client"
import React from 'react'
import { Document, Page, pdfjs } from 'react-pdf';
import { PDFViewer as PDFView} from '@embedpdf/react-pdf-viewer';

type Props = {
    pdfURL : string
}


const PDFViewer = ({pdfURL}: Props) => {
  const [numPages, setNumPages] = React.useState<number>();
  const [pageNumber, setPageNumber] = React.useState<number>(1);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
    setNumPages(numPages);
  }

  console.log("pdfUrl inside PDFViewer: ", pdfURL);
  

  return (
    <div style={{ height: '100%' }}>
      <PDFView 
        config={{
          src: pdfURL,
          theme: { preference: 'light' }
        }}
      />
    </div>
  );
}

export default PDFViewer