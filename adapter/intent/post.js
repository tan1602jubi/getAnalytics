let {PythonShell} = require('python-shell')
module.exports = {
	getProjectId: (model) => {
		return new Promise(async function (resolve, reject) {
			console.log(model.data)
			let options = {
				mode: 'text',
				pythonOptions: ['-u'],
				scriptPath: './getinfo.py',//Path to your script
				args: [JSON.stringify({"operation": "chkId", "id": model.data})]
			};
	  
			await PythonShell.run('getinfo.py', options, function (err, results) {
				if (err) throw err;
				console.log('results: ');
				if (results[0] == "1"){
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
			delete(model.stage)
			resolve(model)
		})
	},
	fallbackMessage: (model) => {
		return new Promise(async function (resolve, reject) {
			console.log(model.data)
			delete(model.stage)
			resolve(model)
		})
	},
}