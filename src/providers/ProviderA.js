class ProviderA {
     async send(to, subject, body) {    // Simulate sending an email
          // 70% chance of success
          if (Math.random() > 0.3) {
               // Simulate a successful email send
               console.log(`ProviderA sent email to ${to}`);
               return true;// Return true to indicate success
          } else {
               throw new Error('ProviderA failed');// Simulate a failure
          }
     }
}
module.exports = ProviderA;
   