import Link from "next/link";
import { contact, profile } from "@/data/site";

export function Footer() {
  return (
    <footer id="contact" className="pb-16 pt-24">
      <div className="flex w-full flex-col gap-10 px-6 py-12 sm:px-12 lg:px-16">
        <div className="flex flex-col gap-2 text-sm text-muted sm:text-base">
          <span>{profile.name}</span>
          <span>{profile.title}</span>
        </div>

        <div className="flex flex-col gap-4 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            {contact.socials.map((social) => (
              <Link
                key={social.label}
                href={social.href}
                className="rounded bg-white/10 px-4 py-2 text-foreground/80 transition-colors hover:bg-white/20 hover:text-foreground"
                target={social.href.startsWith("http") ? "_blank" : undefined}
                rel={social.href.startsWith("http") ? "noopener noreferrer" : undefined}
              >
                {social.label}
              </Link>
            ))}
          </div>
          <Link
            href={`mailto:${contact.email}`}
            className="text-sm text-foreground transition-colors hover:text-accent"
          >
            {contact.email}
          </Link>
        </div>

        <div className="flex items-center justify-between text-xs text-muted">
          <span>2025</span>
          <span>{contact.location}</span>
        </div>
      </div>
    </footer>
  );
}

