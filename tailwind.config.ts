import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          50: '#e8f0f8',
          100: '#c5d8ef',
          500: '#2a5f9e',
          600: '#1e4d8a',
          700: '#163d6e',
          800: '#0f2d52',
          900: '#0a1f3a',
          950: '#061429',
        },
      },
    },
  },
  plugins: [],
}

export default config
