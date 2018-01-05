function UserService() {}

var proto = UserService.prototype;

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

/**
 * Auth user with login name and password
 * @param  {String} login    login name
 * @param  {String} password login password
 * @return {User}
 */
proto.auth = function*(login, password) {
	return {
		"login": "yue.yang",
		"email": "yue.yang@100credit.com",
		"name": "yangyue",
		"html_url": "http://bluelight598.github.com",
		"avatar_url": "https://avatars3.githubusercontent.com/u/18495650?s=40&v=4",
		"im_url": "",
		"site_admin": false,
		"scopes": ["@br"]
	}
};

/**
 * Get user by login name
 * @param  {String} login  login name
 * @return {User}
 */
proto.get = function*(login) {
	return {
		"login": "yue.yang",
		"email": "yue.yang@100credit.com",
		"name": "yangyue",
		"html_url": "http://bluelight598.github.com",
		"avatar_url": "https://avatars3.githubusercontent.com/u/18495650?s=40&v=4",
		"im_url": "",
		"site_admin": false,
		"scopes": ["@br"]
	}
};

/**
 * List users
 * @param  {Array<String>} logins  login names
 * @return {Array<User>}
 */
proto.list = function*(logins) {
	return [{
		"login": "yue.yang",
		"email": "yue.yang@100credit.com",
		"name": "yangyue",
		"html_url": "http://bluelight598.github.com",
		"avatar_url": "https://avatars3.githubusercontent.com/u/18495650?s=40&v=4",
		"im_url": "",
		"site_admin": false,
		"scopes": ["@br"]
	}]
};

/**
 * Search users
 * @param  {String} query  query keyword
 * @param  {Object} [options] optional query params
 *  - {Number} limit match users count, default is `20`
 * @return {Array<User>}
 */
proto.search = function*(query, options) {
	return [{
		"login": "yue.yang",
		"email": "yue.yang@100credit.com",
		"name": "yangyue",
		"html_url": "http://bluelight598.github.com",
		"avatar_url": "https://avatars3.githubusercontent.com/u/18495650?s=40&v=4",
		"im_url": "",
		"site_admin": false,
		"scopes": ["@br"]
	}]
};