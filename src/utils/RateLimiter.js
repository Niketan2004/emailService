// RateLimiter.js
class RateLimiter {
     // RateLimiter class to limit the number of requests
     // within a specified time window
     constructor(limit, windowMs) {
          this.limit = limit;          // Max requests
          this.windowMs = windowMs;    // Time window (in ms)
          this.timestamps = [];        // Track email timestamps
     }
//     // Check if the request is allowed
     // Returns true if allowed, false if limit exceeded
     isAllowed() {
          const now = Date.now();  // Current timestamp

          // Remove timestamps older than window
          this.timestamps = this.timestamps.filter(ts => now - ts < this.windowMs);
          // Check if we can add a new timestamp
          // If the number of timestamps is less than the limit, allow the request   
          if (this.timestamps.length < this.limit) {   
               this.timestamps.push(now);    // Add current timestamp
               return true;   // Allow the request
          }

          return false; // Limit exceeded
     }
}

module.exports = RateLimiter;
   