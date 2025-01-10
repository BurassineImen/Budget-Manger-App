// rrd imports
import { Outlet, useLoaderData } from "react-router-dom";

// assets
import wave from "../assets/wave.svg";

// components
import Nav from "../components/nav";

//  helper functions
import { fetchData } from "../helpers"

// loader
export function mainLoader() {
  const name = fetchData("name") || "Guest";
  return { name };
}


const Main = () => {
  const { name } = useLoaderData()

  return (
    <div className="layout">
      <Nav name={name} />
      <main>
        <Outlet />
      </main>
      <img src={wave} alt="" />
    </div>
  )
}
export default Main