import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1a3d2b',
        accent: '#c8f53c',
        cream: '#f5f0e8',
        charcoal: '#1c1c1c',
        severity: {
          critical: '#dc2626',
          high: '#ea580c',
          medium: '#ca8a04',
          low: '#16a34a'
        }
      },
      boxShadow: {
        panel: '4px 4px 0px #1c1c1c'
      },
      fontFamily: {
        heading: ['var(--font-syne)'],
        mono: ['var(--font-ibm-plex-mono)']
      },
      keyframes: {
        pulseRadar: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' }
        },
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' }
        }
      },
      animation: {
        pulseRadar: 'pulseRadar 10s ease-in-out infinite',
        scanline: 'scanline 8s linear infinite'
      }
    }
  },
  plugins: []
};

export default config;
