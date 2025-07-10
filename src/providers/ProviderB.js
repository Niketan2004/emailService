class ProviderB {
     async send(to, subject, body) {// Simulate sending an email
          // Simulate a 50% chance of success
          if (Math.random() > 0.5) {
               // Simulate a successful email send
               console.log(`ProviderB sent email to ${to}`);
               return true;
          } else {
               throw new Error('ProviderB failed');
          }
     }
}
module.exports = ProviderB;
   