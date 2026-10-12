import { Outlet } from "../router/navigation";

/** Root layout route — always renders a single stable outlet for child routes. */
const AppOutletLayout = () => {
  return <Outlet />;
};

export default AppOutletLayout;
