import Image from "next/image";

type CaseImageProps = {
  image: string;
  alt: string;
};

export function CaseImage({ image, alt }: CaseImageProps) {
  return (
    <div className="relative w-full bg-[#0a0a0a]">
      <div className="relative mx-auto w-full" style={{ maxWidth: "min(100%, 1400px)" }}>
        <Image
          src={image}
          alt={alt}
          width={1400}
          height={1400}
          quality={95}
          className="h-auto w-full object-contain"
          style={{ 
            maxWidth: "100%", 
            height: "auto",
            display: "block"
          }}
          sizes="(max-width: 768px) 100vw, (max-width: 1400px) 100vw, 1400px"
        />
      </div>
    </div>
  );
}

