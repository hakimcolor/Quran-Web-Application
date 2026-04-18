import './globals.css';
import Navbar from '@/components/Navbar';

export const metadata = {
  title: 'Quran App',
  description: 'Read the Holy Quran online',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 min-h-screen">
        <Navbar />
        <main className="max-w-4xl mx-auto px-4 py-6">{children}</main>
      </body>
    </html>
  );
}
