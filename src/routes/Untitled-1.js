// let data = JSON.parse(responseBody);
var authorization = pm.response.headers.get('authorization')
var refreshToken = pm.response.headers.get('x-refresh-token')
postman.setGlobalVariable("USER_ACCESS_TOKEN", authorization.split(' ')[1]);
postman.setGlobalVariable("USER_REFRESH_TOKEN", refreshToken);
