require("parramato").Server({
    root:"http://152.67.1.65/get_analytics",
    socketLocalPath: '/socket',
    httpPort:7000,
    cluster:false,
    dbUri:'mongodb://getanalyticsdb:analyticsdb123@127.0.0.1:27017/analytics',
    staticDirectory:__dirname+"/static",
    adapterPath:"/adapter",
    adapterDirectory:__dirname+"/adapter",
    projectId:"get_analytics_236145124787",
    // dashbotKey:"VxtYPVW6168LIiXwqpIku9wE",
    directMultiplier:1,
    fallbackMultiplier:0.8,
    passphraseMiddleware:"YGUYGgyjgblgUGIYGIGkwhbiuashbo98u9283hr9h24rqIYGI932kbidbiadsYE",
    timeoutSeconds:60,
    fcmServerKey:"AAAAYTZC9WQ:APA91bFRmKa",
    firebaseWebConfig:{
        apiKey: "sd-ZrO9xKQ",
        authDomain: "on-f31.firebaseapp.com",
        databaseURL: "https://on-f31.firebaseio.com",
        projectId: "on-f31",
        storageBucket: "",
        messagingSenderId: "4175221234234"
    }
},()=>{
    //TO DO AFTER INITIALIZATION
})