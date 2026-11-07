import DemoPlayer from "@/components/DemoPlayer";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import LogoStrip from "@/components/LogoStrip";

export default function Home() {
  return (
    <main>
      <Hero />
      <section className="mx-auto mt-14 w-full max-w-5xl px-6 sm:mt-20">
        <DemoPlayer />
      </section>
      <LogoStrip />
      <Footer />
    </main>
  );
}
