const ghpages = require("gh-pages")

// replace with your repo url
ghpages.publish(
  "dist",
  {
    branch: "gh-pages",
    repo: "https://github.com/eLeontev/radar_touch_game.io.git",
  },
  () => {
    console.log("Deploy Complete!")
  }
)