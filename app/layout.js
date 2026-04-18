import './globals.css';
import Navbar from '@/components/Navbar';

export const metadata = {
  title: 'Quran App',
  description: 'Read the Holy Quran online',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased" suppressHydrationWarning>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
