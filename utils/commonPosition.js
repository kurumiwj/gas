function findCommonPosition(str){
    let pos=str.lastIndexOf("-");
    return str.slice(0,pos);
}

export {findCommonPosition};