import './globals.css';
import Navbar from '@/components/Navbar';

export const metadata = {
  title: 'Quran App',
  description: 'Read and listen to the Holy Quran online',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="bg-gray-50 dark:bg-slate-900 text-slate-900 dark:text-slate-50 min-h-screen antialiased">
        <Navbar />
        <main className="max-w-4xl mx-auto px-4 py-8">{children}</main>
      </body>
    </html>
  );
}
