const fs = require('fs');
const db = require('../db/db');
const config = require('../config/config');

const uploadCsvData = async () => {
  const csvFilePath = config.csvFilePath;
  const csvData = fs.readFileSync(csvFilePath, 'utf8');
  const [headerLine, ...lines] = csvData.split('\n').filter(line => line.trim() !== '');
  const headers = headerLine.split(',').map(header => header.trim());

  const users = lines.map(line => {
    const values = line.split(',').map(value => value.trim());
    let user = {};
    headers.forEach((header, index) => {
      user[header] = values[index];
    });
    return user;
  });

  for (const user of users) {
    const name = `${user['name.firstName']} ${user['name.lastName']}`;
    const age = parseInt(user['age']);
    const address = {
      line1: user['address.line1'],
      line2: user['address.line2'],
      city: user['address.city'],
      state: user['address.state']
    };

    let additionalInfo = {};
    Object.keys(user).forEach(key => {
      if (!['name.firstName', 'name.lastName', 'age', 'address.line1', 'address.line2', 'address.city', 'address.state'].includes(key)) {
        additionalInfo[key] = user[key];
      }
    });

    await db.query(
      'INSERT INTO public.users (name, age, address, additional_info) VALUES ($1, $2, $3, $4)',
      [name, age, address, additionalInfo]
    );
  }

  const result = await db.query('SELECT age FROM public.users');
  const ages = result.rows.map(row => row.age);
  const ageGroups = {
    '< 20': 0,
    '20 to 40': 0,
    '40 to 60': 0,
    '> 60': 0,
  };
  ages.forEach(age => {
    if (age < 20) ageGroups['< 20']++;
    else if (age <= 40) ageGroups['20 to 40']++;
    else if (age <= 60) ageGroups['40 to 60']++;
    else ageGroups['> 60']++;
  });

  const total = ages.length;
  for (const group in ageGroups) {
    ageGroups[group] = ((ageGroups[group] / total) * 100).toFixed(2);
  }

  console.log('Age-Group % Distribution');
  for (const group in ageGroups) {
    console.log(`${group}: ${ageGroups[group]}%`);
  }
};

module.exports = {
  uploadCsvData
};
