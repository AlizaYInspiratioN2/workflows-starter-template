import { useMemo, useState } from "react";

type VehicleRecord = {
  id: string;
  make: string;
  model: string;
  yearStart: number;
  yearEnd: number;
  engine?: string;
  region: string;
};

type Fitment = {
  vehicleId: string;
  notes: string;
};

type PartRecord = {
  id: string;
  partNumber: string;
  title: string;
  brand: string;
  category: string;
  description: string;
  source: string;
  image: string;
  fitments: Fitment[];
};

const vehicles: VehicleRecord[] = [
  {
    id: "vw-golf-vii-2013-2020-14-tsi",
    make: "Volkswagen",
    model: "Golf VII",
    yearStart: 2013,
    yearEnd: 2020,
    engine: "1.4 TSI",
    region: "EU",
  },
  {
    id: "vw-golf-vii-2013-2020-18-tsi",
    make: "Volkswagen",
    model: "Golf VII",
    yearStart: 2013,
    yearEnd: 2020,
    engine: "1.8 TSI",
    region: "EU",
  },
  {
    id: "audi-a3-8v-2013-2020-20-tsi",
    make: "Audi",
    model: "A3 8V",
    yearStart: 2013,
    yearEnd: 2020,
    engine: "2.0 TSI",
    region: "EU",
  },
  {
    id: "bmw-3-series-g20-2019-2025-20i",
    make: "BMW",
    model: "3 Series G20",
    yearStart: 2019,
    yearEnd: 2025,
    engine: "2.0 20i",
    region: "EU",
  },
  {
    id: "mercedes-c-class-w205-2014-2021-200d",
    make: "Mercedes-Benz",
    model: "C-Class W205",
    yearStart: 2014,
    yearEnd: 2021,
    engine: "2.0 200d",
    region: "EU",
  },
  {
    id: "porsche-911-992-2019-2025-34-boxster",
    make: "Porsche",
    model: "911 992",
    yearStart: 2019,
    yearEnd: 2025,
    engine: "3.4 Boxer",
    region: "EU",
  },
];

const parts: PartRecord[] = [
  {
    id: "part-1",
    partNumber: "VW-06J-998-011",
    title: "Front Brake Pad Set",
    brand: "Bosch",
    category: "Brakes",
    description: "Ceramic front brake pad set for Volkswagen Golf VII and Audi A3 8V",
    source: "Authorized supplier export",
    image: "Brake pad",
    fitments: [
      { vehicleId: "vw-golf-vii-2013-2020-14-tsi", notes: "Front axle only" },
      { vehicleId: "vw-golf-vii-2013-2020-18-tsi", notes: "Front axle only" },
      { vehicleId: "audi-a3-8v-2013-2020-20-tsi", notes: "Front axle only" },
    ],
  },
  {
    id: "part-2",
    partNumber: "BMW-34116782162",
    title: "Cabin Air Filter",
    brand: "Mahle",
    category: "Filters",
    description: "High-flow cabin air filter for BMW 3 Series G20 and related trims",
    source: "Authorized supplier export",
    image: "Air filter",
    fitments: [{ vehicleId: "bmw-3-series-g20-2019-2025-20i", notes: "Standard cabin filter kit" }],
  },
  {
    id: "part-3",
    partNumber: "MB-A2711800252",
    title: "Engine Oil Filter",
    brand: "Mann Filter",
    category: "Filters",
    description: "Engine oil filter compatible with Mercedes C-Class W205 diesel models",
    source: "Authorized supplier export",
    image: "Oil filter",
    fitments: [{ vehicleId: "mercedes-c-class-w205-2014-2021-200d", notes: "Use with OEM spec oil" }],
  },
  {
    id: "part-4",
    partNumber: "POR-991-111-123-02",
    title: "Rear Wheel Bearing Kit",
    brand: "FAG",
    category: "Suspension",
    description: "Rear wheel bearing kit for Porsche 911 Carrera 992 generation",
    source: "Authorized supplier export",
    image: "Wheel bearing",
    fitments: [{ vehicleId: "porsche-911-992-2019-2025-34-boxster", notes: "Rear axle pair" }],
  },
  {
    id: "part-5",
    partNumber: "VW-1K0-998-780",
    title: "Spark Plug Set",
    brand: "NGK",
    category: "Ignition",
    description: "Iridium spark plug set for VW Golf VII and related turbo engines",
    source: "Authorized supplier export",
    image: "Spark plug",
    fitments: [
      { vehicleId: "vw-golf-vii-2013-2020-14-tsi", notes: "4-cylinder turbo set" },
      { vehicleId: "vw-golf-vii-2013-2020-18-tsi", notes: "4-cylinder turbo set" },
    ],
  },
];

