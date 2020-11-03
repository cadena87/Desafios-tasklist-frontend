const proxy = [
  {
    context: '/api/v1',
    target: 'http://localhost:8080',
    pathRewrite: {'^/api/v1' : ''}
  }
];
module.exports = proxy;
