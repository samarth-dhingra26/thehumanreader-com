"use client";

import { signOut } from "aws-amplify/auth";
import "../../lib/amplify/client";

export default function NavSignOutLink({ className }: { className?: string }) {
  async function handleClick() {
    await signOut();
    window.location.href = "/";
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
