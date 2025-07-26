import Link from "next/link";
import Image from "next/image";

const images = [
  "/gallery1.jpg",
  "/gallery2.jpg",
  "/gallery3.jpg",
  "/gallery4.jpg",
  "/gallery5.jpg",
];

export default function Home() {
  return (
     <main className="min-h-screen bg-gray-50 text-gray-800">
      {/* Hero Section */}
      <section className="bg-blue-900 text-white py-20 px-6 text-center" style={{ backgroundImage: "url('/hero.jpg')" }}>
        <h1 className="text-4xl md:text-6xl font-bold mb-4">
          TUPAD Profiling and Verification System
        </h1>
        <p className="text-lg md:text-2xl mb-6 max-w-3xl mx-auto">
          A digital solution to manage and verify TUPAD beneficiaries with efficiency, accuracy, and transparency.
        </p>
        <div className="space-x-4">
          <Link href="/pages/login">
            <button className="bg-white text-blue-900 px-6 py-2 rounded-lg font-semibold">Login</button>
          </Link>
          <Link href="/pages/signup">
            <button className="bg-blue-600 px-6 py-2 rounded-lg font-semibold hover:bg-blue-500">Sign Up</button>
          </Link>
        </div>
      </section>

      {/* Explanation Section */}
      <section className="py-16 px-6 max-w-5xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-6">What is TUPAD?</h2>
        <p className="mb-6 text-lg">
          TUPAD, or Tulong Panghanapbuhay sa Ating Disadvantaged/Displaced Workers, is a community-based package of assistance
          that provides emergency employment for displaced workers, underemployed, and seasonal workers.
        </p>
        <h2 className="text-3xl font-bold mb-6">What is the TUPAD Profiling and Verification System?</h2>
        <p className="text-lg">
          The system is designed to streamline the profiling, validation, and verification of TUPAD beneficiaries,
          ensuring that only qualified individuals receive government assistance, while maintaining transparency and accountability.
        </p>
      </section>

      {/* Gallery Section */}
      <section className="py-16 bg-gray-100 px-6">
        <h2 className="text-3xl font-bold text-center mb-10">Gallery</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {images.map((src, index) => (
            <div key={index} className="bg-white shadow-lg rounded-lg overflow-hidden">
              <Image src={src} alt={`Gallery ${index + 1}`} width={500} height={300} className="object-cover w-full h-60" />
            </div>
          ))}
        </div>
      </section>

      <footer className="bg-gray-900 text-white py-10 mt-16">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Column 1: Branding */}
          <div>
            <h2 className="text-lg font-bold mb-2">TUPAD System</h2>
            <p className="text-sm">Profiling and Verification System</p>
            <small className="text-sm">Develop by: John Oliver G. Virola</small>
          </div>

          {/* Column 2: Account */}
          <div>
            <h3 className="font-semibold mb-2">Account</h3>
            <ul className="space-y-1 text-sm">
              <li><a href="/pages/login" className="hover:underline">Login</a></li>
              <li><a href="/pages/signup" className="hover:underline">Signup</a></li>
            </ul>
          </div>

          {/* Column 3: Search Info */}
          <div>
            <h3 className="font-semibold mb-2">TUPAD Info</h3>
            <ul className="space-y-1 text-sm">
              <li><a href="/search?q=what+is+tupad" className="hover:underline">What is TUPAD?</a></li>
              <li><a href="/search?q=how+to+avail+tupad" className="hover:underline">How to avail</a></li>
              <li><a href="/search?q=qualified+to+avail+tupad" className="hover:underline">Qualified to avail</a></li>
              <li><a href="/search?q=not+qualified+in+tupad" className="hover:underline">Not qualified</a></li>
            </ul>
          </div>

          {/* Column 4: Contact */}
          <div >
            <h3 className="font-semibold mb-2">Contact</h3>
            <ul className="space-y-1 text-sm">
              <li><a href="mailto:tupad.support@email.com" className="hover:underline">📧 tupad.support@email.com</a></li>
              <li><a href="https://facebook.com/tupadprogram" target="_blank" className="hover:underline">📘 facebook.com/tupadprogram</a></li>
            </ul>
          </div>
        </div>

        <div className="text-center text-xs text-gray-400 mt-10">
          © {new Date().getFullYear()} TUPAD Profiling and Verification System. All rights reserved.
        </div>
      </footer>

    </main>
  );
}
