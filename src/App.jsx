import { BrowserRouter, Routes, Route } from "react-router-dom";
import SplashScreen from "./pages/SplashScreen/SplashScreen";
import Login from "./pages/Login/Login";
import Dashboard from "./pages/Home/Dashboard";
import DashboardLayout from "./layout/DashboardLayout";
import KundliPage from "./pages/Home/KundaliPage";
import Horoscope from "./pages/Home/Horoscope";
import ProfilePage from "./pages/ProfilePage/ProfilePage";
import MatchingMaking from "./pages/Home/MatchMaking";
import FestivalCalendar from "./pages/Home/FestivalCalender";
import LiveStream from "./pages/Home/LiveStream";
import CosmicInsightsDetail from "./pages/Home/CosmicInsightDetails";
import Astrologers from "./pages/Home/Astrologers";
import MyBookings from "./pages/Bookings/MyBookings";
import WalletPage from "./pages/Home/WalletPage";
import AllProducts from "./pages/Home/AllProducts";
import Cart from "./pages/Cart/Cart";
import AboutUs from "./pages/About/AboutUs";
import CosmicStore from "./pages/Home/CosmicStore";
import CosmicInsights from "./pages/Home/CosmicInsights";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SplashScreen />} />
        <Route path="/login" element={<Login />} />

        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="kundali" element={<KundliPage />} />
          <Route path="horoscope" element={<Horoscope />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="match" element={<MatchingMaking />} />
          <Route path="festival" element={<FestivalCalendar />} />
          <Route path="live" element={<LiveStream />} />
          <Route path="cosmic" element={<CosmicStore />} />
          <Route path="cosmic-detail/:id" element={<CosmicInsightsDetail />} />
          <Route path="astrologers" element={<Astrologers />} />
          <Route path="my-bookings" element={<MyBookings />} />
          <Route path="my-wallet" element={<WalletPage />} />
          <Route path="products" element={<AllProducts />} />
          <Route path="cart" element={<Cart />} />
          <Route path="about" element={<AboutUs/>}/>
          <Route path="articles" element={<CosmicInsights/>}/>
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;