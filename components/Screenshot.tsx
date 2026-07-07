import Image from "next/image";

// Renders a mobile screenshot inside a tasteful device frame. Used to drop the
// real QuoteSmart / Bolt product screenshots into feature rows and heroes.

export default function PhoneShot({
  src,
  alt,
  width = 900,
  height = 1860,
  className = "",
}: {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
}) {
  return (
    <div className={`relative mx-auto w-full max-w-[300px] ${className}`}>
      {/* soft brand glow behind the device */}
      <div
        aria-hidden
        className="absolute -inset-6 -z-10 rounded-[3rem] bg-[radial-gradient(closest-side,rgba(107,63,208,0.18),transparent)]"
      />
      <div className="overflow-hidden rounded-[2.25rem] border-[7px] border-ink/90 bg-ink shadow-[0_30px_60px_-20px_rgba(20,16,25,0.4)]">
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          className="h-auto w-full"
        />
      </div>
    </div>
  );
}
