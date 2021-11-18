import { getAll, getRef, by, storeMedia } from "./utils";

export async function testimonyByDay(day) {
  return await by('testimonies', day)
}

export async function testimonyByName(name) {
  return await by('testimonies', name, 'testifier')
}

export const shareTestimony = async ({ testifier, testimony, media,desc,date }) => {
  const minGallery = [];
  try {
    const testimonyRef = await getRef("testimonies").add({ testifier, desc, testimony, date, minGallery})
    if(media) {
      _.values(media).forEach(async (source) => {
        const { name, type } = await source;
        const url = await storeMedia(name,source)
        minGallery.push({ url, type});
        await testimonyRef.update({ minGallery });
      }); 
    }
    return (await testimonyRef.get()).data()
  } catch(e) {return null}
};

export const getTestimonies = async () => await getAll("testimonies", 'desc');
