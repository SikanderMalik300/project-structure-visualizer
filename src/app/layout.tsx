import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Project Structure Visualizer',
  description: 'Visualize and compare your project structures over time',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}