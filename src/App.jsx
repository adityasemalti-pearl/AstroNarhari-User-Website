import { BrowserRouter, Routes, Route } from "react-router-dom";
import SplashScreen from "./pages/SplashScreen/SplashScreen";
import Login from "./pages/Login/Login";
import Dashboard from "./pages/Home/Dashboard";
import DashboardLayout from "./layout/DashboardLayout";
import KundliPage from "./pages/Home/KundaliPage";
import Horoscope from "./pages/Home/Horoscope";
import CreateProfilePage from "./pages/ProfilePage/CreateProfilePage";
import MatchingMaking from "./pages/Home/MatchMaking";
import FestivalCalendar from "./pages/Home/FestivalCalender";
import LiveStream from "./pages/Home/LiveStream";
import CosmicProductDetail from "./pages/Home/CosmicProductDetails";
import Astrologers from "./pages/Home/Astrologers";
import MyBookings from "./pages/Bookings/MyBookings";

import AllProducts from "./pages/Home/AllProducts";
import Cart from "./pages/Cart/Cart";
import AboutUs from "./pages/About/AboutUs";
import CosmicStore from "./pages/Home/CosmicStore";
import CosmicInsights from "./pages/Home/CosmicInsights";
import CosmicDetail from "./pages/Home/CosmicInsightDetails";
import MyConsultations from "./pages/ProfilePage/MyConsultations";
import AccountSettings from "./pages/ProfilePage/AccountSettings";
import EditProfileDetails from "./pages/ProfilePage/EditProfileDetails";
import ProfileDashboard from "./pages/ProfilePage/ProfileDashboard";
import HomePage from "./pages/Home/PublicPages/HomePage";
import ProtectedRoute from "./pages/ProtectedRoute";
import PublicRoute from "./pages/PublicRoutes";
import NotFound from "./components/NotFound";
import CheckoutPage from "./pages/Cart/Checkout";
import WalletPage from "./pages/Home/Wallet"


import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import TermsConditions from "./pages/Home/PublicPages/TermsConditions";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant",
    });
  }, [pathname]);

  return null;
};


function App() {
  return (
    <BrowserRouter>
    <ScrollToTop/>
      <Routes>
        {/* Public Routes */}
        <Route element={<PublicRoute />}>
          <Route path="/" element={<SplashScreen />} />
          <Route path="/login" element={<Login />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/terms-n-conditions" element={<TermsConditions />} />
           <Route path="/create-profile" element={<CreateProfilePage />} />
        </Route>
        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="kundali" element={<KundliPage />} />
            <Route path="horoscope" element={<Horoscope />} />
           
            <Route path="match" element={<MatchingMaking />} />
            <Route path="festival" element={<FestivalCalendar />} />
            <Route path="live" element={<LiveStream />} />
            <Route path="cosmic" element={<CosmicStore />} />
            <Route path="cosmic-detail/:id" element={<CosmicProductDetail />} />
            <Route path="astrologers" element={<Astrologers />} />
            <Route path="my-bookings" element={<MyBookings />} />
            <Route path="my-wallet" element={<WalletPage />} />
            <Route path="products" element={<AllProducts />} />
            <Route path="cart" element={<Cart />} />
            <Route path="about" element={<AboutUs />} />
            <Route path="articles" element={<CosmicInsights />} />
            <Route path="articles/:slug" element={<CosmicDetail />} />
            <Route path="profile-overview" element={<ProfileDashboard />} />
            <Route path="profile/edit" element={<EditProfileDetails />} />
            <Route path="settings" element={<AccountSettings />} />
            <Route path="consultations" element={<MyConsultations />} />
            <Route path="checkout" element={<CheckoutPage />} />
            <Route path="wallet" element={<WalletPage />} />
          </Route>
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;