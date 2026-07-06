import { Link } from "react-router-dom";

import NavLinks from "./NavLinks";

import UserMenu from "./UserMenu";

import ThemeToggle from "../Common/ThemeToggle";


const Navbar = () => {


return (

<header className="
sticky
top-0
z-50
border-b
bg-white/90
backdrop-blur
dark:bg-gray-950/90
">


<nav className="
container
mx-auto
flex
items-center
justify-between
px-4
py-4
">


<Link

to="/"

className="
text-3xl
font-bold
text-orange-500
"

>

🍽️ HomeFeast

</Link>




<div className="
hidden
items-center
gap-8
md:flex
">


<NavLinks/>


<ThemeToggle/>


<UserMenu/>


</div>




</nav>


</header>

);


};


export default Navbar;