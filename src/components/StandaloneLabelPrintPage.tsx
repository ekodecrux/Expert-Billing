import React, { useEffect, useRef, useState } from "react";
import { Download, Printer, RefreshCw, Tag } from "lucide-react";
import {
  LabelPrintSnapshotPayload,
  decodeLabelSnapshotFromHash,
  fetchLabelPrintSnapshotFromServer,
  loadLabelPrintSnapshot,
  printLabelHtmlSynchronously,
  saveLabelPrintSnapshot
} from "../utils/labelPrinterEngine";

function getInitialLabelSnapshot(): LabelPrintSnapshotPayload | null {
  if (typeof window === "undefined") return null;
  const fromHash = decodeLabelSnapshotFromHash(window.location.hash || "");
  if (fromHash?.html) return fromHash;
  return loadLabelPrintSnapshot();
}

export const StandaloneLabelPrintPage: React.FC = () => {
  const [snapshot, setSnapshot] = useState<LabelPrintSnapshotPayload | null>(() =>
    getInitialLabelSnapshot()
  );
  const [isLoadingServer, setIsLoadingServer] = useState<boolean>(
    () => !getInitialLabelSnapshot()
  );
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const hasAutoDispatchedRef = useRef<boolean>(false);

  const scheduleRelayWindowClose = (delayMs = 450) => {
    setTimeout(() => {
      try {
        window.close();
      } catch {
        // Ignore if browser prevents programmatic tab close
      }
    }, delayMs);
  };

  const triggerDirectLabelPrint = () => {
    if (!snapshot?.html) return;
    const onAfterPrint = () => {
      scheduleRelayWindowClose(350);
    };
    window.addEventListener("afterprint", onAfterPrint, { once: true });
    const res = printLabelHtmlSynchronously(
      snapshot.html,
      snapshot.pageWidthMm || 50,
      snapshot.pageHeightMm || 25,
      Boolean(snapshot.isA4Sheet),
      snapshot.jobTitle || "Expert POS Label Print"
    );
    if (!res.ok) {
      window.removeEventListener("afterprint", onAfterPrint);
      setStatusMessage(res.reason || "Unable to open print dialog automatically — click Print Labels Now.");
    } else {
      setStatusMessage("Print dialog opened for your configured label printer.");
    }
  };

  const loadLatestFromServer = async (showSpinner = false) => {
    if (showSpinner) setIsLoadingServer(true);
    try {
      const params = new URLSearchParams(window.location.search);
      const jobId = params.get("job") || "latest_label";
      const serverSnap = await fetchLabelPrintSnapshotFromServer(jobId);
      if (serverSnap?.html) {
        setSnapshot(serverSnap);
        saveLabelPrintSnapshot(serverSnap);
      }
    } finally {
      setIsLoadingServer(false);
    }
  };

  useEffect(() => {
    void loadLatestFromServer(!snapshot);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!snapshot?.html || isLoadingServer || hasAutoDispatchedRef.current) return;
    const timer = setTimeout(() => {
      if (hasAutoDispatchedRef.current) return;
      hasAutoDispatchedRef.current = true;
      triggerDirectLabelPrint();
    }, 180);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [snapshot, isLoadingServer]);

  const handleDownloadRawCommands = () => {
    if (!snapshot?.rawCommands) return;
    const proto = snapshot.rawProtocol === "TSPL" ? "tspl" : "zpl";
    const blob = new Blob([snapshot.rawCommands], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Labels-${proto.toUpperCase()}-${Date.now()}.${proto}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (isLoadingServer && !snapshot?.html) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-6 font-sans">
        <div className="bg-white max-w-md w-full rounded-2xl border border-slate-200 shadow-lg p-6 text-center space-y-3">
          <RefreshCw className="w-8 h-8 text-purple-600 mx-auto animate-spin" />
          <h1 className="text-base font-bold text-slate-900">Preparing Label Print Job...</h1>
          <p className="text-xs text-slate-600">
            Loading formatted thermal labels for your printer.
          </p>
        </div>
      </div>
    );
  }

  if (!snapshot?.html) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-6 font-sans">
        <div className="bg-white max-w-md w-full rounded-2xl border border-slate-200 shadow-lg p-6 text-center space-y-4">
          <Tag className="w-9 h-9 text-slate-500 mx-auto" />
          <h1 className="text-base font-bold text-slate-900">No Labels Loaded to Print</h1>
          <p className="text-xs text-slate-600 leading-relaxed">
            Open the Label &amp; Barcode Printer Studio in Expert POS and click Print to send your label batch here.
          </p>
          <button
            type="button"
            onClick={() => void loadLatestFromServer(true)}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Check for Latest Label Job
          </button>
        </div>
      </div>
    );
  }

  const widthMm = snapshot.isA4Sheet ? 210 : snapshot.pageWidthMm || 50;
  const heightMm = snapshot.isA4Sheet ? 297 : snapshot.pageHeightMm || 25;

  return (
    <div className="min-h-screen bg-slate-100 py-6 px-4 flex flex-col items-center gap-5 font-sans">
      <div className="bg-white max-w-lg w-full rounded-2xl border border-slate-200 shadow-md p-4 space-y-2.5 no-print">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="min-w-0">
            <h1 className="text-sm font-black text-slate-900 truncate">
              {snapshot.jobTitle || "Ready to Print Product Labels"}
            </h1>
            <p className="text-[11px] text-slate-500 truncate font-mono">
              {snapshot.presetName || "Label Roll"} • {widthMm}×{heightMm} mm
              {snapshot.isDualRoll ? " • 2-Up Dual Roll" : ""}
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {snapshot.rawCommands && (
              <button
                type="button"
                onClick={handleDownloadRawCommands}
                className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                .{snapshot.rawProtocol === "TSPL" ? "tspl" : "zpl"}
              </button>
            )}
            <button
              type="button"
              onClick={triggerDirectLabelPrint}
              className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <Printer className="w-4 h-4" />
              Print Labels Now
            </button>
          </div>
        </div>

        {statusMessage && (
          <p className="text-[11px] font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2">
            {statusMessage}
          </p>
        )}
      </div>

      <style>{`
        #standalone-label-sheet {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
          padding: 16px;
          background: #ffffff;
          border: 1px solid #cbd5e1;
          border-radius: 14px;
          box-shadow: 0 10px 25px rgba(15, 23, 42, 0.1);
          max-width: 100%;
          overflow-x: auto;
        }
        #standalone-label-sheet .label-print-page {
          width: ${widthMm}mm;
          height: ${heightMm}mm;
          background: #ffffff;
          box-shadow: 0 1px 4px rgba(15, 23, 42, 0.12);
          overflow: hidden;
        }
        #standalone-label-sheet .label-print-page.label-dual-row {
          display: grid !important;
        }
      `}</style>

      <div
        id="standalone-label-sheet"
        className="no-print"
        dangerouslySetInnerHTML={{ __html: snapshot.html }}
      />
    </div>
  );
};
