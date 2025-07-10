class ProviderA {
     async send(to, subject, body) {
          if (Math.random() > 0.3) {
               console.log(`ProviderA sent email to ${to}`);
               return true;
          } else {
               throw new Error('ProviderA failed');
          }
     }
}
module.exports = ProviderA;
   