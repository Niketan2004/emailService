const EmailService = require('./EmailService');
const emailService = new EmailService();

(async () => {
     // Try the same provider enough times to trigger breaker
     for (let i = 0; i < 10; i++) {
          const id = `cb-${i}`;
          console.log(`\n📩 Email #${i + 1}`);
          await emailService.sendEmail(id, "niketan@example.com", "Breaker Test", `Email #${i}`);
     }
})();
