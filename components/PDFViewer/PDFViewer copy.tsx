import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Download,
  Maximize2,
} from "lucide-react";

declare global {
  interface Window {
    pdfjsLib: any;
  }
}

interface PDFViewerProps {
  url: string;
  initialPagesToLoad?: number;
  pageLoadBuffer?: number;
}

interface PageInfo {
  pageNumber: number;
  height: number;
  isLoaded: boolean;
}

const PDFViewer = ({
  url,
  initialPagesToLoad = 3,
  pageLoadBuffer = 2,
}: PDFViewerProps) => {
  const canvasRefs = useRef<Map<number, HTMLCanvasElement>>(new Map());
  const observerRef = useRef<IntersectionObserver | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [pdfDoc, setPdfDoc] = useState<any>(null);
  const [numPages, setNumPages] = useState(0);
  const [scale, setScale] = useState(1.0);
  const [rotation, setRotation] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pageInfos, setPageInfos] = useState<PageInfo[]>([]);
  const [visiblePages, setVisiblePages] = useState<Set<number>>(new Set());
  const [initialRenderComplete, setInitialRenderComplete] = useState(false);
  const [renderedPages, setRenderedPages] = useState<Set<number>>(new Set());

  const baseScaleRef = useRef<number>(1.0);

  const markPageAsRendered = (pageNumber: number) => {
    setRenderedPages((prev) => new Set(prev).add(pageNumber));
  };

  const calculateBaseScale = useCallback((viewport: any) => {
    if (!containerRef.current) return 1.0;
    const containerWidth = containerRef.current.clientWidth - 48; // 패딩 고려
    return containerWidth / viewport.width;
  }, []);

  const getPixelRatio = () => {
    return window.devicePixelRatio || 1;
  };

  useEffect(() => {
    let scriptElement: HTMLScriptElement | null = null;

    const initPDF = async () => {
      try {
        const script = document.createElement("script");
        script.src =
          "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
        script.async = true;

        const loadScript = new Promise((resolve, reject) => {
          script.onload = resolve;
          script.onerror = reject;
        });

        document.head.appendChild(script);
        scriptElement = script;

        await loadScript;

        window.pdfjsLib.GlobalWorkerOptions.workerSrc =
          "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
        await loadPDF();
      } catch (err) {
        setError("Failed to load PDF viewer");
        setIsLoading(false);
      }
    };

    initPDF();

    return () => {
      if (scriptElement && document.head.contains(scriptElement)) {
        document.head.removeChild(scriptElement);
      }
      observerRef.current?.disconnect();
    };
  }, [url]);

  const loadPDF = async () => {
    if (!window.pdfjsLib) return;
    setError(null);

    try {
      setIsLoading(true);
      const loadingTask = window.pdfjsLib.getDocument({
        url: url,
        cMapUrl:
          "https://cdnjs.cloudflare.com/ajax/libs/pdfjs-dist/3.11.174/cmaps/",
        cMapPacked: true,
        enableXfa: true,
      });
      const pdf = await loadingTask.promise;
      setPdfDoc(pdf);
      setNumPages(pdf.numPages);

      const infos: PageInfo[] = Array.from(
        { length: pdf.numPages },
        (_, i) => ({
          pageNumber: i + 1,
          height: 0,
          isLoaded: false,
        })
      );
      setPageInfos(infos);
      setError(null);
    } catch (error) {
      console.error("Error loading PDF:", error);
      setError("Failed to load PDF document");
    } finally {
      setIsLoading(false);
    }
  };

  const clearCanvas = (canvas: HTMLCanvasElement) => {
    const context = canvas.getContext("2d");
    if (context) {
      context.fillStyle = "#ffffff"; // 흰색 배경으로 초기화
      context.fillRect(0, 0, canvas.width, canvas.height);
    }
  };

  const renderPage = async (pageNum: number) => {
    if (!pdfDoc || !canvasRefs.current.has(pageNum)) return;
  
    try {
      const page = await pdfDoc.getPage(pageNum);
  
      // 기본 뷰포트로 baseScale 계산
      const defaultViewport = page.getViewport({ scale: 1.0 });
      if (baseScaleRef.current === 1.0) {
        baseScaleRef.current = calculateBaseScale(defaultViewport);
      }
  
      // 최종 스케일 계산: 기본 스케일 * 사용자 확대/축소 * 픽셀 비율
      const pixelRatio = getPixelRatio();
      const finalScale = baseScaleRef.current * scale * pixelRatio;
  
      const viewport = page.getViewport({ scale: finalScale, rotation });
  
      const canvas = canvasRefs.current.get(pageNum)!;
      const context = canvas.getContext("2d", { alpha: false });
      if (!context) return;
  
      // 캔버스 크기 설정
      canvas.style.width = `${viewport.width / pixelRatio}px`;
      canvas.style.height = `${viewport.height / pixelRatio}px`;
      canvas.width = viewport.width;
      canvas.height = viewport.height;
  
      // 배경 초기화
      context.fillStyle = "#ffffff";
      context.fillRect(0, 0, canvas.width, canvas.height);
  
      // 고품질 렌더링 설정
      context.imageSmoothingEnabled = true;
      context.imageSmoothingQuality = "high";
  
      const renderContext = {
        canvasContext: context,
        viewport: viewport,
        enableWebGL: true,
        renderInteractiveForms: true,
        background: "white",
      };
  
      // 페이지 렌더링
      await page.render(renderContext).promise;
  
      // 렌더 완료된 페이지 표시
      markPageAsRendered(pageNum);
  
      // 페이지 정보 업데이트
      setPageInfos((prev) =>
        prev.map((info) =>
          info.pageNumber === pageNum
            ? { ...info, height: viewport.height / pixelRatio, isLoaded: true }
            : info
        )
      );
  
      // 첫 페이지 렌더링 완료 처리
      if (pageNum === 1 && !initialRenderComplete) {
        setInitialRenderComplete(true);
      }
    } catch (error) {
      console.error(`Error rendering page ${pageNum}:`, error);
    }
  };
  
  

  // Intersection Observer 설정
  useEffect(() => {
    if (!containerRef.current) return;

    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      const visiblePageNumbers = new Set<number>();

      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const pageNum = Number(entry.target.getAttribute("data-page"));
          visiblePageNumbers.add(pageNum);

          for (let i = 1; i <= pageLoadBuffer; i++) {
            if (pageNum + i <= numPages) visiblePageNumbers.add(pageNum + i);
            if (pageNum - i > 0) visiblePageNumbers.add(pageNum - i);
          }
        }
      });

      setVisiblePages(visiblePageNumbers);
    };

    observerRef.current = new IntersectionObserver(handleIntersection, {
      root: containerRef.current,
      threshold: 0.1,
      rootMargin: "100px",
    });

    return () => {
      observerRef.current?.disconnect();
    };
  }, [numPages, pageLoadBuffer]);

  // 초기 페이지 및 가시성 변경 시 렌더링
  useEffect(() => {
    // if (!initialRenderComplete && pdfDoc) {
    //   // 첫 페이지 즉시 렌더링
    //   renderPage(1);
    // }

    visiblePages.forEach((pageNum) => {
      if (!pageInfos[pageNum - 1]?.isLoaded) {
        renderPage(pageNum);
      }
    });
  }, [visiblePages, scale, rotation, pdfDoc, initialRenderComplete]);

  // 창 크기 변경 시 다시 렌더링
  useEffect(() => {
    const handleResize = () => {
      visiblePages.forEach((pageNum) => {
        renderPage(pageNum);
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [visiblePages]);

  useEffect(() => {
    if (!pdfDoc) return;
  
    renderedPages.forEach((pageNumber) => {
      renderPage(pageNumber);
    });
  }, [scale, rotation]);

  const handleZoomIn = () => {
    setScale((prev) => Math.min(prev + 0.2, 3.0));
  };
  const handleZoomOut = () => {
    setScale((prev) => Math.max(prev - 0.2, 0.5));
  };
  const handleRotate = () => setRotation((prev) => (prev + 90) % 360);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = url;
    link.download = "document.pdf";
    link.click();
  };

  return (
    <div
      ref={containerRef}
      className="w-full h-full mx-auto bg-white rounded-lg shadow-lg"
    >
      <div className="sticky top-0 z-10 flex items-center justify-between p-4 bg-white border-b">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm">{numPages} pages</span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleZoomOut}
              disabled={isLoading}
              className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-50"
            >
              <ZoomOut className="w-5 h-5" />
            </button>

            <span className="text-sm">{Math.round(scale * 100)}%</span>

            <button
              onClick={handleZoomIn}
              disabled={isLoading}
              className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-50"
            >
              <ZoomIn className="w-5 h-5" />
            </button>
          </div>

          <button
            onClick={handleRotate}
            disabled={isLoading}
            className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-50"
          >
            <RotateCw className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleDownload}
            disabled={isLoading}
            className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-50"
          >
            <Download className="w-5 h-5" />
          </button>

          <button
            onClick={toggleFullscreen}
            disabled={isLoading}
            className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-50"
          >
            <Maximize2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div
        className="relative overflow-auto bg-gray-100 p-4"
        style={{ height: "calc(100vh - 80px)" }}
      >
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        {error && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-red-500 text-center">
              <p className="text-lg font-semibold">{error}</p>
              <button
                onClick={loadPDF}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        <div className="flex flex-col items-center space-y-4">
          {pageInfos.map((pageInfo) => (
            <div
              key={pageInfo.pageNumber}
              className="relative bg-white shadow-lg"
              data-page={pageInfo.pageNumber}
              ref={(el) => {
                if (el) {
                  observerRef.current?.observe(el);
                }
              }}
            >
              <canvas
                ref={(el) => {
                  if (el) {
                    canvasRefs.current.set(pageInfo.pageNumber, el);
                  }
                }}
                className="block"
                style={{
                  backgroundColor: "#ffffff",
                  minHeight: pageInfo.isLoaded ? "auto" : "842px",
                }}
              />
              {!pageInfo.isLoaded && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
                  <span className="text-gray-500">
                    Page {pageInfo.pageNumber}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PDFViewer;
