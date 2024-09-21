import Image from "next/image";

interface EmptyProps {
  label?: string;
}

export const Empty = ({ label }: EmptyProps) => {
  const hasLabel = !!label;

  return (
    <div className="h-full p-4 flex flex-col items-center justify-center">
      <div className="relative h-72 w-72">
        {/* <Image src="/empty.png" fill alt="Empty" /> */}
        <Image fill alt="Logo" src="/transcript.png" />
      </div>

      <p className="text-muted-foreground text-sm text-center">
        {hasLabel ? (
          label
        ) : (
          <>
            <b>NOTICE:</b> We use Stripe to process payments and do not collect your personal data.
            <br/>
            Please use our chat support for any questions.
          </>
        )}
      </p>
    </div>
  );
};
