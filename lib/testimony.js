import { getAll, getRef, by } from "./utils";

export async function testimonyByDay(day) {
  return await by('testimonies', day)
}

export function testimonyByName(name) {
  return by('testimonies', name, 'testifier')
}

export const shareTestimony = ({ testifier, testimony, media,desc }) => {
  const gallery = [];
  getRef("testimonies")
    .add({ testifier, desc, testimony, date: new Date().toDateString(), gallery: [] })
    .then((testimonyRef) => {

      Object.values(media).forEach(async (medium) => {
        // Upload the image to Cloud Storage.
        const { name } = await medium;
        firebase
          .storage()
          .ref()
          .child(name)
          .put(medium)
          .then((fileSnapshot) => {
            fileSnapshot.ref.getDownloadURL().then((url) => {
              gallery.push(url);
            });
          });
        testimonyRef.update({ gallery });
      });
    })
    .catch(function (error) {
      console.error(
        "There was an error uploading a file to Cloud Storage:",
        error
      );
    });
};

export const getTestimonies = async () => {
  return await getAll("testimonies");
};
