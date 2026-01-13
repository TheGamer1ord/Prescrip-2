const fs = require('fs');

// Read the assets file
const content = fs.readFileSync('./src/assets/assets.js', 'utf8');

// Extract all specialities using regex
const specialityMatches = content.match(/speciality: '([^']+)'/g);

if (specialityMatches) {
  // Extract just the speciality names
  const specialities = specialityMatches.map(match => {
    return match.replace("speciality: '", "").replace("'", "");
  });

  // Get unique specialities
  const uniqueSpecialities = [...new Set(specialities)];
  
  console.log('Available specialities:', uniqueSpecialities);
  console.log('Total unique specialities:', uniqueSpecialities.length);
} else {
  console.log('No specialities found');
}