const dns = require('dns');

console.log("1. Checking Internet Connectivity (lookup google.com)...");
dns.lookup('google.com', (err, address, family) => {
    if (err) {
        console.error("❌ Google Lookup Failed:", err.code);
        console.error("   -> You might not be connected to the internet.");
    } else {
        console.log("✅ Google Lookup Success:", address);
    }

    console.log("\n2. Checking MongoDB Atlas Resolution (lookup cluster0.r43scbx.mongodb.net)...");
    // Standard lookup (A record)
    dns.lookup('cluster0.r43scbx.mongodb.net', (err, address, family) => {
        if (err) {
            console.error("❌ MongoDB Atlas Host Lookup Failed:", err.code);
            console.error("   -> This computer cannot find the MongoDB server.");
            console.error("   -> Possible causes: Firewall, ISP Block, or invalid address.");
        } else {
            console.log("✅ MongoDB Atlas Host Lookup Success:", address);
        }
    });

    console.log("\n3. Checking MongoDB SRV Record (_mongodb._tcp.cluster0.r43scbx.mongodb.net)...");
    dns.resolveSrv('_mongodb._tcp.cluster0.r43scbx.mongodb.net', (err, addresses) => {
        if (err) {
            console.error("❌ MongoDB SRV Lookup Failed:", err.code);
            console.error("   -> The special 'SRV' record needed for 'mongodb+srv://' cannot be found.");
        } else {
            console.log("✅ MongoDB SRV Lookup Success:", addresses);
        }
    });
});
