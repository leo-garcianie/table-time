import { Link } from "react-router";

const Home = () => {
  return (
    <div className="min-h-full w-full flex flex-col items-center justify-center">
      <header className="flex flex-col text-center mt-12 text-dark items-center z-99">
        <p className="text-xs font-semibold py-0.5 px-3 bg-gray-100 rounded-full justify-self-center">
          TableTime
        </p>
        <h3 className="font-semibold text-5xl md:text-6xl lg:text-7xl">Your Perfect Table</h3>
        <h3 className="font-semibold text-5xl md:text-6xl lg:text-7xl">
          Every <span className="text-primary">Time</span>, Right on{" "}
          <span className="text-primary">Time</span>
        </h3>
        <p className="mt-5 text-base md:text-lg text-gray-500">
          Because every meal deserves the right setting, TableTime helps you
          <br />
          find, book, and secure your table with ease and confidence
        </p>
        <div className="flex gap-2 mt-8">
          <Link to="/login" className="btn-primary">
            Get Started
          </Link>
          <Link to="/reservations" className="btn-secondary">
            New Reservation
          </Link>
        </div>
      </header>
      <div className="hidden md:flex flex-col md:flex-row gap-5 mt-12 z-999">
        <img src="/img1.svg" alt="Landing Img1" className="size-52 lg:size-60 border-4 border-gray-100 rounded-4xl" />
        <img src="/img2.svg" alt="Landing Img2" className="size-52 lg:size-60 border-4 border-gray-100 rounded-4xl" />
        <img src="/img3.svg" alt="Landing Img3" className="size-52 lg:size-60 border-4 border-gray-100 rounded-4xl" />
      </div>
    </div>
  );
};
export default Home;
