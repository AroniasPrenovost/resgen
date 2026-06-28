"use client";

import { IconCheck, IconX, IconLock } from "./icons";

/**
 * Checkout panel — restates the honest-math framing at the exact moment the
 * card comes out. The "what you don't pay for" list kills the subscription-trap
 * objection right at payment. `onUnlock` wires to the existing checkout
 * (a redirect to the Stripe payment link).
 */
export function CheckoutPanel({
  onUnlock,
  disabled = false,
}: {
  onUnlock: () => void;
  disabled?: boolean;
}) {
  return (
    <div className="gen-checkout">
      <div className="co-price">
        <span className="big">$9.99</span>
        <span className="unit">once</span>
      </div>
      <div className="co-strike">vs. $337/year if you forget to cancel the others</div>

      <ul className="co-list">
        <li>
          <IconCheck />
          <span>
            <b>30 generations</b>, unlimited downloads
          </span>
        </li>
        <li>
          <IconCheck />
          <span>
            Editable <b>Word &amp; Google Docs</b> files
          </span>
        </li>
        <li>
          <IconCheck />
          <span>
            Matching <b>cover letter</b> included
          </span>
        </li>
        <li>
          <IconCheck />
          <span>30 days of access</span>
        </li>
      </ul>

      <button
        type="button"
        className="gen-btn-primary"
        style={{ fontSize: 15, padding: 15 }}
        onClick={onUnlock}
        disabled={disabled}
      >
        <IconLock />
        Unlock &amp; download · $9.99
      </button>

      <div className="co-divider" />
      <div className="co-nopay">What you don&apos;t pay for</div>
      <ul className="co-nolist">
        <li>
          <IconX /> Monthly subscription
        </li>
        <li>
          <IconX /> A &ldquo;trial&rdquo; that auto-bills
        </li>
        <li>
          <IconX /> A card kept on file
        </li>
      </ul>
      <div className="co-secure">
        <IconLock /> Stripe secured
      </div>
    </div>
  );
}
