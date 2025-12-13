/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: '#EC4899', // Pink-500
                    hover: '#DB2777',   // Pink-600
                    light: '#FCE7F3',   // Pink-100
                },
                secondary: {
                    DEFAULT: '#F59E0B', // Amber-500
                    hover: '#D97706',   // Amber-600
                    light: '#FEF3C7',   // Amber-100
                },
                accent: '#8B5CF6',      // Violet-500
                background: '#FFFBEB',  // Amber-50 (Creamy background)
                surface: '#FFFFFF',
                text: {
                    main: '#1F2937',    // Gray-800
                    muted: '#6B7280',   // Gray-500
                }
            },
            fontFamily: {
                sans: ['Nunito', 'sans-serif'],
                display: ['Fredoka', 'cursive'],
            },
        },
    },
    plugins: [],
}
