
import logo from '/logo.jpeg';

const Banner = () => {
    return (
        <div className="block md:flex items-center m-10 md:m-20">
            <div className="w-full md:w-2/3 mr-0 md:mr-20">
                <h1 className="text-3xl md:text-4xl text-white font-semibold mb-5">Your local social club. Match nights, food, good people.</h1>
                <p className="text-lg">More than a social club, it's a community built around unforgettable experiences, exciting events, great food, and extraordinary connections. From match nights and themed parties to birthday celebrations, there's always something happening at DA WEB SOCIAL CLUB. Become a Member. Be Part of Something Special.</p>
            </div>
            <div className="w-full md:w-1/3 mt-5 md:mt-0">
                <img src={logo} />
            </div>
        </div>
    );
};

export default Banner;