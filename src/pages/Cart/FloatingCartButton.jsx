import { ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getCart } from "../../API/cosmicApis";
import { useEffect, useState } from "react";

const FloatingCartButton = () => {
  const navigate = useNavigate();
  const [cartCount, setCartCount] = useState(0)
  const [cartItems, setCartItems] = useState([])
  const fetchCart = async () => {
          try {
  
             
              const res = await getCart();
  
              if (res.data.success) {
                  setCartItems(res.data.data.items);
              }

              setCartCount(cartItems?.length || 0)
  
          } catch (error) {
              console.log(error);
          } 
      };



        useEffect(() => {
              fetchCart();
          }, []);
      
  
  

  return (
    <button
      onClick={() => navigate("/dashboard/cart")}
      className="fixed bottom-6 right-6 z-[9999] flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-purple-600 via-violet-700 to-purple-900 text-white shadow-2xl transition-all duration-300 hover:scale-110 hover:shadow-purple-500/50 active:scale-95"
    >
      <ShoppingCart size={28} strokeWidth={2.2} />

      {/* Badge */}
      {cartCount > 0 && (
        <span className="absolute -right-1 -top-1 flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-red-500 text-xs font-bold text-white shadow-lg">
          {cartCount > 99 ? "99+" : cartCount}
        </span>
      )}

      {/* Pulse Effect */}
      <span className="absolute inset-0 animate-ping rounded-full bg-purple-500 opacity-20"></span>
    </button>
  );
};

export default FloatingCartButton;