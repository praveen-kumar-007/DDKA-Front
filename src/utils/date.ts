export function formatDateMDY(input?: string | Date | null): string {
  if (!input) return '—';
  const d = input instanceof Date ? input : new Date(input as string);
  if (Number.isNaN(d.getTime())) return '—';
  const dd = d.getDate();
  const yyyy = d.getFullYear();
  const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  const month = monthNames[d.getMonth()] || '';
  return `${dd} ${month} ${yyyy}`;
}
