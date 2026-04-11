/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        bg: { primary: '#0a0b0f', secondary: '#111318', tertiary: '#1a1d26' },
        surface: { DEFAULT: '#1e2130', hover: '#252840', border: '#2d3148' },
        accent: { cyan: '#00d4ff', blue: '#4f8ef7', purple: '#9b5de5', green: '#00f5a0' },
        text: { primary: '#f0f2ff', secondary: '#8b92b3', muted: '#4a5080' }
      },
      fontFamily: {
        sans: ['DM Sans', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
        display: ['Syne', 'sans-serif']
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'glow': 'glow 2s ease-in-out infinite alternate'
      },
      keyframes: {
        float: { '0%, 100%': { transform: 'translateY(0px)' }, '50%': { transform: 'translateY(-10px)' } },
        shimmer: { '0%': { backgroundPosition: '-200% 0' }, '100%': { backgroundPosition: '200% 0' } },
        glow: { from: { boxShadow: '0 0 20px #00d4ff33' }, to: { boxShadow: '0 0 40px #00d4ff66' } }
      }
    }
  },
  plugins: []
}
