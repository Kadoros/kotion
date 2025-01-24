"use client";
import PDFViewer from "@/components/PDFViewer/PDFViewer";

interface PDFViewerPageProps {
  params: {
    pdfId: string;
  };
}

export default function PDFViewerPage({ params }: PDFViewerPageProps) {
  return (
    <div className="size-full bg-gray-100">
      <PDFViewer url={`/${params.pdfId}`} />
    </div>
  );
}
