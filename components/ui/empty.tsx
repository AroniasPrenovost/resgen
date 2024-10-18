import Image from "next/image";

interface EmptyProps {
  label?: string;
}

export const Empty = ({ label }: EmptyProps) => {
  const hasLabel = !!label;

  return (
    <div className="h-full p-4 flex flex-col items-center justify-center">
      <div className="relative h-72 w-72">
        <Image fill alt="Logo" src="/transcript.png" />
      </div>

      <p className="text-muted-foreground text-sm text-center">
        {hasLabel ? (
          label
        ) : (
          <>
            <b>NOTICE</b>
            <br />

              We do not collect your personal data.

            <br />
            <span className="flex items-center justify-center" style={{marginTop: "-6px"}}>
              Payments processed with
              <Image
                width={34}
                height={34}
                alt="Stripe logo"
                src="/stripe-logo.png"
                className="inline-block ml-1"
                style={{
                  marginTop: "2px",
                }}
              />.
            </span>
          </>
        )}
      </p>
    </div>
  );
};
