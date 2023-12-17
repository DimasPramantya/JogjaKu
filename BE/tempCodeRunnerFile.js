const arr = [7, 7, 12, 98, 106];
const answer = (arr)=>{
if(arr.length === 2){
    return [arr[0], arr[1]];
}else{
    let maxCount = 1;
    let minCount = 1;

    let maxNumber = arr[arr.length-1];
    let minNumber = arr[0];
    console.log(maxNumber, minNumber);
    for(let i = 1; i<arr.length; i++){
        if(arr[i]>minNumber && minCount > 0){
            minNumber = arr[i];
            minCount-=1;
            break;
        }
    }

    for(let i = arr.length-2; i>=0; i--){
        if(arr[i]<maxNumber && maxCount > 0){
            maxNumber = arr[i];
            console.log(maxNumber);
            maxCount-=1;
            break;
        }
    }

    return [minNumber, maxNumber]
}
}

console.log(answer(arr));

