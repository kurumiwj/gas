import request from "@/utils/request";

//修改刷新间隔
function changeRefreshInterval(interval){
    return new Promise((resolve,reject)=>{
        request.put("/refresh/changeInterval",{interval}).then(
            res=>{resolve(res);},
            err=>{reject(err);}
        );
    });
}

//获取网页刷新间隔
function getRefreshInterval(){
    return new Promise((resolve,reject)=>{
        request.get("/refresh/interval").then(
            res=>{resolve(res);},
            err=>{reject(err);}
        );
    });
}

export {changeRefreshInterval,getRefreshInterval};