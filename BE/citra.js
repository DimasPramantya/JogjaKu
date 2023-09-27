//Matriks Translasi
const matriks = [
    [1, 3, 5, 7, 9, 11],
    [2, 4, 6, 8, 10, 12],
    [13, 15, 17, 19, 21, 23],
    [14, 16, 18, 20, 22, 24],
    [25, 27, 29, 31, 33, 35],
    [26, 28, 30, 32, 34, 36],
    [37, 39, 41, 43, 45, 47]
];
function translatematriks(matriks, xTranslasi, yTranslasi) {
    const jumlahRow = matriks.length;
    const jumlahKolom = matriks[0].length;
    const matriksTranslasi = [];
  
    for (let i = 0; i < jumlahRow; i++) {
      let translatedRow = new Array(jumlahKolom);
      for (let j = 0; j < jumlahKolom; j++) {
            if(i < yTranslasi){
                translatedRow[j] = 0;
            }else{
                if(j<yTranslasi-1){
                    translatedRow[j] = 0;  
                }else{
                    translatedRow[j] = matriks[i-yTranslasi][j-xTranslasi];
                }
            }
      }
      matriksTranslasi.push(translatedRow);
    }
    return matriksTranslasi;
}
const matriksTranslasi = translatematriks(matriks, 2, 3);

console.log("Matriks asal");
for (let i = 0; i < matriks.length; i++) {
    console.log(matriks[i]);
}
console.log();

console.log("Matriks hasil translasi x sejauh 2, y sejauh 3");
for (let i = 0; i < matriksTranslasi.length; i++) {
    console.log(matriksTranslasi[i]);
}


//Matriks NOT
const matriksHasilKomplemen = [
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0]
]

const matriksAwalUntukKomplemen = [
    [0, 1, 1, 0, 0],
    [1, 1, 0, 1, 0],
    [1, 0, 1, 1, 0],
    [1, 0, 1, 1, 0],
    [0, 1, 0, 0, 1],
    [0, 0, 1, 1, 1]
]

for(let i = 0; i<matriksAwalUntukKomplemen.length; i++){
    for(let j = 0; j<matriksAwalUntukKomplemen[0].length; j++){
        matriksHasilKomplemen[i][j] = Number(!matriksAwalUntukKomplemen[i][j]);
    }
}

console.log("\nMatriks awal\n",matriksAwalUntukKomplemen,"\n\nMatriks Hasil Komplemen\n",matriksHasilKomplemen);