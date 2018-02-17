var env = process.env.NODE_ENV || 'development';

console.log('env ******** ', env);


if (env === 'development' || env === 'test'){

  // THis automatically loads the contents of the config.json file
  // into a Javascript JSON object
  var config = require('./config.json');

  // Grab the environment components pertaining to the current environment.
  var envConfig = config[env];

  // Create an environment variable using each key:value pair
  // in the envConfig object
  Object.keys(envConfig).forEach((key) => {
    process.env[key] = envConfig[key];
  });
}


// if (env === 'development'){
//   process.env.PORT = 3000;
//   process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoApp';
// } else if (env === 'test'){
//   process.env.PORT = 3000;
//   process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoAppTest';
// }
