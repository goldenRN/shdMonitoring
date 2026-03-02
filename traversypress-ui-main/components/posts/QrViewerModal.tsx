"use client";
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "../ui/button";

interface QrViewerModalProps {
  open: boolean;
  onClose: () => void;
  qrCode: string | null;
  newsId: number | 0;
}

const QrViewerModal: React.FC<QrViewerModalProps> = ({ open, onClose, qrCode, newsId }) => {
  const downloadQR = (qrBase64: string, newsId: number) => {
    const link = document.createElement("a");
    link.href = qrBase64;
    link.download = `qr-news-${newsId}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          {/* <DialogTitle>Ажлын QR </DialogTitle> */}
        </DialogHeader>
        {/* {qrCode! ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4">
            <img src={qrCode!} alt="QR Code" className="w-32 h-32" />
          </div>
        ) : (
          <p className="text-center text-gray-500 py-6">QR олдсонгүй.</p>
        )} */}

        {qrCode && (
          <div className="flex flex-col items-center">
            <img src={qrCode} alt="QR Code" className="w-50 h-50" />

            <Button
              size="lg"
              onClick={() => downloadQR(qrCode, newsId)}
              className="bg-black text-white text-xs"
            >
              QR татах
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default QrViewerModal;
