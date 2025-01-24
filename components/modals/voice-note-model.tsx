"use client";

import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { useVoiceNote } from "@/hook/use-voice-note";
import { SingleImageDropzone } from "@/components/global/single-image-dropzone";
import { useState } from "react";
import { useEdgeStore } from "@/lib/edgestore";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useParams } from "next/navigation";
import { Id } from "@/convex/_generated/dataModel";

export const VoiceNoteModel = () => {
  const params = useParams();
  const [file, setFile] = useState<File>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const voiceNote = useVoiceNote();


  const onClose = () => {
    setFile(undefined);
    setIsSubmitting(false);
    voiceNote.onClose();
  };

  const onChange = async (file?: File) => {
    if (file) {
      setIsSubmitting(true);
      setFile(file);

      //voice note scripting
      onClose();
    }
  };

  return (
    <Dialog open={voiceNote.isOpen} onOpenChange={voiceNote.onClose}>
      <DialogContent>
        <DialogHeader>
          <h2 className="text-center text-lg font-semibold">Voice Note</h2>
        </DialogHeader>
        <div>
          <SingleImageDropzone
            className="w-full outline-none"
            disabled={isSubmitting}
            value={file}
            onChange={onChange}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};
