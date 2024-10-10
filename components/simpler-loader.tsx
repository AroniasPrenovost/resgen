import Image from "next/image"

export const SimplerLoader = () => {
  return (
    <div className="h-full flex flex-row items-center justify-center w-full">
      <div className="w-10 h-10 relative animate-spin">
        <Image
          alt="Logo"
          src="/transcript.png"
          fill
        />
      </div>
      <p className="text-sm text-muted-foreground pl-2" style={{
        // color: 'rgb(87, 101, 116)',
      }}>
        Importing your resume...
      </p>
    </div>
  );
};
