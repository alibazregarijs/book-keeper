import React from "react";
import Image from "next/image";
import "@/app/(root)/globals.css";
import { Button } from "../ui/button";

const Hero = () => {
  return (
    <div className="grid grid-flow-col">
      <div className="col-span-12 absolute top-0 -z-10">
        <div className="relative">
          <Image
            alt="background"
            width={1000}
            height={1000}
            quality={100}
            src="/background.jpg"
            className="w-screen h-screen brightness-[25%] object-cover"
          />
          <div className="flex absolute inset-0  items-center justify-center m-5 z-10">
            <div className="flex flex-col space-y-4 border p-6">
              <p className="text-white text-center">
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Reiciendis, sit vitae. Soluta voluptatibus ratione, quam eum
                sunt laboriosam adipisci laborum?
              </p>
              <div className="text-center">
             
                <Button variant={"secondary"}>Fantasy World of Book</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
