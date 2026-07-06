import { Link } from "react-router-dom";


const MobileMenu = ({
open
}) => {


if(!open) return null;



return (

<div className="
absolute
top-16
left-0
w-full
border-b
bg-white
p-5
md:hidden
">


<div className="
flex
flex-col
gap-4
">


<Link to="/">
Home
</Link>


<Link to="/menu">
Menu
</Link>


<Link to="/chefs">
Chefs
</Link>


<Link to="/about">
About
</Link>


<Link to="/contact">
Contact
</Link>


</div>


</div>

);


};


export default MobileMenu;