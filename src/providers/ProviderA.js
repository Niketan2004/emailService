class ProviderA {
     async send(to, subject, body) {    // Simulate sending an email
          if (Math.random() > 0.3) {// 70% chance of success
               // Simulate a successful email send
               console.log(`ProviderA sent email to ${to}`);
               return true;// Return true to indicate success
          } else {
               throw new Error('ProviderA failed');// Simulate a failure
          }
     }
}
module.exports = ProviderA;
   