import firebase from "./firebase";
import { by, getAll, getRef } from "./utils";

export const dailyDevotion = async () => {
  return await by('devotions', new Date().toDateString())
};

export async function devotionByDay(day) {
  return await by('devotions', day)
}

export const createDevotion = async ({ topic, title, media, text }) => {
  const gallery = []
  const devotionRef = await getRef("devotions").add({
    topic,
    text,
    title,
    date: new Date().toDateString(),
    gallery: [],
  });
  Object.values(media)
    .forEach(async (medium) => {
      // Upload the image to Cloud Storage.
      const { name } = await medium;
      const fileSnapshot = await firebase
        .storage()
        .ref()
        .child(name)
        .put(medium);
      const url = await fileSnapshot.ref.getDownloadURL();
      gallery.push(url);
      devotionRef.update({ gallery})
    }) 
};

export const devotions = async () => {
  return await getAll("devotions");
};
