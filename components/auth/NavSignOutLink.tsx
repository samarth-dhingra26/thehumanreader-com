"use client";

import { useRouter } from "next/navigation";
import { signOut } from "aws-amplify/auth";
import "../../lib/amplify/client";

export default function NavSignOutLink() {
  const router = useRouter();

  async function handleClick() {
    await signOut();
    router.push("/");
  }

  return (
    <a href="#" onClick={(e) => { e.preventDefault(); handleClick(); }}>
      Log out
    </a>
  );
}
