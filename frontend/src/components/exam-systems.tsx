import { Link } from "@tanstack/react-router";

type ExamSystem = {
  name: string;
  region: string;
  detail: string;
  to?: string;
};

const examSystems: ExamSystem[] = [
  {
    name: "NCEA",
    region: "New Zealand",
    detail: "Level 1-3 Achievement Standards",
    to: "/subject-selection",
  },
  { name: "Australia", region: "Coming Soon", detail: "" },
  { name: "USA", region: "Coming Soon", detail: "" },
  {
    name: "NZCE",
    region: "New Zealand",
    detail: "Coming 2029",
  },
  { name: "UK", region: "Coming Soon", detail: "" },
  { name: "Canada", region: "Coming Soon", detail: "" },
];

const Card = ({ system }: { system: ExamSystem }) => {
  const content = (
    <>
      <h3 className="text-lg font-bold text-slate-900">{system.name}</h3>
      <p className="mt-3 text-sm font-medium text-slate-700">{system.region}</p>
      {system.detail && (
        <p className="mt-1 text-sm text-slate-400">{system.detail}</p>
      )}
    </>
  );

  const className =
    "block h-[147px] w-full max-w-[325px] rounded-xl border border-slate-200 bg-white px-6 py-5 shadow-sm transition";

  if (system.to) {
    return (
      <Link to={system.to} className={`${className} hover:shadow-md`}>
        {content}
      </Link>
    );
  }

  return <div className={className}>{content}</div>;
};

const ExamSystems = () => {
  return (
    <section className="mx-auto max-w-7xl px-6 py-16 font-inter lg:px-8 xl:px-[8%]">
      <h2 className="text-xl font-bold text-slate-900">Exam Systems</h2>

      <div className="mt-8 grid grid-cols-1 gap-10 sm:grid-cols-[repeat(2,325px)] lg:grid-cols-[repeat(3,325px)]">
        {examSystems.map((system) => (
          <Card key={system.name} system={system} />
        ))}
      </div>
    </section>
  );
};

export default ExamSystems;
