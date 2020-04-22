module.exports={
	viewReport:(model)=>{
        return new Promise(function(resolve, reject){
            console.log("----------------------------------------------------------")
            console.log(model.tags.report)
            console.log(typeof(model.tags.report))
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

//AxaWidgetOnPrem_988081714821
//what can i do for you today?
//i think you're stuck in between the journey
// 2020-04-01 to 2020-04-10