import React from "react";
import Image from "next/image";
import "@/app/(root)/globals.css";
import { Button } from "../ui/button";
import { Navbar } from "@/components/navbar/Navbar";

const Hero = async({query}:{query?:string}) => {

  return (
    <div className="relative w-full h-screen">
      {/* Background Image */}
      <Image
        alt="background"
        width={1000}
        height={1000}
        quality={100}
        src="/background.jpg"
        className="absolute inset-0 w-full h-full brightness-[25%] object-cover -z-10"
      />

      {/* Navbar Positioned Over the Hero */}
      <div className="absolute top-0 left-0 w-full z-10">
        <Navbar query={query} />
      </div>

      {/* Hero Content */}
      <div className="flex items-center justify-center h-full">
        <div className="flex flex-col space-y-4 border p-6">
          <p className="text-white text-center">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Reiciendis, sit vitae. Soluta voluptatibus ratione, quam eum sunt laboriosam adipisci laborum?
          </p>
          <div className="text-center">
            <Button variant={"secondary"}>Fantasy World of Book</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
