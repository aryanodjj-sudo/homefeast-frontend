import { useContext } from "react";
import OrderContext from "../context/OrderContext";


const useOrders = () => {

return useContext(OrderContext);

};


export default useOrders;