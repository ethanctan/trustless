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
    const filteredCEXData = jsonData.filter(protocol => protocol.category == "CEX")
                                 .map(protocol => ({name: protocol.name, logo: protocol.logo}));

    // Save filtered data back to a new JSON file
    fs.writeFile('filteredCEXData.json', JSON.stringify(filteredCEXData), (err) => {
        if (err) throw err;
        console.log('Filtered data written to file');
    });
});
