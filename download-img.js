const https = require('https');
const fs = require('fs');
const file = fs.createWriteStream("C:\\eclub\\figma_table.png");
https.get("https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/f6f25a33-295b-4b72-9551-fb32566c09be", function(response) {
  response.pipe(file);
});
