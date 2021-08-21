import { getAll, getRef, by } from "./utils";
import firebase from './firebase'

export async function testimonyByDay(day) {
  return await by('testimonies', day)
}

export async function testimonyByName(name) {
  return await by('testimonies', name, 'testifier')
}

export const shareTestimony = async ({ testifier, testimony, media,desc,date }) => {
  const gallery = [];
  try {
    const testimonyRef = await getRef("testimonies").add({ testifier, desc, testimony, date, gallery})
    if(media) {
      _.values(media).forEach(async (medium) => {
        // Upload the image to Cloud Storage.
        const {name, type} = await medium
        firebase.storage().ref().child(name).put(medium).then(async (fileSnapshot) => {
          const url = await fileSnapshot.ref.getDownloadURL() 
          gallery.push({url,type})
          testimonyRef.update({ gallery });
        });
      }); 
    }
    return (await testimonyRef.get()).data()
  } catch(e) {return null}
};

export const getTestimonies = async () => await getAll("testimonies", 'desc');
