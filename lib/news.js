import { getAll, getRef, by } from "./utils";
import firebase from './firebase'

export const createNews = async ({ title, news, media, date }) => {
  const gallery = [];
  try {
    const newsRef = await getRef("news").add({ news, title, date, gallery: [] })
    if(media) {
      Object.values(media).forEach(async (medium) => {
        // Upload the image to Cloud Storage.
        const { name, type } = await medium;
        firebase.storage().ref().child(name).put(medium).then(async (fileSnapshot) => {
          const url = await fileSnapshot.ref.getDownloadURL() 
          gallery.push({url,type})
          newsRef.update({ gallery });
        });
      });
    }
    return (await newsRef.get()).data()
  } catch(e) { return null}
};

export const allnews = async () => {
  return await getAll("news", 'desc');
};

export async function newsByDay(day) {
  return await by("news", day);
}

export async function dailyNews() {
  return await by("news", Math.floor(new Date().getTime()/(1000*60*60*24)));
}