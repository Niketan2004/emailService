// delay.js
function delay(ms) {// Delay function that returns a promise
  return new Promise(resolve => setTimeout(resolve, ms));// Resolve after the specified milliseconds
}
module.exports = delay;
