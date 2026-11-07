export const CVE_ID = "CVE-2026-98432";
export const CVE_URL = `https://ubuntu.com/security/cves/${CVE_ID}.json`;

export const FLAVORS = [
  { id: "noble-linux", label: "24.04 linux-generic", pkg: "linux", codename: "noble" },
  { id: "jammy-linux", label: "22.04 linux-generic", pkg: "linux", codename: "jammy" },
  { id: "resolute-linux", label: "26.04 linux-generic", pkg: "linux", codename: "resolute" },
  { id: "jammy-hwe", label: "22.04 linux-hwe-6.8", pkg: "linux-hwe-6.8", codename: "jammy" },
  { id: "noble-hwe", label: "24.04 linux-hwe-7.0", pkg: "linux-hwe-7.0", codename: "noble" },
  { id: "noble-aws", label: "24.04 linux-aws", pkg: "linux-aws", codename: "noble" },
  { id: "noble-azure", label: "24.04 linux-azure", pkg: "linux-azure", codename: "noble" },
  { id: "noble-gcp", label: "24.04 linux-gcp", pkg: "linux-gcp", codename: "noble" },
] as const;

export type FlavorId = (typeof FLAVORS)[number]["id"];

export type FlavorStatus = {
  id: FlavorId;
  label: string;
  status: string;
  version: string;
};

export type CveSnapshot =
  | {
      ok: true;
      id: string;
      cvss3: number | null;
      published: string;
      daysOpen: number;
      usnIds: string[];
      flavors: FlavorStatus[];
    }
  | { ok: false; error: string };

type UbuntuCveJson = {
  id: string;
  cvss3: number | null;
  published: string;
  notices_ids: string[];
  packages: {
    name: string;
    statuses: { release_codename: string; status: string; description: string }[];
  }[];
};

export async function fetchCve(): Promise<CveSnapshot> {
  let res: Response;
  try {
    res = await fetch(CVE_URL, { next: { revalidate: 600 } });
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : String(e) };
  }
  if (!res.ok) {
    return { ok: false, error: `HTTP ${res.status} from ${CVE_URL}` };
  }
  const data = (await res.json()) as UbuntuCveJson;

  const flavors: FlavorStatus[] = FLAVORS.map((f) => {
    const pkg = data.packages.find((p) => p.name === f.pkg);
    const row = pkg?.statuses.find((s) => s.release_codename === f.codename);
    return {
      id: f.id,
      label: f.label,
      status: row?.status ?? "not listed",
      version: row?.description ?? "",
    };
  });

  const publishedMs = Date.parse(data.published);
  const daysOpen = Math.floor((Date.now() - publishedMs) / 86_400_000);

  return {
    ok: true,
    id: data.id,
    cvss3: data.cvss3,
    published: data.published.slice(0, 10),
    daysOpen,
    usnIds: data.notices_ids,
    flavors,
  };
}
