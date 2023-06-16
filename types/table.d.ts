interface Table {
  id: number;
  alias: string;
  status: "available" | "busy";
  capacity: number;
}
