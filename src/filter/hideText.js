export function hideText(text, length = 1) {
   if (typeof text !== 'string') throw new TypeError('text must be string type');
   if (typeof length !== 'number') throw new TypeError('length must be number');
   const regx = new RegExp(`(.{${length}})(.+)(.{${length}})`, 'g');
   return text.replace(regx, function (match, start, middle, end) {
      return start + '*'.repeat(middle.length) + end;
   });
}