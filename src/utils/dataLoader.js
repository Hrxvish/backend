const fs = require('fs');
const csv = require('csv-parser');

function loadSalesData(filePath) {
  return new Promise((resolve, reject) => {
    const results = [];

    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (row) => {
        // Normalize some numeric fields
        const parsedRow = {
          ...row,
          Quantity: Number(row['Quantity'] || 0),
          PricePerUnit: Number(row['Price per Unit'] || 0),
          DiscountPercentage: Number(row['Discount Percentage'] || 0),
          TotalAmount: Number(row['Total Amount'] || 0),
          FinalAmount: Number(row['Final Amount'] || 0),
          Age: Number(row['Age'] || 0),
          Date: row['Date']
        };
        results.push(parsedRow);
      })
      .on('end', () => {
        console.log(`Loaded ${results.length} sales records`);
        resolve(results);
      })
      .on('error', (err) => {
        reject(err);
      });
  });
}

module.exports = loadSalesData;
