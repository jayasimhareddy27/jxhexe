// Fisher-Yates shuffle algorithm
export const shuffle = (array) => {
  let currentIndex = array.length, randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]
    ];
  }
  
  return array;
};

export const BackendURL = 'http://localhost:4000';
// You can add other utilit
// y functions here in the future

