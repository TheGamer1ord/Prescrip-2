// Quick utility to URL-encode your MongoDB Atlas password
// Usage: node scripts/encodePassword.js "your@password#123"

const password = process.argv[2];

if (!password) {
  console.log('\n📝 Usage: node scripts/encodePassword.js "your@password#123"\n');
  console.log('This will show you the URL-encoded version for your connection string.\n');
  process.exit(1);
}

const encoded = encodeURIComponent(password);
console.log('\n🔐 Password Encoding Utility\n');
console.log('Original password:', password);
console.log('Encoded password: ', encoded);
console.log('\n✅ Use this in your connection string:');
console.log(`   mongodb+srv://USERNAME:${encoded}@cluster0.jezjje6.mongodb.net/prescrip?retryWrites=true&w=majority\n`);

