// import { About } from "@/components/About";
import { AboutSplit } from "@/components/about/Variants";
// import { AboutBento, AboutStatement } from "@/components/about/Variants";
import { Contact } from "@/components/Contact";
import { Experience } from "@/components/Experience";
import { Hero } from "@/components/Hero";
import { Nav } from "@/components/Nav";
import { Stack } from "@/components/Stack";
import { Testimonials } from "@/components/Testimonials";
import { Work } from "@/components/Work";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        {/* Try one About at a time — uncomment the one to show:
        <About />
        <AboutBento />
        <AboutStatement /> */}
        <AboutSplit />
        <Experience />
        <Work />
        <Stack />
        <Testimonials />
        <Contact />
      </main>
    </>
  );
}
