// Definir las rutas de los archivos de audio
const intheends = './data/music-player/sngs/In The End - Linkin Park.mp3';
const faints = './data/music-player/sngs/Faint - Linkin Park.mp3';
const disfigs = './data/music-player/sngs/Disfigure - Blank [NCS Release].mp3';
const blinkas = './data/music-player/sngs/blk182.mp3';

// Definir las rutas de las miniaturas de audio
const intheend = './data/music-player/imgs/In The End - Linkin Park.jpg';
const faint = './data/music-player/imgs/Fain - Linkin Park.jpg';
const disfigure = './data/music-player/imgs/disfigure.jpg';
const blinka = './data/music-player/imgs/blk182.jpeg';

// Crear un arreglo de pistas de audio
const tracks = [
  {
    title: "Adam's Song",
    src: blinkas,
    author: 'Blink-182',
    thumbnail: blinka,
  },
  {
    title: 'Faint',
    src: faints,
    author: 'Linkin Park',
    thumbnail: faint,
  },
  {
    title: 'In The End',
    src: intheends,
    author: 'Linkin Park',
    thumbnail: intheend,
  },
  {
    title: 'Disfigure',
    src: disfigs,
    author: 'Blank [NCS Release]',
    thumbnail: disfigure,
  }
];

console.log(tracks);
// Exportar el arreglo de pistas de audio
export default tracks;