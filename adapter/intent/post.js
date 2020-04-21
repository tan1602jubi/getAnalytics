module.exports = {
	getProjectId: (model) => {
		return new Promise(async function (resolve, reject) {
			console.log(model.data)
			resolve(model)
		})
	},
	firstMessage : (model) => {
		return new Promise(async function (resolve, reject) {
			console.log(model.data)
			resolve(model)
		})
	},
	fallbackMessage: (model) => {
		return new Promise(async function (resolve, reject) {
			console.log(model.data)
			resolve(model)
		})
	},
}