/**
 * auth测试模块
 */

let UserService = require('../servers/auth')

let co = require('co')

let USER = new UserService()

co(function*(){

	let authResult = yield USER.auth('yue.yang','654321')

	let getResult = yield USER.get('yue.yang')

	let listResult = yield USER.list(['yue.yang','xiaohu.li','an.zhao','yi.zhang'])

	let searchResult = yield USER.search('li')


	console.log(`=========authResult=========`)
	console.log(authResult)

	console.log(`=========getResult=========`)
	console.log(getResult)

	console.log(`=========listResult=========`)
	console.log(listResult)

	console.log(`=========searchResult=========`)
	console.log(searchResult)

})
