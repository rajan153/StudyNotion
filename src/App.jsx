import { Route, Routes } from "react-router-dom";
import HomePages from "./pages/HomePages";

function App() {
  return (
    <div className="w-screen min-h-screen bg-richblack-900 flex flex-col font-inter items-center">
      <Routes>
        <Route path="/" element={<HomePages />} />
      </Routes>
    </div>
  );
}

export default App;
