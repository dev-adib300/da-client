import { Link } from "react-router-dom";


const Footer = () => {
    return (
        <div>
            <footer className="footer sm:footer-horizontal footer-center text-lg p-4 md:p-10">
                <aside>
                    <p>Copyright © {new Date().getFullYear()} - All right reserved</p>
                </aside>
            </footer>
        </div>
    );
};

export default Footer;