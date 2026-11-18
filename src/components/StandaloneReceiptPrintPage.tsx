import React, { useEffect, useRef, useState } from "react";
import { Printer, RefreshCw, Usb, Wifi } from "lucide-react";
import { buildReceiptUtilityStyles, printElementDirect } from "../types";
import {
  THERMAL_LAYOUT_SPECS,
  PrintSnapshotPayload,
  decodeSnapshotFromHash,
  fetchPrintSnapshotFromServer,
  loadPrintSnapshot,
  savePrintSnapshot,
  loadThermalPrinterConfig,
  saveThermalPrinterConfig,
  buildEscPosPayload,
  hasPairedUsbPrinter,
  hasPairedSerialPrinter,
  printViaWebUSB,
  printViaWebSerial,
  printViaNetworkSocket,
  PrinterLayoutProfile,
  ThermalConnectionMode,
  ReceiptFontStyle,
  ReceiptFontSize,
  getReceiptTypographySpec
} from "../utils/thermalPrinter";

function getInitialSnapshot(): PrintSnapshotPayload | null {
  if (typeof window === "undefined") return null;
  const fromHash = decodeSnapshotFromHash(window.location.hash || "");
  if (fromHash?.html) return fromHash;
  return loadPrintSnapshot();
}

export const StandaloneReceiptPrintPage: React.FC = () => {
  const [snapshot, setSnapshot] = useState<PrintSnapshotPayload | null>(() => getInitialSnapshot());
  const [isLoadingServer, setIsLoadingServer] = useState<boolean>(() => !getInitialSnapshot());
  const [printerConfig, setPrinterConfig] = useState(() => {
    const cfg = loadThermalPrinterConfig();
    const initialSnap = getInitialSnapshot();
    return {
      ...cfg,
      layoutProfile: (initialSnap?.layoutProfile && THERMAL_LAYOUT_SPECS[initialSnap.layoutProfile]
        ? initialSnap.layoutProfile
        : cfg.layoutProfile) as PrinterLayoutProfile,
      connectionMode: (initialSnap?.connectionMode &&
      ["system", "webusb", "webserial", "network"].includes(initialSnap.connectionMode)
        ? initialSnap.connectionMode
        : cfg.connectionMode) as ThermalConnectionMode,
      receiptFontStyle: (initialSnap?.receiptFontStyle || cfg.receiptFontStyle || "courier") as ReceiptFontStyle,
      receiptFontSize: (initialSnap?.receiptFontSize || cfg.receiptFontSize || "medium") as ReceiptFontSize
    };
  });
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [hasPairedDevice, setHasPairedDevice] = useState<boolean>(false);

  const hasAutoDispatchedRef = useRef<boolean>(false);
  const isPrintingRef = useRef<boolean>(false);

  const layout: PrinterLayoutProfile = printerConfig.layoutProfile || "thermal-80mm";
  const spec = THERMAL_LAYOUT_SPECS[layout] || THERMAL_LAYOUT_SPECS["thermal-80mm"];
  const isA4 = layout === "standard-a4";
  const typo = getReceiptTypographySpec(
    layout,
    snapshot?.receiptFontStyle || printerConfig.receiptFontStyle,
    snapshot?.receiptFontSize || printerConfig.receiptFontSize
  );

  const scheduleRelayWindowClose = (delayMs = 800) => {
    setTimeout(() => {
      try {
        window.close();
      } catch {
        // Ignore if browser prevents programmatic tab close
      }
    }, delayMs);
  };

  const triggerSystemPrintAndCloseOnFinish = () => {
    const onAfterPrint = () => {
      scheduleRelayWindowClose(250);
    };
    window.addEventListener("afterprint", onAfterPrint, { once: true });
    const res = printElementDirect(
      "standalone-receipt-body",
      layout,
      typo.fontStyle,
      typo.fontSize
    );
    if (!res.ok) {
      window.removeEventListener("afterprint", onAfterPrint);
    }
    return res;
  };

  const loadLatestFromServer = async (showSpinner = false) => {
    if (showSpinner) setIsLoadingServer(true);
    try {
      const params = new URLSearchParams(window.location.search);
      const jobId = params.get("job") || "latest";
      const serverSnap = await fetchPrintSnapshotFromServer(jobId);
      if (serverSnap?.html) {
        setSnapshot(serverSnap);
        savePrintSnapshot(serverSnap);
        setPrinterConfig((prev) => {
          const next = {
            ...prev,
            layoutProfile:
              serverSnap.layoutProfile && THERMAL_LAYOUT_SPECS[serverSnap.layoutProfile]
                ? serverSnap.layoutProfile
                : prev.layoutProfile,
            connectionMode:
              serverSnap.connectionMode &&
              ["system", "webusb", "webserial", "network"].includes(serverSnap.connectionMode)
                ? (serverSnap.connectionMode as ThermalConnectionMode)
                : prev.connectionMode,
            receiptFontStyle: serverSnap.receiptFontStyle || prev.receiptFontStyle || "courier",
            receiptFontSize: serverSnap.receiptFontSize || prev.receiptFontSize || "medium"
          };
          saveThermalPrinterConfig(next);
          return next;
        });
      }
    } finally {
      setIsLoadingServer(false);
    }
  };

  useEffect(() => {
    void loadLatestFromServer(!snapshot);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePrintNow = async (forcePrompt = false) => {
    if (isPrintingRef.current) return;
    isPrintingRef.current = true;
    try {
      if (printerConfig.connectionMode === "system") {
        const res = triggerSystemPrintAndCloseOnFinish();
        setStatusMessage(res.ok ? "Sent directly to printer." : res.reason || "Print dialog could not open.");
        return;
      }

      const el = document.getElementById("standalone-receipt-body");
      if (!el) return;
      const payload = buildEscPosPayload(el, { ...printerConfig, layoutProfile: layout });

      if (printerConfig.connectionMode === "webusb") {
        const res = await printViaWebUSB(payload, forcePrompt);
        if (res.ok) {
          setHasPairedDevice(true);
          if (res.deviceLabel) {
            const next = { ...printerConfig, pairedDeviceLabel: res.deviceLabel };
            setPrinterConfig(next);
            saveThermalPrinterConfig(next);
          }
          setStatusMessage(`Printed directly to ${res.deviceLabel || "USB Thermal Printer"}.`);
          scheduleRelayWindowClose(1000);
        } else if (res.fallbackToSystemPrint) {
          setStatusMessage("USB printer uses OS spooler — opening system print window.");
          triggerSystemPrintAndCloseOnFinish();
        } else {
          setStatusMessage(res.error || "USB print cancelled.");
        }
        return;
      }

      if (printerConfig.connectionMode === "webserial") {
        const res = await printViaWebSerial(payload, printerConfig.serialBaudRate, forcePrompt);
        if (res.ok) {
          setHasPairedDevice(true);
          if (res.deviceLabel) {
            const next = { ...printerConfig, pairedDeviceLabel: res.deviceLabel };
            setPrinterConfig(next);
            saveThermalPrinterConfig(next);
          }
          setStatusMessage(`Printed directly to ${res.deviceLabel || "Serial / BT Printer"}.`);
          scheduleRelayWindowClose(1000);
        } else if (res.fallbackToSystemPrint) {
          setStatusMessage("Serial port uses OS spooler — opening system print window.");
          triggerSystemPrintAndCloseOnFinish();
        } else {
          setStatusMessage(res.error || "Serial print cancelled.");
        }
        return;
      }

      if (printerConfig.connectionMode === "network") {
        const res = await printViaNetworkSocket(payload, printerConfig.networkIp, printerConfig.networkPort);
        if (res.ok) {
          setStatusMessage(`Sent directly to LAN printer ${printerConfig.networkIp}:${printerConfig.networkPort}.`);
          scheduleRelayWindowClose(1000);
        } else {
          setStatusMessage(res.error || "Network printer unreachable.");
        }
      }
    } finally {
      isPrintingRef.current = false;
    }
  };

  useEffect(() => {
    if (!snapshot?.html || isLoadingServer || hasAutoDispatchedRef.current) return;

    const runAutoDispatch = async () => {
      if (printerConfig.connectionMode === "system") {
        const res = triggerSystemPrintAndCloseOnFinish();
        if (res.ok) {
          setStatusMessage("Printing window opened for your configured printer.");
        }
        return;
      }

      if (printerConfig.connectionMode === "webusb") {
        const paired = await hasPairedUsbPrinter();
        setHasPairedDevice(paired);
        if (paired) {
          await handlePrintNow(false);
        } else {
          setStatusMessage("Click 'Pair USB Printer & Print' once to connect your thermal printer.");
        }
        return;
      }

      if (printerConfig.connectionMode === "webserial") {
        const paired = await hasPairedSerialPrinter();
        setHasPairedDevice(paired);
        if (paired) {
          await handlePrintNow(false);
        } else {
          setStatusMessage("Click 'Pair Serial / BT & Print' once to connect your printer port.");
        }
        return;
      }

      if (printerConfig.connectionMode === "network") {
        await handlePrintNow(false);
      }
    };

    const timer = setTimeout(() => {
      if (hasAutoDispatchedRef.current) return;
      hasAutoDispatchedRef.current = true;
      void runAutoDispatch();
    }, 180);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [snapshot, isLoadingServer]);

  if (isLoadingServer && !snapshot?.html) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-6 font-sans">
        <div className="bg-white max-w-md w-full rounded-2xl border border-slate-200 shadow-lg p-6 text-center space-y-3">
          <RefreshCw className="w-8 h-8 text-emerald-600 mx-auto animate-spin" />
          <h1 className="text-base font-bold text-slate-900">Preparing Receipt Print...</h1>
          <p className="text-xs text-slate-600">
            Sending formatted receipt to your configured printer.
          </p>
        </div>
      </div>
    );
  }

  if (!snapshot?.html) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-6 font-sans">
        <div className="bg-white max-w-md w-full rounded-2xl border border-slate-200 shadow-lg p-6 text-center space-y-4">
          <Printer className="w-9 h-9 text-slate-500 mx-auto" />
          <h1 className="text-base font-bold text-slate-900">No Receipt Loaded to Print</h1>
          <p className="text-xs text-slate-600 leading-relaxed">
            Open an invoice in Expert POS Direct Print Preview and click Print to send the receipt here.
          </p>
          <button
            type="button"
            onClick={() => void loadLatestFromServer(true)}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Check for Latest Receipt
          </button>
        </div>
      </div>
    );
  }

  const modeLabel =
    printerConfig.connectionMode === "webusb"
      ? printerConfig.pairedDeviceLabel || "Direct USB Thermal"
      : printerConfig.connectionMode === "webserial"
      ? `Serial / Bluetooth (${printerConfig.serialBaudRate} baud)`
      : printerConfig.connectionMode === "network"
      ? `LAN ${printerConfig.networkIp}:${printerConfig.networkPort}`
      : "OS / USB Printer Driver";

  const primaryLabel =
    printerConfig.connectionMode === "webusb" && !hasPairedDevice
      ? "Pair USB Printer & Print"
      : printerConfig.connectionMode === "webserial" && !hasPairedDevice
      ? "Pair Serial / BT & Print"
      : "Print Now";

  return (
    <div className="min-h-screen bg-slate-100 py-6 px-4 flex flex-col items-center gap-5 font-sans">
      <div className="bg-white max-w-md w-full rounded-2xl border border-slate-200 shadow-md p-4 space-y-2.5 no-print">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <h1 className="text-sm font-black text-slate-900 truncate">
              {snapshot.invoiceId ? `Receipt ${snapshot.invoiceId}` : "Ready to Print Receipt"}
            </h1>
            <p className="text-[11px] text-slate-500 truncate">
              {spec.label} • {modeLabel}
            </p>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            {(printerConfig.connectionMode === "webusb" || printerConfig.connectionMode === "webserial") &&
              hasPairedDevice && (
                <button
                  type="button"
                  onClick={() => void handlePrintNow(true)}
                  className="px-2.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-bold cursor-pointer"
                  title="Pair a different printer"
                >
                  Change
                </button>
              )}
            <button
              type="button"
              onClick={() => void handlePrintNow(false)}
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              {printerConfig.connectionMode === "webusb" ? (
                <Usb className="w-4 h-4 text-emerald-400" />
              ) : printerConfig.connectionMode === "network" ? (
                <Wifi className="w-4 h-4 text-emerald-400" />
              ) : (
                <Printer className="w-4 h-4 text-emerald-400" />
              )}
              {primaryLabel}
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
        #standalone-receipt-body {
          width: ${isA4 ? "190mm" : `${spec.printableWidthMm}mm`};
          max-width: 100%;
          padding: ${spec.paddingCss};
          background: #ffffff;
          color: #000000;
          font-family: ${typo.cssFamily} !important;
          font-size: ${typo.printFontSizeCss};
          font-weight: 700 !important;
          line-height: 1.3;
          box-shadow: 0 10px 25px rgba(15, 23, 42, 0.12);
          border: 1px solid #cbd5e1;
        }
        #standalone-receipt-body * {
          font-family: ${typo.cssFamily} !important;
          font-weight: 700 !important;
        }
        #standalone-receipt-body h4,
        #standalone-receipt-body [data-receipt-store-name="true"] {
          font-weight: 900 !important;
        }
        ${buildReceiptUtilityStyles(layout, "#standalone-receipt-body ", typo.fontStyle, typo.fontSize)}
      `}</style>

      <div
        id="standalone-receipt-body"
        dangerouslySetInnerHTML={{ __html: snapshot.html }}
      />
    </div>
  );
};
