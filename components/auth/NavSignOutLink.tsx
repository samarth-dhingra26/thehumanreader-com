"use client";

import { useRouter } from "next/navigation";
import { signOut } from "aws-amplify/auth";
import "../../lib/amplify/client";

export default function NavSignOutLink({ className }: { className?: string }) {
  const router = useRouter();

  async function handleClick() {
    await signOut();
    router.push("/");
  }

  return (
    <a
      href="#"
      className={className}
      onClick={(e) => {
        e.preventDefault();
        handleClick();
      }}
    >
      Log out
    </a>
  );
}
