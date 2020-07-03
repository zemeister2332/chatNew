const colors = ['blue', 'green', 'red', 'yellow'];

const randomColors = () => {
  return colors[Math.floor(Math.random() * colors.length)];
};

module.exports = randomColors;