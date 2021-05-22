const config = require('./config.js');
const axios = require('axios');
const FormData = require('form-data');

var callback = (data, error) => {
  // consume data
  if (error) {
      console.error(error);
      return;
  }
  console.log(data);
};

console.log(config.url, config.message, config.repeat)
request(config.repeat, callback);

function request(retries,  callback) {
  const data = new FormData();
  data.append(config.key, config.message);

  axios.post(config.url, data, {headers: data.getHeaders() 
  }).then(response => {
      if(response.data) {
          callback(response.data);
      }
      else {
          if (retries > 0) {
              console.log(retries, "success")
              request(--retries, callback);
          }
          else {
              callback([], "out of retries");
          }
      }
  }).catch(error => {
      if (retries > 0) {
          request(--retries, callback);
      }
      else {
          callback([], error);
      }
  });
}