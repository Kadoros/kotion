"use client";

import { SettingsModal } from "@/components/modals/settings-model";

import React, { useEffect, useState } from "react";
import { CoverImageModal } from "@/components/modals/cover-image-modal";
import { VoiceNoteModel } from "../modals/voice-note-model";

export const ModelProvider = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <SettingsModal />
      <CoverImageModal />
      <VoiceNoteModel />
    </>
  );
};
