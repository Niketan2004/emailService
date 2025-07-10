class ProviderB {
     async send(to, subject, body) {
          if (Math.random() > 0.5) {
               console.log(`ProviderB sent email to ${to}`);
               return true;
          } else {
               throw new Error('ProviderB failed');
          }
     }
}
module.exports = ProviderB;
   