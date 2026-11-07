const SOURCES = [
  "Ubuntu CVE Tracker",
  "Ubuntu Security Notices",
  "Launchpad",
  "oss-security",
  "NVD",
  "Hacker News",
];

export default function LogoStrip() {
  return (
    <section className="mx-auto mt-20 w-full max-w-5xl px-6 sm:mt-28">
      <p className="text-center text-muted">Polled from the feeds you already read by hand</p>
      <ul className="mt-6 flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
        {SOURCES.map((name) => (
          <li key={name} className="font-bold uppercase tracking-wide text-ink-strong/60">
            {name}
          </li>
        ))}
      </ul>
    </section>
  );
}
