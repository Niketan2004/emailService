// CircuitBreaker.js
class CircuitBreaker {
     constructor(failureThreshold = 3, cooldownTime = 30000) {
          this.failureThreshold = failureThreshold;
          this.cooldownTime = cooldownTime;

          this.failureCount = 0;
          this.lastFailureTime = null;
          this.state = 'CLOSED'; // Other states: OPEN, HALF_OPEN
     }

     canRequest() {
          const now = Date.now();

          if (this.state === 'OPEN') {
               if (now - this.lastFailureTime >= this.cooldownTime) {
                    this.state = 'HALF_OPEN'; // Try again
                    return true;
               }
               return false;
          }

          return true; // CLOSED or HALF_OPEN
     }

     success() {
          this.failureCount = 0;
          this.state = 'CLOSED';
     }

     failure() {
          this.failureCount++;
          if (this.failureCount >= this.failureThreshold) {
               this.state = 'OPEN';
               this.lastFailureTime = Date.now();
               console.log(`🚫 Circuit opened due to repeated failures`);
          }
     }
}

module.exports = CircuitBreaker;
