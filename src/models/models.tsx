
export interface FilmRequestModel {
  filmName: string;
  filmGenre: string;
  filmDuration: number;
  filmLanguage: string;
  filmRating: number;
  filmDescription: string;
}

export interface FilmResponseModel {
  id: number;
  filmName: string;
  filmGenre: string;
  filmDuration: number;
  filmLanguage: string;
  filmRating: number;
  filmDescription: string;
}

export interface ScreeningRequestModel {
  screenNum: number;
  chosenSeats: number;
  screenType: string;
  screenDate: string; // ISO yyyy-mm-dd
  screenDescription: string;
  chosenFilm: FilmResponseModel;
}

export interface ScreeningResponseModel {
  id: number;
  screenNum: number;
  availableSeats: number;
  screenType: string;
  screenDate: string;
  screenDescription: string;
  filmAvailable: FilmResponseModel;
}

