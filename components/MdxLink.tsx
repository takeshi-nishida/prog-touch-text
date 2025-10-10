"use client";
import Link from "next/link";

type MdxLinkProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  href?: string;
  children?: React.ReactNode;
};

export function MdxLink({ href, children, ...props }: MdxLinkProps) {
  const isExternal = /^https?:\/\//.test(href || '');

  if (isExternal) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        {...props}
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={href || "#"} {...props}>
      {children}
    </Link>
  );
}