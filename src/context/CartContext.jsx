import {createContext,useContext,useEffect,useState} from "react";
const CartContext=createContext(null);
export function CartProvider({children}){
 const [cart,setCart]=useState(()=>JSON.parse(localStorage.getItem("keyboard_cart")||"[]"));
 useEffect(()=>localStorage.setItem("keyboard_cart",JSON.stringify(cart)),[cart]);
 const add=(product,quantity=1)=>setCart(c=>{const x=c.find(i=>i.id===product.id);return x?c.map(i=>i.id===product.id?{...i,quantity:i.quantity+quantity}:i):[...c,{...product,quantity}]});
 const update=(id,quantity)=>setCart(c=>quantity<=0?c.filter(x=>x.id!==id):c.map(x=>x.id===id?{...x,quantity}:x));
 const remove=id=>setCart(c=>c.filter(x=>x.id!==id)); const clear=()=>setCart([]);
 const subtotal=cart.reduce((s,x)=>s+(x.discount_price??x.price)*x.quantity,0);
 const count=cart.reduce((s,x)=>s+x.quantity,0);
 return <CartContext.Provider value={{cart,add,update,remove,clear,subtotal,count}}>{children}</CartContext.Provider>
}
export const useCart=()=>useContext(CartContext);
