module.exports={
	botLink:(model)=>{
        return new Promise(function(resolve, reject){
        console.log("PDFGEN")
            model.reply = {
                type :"button",
                text : "Here is you bot analytics url",
                next:{
                    data:[
                        {
                            type:"url",
                            data: model.tags.botlink,
                            text:"Bot Analytics Link"
                        },
                    ]
                }
            }
            resolve(model)
        })
    },
}