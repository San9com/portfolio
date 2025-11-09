import Link from "next/link";
import { contact, heroCopy, profile } from "@/data/site";

export function Footer() {
  return (
    <footer id="contact" className="border-t border-white/10 bg-[#050505] px-3 py-20 sm:px-12 sm:py-28">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-16">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between sm:gap-16">
          <div className="flex flex-col gap-3 text-foreground/80">
            <span>{profile.name}</span>
            <span className="text-foreground/60">{profile.title}</span>
          </div>

          <div className="flex flex-col gap-6 sm:flex-row sm:gap-14">
            <div className="flex flex-col gap-3 text-foreground/60">
              <span className="text-foreground/80">Connect</span>
              <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
                {contact.socials.map((social) => (
                  <Link
                    key={social.label}
                    href={social.href}
                    className="text-foreground/70 transition-colors hover:text-foreground"
                    target={social.href.startsWith("http") ? "_blank" : undefined}
                    rel={social.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  >
                    {social.label}
                  </Link>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-3 text-foreground/60">
              <span className="text-foreground/80">Write</span>
              <Link
                href={`mailto:${contact.email}`}
                className="text-foreground/70 transition-colors hover:text-foreground"
              >
                {contact.email}
              </Link>
            </div>
          </div>
        </div>

        <div className="h-px w-full bg-white/12" />

        <div className="flex flex-col gap-4 text-foreground/70 sm:flex-row sm:items-end sm:justify-between">
          <p className="max-w-3xl text-foreground/80">{heroCopy.description}</p>
          <span className="text-foreground/60">{contact.location.toUpperCase()}</span>
        </div>

        <div className="h-px w-full bg-white/12" />

        <div className="flex flex-col gap-3 text-foreground/50 sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} {profile.name}</span>
          <span>All rights reserved.</span>
        </div>
      </div>
    </footer>
  );
}

