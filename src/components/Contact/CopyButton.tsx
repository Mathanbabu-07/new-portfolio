import React, { useState, useRef } from 'react';
import { Copy, Check } from 'lucide-react';

interface CopyButtonProps {
  text: string;
  typeLabel: string;
  onCopied: (msg: string) => void;
}

export const CopyButton: React.FC<CopyButtonProps> = ({
  text,
  typeLabel,
  onCopied,
}) => {
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<number | null>(null);

  const handleCopy = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    let success = false;
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
        success = true;
      }
    } catch {
      success = false;
    }

    if (!success) {
      try {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.left = '-9999px';
        textarea.style.top = '-9999px';
        textarea.setAttribute('readonly', '');
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        success = true;
      } catch {
        success = false;
      }
    }

    if (success) {
      setCopied(true);
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = window.setTimeout(() => {
        setCopied(false);
      }, 1600);

      const msg = typeLabel.toLowerCase().includes('email')
        ? 'Email copied'
        : 'Phone number copied';
      onCopied(msg);
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={`Copy ${typeLabel.toLowerCase()}`}
      className="relative z-10 flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/60 transition-colors hover:border-white/25 hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3054ff]"
    >
      {copied ? (
        <Check className="h-4 w-4 text-[#b4c0ff] animate-in zoom-in-75 duration-200" />
      ) : (
        <Copy className="h-4 w-4 transition-transform hover:scale-110 duration-200" />
      )}
    </button>
  );
};
