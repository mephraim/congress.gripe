var axios = require('axios');
axios.get('/assets/javascripts/congress.json').then(function(response) {
  console.log(response);
});
