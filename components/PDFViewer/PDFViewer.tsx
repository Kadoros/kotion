"use client";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import { toolbarPlugin, ToolbarSlot } from "@react-pdf-viewer/toolbar";
import {
  highlightPlugin,
  Trigger,
  HighlightArea,
  SelectionData,
  RenderHighlightTargetProps,
  MessageIcon,
} from "@react-pdf-viewer/highlight";

import { Button, Position, Tooltip } from "@react-pdf-viewer/core";

import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import { useTheme } from "next-themes";
import { usePDFHighlight } from "@/hook/use-pdf-highlight";
import { useEffect } from "react";

// Define types for ToolbarProps
interface ToolbarProps {
  children: (slots: ToolbarSlot) => React.ReactNode;
}

interface PDFProps {
  url: string; // Expecting a `url` prop as string
}

export default function PDFViewer({ url }: PDFProps) {
  const theme = useTheme();
  const setSelectedText = usePDFHighlight((state) => state.setSelectedText);
  const renderHighlightTarget = (props: RenderHighlightTargetProps) => {
    const { selectionRegion, selectedText } = props;
    setSelectedText(selectedText);

    return (
      <div
        style={{
          position: "absolute",
          left: `${selectionRegion.left}%`,
          top: `${selectionRegion.top + selectionRegion.height}%`,
        }}
      >
        {/* <Button
          onClick={() => {
            setSelectedText({
              selectedText: selectedText.selectedText,
              pageIndex: selectedText.pageIndex,
              bounds: selectedText.bounds,
            });
          }}
        >
          <Tooltip
            position={Position.TopCenter}
            target={<MessageIcon />}
          >
            Send to Sidebar
          </Tooltip>
        </Button> */}
      </div>
    );
  };

  const highlightPluginInstance = highlightPlugin({
    trigger: Trigger.TextSelection,

    renderHighlightTarget,
  });

  const defaultLayoutPluginInstance = defaultLayoutPlugin({
    sidebarTabs: (defaultTabs) => [],
  });
  const toolbarPluginInstance = toolbarPlugin();

  return (
    <>
      <Worker workerUrl="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js">
        <div className="h-full">
          <Viewer
            fileUrl={url} // Use the `url` prop passed to the component
            plugins={[
              defaultLayoutPluginInstance,
              toolbarPluginInstance,
              highlightPluginInstance,
            ]}
            theme={theme}
          />
        </div>
      </Worker>
    </>
  );
}
