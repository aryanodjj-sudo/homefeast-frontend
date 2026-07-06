import useTheme from "../../hooks/useTheme";


const ThemeToggle = () => {


const {
darkMode,
toggleTheme

}=useTheme();



return (

<button

onClick={toggleTheme}

className="
rounded-xl
border
px-4
py-2
"

>


{darkMode ? "☀️" : "🌙"}


</button>

);


};


export default ThemeToggle;