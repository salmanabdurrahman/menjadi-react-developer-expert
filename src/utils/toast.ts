import { toast } from 'sonner';

import { toIndonesianMessage } from '@/utils/messages';

function getMessage(value: unknown, fallback: string) {
  if (typeof value === 'string') {
    return toIndonesianMessage(value, fallback);
  }

  if (value instanceof Error) {
    return toIndonesianMessage(value.message, fallback);
  }

  if (typeof value === 'object' && value !== null && 'message' in value) {
    const { message } = value as { message?: unknown };

    if (typeof message === 'string') {
      return toIndonesianMessage(message, fallback);
    }
  }

  return fallback;
}

export function showSuccessToast(value: unknown, fallback: string) {
  toast.success(getMessage(value, fallback));
}

export function showErrorToast(value: unknown, fallback: string) {
  toast.error(getMessage(value, fallback));
}
