//ppm转mgm3
function ppmToMgm3(ppm,P,T,Mw){
    return (ppm*101/P*273/T*Mw/22.4).toFixed(2);
}
//ppm转%
function ppmToV(ppm){
    return ppm/10000;
}
//单位换算
function unitChange(gas){
    if(gas.unit==="mg/m3"){
        return ppmToMgm3(gas.data,gas.atmosphere,gas.temperature,gas.molecularWeight);
    }else if(gas.unit==="%"){
        return ppmToV(gas.data);
    }else{
        return gas.data;
    }
}
//判断是否报警
function isAlarm(gas){
    if(gas.gas_name!="H2"){
        return unitChange(gas)>=gas.alarm*0.01*gas.scope/0.3;
    }else return unitChange(gas)>=gas.alarm*0.01*gas.scope;
}

export {isAlarm,ppmToMgm3,ppmToV,unitChange};