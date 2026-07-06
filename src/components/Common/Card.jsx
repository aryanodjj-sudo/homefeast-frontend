const Card = ({
children,
className=""
}) => {


return (

<div

className={`
rounded-2xl
border
p-5
shadow-sm
bg-white
dark:bg-gray-900
${className}
`}

>

{children}

</div>

);


};


export default Card;