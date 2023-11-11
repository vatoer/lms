import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function Home() {
  return (
    <div>
      <p className="text-3xl font-medium text-sky-700 ">hello</p>
      <Button variant={"destructive"} type="submit">
        click me
      </Button>
    </div>
  );
}
