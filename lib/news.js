import { getAll, getRef, by } from "./utils";

export const createNews = ({ title, news, media }) => {
  const gallery = [];
  getRef("news")
    .add({ news, title, date: Date.now(), gallery: [] })
    .then((newsRef) => {
      Object.values(media).forEach(async (medium) => {
        // Upload the image to Cloud Storage.
        const { name } = await medium;
        firebase
          .storage()
          .ref("news")
          .child(name)
          .put(medium)
          .then((fileSnapshot) => {
            // 3 - Generate a public URL for the file.
            fileSnapshot.ref.getDownloadURL().then((url) => {
              gallery.push(url);
            });
          });
      });
      newsRef.update({ gallery });
    })
    .catch(function (error) {
      console.error(
        "There was an error uploading a file to Cloud Storage:",
        error
      );
    });
};

export const allnews = async () => {
  return await getAll("news");
};

export async function newsByDay(day) {
  return await by("news", day);
}

export async function dailyNews() {
  return await by("news", new Date().toDateString());
}