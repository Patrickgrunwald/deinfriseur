import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
 
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}

export async function getBase64FromWebcam(imageBlob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result;
      if (typeof result === 'string') {
        const base64Data = result.split(',')[1];
        if (base64Data) {
          resolve(base64Data);
        } else {
          reject(new Error('Invalid image format'));
        }
      } else {
        reject(new Error('Failed to convert image to base64'));
      }
    };
    reader.onerror = reject;
    reader.readAsDataURL(imageBlob);
  });
}