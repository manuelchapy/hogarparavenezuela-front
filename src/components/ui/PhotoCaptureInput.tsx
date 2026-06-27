import { useRef, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { compressImage } from '@/services/imageCompression';
import { IMAGE_CONSTRAINTS } from '@/constants/routes';

interface PhotoCaptureInputProps {
  value: File | null | undefined;
  onChange: (file: File | null) => void;
  error?: string;
  disabled?: boolean;
}

export const PhotoCaptureInput = ({
  value,
  onChange,
  error,
  disabled = false,
}: PhotoCaptureInputProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isCompressing, setIsCompressing] = useState(false);
  const [sizeInfo, setSizeInfo] = useState<string | null>(null);

  const handleFile = async (file: File | undefined) => {
    if (!file) return;

    setIsCompressing(true);
    try {
      const result = await compressImage(file);
      onChange(result.file);
      setPreview(URL.createObjectURL(result.file));
      const sizeKb = Math.round(result.compressedSize / 1024);
      setSizeInfo(
        sizeKb <= IMAGE_CONSTRAINTS.MAX_SIZE_KB
          ? `${sizeKb} KB — listo para enviar`
          : `${sizeKb} KB — comprimido`,
      );
    } finally {
      setIsCompressing(false);
    }
  };

  const clearPhoto = () => {
    onChange(null);
    setPreview(null);
    setSizeInfo(null);
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div className="flex w-full flex-col gap-3">
      <span className="text-base font-medium text-text-primary">
        Fotografía del NNA *
      </span>

      {preview ? (
        <div className="overflow-hidden rounded-2xl border-2 border-slate-200">
          <img
            src={preview}
            alt="Vista previa del NNA"
            className="aspect-[4/3] w-full object-cover"
          />
          {sizeInfo && (
            <p className="bg-slate-50 px-4 py-2 text-sm text-text-secondary">
              {sizeInfo}
            </p>
          )}
        </div>
      ) : (
        <div className="flex aspect-[4/3] w-full items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50">
          <p className="px-4 text-center text-base text-text-secondary">
            Captura o selecciona una foto del rostro del NNA
          </p>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        disabled={disabled || isCompressing}
        onChange={(e) => void handleFile(e.target.files?.[0])}
      />

      <div className="flex gap-2">
        <Button
          type="button"
          variant="secondary"
          className="flex-1"
          disabled={disabled || isCompressing}
          onClick={() => inputRef.current?.click()}
        >
          {isCompressing ? 'Comprimiendo...' : value ? 'Cambiar foto' : 'Tomar / elegir foto'}
        </Button>
        {value && (
          <Button
            type="button"
            variant="ghost"
            disabled={disabled}
            onClick={clearPhoto}
          >
            Quitar
          </Button>
        )}
      </div>

      {error && (
        <p className="text-sm font-medium text-danger-500" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};
