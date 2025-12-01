import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "cv",
};

export default function CVPage() {
  // URL encode the PDF path to handle spaces and special characters
  const pdfPath = encodeURI("/cv - alexander murashka@2x.pdf");
  
  return (
    <div className="fixed inset-0 bg-black">
      <iframe
        src={pdfPath}
        className="h-full w-full"
        title="Alexander Murashka CV"
      />
    </div>
  );
}

