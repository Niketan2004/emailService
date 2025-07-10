const EmailService = require('./EmailService');
const emailService = new EmailService();
// This demo shows how to use the EmailService with idempotency, rate limiting, retries, and circuit breaking
(async () => {
     // Log the start of the demo
     console.log("🔹 DEMO: Successful Email Send");
     await emailService.sendEmail("demo-1", "niketan@example.com", "Hello!", "Welcome to the service!");

     console.log("\n🔹 DEMO: Idempotency Check (Should NOT resend)");
     await emailService.sendEmail("demo-1", "niketan@example.com", "Hello Again!", "This should be skipped");

     console.log("\n🔹 DEMO: Fallback + Retry + Circuit Breaker Simulation");
     // Try enough to fail one provider and trigger circuit breaker
     for (let i = 0; i < 6; i++) {
          const id = `fail-${i}`;// Use a unique ID for each attempt
          await emailService.sendEmail(id, "niketan@example.com", "Fail Test", `Attempt ${i + 1}`);// This will trigger retries and eventually the circuit breaker   
     }
     // This will trigger the circuit breaker to skip the next email
     console.log("\n🔹 DEMO: Circuit Breaker Skip (Provider will be blocked temporarily)");
     await emailService.sendEmail("cb-test", "niketan@example.com", "Breaker", "Circuit Breaker should skip one");
     // This will reset the circuit breaker after a delay
     console.log("\n🔹 DEMO: Rate Limiting (Send 6 quickly, only 5 should go through)");
     // Simulate rate limiting by sending 6 emails quickly
     // Only 5 should be sent due to the rate limit of 5 per minute
     for (let i = 0; i < 6; i++) {
          const id = `rate-${i}`;
          await emailService.sendEmail(id, "niketan@example.com", "Rate Limit", `Email ${i + 1}`);
     }
     console.log("\n✅ DEMO Complete.");
})();
