/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                brand: {
                    blue: '#2B6CB0',
                    'blue-dark': '#1e4a7a',
                    'blue-light': '#3182ce',
                }
            },
            fontFamily: {
                sans: ['Inter', 'Poppins', 'system-ui', 'sans-serif'],
            },
        },
    },
    plugins: [],
}
