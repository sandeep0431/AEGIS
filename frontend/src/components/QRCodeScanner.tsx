import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { QrCode, Upload, RefreshCw, AlertCircle, CheckCircle2, FileText, ArrowRight, X } from 'lucide-react';
import jsQR from 'jsqr';

interface QRCodeScannerProps {
  onAnalyzeUrl: (url: string) => void;
  analyzing?: boolean;
  onClear?: () => void;
}

type ScanStatus = 'idle' | 'scanning' | 'detected_url' | 'detected_text' | 'not_found' | 'error';

interface DecodedState {
  raw: string;
  isUrl: boolean;
  validWebUrl: boolean;
  url?: string;
}

const MAX_FILE_SIZE_BYTES = 15 * 1024 * 1024; // 15MB
const MAX_CANVAS_DIMENSION = 1600;

export const QRCodeScanner: React.FC<QRCodeScannerProps> = ({
  onAnalyzeUrl,
  analyzing = false,
  onClear,
}) => {
  const [status, setStatus] = useState<ScanStatus>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [decodedData, setDecodedData] = useState<DecodedState | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const resetScanner = () => {
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }
    setStatus('idle');
    setErrorMessage(null);
    setDecodedData(null);
    setImagePreview(null);
    setIsDragging(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    if (onClear) {
      onClear();
    }
  };

  const processImageFile = (file: File) => {
    // 1. Validation checks
    if (!file.type.startsWith('image/')) {
      setStatus('error');
      setErrorMessage('Please upload a valid image file (PNG, JPEG, WebP, etc.).');
      return;
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      setStatus('error');
      setErrorMessage('Image size is too large (maximum 15MB). Please choose a smaller image.');
      return;
    }

    // Revoke previous preview if any
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }

    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
    setStatus('scanning');
    setErrorMessage(null);
    setDecodedData(null);

    // 2. Decode locally via multi-strategy browser pipeline (Native BarcodeDetector + Multi-pass jsQR)
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = async () => {
      try {
        const origWidth = img.naturalWidth || img.width;
        const origHeight = img.naturalHeight || img.height;

        if (origWidth === 0 || origHeight === 0) {
          setStatus('error');
          setErrorMessage('Could not determine image dimensions.');
          return;
        }

        let decodedRawText: string | null = null;

        // --- STRATEGY 1: Native W3C BarcodeDetector API (Chrome, Edge, Opera, Android) ---
        // Fast C++ hardware-accelerated detection with high tolerance for angles, perspective, blur, and small QRs
        if (typeof window !== 'undefined' && 'BarcodeDetector' in window) {
          try {
            const barcodeDetector = new (window as any).BarcodeDetector({ formats: ['qr_code'] });
            const barcodes = await barcodeDetector.detect(img);
            if (barcodes && barcodes.length > 0 && barcodes[0].rawValue) {
              decodedRawText = barcodes[0].rawValue.trim();
            }
          } catch (nativeErr) {
            // Silently fall through to jsQR multi-pass pipeline
          }
        }

        // --- STRATEGY 2: Multi-Pass jsQR Pipeline (Pure client-side fallback) ---
        if (!decodedRawText) {
          const tryDecodeCanvas = (w: number, h: number, enhanceContrast: boolean = false): string | null => {
            const canvas = document.createElement('canvas');
            canvas.width = w;
            canvas.height = h;

            const ctx = canvas.getContext('2d', { willReadFrequently: true });
            if (!ctx) return null;

            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';
            ctx.drawImage(img, 0, 0, w, h);

            const imageData = ctx.getImageData(0, 0, w, h);

            if (enhanceContrast) {
              const data = imageData.data;
              let minLum = 255;
              let maxLum = 0;
              const lums = new Uint8Array(w * h);

              for (let i = 0, j = 0; i < data.length; i += 4, j++) {
                const lum = Math.round((data[i] * 299 + data[i + 1] * 587 + data[i + 2] * 114) / 1000);
                lums[j] = lum;
                if (lum < minLum) minLum = lum;
                if (lum > maxLum) maxLum = lum;
              }

              const range = maxLum - minLum;
              if (range > 20) {
                for (let i = 0, j = 0; i < data.length; i += 4, j++) {
                  const stretched = Math.round(((lums[j] - minLum) / range) * 255);
                  data[i] = stretched;
                  data[i + 1] = stretched;
                  data[i + 2] = stretched;
                }
              }
            }

            const code = jsQR(imageData.data, w, h, {
              inversionAttempts: 'attemptBoth',
            });

            if (code && code.data && code.data.trim().length > 0) {
              return code.data.trim();
            }
            return null;
          };

          const maxDim = Math.max(origWidth, origHeight);

          // Pass 2A: Original resolution (capped at 2500px to avoid memory overflow)
          let w = origWidth;
          let h = origHeight;
          if (maxDim > 2500) {
            const scale = 2500 / maxDim;
            w = Math.round(origWidth * scale);
            h = Math.round(origHeight * scale);
          }

          decodedRawText = tryDecodeCanvas(w, h, false);

          // Pass 2B: Contrast-enhanced pass for faded/low-contrast photos
          if (!decodedRawText) {
            decodedRawText = tryDecodeCanvas(w, h, true);
          }

          // Pass 2C: Scaled pass at 1000px max (removes high-frequency camera sensor noise from phone photos)
          if (!decodedRawText && maxDim > 1200) {
            const scale1000 = 1000 / maxDim;
            const w1000 = Math.round(origWidth * scale1000);
            const h1000 = Math.round(origHeight * scale1000);
            decodedRawText = tryDecodeCanvas(w1000, h1000, false);

            if (!decodedRawText) {
              decodedRawText = tryDecodeCanvas(w1000, h1000, true);
            }
          }

          // Pass 2D: Scaled pass at 600px max for very large camera captures (> 1800px)
          if (!decodedRawText && maxDim > 1800) {
            const scale600 = 600 / maxDim;
            const w600 = Math.round(origWidth * scale600);
            const h600 = Math.round(origHeight * scale600);
            decodedRawText = tryDecodeCanvas(w600, h600, false);
          }
        }

        // --- EVALUATE DECODED CONTENT ---
        if (decodedRawText && decodedRawText.length > 0) {
          const rawText = decodedRawText;

          // Validate URL using standard URL constructor
          let parsedUrl: URL | null = null;
          let isHttpWebUrl = false;

          try {
            parsedUrl = new URL(rawText);
            // Strictly enforce http or https protocols only
            if (parsedUrl.protocol === 'http:' || parsedUrl.protocol === 'https:') {
              isHttpWebUrl = true;
            }
          } catch {
            isHttpWebUrl = false;
          }

          if (isHttpWebUrl && parsedUrl) {
            setDecodedData({
              raw: rawText,
              isUrl: true,
              validWebUrl: true,
              url: parsedUrl.href,
            });
            setStatus('detected_url');
          } else {
            setDecodedData({
              raw: rawText,
              isUrl: false,
              validWebUrl: false,
            });
            setStatus('detected_text');
          }
        } else {
          setStatus('not_found');
        }
      } catch (err: any) {
        console.error('QR decode error:', err);
        setStatus('error');
        setErrorMessage('An unexpected error occurred while scanning the QR image.');
      }
    };

    img.onerror = () => {
      setStatus('error');
      setErrorMessage('Failed to read image file. It may be corrupted or in an unsupported format.');
    };

    img.src = previewUrl;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processImageFile(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      processImageFile(files[0]);
    }
  };

  return (
    <div className="space-y-4">
      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
        id="qr-file-input"
        disabled={analyzing}
      />

      {/* Upload Box / Drag & Drop Area */}
      {status === 'idle' && (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-8 sm:p-10 cursor-pointer text-center transition-all ${
            isDragging
              ? 'border-[#FF5A00] bg-[#FF5A00]/10'
              : 'border-white/15 bg-[#050505] hover:border-white/30 hover:bg-[#0a0a0a]'
          }`}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              fileInputRef.current?.click();
            }
          }}
          aria-label="Upload QR code image"
        >
          <div className="flex flex-col items-center justify-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[#FF5A00]">
              <QrCode className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-display font-semibold text-white uppercase tracking-wider">
                Upload QR Code Image
              </p>
              <p className="text-xs text-zinc-400 font-sans mt-1">
                Check where a QR code leads before opening it
              </p>
            </div>
            <div className="pt-2 flex items-center gap-2">
              <span className="btn-pill-orange text-xs py-2 px-5 font-display uppercase tracking-wider inline-flex items-center gap-1.5">
                <Upload className="w-3.5 h-3.5" />
                <span>Choose Image</span>
              </span>
            </div>
            <p className="text-[11px] text-zinc-500 font-sans">
              Supports screenshots and photos containing QR codes (PNG, JPG, WebP)
            </p>
          </div>
        </div>
      )}

      {/* Image Preview & Active Status Panel */}
      {status !== 'idle' && (
        <div className="bg-[#050505] border border-white/15 rounded-xl p-4 sm:p-6 text-left">
          <div className="flex items-start justify-between gap-4 mb-4 border-b border-white/10 pb-4">
            <div className="flex items-center gap-3">
              {imagePreview && (
                <div className="relative w-14 h-14 rounded-lg overflow-hidden border border-white/20 bg-black shrink-0">
                  <img
                    src={imagePreview}
                    alt="Uploaded QR preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div>
                <span className="text-[10px] font-display font-semibold text-zinc-500 uppercase tracking-widest block">
                  QR IMAGE SCANNER
                </span>
                <span className="text-xs font-display font-semibold text-zinc-200">
                  {status === 'scanning' && 'Scanning QR code...'}
                  {status === 'detected_url' && 'QR destination detected'}
                  {status === 'detected_text' && 'QR code detected'}
                  {status === 'not_found' && 'No QR code detected'}
                  {status === 'error' && 'Scan Error'}
                </span>
              </div>
            </div>

            <button
              onClick={resetScanner}
              disabled={analyzing}
              className="text-xs font-display uppercase tracking-wider text-zinc-400 hover:text-white flex items-center gap-1 px-2.5 py-1 rounded-lg border border-white/10 hover:bg-white/5 transition-all disabled:opacity-50"
              aria-label="Upload another image"
            >
              <X className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>

          {/* Scanning In-Progress */}
          {status === 'scanning' && (
            <div className="py-6 flex flex-col items-center justify-center space-y-3 text-center">
              <RefreshCw className="w-6 h-6 text-[#FF5A00] animate-spin" />
              <p className="text-xs font-display uppercase tracking-wider text-zinc-300">
                Scanning QR code locally in browser...
              </p>
              <p className="text-[11px] text-zinc-500 font-sans">
                Your image is processed privately on your device and never uploaded.
              </p>
            </div>
          )}

          {/* Detected Web URL */}
          {status === 'detected_url' && decodedData?.url && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-display uppercase tracking-wider">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Valid Web Destination Found</span>
              </div>

              <div>
                <label className="block text-[11px] font-display font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">
                  Destination URL
                </label>
                <div className="bg-[#101010] border border-white/10 rounded-lg p-3.5 text-xs sm:text-sm font-mono text-zinc-200 break-all select-all">
                  {decodedData.url}
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={() => onAnalyzeUrl(decodedData.url!)}
                  disabled={analyzing}
                  className="flex-1 btn-pill-orange text-sm uppercase tracking-wider flex items-center justify-center gap-2 font-display font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {analyzing ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Analyzing with AEGIS...</span>
                    </>
                  ) : (
                    <>
                      <span>Analyze with AEGIS</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={resetScanner}
                  disabled={analyzing}
                  className="px-5 py-2.5 rounded-full border border-white/15 text-xs font-display font-semibold uppercase tracking-wider text-zinc-400 hover:text-white hover:bg-white/5 transition-all text-center"
                >
                  Try Another Image
                </button>
              </div>

              <p className="text-[11px] text-zinc-500 font-sans">
                AEGIS analyzes URL structure, domain reputation, and phishing indicators without opening or redirecting to the destination.
              </p>
            </motion.div>
          )}

          {/* Detected Plain Text (Non-HTTP URL) */}
          {status === 'detected_text' && decodedData?.raw && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <div className="flex items-center gap-2 text-amber-400 text-xs font-display uppercase tracking-wider">
                <FileText className="w-4 h-4 shrink-0" />
                <span>Text Content (Non-Web URL)</span>
              </div>

              <p className="text-xs text-zinc-300 font-sans">
                This QR code contains text rather than a web URL. AEGIS URL analysis is only applicable to web links.
              </p>

              <div>
                <label className="block text-[11px] font-display font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">
                  Decoded Content
                </label>
                <div className="bg-[#101010] border border-white/10 rounded-lg p-3.5 text-xs font-mono text-zinc-300 max-h-40 overflow-y-auto break-all whitespace-pre-wrap select-all">
                  {decodedData.raw}
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={resetScanner}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-full border border-white/15 text-xs font-display font-semibold uppercase tracking-wider text-zinc-300 hover:text-white hover:bg-white/5 transition-all"
                >
                  Scan Another QR Code
                </button>
              </div>
            </motion.div>
          )}

          {/* Not Found State */}
          {status === 'not_found' && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="py-4 space-y-4"
            >
              <div className="flex items-start gap-3 bg-amber-500/10 border border-amber-500/20 rounded-lg p-3.5 text-amber-300 text-xs font-sans">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold font-display uppercase tracking-wider mb-0.5">
                    Couldn't detect a QR code in this image
                  </p>
                  <p className="text-amber-300/80">
                    Make sure the QR code is clearly visible, well-lit, and in focus. Cropping or zooming in on the QR code can help.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="btn-pill-orange text-xs py-2.5 px-6 uppercase tracking-wider font-display font-semibold inline-flex items-center gap-1.5"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Try Another Image</span>
                </button>
                <button
                  type="button"
                  onClick={resetScanner}
                  className="px-5 py-2.5 rounded-full border border-white/15 text-xs font-display font-semibold uppercase tracking-wider text-zinc-400 hover:text-white hover:bg-white/5 transition-all"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          )}

          {/* Error State */}
          {status === 'error' && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="py-4 space-y-4"
            >
              <div className="flex items-start gap-3 bg-red-500/10 border border-red-500/25 rounded-lg p-3.5 text-red-300 text-xs font-sans">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold font-display uppercase tracking-wider mb-0.5">
                    Unable to Process Image
                  </p>
                  <p className="text-red-300/80">{errorMessage || 'An error occurred.'}</p>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="btn-pill-orange text-xs py-2.5 px-6 uppercase tracking-wider font-display font-semibold inline-flex items-center gap-1.5"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Choose Another Image</span>
                </button>
                <button
                  type="button"
                  onClick={resetScanner}
                  className="px-5 py-2.5 rounded-full border border-white/15 text-xs font-display font-semibold uppercase tracking-wider text-zinc-400 hover:text-white hover:bg-white/5 transition-all"
                >
                  Reset
                </button>
              </div>
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
};
