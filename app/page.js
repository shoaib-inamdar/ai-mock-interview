import { Button } from "@/components/ui/button";
import { UserButton } from "@stackframe/stack";
import Image from "next/image";

export default function Home() {
  return (
     <div>
      <h2>Getting start a new project</h2>
      <Button>Subscribe</Button>
      <UserButton/>
     </div>
  );
}
