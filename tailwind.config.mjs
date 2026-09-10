/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        'brand-black': '#050505',
        'brand-dark': '#0A0A0A',
        'brand-gray': '#1A1A1A',
        'brand-white': '#F5F5F7',
        'brand-accent': '#FFFFFF', // High contrast white for accents
        'brand-beige': '#E0D8CC',
      },
      fontFamily: {
        sans: ['Outfit', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      }
    },
  },
  safelist: [
    'bg-indigo-900',
    'bg-purple-900',
    'bg-blue-900',
    'bg-emerald-900'
  ],
  plugins: [],
}
