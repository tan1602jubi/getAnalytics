let Base64 = require('js-base64').Base64;
let helper = require('../../commonHelper/helper.js')
module.exports = {
	getProjectId: (model) => {
		return new Promise(async function (resolve, reject) {
			console.log(model.data)
			let chk = await helper.runpy({"operation": "chkId", "id": model.data})
			if (chk == "1"){
				delete(model)
				resolve(model)
			}
			else{
				reject(model)
			}			
		})
	},
	firstMessage : (model) => {
		return new Promise(async function (resolve, reject) {
			console.log(model.data)
			model.tags.firstMessage = model.data.trim()
			console.log(model)
			console.log("-----------------------------------------------------------------------------------------------")
			delete(model.stage)
			resolve(model)
		})
	},
	fallbackMessage: (model) => {
		return new Promise(async function (resolve, reject) {
			console.log(model.data)
			model.tags.fallbackMessage = model.data.trim()
			console.log(model)
			console.log("-----------------------------------------------------------------------------------------------")
			delete(model.stage)
			resolve(model)
		})
	},
	dateRange: (model) => {
		return new Promise(async function (resolve, reject) {
			from = model.data.split("to")[0].trim()
			to = model.data.split("to")[1].trim()
			if(to.match(/([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/g) && from.match(/([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/g)){
				console.log(model)
				console.log("-----------------------------------------------------------------------------------------------")
				let projectInfo = {
					projectId: model.tags.projectId,
					firstMessage: model.tags.firstMessage,
					fallbackMessage: model.tags.fallbackMessage,
					date: {
						to: to,
						from: from
					}
				}
				model.tags.report = await helper.runpy({"operation": "getAnalysis", "projectInfo": projectInfo})
				delete(model)
			}
			else{
				reject(model)
			}
			console.log(model.data)
			delete(model.stage)
			resolve(model)
		})
	},
}