import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
//import '/src/styles/main.css';
import Navbar from '../components/Navbar';

function Home() {
  return (
    <div className="relative">
      <Navbar />

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
        {[
          'interior1.jpg',
          'interior2.webp',
          'interior3.jpg',
          'terraza.jpg',
        ].map((img, idx) => (
          <div className="relative" key={idx}>
            <img
              src={`/src/assets/interior/${img}`}
              alt={`Location ${idx + 1}`}
              className="w-full h-[450px] object-cover rounded-lg shadow-md"
            />
          </div>
        ))}
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
        style={{ height: '400px' }}
        className="my-10"
      >
        {[
          'restaurant2.avif',
          'restaurant1.webp',
          'restaurant3.jpg',
          'french toast.avif',
        ].map((bg, idx) => (
          <SwiperSlide key={idx}>
            <div
              className="h-full bg-cover bg-center"
              style={{
                backgroundImage: `url('/src/assets/carousel/${bg}')`,
              }}
            ></div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

export default Home;
