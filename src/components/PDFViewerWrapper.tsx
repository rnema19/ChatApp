"use client"
import dynamic from 'next/dynamic'

// Dynamically import PDFViewer with no SSR to avoid pdfjs server-side issues
const PDFViewer = dynamic(() => import('./PDFViewer'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  ),
})

type Props = {
  pdfURL: string
}

export default function PDFViewerWrapper({ pdfURL }: Props) {
  return <PDFViewer pdfURL={pdfURL} />
}
