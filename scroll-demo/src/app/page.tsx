import { Navbar } from "@/components/ui/Navbar";
import { MyAnimationSection } from "@/components/sections/MyAnimationSection";
import { SystemsNominal } from "@/components/sections/SystemsNominal";
import { Footer } from "@/components/sections/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <MyAnimationSection />
        <SystemsNominal />
      </main>
      <Footer />
    </>
  );
}
