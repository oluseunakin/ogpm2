import firebase from "./firebase";
import Bible from "./Bible";
import { dailyNews } from "./news";
import { dailyDevotion } from "./devotion";
import _ from "lodash";

export function getRef(collection) {
  return firebase.firestore().collection(collection);
}

export const getAll = async (collection, sort) => {
  const all = [];
  let ref = getRef(collection);
  if (sort) ref = ref.orderBy("date", sort);
  const snapshot = await ref.get();
  snapshot.forEach((doc) => all.push(doc.data()));
  return all;
};

export const by = async (collection, value, by = "date", option) => {
  let res
  if(option) res = await getRef(collection).where(by, 'in', value).get()
  else res = await getRef(collection).where(by, "==", value).get();
  return res.docs.map((doc) => doc.data());
};

export async function updateAbout(about, gallery) {
  const ref = getRef("about");
  const snapshot = await ref.get();
  if (gallery) {
    let g = [];
    Object.values(gallery).forEach(async (ga, i) => {
      const { name, type } = ga;
      const fileSnapshot = await firebase.storage().ref().child(name).put(ga);
      const url = await fileSnapshot.ref.getDownloadURL();
      g[i] = { url, type };
      if (snapshot.empty) {
        return ref.add({ about, gallery: g });
      } else {
        snapshot.docs.forEach(async (doc) => {
          let oldAbout = doc.ref;
          const gallery = await (await oldAbout.get()).get("gallery");
          return oldAbout.update({
            about,
            gallery: g.concat(gallery),
          });
        });
      }
    });
  } else {
    if (snapshot.empty) {
      return ref.add({ about });
    } else {
      snapshot.docs.forEach(async (doc) => {
        return doc.ref.update({ about });
      });
    }
  }
}

export async function getAbout() {
  const about = await getAll("about");
  return _.isEmpty(about) ? null : about[0];
}

export const formatDate = (d, formatter) => {
  const date = new Date(d);
  if (formatter) {
    const [day, month, year] = date.toLocaleDateString().split("/");
    return `${year}${formatter}${month}${formatter}${day}`;
  }
  return date.toDateString();
};

export const bibleTypes = () => {
  const data = [<option key="k">Select Bible version</option>];
  Bible.types.forEach((v, k) =>
    data.push(
      <option key={k} value={v}>
        {k}
      </option>
    )
  );
  return data;
};

export const daily = async () => {
  const dn = await dailyNews();
  const dd = await dailyDevotion();
  const max = dn.length + dd.length;
  const daily = [];
  let j = 1;
  let random = dn.length === 0 ? undefined : _.random(1, dn.length);
  for (let i = 0; i < max; i++) {  
    if (i === random) {
      daily.push(dn.shift());
      random = _.random(1, dn.length);
      j++
    } else if (dd.length === 0) {
      daily = dn;
      break;
    } else if (i === 5 * j && dn.length !== 0) {
      daily.push(dn.shift());
      j++;
    } else daily.push(dd.shift());
  }
  return daily;
};

function compress(media) {
  const gallery = [];
  Object.values(media).forEach(async (source) => {
    const c = document.createElement("canvas");
    const l = new Image();
    l.src = window.URL.createObjectURL(source);
    l.onload = function () {
      c.width = l.width;
      c.height = l.height;
      c.getContext("2d").drawImage(l, 0, 0, c.width, c.height);
      c.toBlob(
        (blob) => {
          const f = new File([blob], source.name, { type: "image/jpeg" });
          gallery.push(f);
        },
        "image/jpeg",
        0.3
      );
    };
  });
  return gallery;
}

export function checkMedia(media) {
  let total = 0;
  const mb = 10 ** 6;
  let hasVideo = false;
  Object.values(media).forEach((source) => {
    total += source.size;
    if (source.type.startsWith("video")) hasVideo = true;
  });
  if ((hasVideo && total > 10 * mb) || (!hasVideo && total > 5 * mb)) {
    return "more than allowed maximum size";
  } else if (hasVideo) return media;
  else return compress(media);
}

export async function storeMedia(name, blob) {
  const fileSnapshot = await firebase.storage().ref().child(name).put(blob);
  return await fileSnapshot.ref.getDownloadURL();
}

function halfify(size, minGallery, ref, source) {
  const d = size - 0.3 * 10 ** 6;
  const halves = [d, size - d];
  let counter = 0;
  halves.forEach(async (half, i) => {
    if (half >= 2 * 10 ** 6) {
      halfify(half, minGallery, ref, source);
    } else {
      const start = counter * half;
      const end = start + half;
      const task = await firebase
        .storage()
        .ref()
        .child(source.name + counter++)
        .put(source.slice(start, end + 1, "video/mp4"));
      const url = await task.ref.getDownloadURL();
      minGallery.push({ url, type: source.type });
      ref.update({ minGallery });
    }
  });
}
