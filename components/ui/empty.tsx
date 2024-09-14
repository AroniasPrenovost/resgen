import Image from "next/image";


interface EmptyProps {
  label: string;
}

export const Empty = ({
  label
}: EmptyProps) => {
  return (
    <div className="h-full p-4 flex flex-col items-center justify-center">
      <div className="relative h-72 w-72">
        {/*<Image src="/empty.png" fill alt="Empty" />*/}
            <Image fill alt="Logo" src="/transcript.png" />
      </div>

   {/*             <div className="relative h-8 w-8 mr-4">
            <Image fill alt="Logo" src="/transcript.png" />
          </div>*/}
      <p className="text-muted-foreground text-sm text-center">
        {label}<br/>
        All information is saved in your local browser session only.
      </p>
    </div>
  );
};
