function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

function getString() {
  max = document.getElementById("max").value;
  max = Number(max);
  if (!max) {
    textRandom = "Vui lòng nhập số vào ô dưới";
  } else {
    numChar = getRndInteger(1, max);
    textRandom =
    hiraganaString[getRndInteger(hiraganaString.length - 1, hiraganaString.length - 1)];
    for (let i = 0; i < numChar - 1; i++) {
      textRandom +=
        hiraKataString[
          getRndInteger(hiraganaString.length - 1, hiraganaString.length - 1)
        ];
    }
  }
  return textRandom;
}

const hiraganaString =
  "あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわをん";
