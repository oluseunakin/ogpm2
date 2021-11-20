import { getAll, getRef, by, storeMedia } from "./utils";

const divider = 1000 * 60 * 60 * 24

export const createNews = async ({ title, news, media, date }) => {
  try {
    const minGallery = [];
    const newsRef = await getRef("news").add({
      news,
      title,
      date,
      minGallery: []
    });
    if (media) {
      Object.values(media).forEach(async (source) => {
        const { name, type } = await source;
        const url = await storeMedia(name,source)
        minGallery.push({ url, type});
        await newsRef.update({ minGallery });
      })
      return (await newsRef.get()).data();
    }
    return (await newsRef.get()).data();
  } catch (e) {
    return null;
  }
};

export const allnews = async () => {
  return await getAll("news", "desc");
};

export async function newsByDay(day) {
  return await by("news", day);
}

export async function dailyNews() {
  return await by(
    "news",
    Math.floor(Date.now() / divider)
  );
}

export async function upcoming() {
  let today = Math.floor(Date.now()/divider)
  let days = [today]
  for(let i = 1;i < 7;i++){
    days.push(++today)
  }
  return await by('news',days, 'date', true)
}