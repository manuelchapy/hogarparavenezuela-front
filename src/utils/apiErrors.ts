import axios from 'axios';

export const isNetworkOrServerError = (error: unknown): boolean => {
  if (!axios.isAxiosError(error)) {
    return error instanceof TypeError;
  }

  if (!error.response) {
    return true;
  }

  return error.response.status >= 502;
};

export const getNetworkErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error) && !error.response) {
    return 'No hay conexión con el servidor. Verifica que el backend esté en ejecución (puerto 4000).';
  }

  if (
    axios.isAxiosError(error) &&
    typeof error.response?.data?.message === 'string'
  ) {
    return error.response.data.message;
  }

  return 'Error de conexión con el servidor';
};
