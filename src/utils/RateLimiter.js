// RateLimiter.js
class RateLimiter {
     constructor(limit, windowMs) {
          this.limit = limit;          // Max requests
          this.windowMs = windowMs;    // Time window (in ms)
          this.timestamps = [];        // Track email timestamps
     }

     isAllowed() {
          const now = Date.now();

          // Remove timestamps older than window
          this.timestamps = this.timestamps.filter(ts => now - ts < this.windowMs);

          if (this.timestamps.length < this.limit) {
               this.timestamps.push(now);
               return true;
          }

          return false; // Limit exceeded
     }
}

module.exports = RateLimiter;
   