////////////////////////////////////Apicalls///////////////////////////////////////
const apikey: string = "6UAZoUJO9AmNwty5O4Tez3kHohgWynbQ";

export const baseImagePath = (size: string, path: string) => {
  return `https://s1.ticketm.net/dam/${size}${path}`;
};

// Assuming you want events in the "Now Playing" category
export const nowPlayingMovies: string = `https://app.ticketmaster.com/discovery/v2/events.json?apikey=${apikey}&classificationName=music&sort=date,asc`;

// Assuming you want upcoming events
export const upcomingMovies: string = `https://app.ticketmaster.com/discovery/v2/events.json?apikey=${apikey}&classificationName=music&sort=date,desc`;

// Assuming you want popular events (sorted by popularity)
export const popularMovies: string = `https://app.ticketmaster.com/discovery/v2/events.json?apikey=${apikey}&classificationName=music&sort=date,desc`;
//const popularMovies: string = `https://app.ticketmaster.com/discovery/v2/events.json?apikey=${apikey}&classificationName=music&sort=date,desc`;

export const searchMovies = (keyword: string) => {
  return `https://app.ticketmaster.com/discovery/v2/events.json?apikey=${apikey}&keyword=${keyword}`;
};

export const movieDetails = (id: string) => {
  return `https://app.ticketmaster.com/discovery/v2/events/${id}.json?apikey=${apikey}`;
};

export const movieCastDetails = (id: string) => {
  return `https://app.ticketmaster.com/discovery/v2/attractions/${id}.json?apikey=${apikey}`;
};
