import { apiClient } from '@/api/client';

export const checkApiHealth = async (): Promise<boolean> => {
  try {
    await apiClient.get('/health', { timeout: 5000 });
    return true;
  } catch {
    return false;
  }
};
