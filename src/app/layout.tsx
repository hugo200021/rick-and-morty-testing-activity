import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Rick and Morty Explorer",
  description: "Explore the Rick and Morty universe",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-900 text-white min-h-screen flex flex-col`}
      >
        <header className="bg-gray-800 border-b border-gray-700 sticky top-0 z-50 shadow-md">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <Link href="/" className="text-2xl font-bold text-orange-500 hover:text-orange-400 transition-colors flex items-center gap-2">
              🧪 Rick & Morty App
            </Link>
            <nav>
              <ul className="flex space-x-6">
                <li>
                  <Link href="/" className="hover:text-orange-400 transition-colors font-medium">
                    Characters
                  </Link>
                </li>
                <li>
                  <a href="https://rickandmortyapi.com/documentation" target="_blank" rel="noopener noreferrer" className="hover:text-orange-400 transition-colors font-medium">
                    API Docs
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        </header>

        <main className="flex-grow">
          {children}
        </main>

        <footer className="bg-gray-950 border-t border-gray-800 py-8 mt-12">
          <div className="container mx-auto px-4 text-center text-gray-500">
            <p className="mb-2">Developed with Next.js, Tailwind CSS & ❤️</p>
            <p className="text-sm">
              Data provided by <a href="https://rickandmortyapi.com" className="text-orange-500 hover:underline" target="_blank" rel="noopener noreferrer">The Rick and Morty API</a>
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
