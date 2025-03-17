/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./src/**/*.{js,jsx,ts,tsx}'],
    theme: {
        extend: {
            backgroundImage: {
                test: "url('../public/logo512.png')",
            },
        },
    },
    plugins: [],
};
