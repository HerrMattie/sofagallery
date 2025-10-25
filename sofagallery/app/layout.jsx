import './globals.css';
export const metadata = {
  title: 'SofaGallery',
  description: 'Digitale museumtours vanuit je bank.'
};

export default function RootLayout({ children }) {
  return (
    <html lang="nl">
      <body style={{ fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial' }}>
        {children}
      </body>
    </html>
  );
}
