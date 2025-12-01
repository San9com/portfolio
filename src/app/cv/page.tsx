import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "cv",
};

export default function CVPage() {
  return (
    <div className="fixed inset-0 bg-black">
      <iframe
        src="/cv - alexander murashka@2x.pdf"
        className="h-full w-full"
        title="Alexander Murashka CV"
      />
    </div>
  );
}

