const Alert = ({
message,
type="success"
}) => {


return (

<div

className={`
rounded-xl
p-4
text-white

${
type==="error"

?

"bg-red-500"

:

"bg-green-500"

}

`}

>

{message}

</div>

);


};


export default Alert;