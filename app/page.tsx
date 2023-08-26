import Image from 'next/image'
import TowingCalculator from './calculator'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex mb-24">
        <div className="fixed bottom-0 left-0 flex h-48 w-full items-end justify-center bg-gradient-to-t from-white via-white dark:from-black dark:via-black lg:static lg:h-auto lg:w-auto lg:bg-none">
          <Image
            src="/vehicles/will-it-tow.svg"
            alt="Vercel Logo"
            className="dark:invert"
            width={100}
            height={24}
            priority
          />
          <h1 className="text-6xl font-bold font-sans mb-4 px-8">Will It Tow</h1>
        </div>
      </div>
      <TowingCalculator />
    </main>
  );
}
