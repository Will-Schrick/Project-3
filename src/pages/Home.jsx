import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import '/src/styles/main.css';

export default function Home() {
  return (
    <div className="relative">
      {/* ========== Top Navigation Bar ========== */}
      <header className="bg-white text-black py-4 shadow-md fixed top-0 w-full z-20">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-5">
          {/* Restaurant Name in Center with Oval */}
          <h1 className="text-5xl font-bold text-center flex-grow relative">
            <span className="inline-block px-10 py-4 border-2 border-black rounded-full">
              DeliciousBites & Coffee
            </span>
          </h1>

          {/* Spacer for Centering */}
          <div className="flex-grow"></div>

          {/* Navigation Links to the Right */}
          <nav className="space-x-10 text-lg flex justify-end">
            <Link to="/location" className="hover:text-orange-500 transition">
              Location
            </Link>
            <Link to="/menu" className="hover:text-orange-500 transition">
              Menu
            </Link>
            <Link to="/about" className="hover:text-orange-500 transition">
              About Us
            </Link>
          </nav>
        </div>
      </header>

      {/* Spacer to offset fixed header */}
      <div className="h-[180px]"></div>

      {/* ========== Two Videos Side-by-Side Under Nav Bar ========== */}
      <div className="grid grid-cols-2 gap-4 px-5 my-10">
        <video
          src="/src/assets/video-home-1.mp4"
          autoPlay
          loop
          muted
          className="w-full h-[600px] object-cover rounded-lg shadow-md"
        />
        <video
          src="/src/assets/video-home-2.mp4"
          autoPlay
          loop
          muted
          className="w-full h-[600px] object-cover rounded-lg shadow-md"
        />
      </div>
      <div className="h-[180px]"></div>
      {/* ========== Grid of Images (Top of Middle Section) ========== */}
      <div className="grid grid-cols-4 gap-4 px-5 my-10">
        <div className="relative">
          <img
            src="/src/assets/interior/interior1.jpg"
            alt="Location 1"
            className="w-full h-[450px] object-cover rounded-lg shadow-md"
          />
        </div>
        <div className="relative">
          <img
            src="/src/assets/interior/interior2.webp"
            alt="Location 2"
            className="w-full h-[450px] object-cover rounded-lg shadow-md"
          />
        </div>
        <div className="relative">
          <img
            src="/src/assets/interior/interior3.jpg"
            alt="Location 3"
            className="w-full h-[450px] object-cover rounded-lg shadow-md"
          />
        </div>
        <div className="relative">
          <img
            src="/src/assets/interior/terraza.jpg"
            alt="Location 4"
            className="w-full h-[450px] object-cover rounded-lg shadow-md"
          />
        </div>
      </div>

      {/* ========== Rounded Image with Description ========== */}
      <section className="text-center py-10 px-5 bg-white">
        <div className="max-w-5xl mx-auto grid grid-cols-2 gap-6 items-center">
          <img
            src="/src/assets/brunch.jpg"
            alt="Brunch"
            className="w-full h-[400px] object-cover rounded-full shadow-md"
          />
          <div>
            <h2 className="text-4xl font-bold mb-5">THE BRUNCH</h2>
            <p className="text-lg mb-5">
              A menu tailored to your needs for the very late with friends and
              family. Enjoy our specialties in a cozy atmosphere. Until 14:00,
              every day.
            </p>
            <Link
              to="/menu"
              className="bg-orange-500 text-white px-6 py-3 rounded hover:bg-orange-600 transition"
            >
              View Our Menu
            </Link>
          </div>
        </div>
      </section>

      {/* ========== Carousel at the Bottom (Shorter Height) ========== */}
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={0}
        slidesPerView={1}
        loop={true}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        style={{ height: '400px' }} // ✅ Shorter height for carousel
        className="my-10"
      >
        <SwiperSlide>
          <div
            className="h-full bg-cover bg-center"
            style={{
              backgroundImage: "url('/src/assets/carousel/restaurant2.avif')",
            }}
          ></div>
        </SwiperSlide>
        <SwiperSlide>
          <div
            className="h-full bg-cover bg-center"
            style={{
              backgroundImage: "url('/src/assets/carousel/restaurant1.webp')",
            }}
          ></div>
        </SwiperSlide>
        <SwiperSlide>
          <div
            className="h-full bg-cover bg-center"
            style={{
              backgroundImage: "url('/src/assets/carousel/restaurant3.jpg')",
            }}
          ></div>
        </SwiperSlide>
        <SwiperSlide>
          <div
            className="h-full bg-cover bg-center"
            style={{
              backgroundImage: "url('/src/assets/carousel/french toast.avif')",
            }}
          ></div>
        </SwiperSlide>
      </Swiper>
    </div>
  );
}
