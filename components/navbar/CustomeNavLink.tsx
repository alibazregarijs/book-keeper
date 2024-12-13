"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import clsx from "clsx";
import { Button } from "../ui/button";

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

export const NavLink = ({ href, children, className }: NavLinkProps) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link href={href}>
      <Button
        className={clsx(
          className,
          isActive && "bg-white text-black hover:bg-white"
        )}
      >
        {children}
      </Button>
    </Link>
  );
};
