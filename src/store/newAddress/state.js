//地区数据
import addressList from '../../data/addressList.js'

export const state = {
	
	title:"编辑地址",
	
	//临时地址数据，用于判断用户是否修改地址数据
	temporaryDate : {},
	
	//新增或者编辑地址标识 1：新增  ， 0：编辑
	isAdd: 0 ,
	
	//购物车唯一标识
	aid : "" ,
	//是否显示默认地址
	isDefault:true,
	
	//是否显示删除
	isDelete:true,
	
	//地址数据
	addressList,
	
	//是否显示邮政编码
	isPastal: true,
}