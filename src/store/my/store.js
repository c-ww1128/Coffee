//导入state
import {state} from './state'

import {mutations} from './mutations'

export const myModule = {
	
	namespaced:true,
	mutations,
	state
}