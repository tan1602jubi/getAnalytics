let {PythonShell} = require('python-shell')
let Base64 = require('js-base64').Base64;
module.exports = {
	getProjectId: (model) => {
		return new Promise(async function (resolve, reject) {
			console.log(model.data)
			let options = {
				mode: 'text',
				pythonOptions: ['-u'],
				scriptPath: './adapter/intent/',
				args: [JSON.stringify({"operation": "chkId", "id": model.data})]
			};
	  
			await PythonShell.run('getinfo.py', options, function (err, results) {
				if (err) throw err;
				console.log('results: ', results);
				if (results[0] == "1"){
					model.tags.projectId = model.data
					delete(model.stage)
					resolve(model)
				}
				else{
					reject(model)
				}
			})
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
				let options = {
					mode: 'text',
					pythonOptions: ['-u'],
					scriptPath: './adapter/intent/',
					args: [JSON.stringify({"operation": "getAnalysis", "projectInfo": projectInfo})]
				};
		  
				await PythonShell.run('getinfo.py', options, async function (err, results) {
					if (err) throw err;
					console.log('results: ', typeof(results[0]));
					model.tags.report = await JSON.parse(JSON.stringify(results[0]))
				})
				delete(model.stage)
			}
			else{
				reject(model)
			}
			console.log(model.data)
			model.tags.fallbackMessage = Base64.encode(model.data.trim())
			delete(model.stage)
			resolve(model)
		})
	},
}