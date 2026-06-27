import { IMAGE_CONSTRAINTS } from '@/constants/routes';

export interface CompressionResult {
  file: File;
  originalSize: number;
  compressedSize: number;
}

const loadImage = (file: File): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('No se pudo cargar la imagen'));
    };
    img.src = url;
  });

const canvasToBlob = (
  canvas: HTMLCanvasElement,
  type: string,
  quality: number,
): Promise<Blob> =>
  new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error('Error al comprimir la imagen'));
      },
      type,
      quality,
    );
  });

export const compressImage = async (
  file: File,
  maxSizeBytes = IMAGE_CONSTRAINTS.MAX_SIZE_BYTES,
): Promise<CompressionResult> => {
  if (file.size <= maxSizeBytes) {
    return { file, originalSize: file.size, compressedSize: file.size };
  }

  const img = await loadImage(file);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('Canvas no disponible en este navegador');
  }

  let { width, height } = img;
  const maxDim = IMAGE_CONSTRAINTS.MAX_DIMENSION;

  if (width > maxDim || height > maxDim) {
    const ratio = Math.min(maxDim / width, maxDim / height);
    width = Math.round(width * ratio);
    height = Math.round(height * ratio);
  }

  canvas.width = width;
  canvas.height = height;
  ctx.drawImage(img, 0, 0, width, height);

  let quality = IMAGE_CONSTRAINTS.DEFAULT_QUALITY;
  let blob = await canvasToBlob(canvas, 'image/jpeg', quality);

  while (blob.size > maxSizeBytes && quality > 0.3) {
    quality -= 0.1;
    blob = await canvasToBlob(canvas, 'image/jpeg', quality);
  }

  const compressedFile = new File(
    [blob],
    file.name.replace(/\.\w+$/, '.jpg'),
    { type: 'image/jpeg' },
  );

  return {
    file: compressedFile,
    originalSize: file.size,
    compressedSize: compressedFile.size,
  };
};

export const generateOfflineId = (cedulaRescatista: string): string => {
  const cleanCedula = cedulaRescatista.replace(/[^a-zA-Z0-9]/g, '');
  return `${cleanCedula}-${Math.floor(Date.now() / 1000)}`;
};
