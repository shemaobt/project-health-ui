import axios, { AxiosError, type AxiosInstance } from 'axios';

export const api: AxiosInstance = axios.create({
  headers: { 'Content-Type': 'application/json' },
});

let getAccessToken: () => string | null = () => null;
let onUnauthorized: () => void = () => undefined;

export function configureApiAuth(opts: {
  getAccessToken: () => string | null;
  onUnauthorized?: () => void;
}): void {
  getAccessToken = opts.getAccessToken;
  if (opts.onUnauthorized) onUnauthorized = opts.onUnauthorized;
}

api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      onUnauthorized();
    }
    return Promise.reject(error);
  },
);

export function apiBaseUrl(): string {
  return '';
}
