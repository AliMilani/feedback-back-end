// let data = JSON.parse(responseBody);
const authorization = pm.response.headers.get('authorization')
const refreshToken = pm.response.headers.get('x-refresh-token')
postman.setGlobalVariable("USER_ACCESS_TOKEN", authorization.split(' ')[1])
postman.setGlobalVariable("USER_REFRESH_TOKEN", refreshToken)
