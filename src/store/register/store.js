//导入state
import {state} from './state'

import {mutations} from './mutations'
export const registerModule = {
	
	namespaced:true,
	
	state,
	mutations
}