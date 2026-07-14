// Previously stored as a magic pseudo-row inside the Airtable map table
// ('Last updated'). Now that the map table is a plain CSV (data/map.csv),
// that data has nowhere else to live — update this by hand alongside data edits.
export const mapMeta = {
  // Free-text date shown on the /map page footer. Update whenever data/map.csv changes.
  lastUpdated: null as string | null,
  suggestUrl:
    'https://docs.google.com/forms/d/e/1FAIpQLScOIzptJ4iWHowPJj_BNCx-SggiFKwhXeZw-7X6abBFgZd2eQ/viewform?usp=sharing&ouid=101556100844017553888',
}
