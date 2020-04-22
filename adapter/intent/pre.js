module.exports={
	viewReport:(model)=>{
        return new Promise(function(resolve, reject){
            model.reply = {
                type :"button",
                text : "View Analysis Report",
                next:{
                    data:[
                        {
                            type:"url",
                            data: "",
                            text:"Bot Analytics Link"
                        },
                    ]
                }
            }
            resolve(model)
        })
    },
}