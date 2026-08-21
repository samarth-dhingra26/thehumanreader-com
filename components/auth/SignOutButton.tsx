"use client";

import { useRouter } from "next/navigation";
import { signOut } from "aws-amplify/auth";
import "../../lib/amplify/client";
import Button from "../ui/Button";

export default function SignOutButton() {
  const router = useRouter();

  async function handleClick() {
    await signOut();
    router.push("/");
  }

  return (
    <Button variant="secondary" onClick={handleClick}>
      Log out
    </Button>
  );
}
