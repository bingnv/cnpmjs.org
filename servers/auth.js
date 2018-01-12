const crypto = require('crypto')
const request = require('request')
const thunkify = require('thunkify-wrap')
const co = require('co')
const POST = thunkify(request.post)

let APIHost
if (process.env.NODE_ENV == 'production') {
	APIHost = 'http://192.168.23.218:8180/innerspore/userCenter';
} else { // 非线上环境，则全部连接到日常接口
	APIHost = 'http://192.168.180.10:8082/innerspore/userCenter'
}

function UserService() {}

/**
 *	User Data Structure
 * 	{
 *	  "login": "fengmk2",
 *	  "email": "fengmk2@gmail.com",
 *	  "name": "Yuan Feng",
 *	  "html_url": "http://fengmk2.github.com",
 *	  "avatar_url": "https://avatars3.githubusercontent.com/u/156269?s=460",
 *	  "im_url": "",
 *	  "site_admin": false,
 *	  "scopes": ["@org1", "@org2"]
 *	}
 */

const getPassword = function(passwd) { // java服务端用户密码加密算法，与客户端加密统一（暂时不用，因为已在前端js中执行加密）
	let pas256 = crypto.createHash('sha256').update(passwd, 'utf8').digest('hex')
	let md5 = crypto.createHash('md5').update(passwd).digest('hex').toUpperCase()
	let newPassHash = md5.slice(0, 8) +
		pas256.slice(24, 32) +
		pas256.slice(0, 8) +
		md5.slice(16, 24) +
		md5.slice(8, 16) +
		pas256.slice(8, 16) +
		pas256.slice(16, 24) +
		md5.slice(24, 32)
	newPassHash = crypto.createHash('sha256').update(newPassHash, 'utf8').digest('hex')
	return newPassHash.slice(0, 32)
}

/**
 * Auth user with login name and password
 * @param  {String} login    login name
 * @param  {String} password login password
 * @return {User}
 */
UserService.prototype.auth = function*(login, password) {
	let result = null
	let accessRe = false
	let re = null
	try {
		re = yield POST({
			url: `${APIHost}/login.do`,
			form: {
				platform: 2,
				deviceId: 'ZXCZXCAd',
				osType: 0,
				unionId: login,
				password: getPassword(password)
			}
		})
	} catch (eee) {
		console.log('login接口调用失败')
		console.log(eee)
		return accessRe
	}
	try {
		result = JSON.parse(re[1])
	} catch (e) {
		console.log('auth result解析失败')
		return accessRe
	}
	if (result && result.code == '0' && result.authMap) {
		try {
			if (result.authMap[2][3] >= 100) { // 有权限 PlatformID = 2（tools工具平台），appID = 3（前端发布）, 权限 > 100
				let username = login.split('@')[0]
				accessRe = {
					"login": login,
					"email": `${username}@100credit.com`,
					"name": username,
					"site_admin": false,
					"scopes": ["@br"]
				}
			}
		} catch (err) {
			// console.log('无法匹配到正确的权限，忽略该记录')
		}
	}
	return accessRe
}

/**
 * Get user by login name
 * @param  {String} login  login name
 * @return {User}
 */
UserService.prototype.get = function*(login) {
	let result = null
	let accessRe = false
	let re = null
	try {
		re = yield POST({
			url: `${APIHost}/getUserByName.do`,
			form: {
				user: login
			}
		})
	} catch (eee) {
		console.log('getUserByName 接口调用失败')
		console.log(eee)
		return accessRe
	}
	try {
		result = JSON.parse(re[1])
	} catch (e) {
		console.log('auth result解析失败')
		return accessRe
	}
	if (result && result.code == '0' && result.user) {
		try {
			if (result.authMap[2][3] >= 100) { // 有权限 PlatformID = 2（tools工具平台），appID = 3（前端发布）, 权限 > 100
				let username = login.split('@')[0]
				accessRe = {
					"login": login,
					"email": result.user.email,
					"name": username,
					"site_admin": (result.authMap[2][3] == 400),
					"scopes": ["@br"]
				}
			}
		} catch (err) {
			// console.log('get 无法匹配到正确的权限，忽略该记录')
		}
	}
	return accessRe
}

/**
 * List users
 * @param  {Array<String>} logins  login names
 * @return {Array<User>}
 */
UserService.prototype.list = function*(logins) {
	let result = null
	let accessRe = []
	let re = null
	try {
		re = yield POST({
			url: `${APIHost}/getUsersByName.do`,
			form: {
				users: `[${logins.join(',')}]`
			}
		})
	} catch (eee) {
		console.log('getUsersByName 接口调用失败')
		console.log(eee)
		return accessRe
	}
	try {
		result = JSON.parse(re[1])
	} catch (e) {
		console.log('list result解析失败')
		return accessRe
	}
	if (result && result.code == '0' && result.userMap) {
		for (let username in result.userMap) {
			let userValue = result.userMap[username]
			try {
				if (userValue.authMap[2][3] >= 100) { // 有权限 PlatformID = 2（tools工具平台），appID = 3（前端发布）, 权限 > 100
					accessRe.push({
						"login": username,
						"email": userValue.user.email,
						"name": username,
						"site_admin": (userValue.authMap[2][3] == 400),
						"scopes": ["@br"]
					})
				}
			} catch (err) {
				// console.log('list 无法匹配到正确的权限，忽略该记录')
			}
		}
	}
	return accessRe
}

/**
 * Search users
 * @param  {String} query  query keyword
 * @param  {Object} [options] optional query params
 *  - {Number} limit match users count, default is `20`
 * @return {Array<User>}
 */
UserService.prototype.search = function*(query, options) {
	let result = null
	let accessRe = []
	let re = null
	try {
		re = yield POST({
			url: `${APIHost}/searchName.do`,
			form: {
				name: query
			}
		})
	} catch (eee) {
		console.log('getUsersByName 接口调用失败')
		console.log(eee)
		return accessRe
	}
	try {
		result = JSON.parse(re[1])
	} catch (e) {
		console.log('search result解析失败')
		return accessRe
	}
	if (result && result.code == '0' && result.userMap) {
		for (let username in result.userMap) {
			let userValue = result.userMap[username]
			try {
				if (userValue.authMap[2][3] >= 100) { // 有权限 PlatformID = 2（tools工具平台），appID = 3（前端发布）, 权限 > 100
					accessRe.push({
						"login": username,
						"email": userValue.user.email,
						"name": username,
						"site_admin": (userValue.authMap[2][3] == 400),
						"scopes": ["@br"]
					})
				}
			} catch (err) {
				// console.log('search 无法匹配到正确的权限，忽略该记录')
			}
		}
	}
	return accessRe
}

module.exports = UserService