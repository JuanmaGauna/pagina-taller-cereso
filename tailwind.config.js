/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./assets/js/**/*.js"],
  theme: {
    extend: {
      colors: {
        crema: '#FAF6EE',
        coral: '#FF6F59',
        lila: '#9E7FFE',
        celeste: '#E1F5FE',
        amarillo: '#FFE494',
        menta: '#A2E8DD',
        pizarra: '#2C3E50',
      }
    }
  },
  plugins: [],
}