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
			model.tags.firstMessage = Base64.encode(model.data.trim())
			delete(model.stage)
			resolve(model)
		})
	},
	fallbackMessage: (model) => {
		return new Promise(async function (resolve, reject) {
			console.log(model.data)
			model.tags.fallbackMessage = Base64.encode(model.data.trim())
			delete(model.stage)
			resolve(model)
		})
	},
}