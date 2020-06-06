import {state} from './state'

import {mutations} from'./mutations'

export const aggregateModule = {
	namespaced: true,
	state,
	mutations
}