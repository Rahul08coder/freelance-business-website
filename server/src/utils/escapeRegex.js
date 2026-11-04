// User ke diye text mein regex ke special characters (. * + ? ( ) [ ] etc.) ko normal text bana deta hai.
// Isse search mein koi regex chalane ya server ko atkane ki koshish nahi kar sakta.
export function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}