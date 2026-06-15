import { Poppins } from 'next/font/google';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
});

export default function Home() {
  return (
    <main className={poppins.className}>
      <h1>Spybee - Maps Incidencias</h1>
      <p>Despues del Login</p>
    </main>
  );
}