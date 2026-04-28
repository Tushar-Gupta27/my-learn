Array.prototype.myMap = function(callback){
    const result = [];
    const arr = this;

    for(let i=0;i<this.length;i++){
        const temp = callback(this[i],i,this)
        result.push(temp);
    }

    return result
}
Array.prototype.myFilter = function(callback){
    const result = [];
    const arr = this;

    for(let i=0;i<this.length;i++){
        const temp = callback(this[i],i,this)
       !!temp && result.push(this[i]);
    }

    return result
}

const x = [1,2,3,4].myMap((e,i)=>{console.log(e,i);return e*2})
const y = [1,2,3,4].myFilter((e,i)=>{return e>2})
console.log(x,y)