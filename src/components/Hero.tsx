import { CVE_ID, fetchCve } from "@/lib/ubuntu";
import SignupForm from "./SignupForm";

export default async function Hero() {
  const cve = await fetchCve();
  const noble = cve.ok ? cve.flavors.find((f) => f.id === "noble-linux") : undefined;

  return (
    <section className="mx-auto w-full max-w-5xl px-6 pt-16 sm:pt-24">
      <h1 className="display max-w-4xl">
        Get an email the minute ubuntu.com flips your CVE from &ldquo;needed&rdquo; to
        &ldquo;released&rdquo; for linux-generic on 24.04.
      </h1>
      <p className="mt-6 max-w-3xl text-muted">
        For the sysadmin running 10 to 200 Ubuntu LTS boxes without Pro, who set the sysctl
        by hand last week and is now waiting on Canonical with no ETA.
      </p>

      <p className="mt-10 max-w-3xl font-semibold text-ink-strong">
        {cve.ok && noble ? (
          <>
            {cve.id}
            {cve.cvss3 !== null ? ` (CVSS ${cve.cvss3})` : ""} has been public for{" "}
            {cve.daysOpen} days with{" "}
            {cve.usnIds.length === 0 ? "no USN" : `${cve.usnIds.join(", ")} published`} for
            linux-generic on 24.04. Tracker status: {noble.status}
            {noble.version ? `, ${noble.version}` : ""}.
          </>
        ) : (
          <>
            Could not load {CVE_ID} from ubuntu.com:{" "}
            {cve.ok ? "flavor row missing" : cve.error}
          </>
        )}
      </p>

      <SignupForm cveId={CVE_ID} flavors={cve.ok ? cve.flavors : null} />
    </section>
  );
}