function App() {
  const [make, setMake] = useState("All");
  const [model, setModel] = useState("All");
  const [year, setYear] = useState("All");
  const [query, setQuery] = useState("");

  const makeOptions = ["All", ...new Set(vehicles.map((vehicle) => vehicle.make))];

  const modelOptions = useMemo(() => {
    return [
      "All",
      ...new Set(
        vehicles
          .filter((vehicle) => make === "All" || vehicle.make === make)
          .map((vehicle) => vehicle.model),
      ),
    ];
  }, [make]);

  const yearOptions = useMemo(() => {
    return [
      "All",
      ...new Set(
        vehicles
          .filter((vehicle) => make === "All" || vehicle.make === make)
          .filter((vehicle) => model === "All" || vehicle.model === model)
          .flatMap((vehicle) => [vehicle.yearStart, vehicle.yearEnd]),
      ),
    ]
      .sort((a, b) => Number(a) - Number(b))
      .map((value) => String(value));
  }, [make, model]);

  const filteredParts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    const selectedVehicleIds = new Set(
      vehicles
        .filter((vehicle) => make === "All" || vehicle.make === make)
        .filter((vehicle) => model === "All" || vehicle.model === model)
        .filter((vehicle) => year === "All" || (vehicle.yearStart <= Number(year) && vehicle.yearEnd >= Number(year)))
        .map((vehicle) => vehicle.id),
    );

    return parts.filter((part) => {
      const text = [
        part.partNumber,
        part.title,
        part.brand,
        part.category,
        part.description,
        part.source,
      ]
        .join(" ")
        .toLowerCase();

      const matchesText = !normalizedQuery || text.includes(normalizedQuery);
      const matchesVehicle =
        selectedVehicleIds.size === 0 ||
        part.fitments.some((fitment) => selectedVehicleIds.has(fitment.vehicleId));

      return matchesText && matchesVehicle;
    });
  }, [make, model, year, query]);

  const clearFilters = () => {
    setMake("All");
    setModel("All");
    setYear("All");
    setQuery("");
  };

  const matchedVehicleCount = new Set(
    filteredParts.flatMap((part) => part.fitments.map((fitment) => fitment.vehicleId)),
  ).size;

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <header className="mb-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-700">
                Arcan Catalog
              </p>
              <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
                German car parts lookup
              </h1>
            </div>
            <div className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-800">
              Authorized data only
            </div>
          </div>
        </header>

        <section className="mb-8 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Makes loaded</p>
            <p className="mt-3 text-3xl font-bold">{makeOptions.length - 1}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Vehicle fits</p>
            <p className="mt-3 text-3xl font-bold">{vehicles.length}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Parts matches</p>
            <p className="mt-3 text-3xl font-bold">{filteredParts.length}</p>
          </div>
        </section>

        <div className="grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
          <aside className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Filters</h2>
              <button
                type="button"
                className="text-sm font-medium text-blue-700 hover:text-blue-900"
                onClick={clearFilters}
              >
                Clear
              </button>
            </div>

            <div className="space-y-4">
              <label className="block text-sm font-medium text-slate-700">
                Search
                <input
                  type="text"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Part number, brand, title..."
                  className="mt-1 w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm outline-none ring-0 transition focus:border-blue-500 focus:bg-white"
                />
              </label>

              <label className="block text-sm font-medium text-slate-700">
                Make
                <select
                  value={make}
                  onChange={(event) => {
                    setMake(event.target.value);
                    setModel("All");
                    setYear("All");
                  }}
                  className="mt-1 w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:bg-white"
                >
                  {makeOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block text-sm font-medium text-slate-700">
                Model
                <select
                  value={model}
                  onChange={(event) => {
                    setModel(event.target.value);
                    setYear("All");
                  }}
                  className="mt-1 w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:bg-white"
                >
                  {modelOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block text-sm font-medium text-slate-700">
                Year
                <select
                  value={year}
                  onChange={(event) => setYear(event.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:bg-white"
                >
                  {yearOptions.map((option) => (
                    <option key={option} value={option}>
                      {option === "All" ? "All years" : option}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </aside>

          <main className="space-y-4">
            <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
              <p className="text-sm text-slate-600">
                Showing <span className="font-semibold text-slate-900">{filteredParts.length}</span> matched parts
                {matchedVehicleCount > 0 && (
                  <span className="ml-2 text-slate-500">across {matchedVehicleCount} vehicle fits</span>
                )}
              </p>
            </div>

            {filteredParts.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm">
                <p className="text-lg font-semibold text-slate-900">No parts found</p>
                <p className="mt-2 text-sm text-slate-500">
                  Try clearing filters or searching a different part number or brand.
                </p>
              </div>
            ) : (
              filteredParts.map((part) => {
                const vehicleMatches = part.fitments
                  .map((fitment) => vehicles.find((vehicle) => vehicle.id === fitment.vehicleId))
                  .filter(Boolean) as VehicleRecord[];

                return (
                  <article key={part.id} className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
                    <div className="grid gap-5 p-5 md:grid-cols-[180px_minmax(0,1fr)]">
                      <div className="flex items-center justify-center rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-200 via-slate-100 to-blue-100 p-4">
                        <div className="flex h-28 w-28 flex-col items-center justify-center rounded-2xl border border-slate-300 bg-white/80 text-center shadow-inner">
                          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
                            {part.category}
                          </span>
                          <span className="mt-2 text-sm font-semibold text-slate-700">{part.image}</span>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-700">
                              {part.partNumber}
                            </p>
                            <h3 className="mt-1 text-2xl font-bold text-slate-900">{part.title}</h3>
                          </div>
                          <div className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600">
                            {part.brand}
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2 text-xs font-medium text-slate-600">
                          <span className="rounded-full bg-blue-50 px-2.5 py-1 text-blue-700">{part.category}</span>
                          <span className="rounded-full bg-amber-50 px-2.5 py-1 text-amber-700">{part.source}</span>
                        </div>

                        <p className="text-sm leading-6 text-slate-600">{part.description}</p>

                        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                            Fitment
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {vehicleMatches.map((vehicle) => (
                              <span
                                key={`${part.id}-${vehicle.id}`}
                                className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-700"
                              >
                                {vehicle.make} {vehicle.model} ({vehicle.yearStart}-{vehicle.yearEnd})
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

export default App;
