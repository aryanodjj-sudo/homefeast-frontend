import useAuth from "../../hooks/useAuth";


const LogoutButton = () => {


const {
logout
}=useAuth();



return (

<button

onClick={logout}

className="
rounded-xl
bg-red-500
px-4
py-2
text-white
"

>

Logout

</button>

);


};


export default LogoutButton;