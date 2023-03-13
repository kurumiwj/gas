//const isLeap=year=>year%4===0&&year%400!==0;

//function handleTime(timeStr){	//时间格式为“year-month-dayThour:minute:secondZ”
//	let l=timeStr.split('T');
//    l[1]=l[1].slice(0,-1);   //删除最后的Z
//    //跨时区问题
//    const months = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
//    let year = parseInt(l[0].slice(0,4));
//    let month = parseInt(l[0].slice(5,7));
//    let day = parseInt(l[0].slice(8,l[0].length));
//    let hour = parseInt(l[1].slice(0,2));
//    let minute = parseInt(l[1].slice(3,5));
//    let second = parseInt(l[1].slice(6,-1));
//    hour += 8;
//    if (hour>=24){
//		hour %= 24;
//        day += 1;
//	}
//    if (isLeap(year))
//		months[1] = 29;
//    if (day > months[month - 1]){
//		day %= months[month - 1];
//        month += 1;
//	}
//    if (month > 12){
//		month %= 12;
//        year += 1;
//	}
//	month=month<10 ? '0'+month : month;
//	day=day<10 ? '0'+day : day;
//	const ret=`${year}-${month}-${day} ${hour}:${minute}:${second}`;
//    return ret;
//}

//标准时间转换
function handleTime(timeStr){
	let localtime=new Date(timeStr);
	let y=localtime.getFullYear();
	let m=localtime.getMonth()+1;
	let d=localtime.getDate();
	let hh=localtime.getHours();
	let mm=localtime.getMinutes();
	let ss=localtime.getSeconds();
	m=m<10 ? '0'+m : m;
	d=d<10 ? '0'+d : d;
	hh=hh<10 ? '0'+hh : hh;
	mm=mm<10 ? '0'+mm : mm;
	ss=ss<10 ? '0'+ss : ss;
	return y+'-'+m+'-'+d+" "+hh+':'+mm+':'+ss;
}

//UTC时间转换
function handleUTCTime(timeStr){
	let localtime=new Date(timeStr);
	let y=localtime.getFullYear();
	let m=localtime.getMonth()+1;
	let d=localtime.getDate();
	let hh=localtime.getHours();
	let mm=localtime.getMinutes();
	let ss=localtime.getSeconds();
	hh+=8;
	m=m<10 ? '0'+m : m;
	d=d<10 ? '0'+d : d;
	hh=hh<10 ? '0'+hh : hh;
	mm=mm<10 ? '0'+mm : mm;
	ss=ss<10 ? '0'+ss : ss;
	return y+'-'+m+'-'+d+" "+hh+':'+mm+':'+ss;
}

export {handleTime,handleUTCTime};