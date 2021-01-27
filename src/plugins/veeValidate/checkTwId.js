const checkTwID = function(id) {
   let city = new Array(1, 10, 19, 28, 37, 46, 55, 64, 39, 73, 82, 2, 11, 20, 48, 29, 38, 47, 56, 65, 74, 83, 21, 3, 12, 30)
   id = id.toUpperCase();
   if (id.search(/^[A-Z](1|2)\d{8}$/i) == -1) {
      return false;
   } else {
      id = id.split('');
      let total = city[id[0].charCodeAt(0) - 65];
      for (let i = 1; i <= 8; i++) {
         total += eval(id[i]) * (9 - i);
      }
      total += eval(id[9]);
      return ((total % 10 == 0));
   }
}

export default checkTwID;