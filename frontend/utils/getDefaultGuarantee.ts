export function getDefaultGuarantee() {
  const start = new Date();
  const end = new Date(start);

  end.setFullYear(start.getFullYear() + 1);

  return {
    start: start.toISOString().split("T")[0],
    end: end.toISOString().split("T")[0],
  };
}
