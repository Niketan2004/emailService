const ProviderA = require('./providers/ProviderA');
const ProviderB = require('./providers/ProviderB');
const delay = require('./utils/delay');
const RateLimiter = require('./utils/RateLimiter');
const CircuitBreaker = require('./utils/CircuitBreaker'); // Assuming you have a CircuitBreaker implementation

// This service manages email sending with multiple providers, rate limiting, and circuit breaking
class EmailService {

     // Initialize with multiple providers, rate limiter, and circuit breakers
     // Each provider can be a different email service (e.g., SMTP, SendGrid, Mailgun)
     // RateLimiter controls the number of emails sent in a time window
     constructor() {
          this.providers = [new ProviderA(), new ProviderB()];   // Add more providers as needed
          this.sentIds = new Set();     // Track sent email IDs to prevent duplicates
          this.rateLimiter = new RateLimiter(5, 60 * 1000); // 5 emails per minute
          this.circuitBreakers = new Map();  // Map to hold circuit breakers for each provider
          // Initialize circuit breakers for each provider
          // This allows each provider to have its own circuit breaker logic
          this.providers.forEach(provider => {
               this.circuitBreakers.set(provider.constructor.name, new CircuitBreaker());      // Use provider name as key
          });
     }


     // Send email with idempotency, rate limiting, retries, and circuit breaking
     // idempotency: If an email with the same ID has been sent, skip sending
     async sendEmail(id, to, subject, body) {
          if (this.sentIds.has(id)) {   // Check if email with this ID has already been sent
               console.log('⛔ Email already sent with this ID. Skipping.');
               return;
          }
          // Rate limiting: Check if we can send another email
          // If the rate limit is exceeded, skip sending and log a message
          if (!this.rateLimiter.isAllowed()) {
               console.log('⛔ Rate limit exceeded. Try again later.');
               return;
          }
          // Iterate through each provider and attempt to send the email
          for (const provider of this.providers) {
               const name = provider.constructor.name; // Get provider name for logging
               const breaker = this.circuitBreakers.get(name);   // Get the circuit breaker for this provider
               // Check if the circuit breaker allows requests
               // If the circuit is open, skip sending and log a message
               if (!breaker.canRequest()) {
                    console.log(`⛔ Skipping ${name} (circuit open)`);
                    continue;
               }
               // Attempt to send the email with retries
               for (let attempt = 0; attempt < 3; attempt++) {
                    try {
                         if (attempt > 0) {  // If this is a retry, wait before trying again
                              const waitTime = 1000 * 2 ** (attempt - 1);  // Exponential backoff: 1s, 2s, 4s
                              console.log(`⏳ Retry ${attempt}: Waiting ${waitTime / 1000}s...`);
                              await delay(waitTime);   // Wait before retrying
                         }
                         // Send the email using the provider
                         await provider.send(to, subject, body);// Call the provider's send method
                         // If successful, mark the email as sent and reset the circuit breaker
                         this.sentIds.add(id);// Add the ID to the sent set to prevent duplicates
                         breaker.success(); // reset breaker
                         console.log(`✅ Sent by ${name} on attempt ${attempt + 1}`);
                         return;
                    } catch (err) {     // If sending fails, log the error and track the failure
                         console.log(`⚠️ ${name} attempt ${attempt + 1} failed`);
                         breaker.failure(); // track failure
                    }
               }

               console.log(`❌ ${name} failed after 3 attempts`);
          }

          console.log('❌ All providers failed. Email not sent.');
     }

}

module.exports = EmailService;
