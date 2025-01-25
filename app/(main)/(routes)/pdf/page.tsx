"use client";

import PDFViewer from "@/components/PDFViewer/PDFViewer";
import { useOpenPdfWith } from "@/hook/use-open-pdf-with";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation"; // Import useSearchParams

export default function PDFViewerPage() {
  const searchParams = useSearchParams(); // Access query parameters
  const openPdf = useOpenPdfWith();
  const [urlVal, setUrlVal] = useState("/dummy.pdf");
  const url = searchParams.get("url");
  useEffect(() => {
    if (!url) {
      openPdf.onOpen();
    } else {
      const proxyUrl = `/api/proxy-pdf?url=${encodeURIComponent(url)}`;
      setUrlVal(proxyUrl)
    }
  }, [url]);

 

  return (
    <div className="size-full bg-gray-100">
      <PDFViewer url={urlVal} />
    </div>
  );
}
