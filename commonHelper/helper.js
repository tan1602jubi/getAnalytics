let {PythonShell} = require('python-shell')
module.exports.runpy = function run(args){
    return new Promise(async function(resolve, reject){
        let options = {
            mode: 'text',
            pythonOptions: ['-u'],
            scriptPath: './commonHelper/',
            args: [JSON.stringify(args)]
        };
        await PythonShell.run('getinfo.py', options, async function (err, results) {
            if (err) throw err;
            console.log('results: ', results);
            resolve(results[0])
        })
    })
}