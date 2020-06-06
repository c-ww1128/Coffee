class Valid{
	
	constructor() {
		
		//手机号正则表达式

		this.phone = {
			reg: /^1[23456789]\d{9}$/,
			msg: '请正确输入手机号'
		},
		
		//昵称正则表达式
		
		this.nickName = {
			reg: /^(?=.*[a-zA-Z])[0-9a-zA-Z\u4e00-\u9fa5]{1,8}$/ ,
			msg: '请正确输入昵称'
		},
		
		//密码正则表达式
		
	    this.password = {
	    	reg:/^[a-zA-Z][^\u4e00-\u9fa5]{5,15}$/ ,
	    	msg: '首个是字符,数字和汉字结合'
	    }
		
		//密码正则表达式
		this.oldPassword = {
			reg:/^[a-zA-Z][^\u4e00-\u9fa5]{5,15}$/ ,
			msg: '旧密码首个是字符,数字和汉字结合'
		}
		
		//密码正则表达式
		this.email = {
			reg:/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,
			msg: '邮箱格式不正确'
		}
	}
	// 注册 ， 登录验证
	validForm(o ,t){
		
		for(let key in o ){
			
			// 一个不成功就return 阻止登录 ， 注册
			if(!this[key].reg.test(o[key])){
				
				t.$toast(this[key].msg)
				
				
				return false
			}
		}
		
		return true
		
		
	}
	

	
	
	
}

export const valid = new Valid();