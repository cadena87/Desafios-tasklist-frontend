const proxy = [
  {
    context: '/api/v1',
    target: 'https://dashboard.heroku.com/apps/ws-tasklist-api',
    pathRewrite: {'^/api/v1' : ''}
  }
];
module.exports = proxy;
