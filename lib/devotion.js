import firebase from "./firebase";
import { by, getAll, getRef } from "./utils";

export const dailyDevotion = async () => {
  return await by('devotions', Math.floor(new Date().getTime()/(1000*60*60*24)))
};

export async function devotionByDay(day) {
  return await by('devotions', day)
}

export const createDevotion = async ({ topic, title, media, text, date }) => {
  const gallery = []
  try {
    const devotionRef = await getRef("devotions").add({
      topic,
      text,
      title,
      date,
      gallery,
    });
    if(media) {
      Object.values(media)
        .forEach(async (medium) => {
          // Upload the image to Cloud Storage.
          const { name, type } = await medium;
          const fileSnapshot = await firebase
            .storage()
            .ref()
            .child(name)
            .put(medium);
          const url = await fileSnapshot.ref.getDownloadURL();
          gallery.push({url,type});
          await devotionRef.update({ gallery})
        }
      )
    } 
    return (await devotionRef.get()).data()
  } catch(e) {return null}  
};

export const devotions = async () => {
  return await getAll("devotions",'desc');
};
