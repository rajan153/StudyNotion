import { Route, Routes } from "react-router-dom";
import HomePages from "./pages/HomePages";
import Footer from "./components/common/Footer";

function App() {
  return (
    <div className="w-screen min-h-screen flex flex-col font-inter items-center">
      <Routes>
        <Route path="/" element={<HomePages />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
