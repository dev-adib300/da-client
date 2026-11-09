import { Outlet } from 'react-router-dom';
import Navbar from '../Pages/Shared/Navbar/Navbar';
import Footer from '../Pages/Shared/Footer/Footer';
import ScrollToTop from '../Components/ScrollToTop';

const Main = () => {
    return (
        <div>
            <ScrollToTop></ScrollToTop>
            <Navbar></Navbar>
            <Outlet></Outlet>
            <Footer></Footer>
        </div>
    );
};

export default Main;