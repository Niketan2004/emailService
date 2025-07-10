const ProviderA = require('./providers/ProviderA');
const ProviderB = require('./providers/ProviderB');
const delay = require('./utils/delay');
const RateLimiter = require('./utils/RateLimiter');
const CircuitBreaker = require('./utils/CircuitBreaker'); // Assuming you have a CircuitBreaker implementation


class EmailService {


     constructor() {
          this.providers = [new ProviderA(), new ProviderB()];
          this.sentIds = new Set();
          this.rateLimiter = new RateLimiter(5, 60 * 1000);
          this.circuitBreakers = new Map();

          this.providers.forEach(provider => {
               this.circuitBreakers.set(provider.constructor.name, new CircuitBreaker());
          });
     }



     async sendEmail(id, to, subject, body) {
          if (this.sentIds.has(id)) {
               console.log('⛔ Email already sent with this ID. Skipping.');
               return;
          }

          if (!this.rateLimiter.isAllowed()) {
               console.log('⛔ Rate limit exceeded. Try again later.');
               return;
          }

          for (const provider of this.providers) {
               const name = provider.constructor.name;
               const breaker = this.circuitBreakers.get(name);

               if (!breaker.canRequest()) {
                    console.log(`⛔ Skipping ${name} (circuit open)`);
                    continue;
               }

               for (let attempt = 0; attempt < 3; attempt++) {
                    try {
                         if (attempt > 0) {
                              const waitTime = 1000 * 2 ** (attempt - 1);
                              console.log(`⏳ Retry ${attempt}: Waiting ${waitTime / 1000}s...`);
                              await delay(waitTime);
                         }

                         await provider.send(to, subject, body);
                         this.sentIds.add(id);
                         breaker.success(); // reset breaker
                         console.log(`✅ Sent by ${name} on attempt ${attempt + 1}`);
                         return;
                    } catch (err) {
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
