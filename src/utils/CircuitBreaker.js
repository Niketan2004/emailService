// CircuitBreaker.js
class CircuitBreaker {
     constructor(failureThreshold = 3, cooldownTime = 30000) {
          this.failureThreshold = failureThreshold; // Number of failures before opening the circuit
          // Cooldown time in milliseconds before trying again
          this.cooldownTime = cooldownTime;

          this.failureCount = 0;// Count of consecutive failures
          this.lastFailureTime = null;// Timestamp of the last failure
          this.state = 'CLOSED'; // Other states: OPEN, HALF_OPEN
     }

     canRequest() {
          const now = Date.now();// Current timestamp
// Check the state of the circuit breaker
          if (this.state === 'OPEN') {
               if (now - this.lastFailureTime >= this.cooldownTime) { // Cooldown period has passed
                    this.state = 'HALF_OPEN'; // Try again
                    return true;// Allow request to proceed
               }
               return false;
          }

          return true; // CLOSED or HALF_OPEN
     }
// Reset the circuit breaker state after a successful request
     success() {
          this.failureCount = 0;
          this.state = 'CLOSED';
     }
// Record a failure and potentially open the circuit
     failure() {
          this.failureCount++;

          if (this.state === 'HALF_OPEN' || this.failureCount >= this.failureThreshold) {
               this.state = 'OPEN';
               this.lastFailureTime = Date.now();
               this.failureCount = 0;
               console.log(`🚫 Circuit opened due to repeated failures`);
          }
     }

}

module.exports = CircuitBreaker;
