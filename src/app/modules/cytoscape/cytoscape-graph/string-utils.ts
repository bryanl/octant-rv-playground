export const camelCaseToDash = (v: string) => {
  let ret = '';
  let prevLowercase = false;
  let prevIsNumber = false;

  [...v].forEach(ch => {
    const isUppercase = ch.toUpperCase() === ch;
    const isNumber = !Number(ch);
    if (isNumber) {
      if (prevLowercase) {
        ret += '-';
      }
    } else {
      if (isUppercase && (prevLowercase || prevIsNumber)) {
        ret += '-';
      }
    }
    ret += ch;
    prevLowercase = !isUppercase;
    prevIsNumber = isNumber;
  });

  return ret.replace(/-+/g, '-').toLowerCase();
};
