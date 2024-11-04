"use client";
import Footer from "./_components/footer";
import Heading from "./_components/heading";
import Hearos from "./_components/hearos";

export default function MarketingPage() {
  return (
    <div className="min-h-full flex flex-col">
      <div className="flex flex-col items-center justify-center md:justify-start text-center gap-y-8 flex-1 px-6 ">
        <Heading />
        <Hearos />
      </div>
      <Footer />
    </div>
  );
}
