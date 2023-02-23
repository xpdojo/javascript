// const dns = require('dns');

// const options = {
//     family: 4, // 4 for IPv4 and 6 for IPv6
//     hints: dns.ADDRCONFIG | dns.V4MAPPED,
// };

// dns.lookup('mail.example.com', options, (err, address, family) =>
//         console.log('address: %j family: IPv%s', address, family));

// https://nodejs.org/api/dns.html#dns-promises-api
const { Resolver } = require("node:dns").promises;
const resolver = new Resolver();

// This request will use the server at 4.4.4.4, independent of global settings.
// resolver.resolve4('example.com').then((addresses) => {
// });

// Alternatively, the same code can be written using async-await style.
async function query(domain) {
  const any = await resolver.resolveAny(domain);
  console.log("any", any);

  const ns = await resolver.resolveNs(domain);
  console.log("ns", ns);

  const mx = await resolver.resolveMx(domain);
  console.log("mx", mx);

  const txt = await resolver.resolveTxt(domain);
  let spf = [];
  for (const record of txt) {
    for (const element of record) {
      if (element.startsWith("v=spf1")) spf.push(element);
    }
  }
  console.log("spf", spf);

  //   let dkim = [];
  let dmarc = [];
  const dmarc1 = await resolver
    .resolveTxt(`_dmarc.${domain}`)
    .then((addresses) => {
      for (const record of dmarc1) {
        for (const element of record) {
          if (element.startsWith("v=DMARC1")) dmarc.push(element);
        }
      }
    })
    .catch((err) => {
      console.log(err);
    });
  console.log("dmarc", dmarc);

  const ipv4 = await resolver.resolve4(domain);
  console.log("ipv4", ipv4);
}

query("google.com");

