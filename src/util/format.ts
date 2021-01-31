export function commafy(str: string | number): string {
  return str.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}
