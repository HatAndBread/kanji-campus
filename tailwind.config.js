module.exports = {
  content: [
    './app/views/**/*.html.erb',
    './app/helpers/**/*.rb',
    './app/assets/stylesheets/**/*.css',
    './app/javascript/**/*.js'
  ],
  theme: {
    fontFamily: {
      'kanji': ['kanji', 'mono']
    }
  },
  plugins: [require("daisyui")] }
