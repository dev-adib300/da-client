import logo from '/logo.jpeg';

const Banner = () => {
    return (
        <div className="block md:flex items-center m-10 md:m-20">
            <div className="w-full md:w-2/3 mr-0 md:mr-20">
                <h1 className="text-3xl md:text-4xl text-white font-semibold mb-5">More Than a Social Club. We’re Family.</h1>
                <h1 className="text-2xl md:text-3xl text-white font-semibold mb-5">Fun. Family. Networking.</h1>
                <p className="text-lg">
                    At Da Web Social Club, our mission is to bring people together through unforgettable experiences, genuine connections, and a welcoming sense of community.

                    We’re more than just a place to socialize. We’re a family built on good vibes, great food, exciting entertainment, and meaningful relationships.

                    From themed parties and birthday celebrations to networking opportunities and special events, Da Web is where friendships grow, connections are made, and lasting memories are created.

                    Whether you’re here to celebrate, unwind, meet new people, or simply enjoy yourself, there’s always a place for you at Da Web.

                    Come for the fun. Stay for the family. Grow through the connections.

                    Become a Member. Become Part of the Family.</p>
            </div>
            <div className="w-full md:w-1/3 mt-5 md:mt-0">
                <img src={logo} />
            </div>
        </div>
    );
};

export default Banner;