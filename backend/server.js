const app = require('./config/express');

const config = require('./config/config');

require('./config/mongoose');

app.listen(config.port, () => 
    console.log(`App listening on port ${config.port}!`)
); 