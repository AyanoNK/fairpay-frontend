import Link from "next/link";

interface ITable {
  table: Table;
}

export default function Table({ table }: ITable) {
  return (
    <Link
      href={
        table.status === "busy"
          ? `/table/${table.id}`
          : `/table/${table.id}/createvisit`
      }
      key={table.alias}
      type="button"
      className="flex flex-col items-center justify-center rounded border p-3 text-center hover:border-blue-700"
    >
      <span>{table.id}</span>
      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-primary-100 p-1.5 text-blue-700  lg:h-12 lg:w-12">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="h-6 w-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M10.5 6a7.5 7.5 0 107.5 7.5h-7.5V6z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M13.5 10.5H21A7.5 7.5 0 0013.5 3v7.5z"
          />
        </svg>
      </div>
      <h3 className="mb-2 text-xl font-bold ">{table.alias}</h3>
      <p className="text-gray-500 ">
        {table.status} for {table.capacity} people
      </p>
    </Link>
  );
}
