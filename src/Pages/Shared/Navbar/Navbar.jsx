import { Link } from "react-router-dom";
import logo from '/logo.jpeg';

const Navbar = () => {
    return (
        <div>
            <div className="navbar relative p-3 md:p-5 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-gradient-to-r after:from-[#BF953F] after:via-[#FCF6BA] after:to-[#AA771C]"
            >
                <div className="flex-1">
                    <Link to='/'><img src={logo} className="w-20 ml-2 md:ml-0" /></Link>
                </div>
                <div className="flex-none">
                    <ul className="menu menu-horizontal px-1 text-md font-bold md:text-lg">
                        <li>
                            <div className="dropdown dropdown-end">
                                <div tabIndex={0}>Menu</div>
                                <ul tabIndex={-1} className="dropdown-content menu bg-black rounded-box z-1 w-52 p-2 shadow-sm">
                                    <li><Link to='/'>Home</Link></li>
                                    <li><Link to='/renewal'>Renew Membership</Link></li>
                                    <li><Link to='/about'>About Us</Link></li>
                                    <li className="text-white/80"><Link to='/admin/login'>Admin Login</Link></li>
                                </ul>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Navbar;