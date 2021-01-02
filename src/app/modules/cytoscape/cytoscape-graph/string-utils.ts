export const camelCaseToDash = (s: string) => s.replace(/[A-Z]/g, char => '-' + char.toLowerCase());
