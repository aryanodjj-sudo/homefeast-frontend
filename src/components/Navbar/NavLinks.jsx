import { Link } from "react-router-dom";


const NavLinks = () => {


return (

<div className="
flex
gap-6
font-medium
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


<Link to="/cart">
Cart
</Link>


<Link to="/wishlist">
Wishlist
</Link>


</div>

);


};


export default NavLinks;