const LINKS = [
  { label: "Privacy", href: "#" },
  { label: "Terms", href: "#" },
  { label: "Contact", href: "mailto:hello@example.com" },
  { label: "GitHub", href: "https://github.com" },
  { label: "X", href: "https://x.com" },
];

export default function Footer() {
  return (
    <footer className="mx-auto mt-20 w-full max-w-5xl px-6 pb-12 sm:mt-28">
      <nav aria-label="Footer">
        <ul className="flex flex-wrap justify-center gap-x-8 gap-y-2">
          {LINKS.map((l) => (
            <li key={l.label}>
              <a
                href={l.href}
                className="cursor-pointer text-muted transition-colors duration-150 hover:text-ink-strong focus:outline-none focus-visible:underline"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </footer>
  );
}
