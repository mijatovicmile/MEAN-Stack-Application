const config = require('./config/config');
const app = require('./config/express');

require('./config/mongoose');

app.listen(config.port, () => 
    console.log(`App listening on port ${config.port}!`)
); 