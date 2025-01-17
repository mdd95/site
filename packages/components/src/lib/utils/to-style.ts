import type { MapperFn } from './types.js';

function createParser(
  matcher: string | RegExp,
  replacer: MapperFn<string, string>
): MapperFn<string, string> {
  const regex = RegExp(matcher, 'g');

  return (str) => {
    if (typeof str !== 'string') {
      throw new TypeError(`Expected an argument of type "string", but got "${typeof str}".`);
    }
    if (!str.match(regex)) return str;
    return str.replace(regex, replacer);
  };
}

const camelToKebab = createParser(/[A-Z]/, (match) => `-${match.toLowerCase()}`);

export function toStyle(obj?: object) {
  if (!obj || typeof obj !== 'object' || Array.isArray(obj)) {
    throw new TypeError(`Expected an argument of type "object", but got "${typeof obj}".`);
  }
  return Object.keys(obj)
    .map((prop) => `${camelToKebab(prop)}: ${obj[prop as keyof typeof obj]};`)
    .join(' ');
}
