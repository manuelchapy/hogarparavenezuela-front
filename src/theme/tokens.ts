/**
 * Single source of truth for design tokens (JS/runtime + PWA manifest).
 * Keep in sync with src/theme/theme.css @theme block.
 */
export const themeTokens = {
  colors: {
    primary: {
      50: '#eef4ff',
      100: '#dce8ff',
      200: '#b9cff5',
      500: '#2563eb',
      600: '#1d4ed8',
      700: '#1e40af',
      800: '#172554',
      900: '#0f172a',
    },
    accent: {
      100: '#fef3c7',
      400: '#fbbf24',
      500: '#f59e0b',
      600: '#d97706',
      700: '#b45309',
    },
    success: {
      500: '#059669',
    },
    warning: {
      500: '#d97706',
    },
    danger: {
      500: '#dc2626',
    },
    surface: {
      base: '#f1f5f9',
      elevated: '#ffffff',
      muted: '#e2e8f0',
    },
    text: {
      primary: '#0f172a',
      secondary: '#475569',
      muted: '#64748b',
      onPrimary: '#ffffff',
      onAccent: '#451a03',
    },
    border: {
      default: '#cbd5e1',
      subtle: '#e2e8f0',
      focus: '#2563eb',
    },
    status: {
      site: { bg: '#fef3c7', text: '#451a03', border: '#d97706' },
      transit: { bg: '#dbeafe', text: '#1e3a8a', border: '#2563eb' },
      sheltered: { bg: '#d1fae5', text: '#064e3b', border: '#059669' },
      delivered: { bg: '#ede9fe', text: '#3b0764', border: '#7c3aed' },
      fallback: { bg: '#f8fafc', text: '#0f172a', border: '#cbd5e1' },
    },
    feedback: {
      success: { bg: '#d1fae5', text: '#064e3b', border: '#059669' },
      warning: { bg: '#fef3c7', text: '#451a03', border: '#d97706' },
      error: { bg: '#fee2e2', text: '#7f1d1d', border: '#dc2626' },
      info: { bg: '#dbeafe', text: '#1e3a8a', border: '#2563eb' },
    },
    network: {
      online: { bg: '#d1fae5', text: '#064e3b', dot: '#059669' },
      offline: { bg: '#fef3c7', text: '#451a03', dot: '#d97706' },
    },
    account: {
      pending: { bg: '#fef3c7', text: '#451a03', border: '#d97706' },
      active: { bg: '#d1fae5', text: '#064e3b', border: '#059669' },
      suspended: { bg: '#fee2e2', text: '#7f1d1d', border: '#dc2626' },
      rejected: { bg: '#f1f5f9', text: '#0f172a', border: '#94a3b8' },
    },
  },
  font: {
    sans: "'Segoe UI', system-ui, -apple-system, sans-serif",
  },
  radius: {
    card: '1rem',
    shell: '1.5rem',
  },
} as const;

export const pwaManifestColors = {
  theme_color: themeTokens.colors.primary[800],
  background_color: themeTokens.colors.surface.base,
} as const;
