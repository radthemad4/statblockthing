export enum Size {
  Fine = -4,
  Diminutive = -3,
  Tiny = -2,
  Small = -1,
  Medium = 0,
  Large = 1,
  Huge = 2,
  Gargantuan = 3,
  Colossal = 4,
}

export const sizeName = (size: number) => {

  if (isNaN(size)) {
    return '—';
  }

  let sizeString = `${size}`;
  switch (size) {
    case Size.Fine:
      sizeString = "Fine";
      break;
    case Size.Diminutive:
      sizeString = "Diminutive";
      break;
    case Size.Tiny:
      sizeString = "Tiny";
      break;
    case Size.Small:
      sizeString = "Small";
      break;
    case Size.Medium:
      sizeString = "Medium";
      break;
    case Size.Large:
      sizeString = "Large";
      break;
    case Size.Huge:
      sizeString = "Huge";
      break;
    case Size.Gargantuan:
      sizeString = "Gargantuan";
      break;
    case Size.Colossal:
      sizeString = "Colossal";
      break;
  }
  return sizeString;
};

export enum BABProgression {
  None = '0',
  Poor = 'floor(0.5 * hd)',
  Average = 'floor(0.75 * hd)',
  Good = 'hd',
}

export const babProgressions = [
  BABProgression.None,
  BABProgression.Poor,
  BABProgression.Average,
  BABProgression.Good,
];

export enum SaveProgression {
  None = '0',
  Poor = 'floor(hd/3)',
  Good = '2+floor(hd/2)'
}

export enum HPFromHDCalculation {
  Average = "0.5 * (hdSize+1) * hd",
  AverageMaxFirst = "hdSize + 0.5 * (hdSize+1) * (hd - 1)",
  Max = "hdSize * hd"
}