export default function mixColors(c1, c2, t) {
  let reRgb = /rgb\(\s*([0-9]+\.?[0-9]*)\s*,\s*([0-9]+\.?[0-9]*)\s*,\s*([0-9]+\.?[0-9]*)\s*\)/i;
  let reHsl = /hsl\(\s*([0-9]+\.?[0-9]*)\s*,\s*([0-9]+\.?[0-9]*)\%\s*,\s*([0-9]+\.?[0-9]*)\%\s*\)/i;
  let matchRgb1 = reRgb.exec(c1);
  let matchRgb2 = reRgb.exec(c2);
  let matchRgb = matchRgb1 && matchRgb2;
  let matchHsl1 = reHsl.exec(c1);
  let matchHsl2 = reHsl.exec(c2);
  let matchHsl = matchHsl1 && matchHsl2;

  if (!matchRgb && !matchHsl)
    return undefined;

  let match1 = matchRgb1 ? matchRgb1 : matchHsl1;
  let match2 = matchRgb2 ? matchRgb2 : matchHsl2;

  let a = Math.round((1-t)*match1[1] + t*match2[1]);
  let b = Math.round((1-t)*match1[2] + t*match2[2]);
  let c = Math.round((1-t)*match1[3] + t*match2[3]);

  return (matchRgb ? 'rgb' : 'hsl') + '(' + a + ',' + b + (matchHsl ? '%,' : ',') + c +(matchHsl ? '%)' : ')');
}
