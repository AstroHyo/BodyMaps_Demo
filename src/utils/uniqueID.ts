let _nextID = 0;
export default function getUniqueID(ns?: string): string {
  return (ns ? ns + "-" : "") + _nextID++;
}
