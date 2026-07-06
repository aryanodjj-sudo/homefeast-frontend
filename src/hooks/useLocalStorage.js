import { useState } from "react";


const useLocalStorage = (key,initial)=>{


const [value,setValue]=useState(()=>{


const item=localStorage.getItem(key);


return item ? JSON.parse(item) : initial;


});


const updateValue=(newValue)=>{


setValue(newValue);


localStorage.setItem(

key,

JSON.stringify(newValue)

);


};



return [value,updateValue];


};


export default useLocalStorage;