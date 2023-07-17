// @ts-nocheck
const fs = require('fs');

// Read the original data file
fs.readFile('protocolData.json', 'utf8', (err, data) => {
    if (err) {
        console.error(err);
        return;
    }

    // Parse JSON string to JS object
    const jsonData = JSON.parse(data);

    // Filter and map data
    const filteredData = jsonData.filter(protocol => protocol.category !== "CEX")
                                 .map(protocol => ({name: protocol.name, logo: protocol.logo}));

    // Save filtered data back to a new JSON file
    fs.writeFile('filteredData.json', JSON.stringify(filteredData), (err) => {
        if (err) throw err;
        console.log('Filtered data written to file');
    });
});
