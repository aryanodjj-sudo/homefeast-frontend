import MealCard from "./MealCard";


const MealList = ({
meals=[]
}) => {


return (

<div className="
grid
gap-6
md:grid-cols-3
">


{

meals.map(meal=>(

<MealCard

key={meal.id}

meal={meal}

/>


))

}


</div>

);


};


export default MealList;