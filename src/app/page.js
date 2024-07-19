import BlogList from '../components/BlogList';
import Link from 'next/link';

export default function Home() {
  return (
    <div>
      <header className="relative h-64 bg-cover bg-center" style={{ backgroundImage: 'url("/path-to-your-image.jpg")' }}>
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-white">
          <h1 className="text-4xl font-bold">Investor Daily Dubai</h1>
          <p className="text-xl">A blog sharing the daily updates in Dubai Real Estate and investment markets.</p>
          <div className="mt-4 flex space-x-4">
            <Link href="/create-blog">
              <button className="flex items-center bg-white text-black px-4 py-2 rounded-full border-2 hover:border-purple-500 hover:bg-custom-purple hover:text-white transition duration-300">
                <span>Create new blog</span>
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
                </svg>
              </button>
            </Link>
            <button className="bg-white text-black px-4 py-2 rounded-full border-2 border-gray-300 hover:bg-gray-300 hover:text-white transition duration-300">
              Manage Subscribers
            </button>
          </div>
        </div>
      </header>
      <main className="container mx-auto p-4">
        <BlogList />
      </main>
    </div>
  );
}
