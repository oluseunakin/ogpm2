import { by, getAll, getRef, storeMedia } from "./utils";

export const dailyDevotion = async () => {
  return await by(
    "devotions",
    Math.floor(Date.now() / (1000 * 60 * 60 * 24))
  );
};

export async function devotionByDay(day) {
  return await by("devotions", day);
}

export const createDevotion = async ({ topic, title, media, text, date }) => {
  const minGallery = [];
  try {
    const devotionRef = await getRef("devotions").add({
      topic,
      text,
      title,
      date,
      minGallery,
    });
    if (media) {
      Object.values(media).forEach(async (source) => {
        const { name, type } = await source;
        const url = await storeMedia(name, source);
        minGallery.push({ url, type });
        await devotionRef.update({ minGallery });
      });
    }
    return devotionRef;
  } catch (e) {
    return null;
  }
};

export const devotions = async () => {
  return await getAll("devotions", "desc");
};
