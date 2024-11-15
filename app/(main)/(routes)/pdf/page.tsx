"use client";
import PDFViewer from "@/components/PDFViewer/PDFViewer";

export default function PDFViewerPage() {
  return (
    <div className="size-full bg-gray-100">
      <PDFViewer url="/sample.pdf" />
    </div>
  );
}
