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

export const by = async (collection, value, by = "date") => {
  return (await getRef(collection).where(by, "==", value).get()).docs.map(
    (doc) => doc.data()
  );
};

export async function updateAbout(about, gallery) {
  const ref = getRef("about");
  ref.get().then((snapshot) => {
    if (gallery) {
      let g = []
      Object.values(gallery).forEach(async (ga) => {
        const { name, type } = ga;
        const fileSnapshot = await firebase.storage().ref().child(name).put(ga);
        const url = await fileSnapshot.ref.getDownloadURL();
        g.push({url,type})
        if (snapshot.empty) ref.add({ about, gallery: g });
        else {
          snapshot.docs.forEach(async (doc) => {
            let oldAbout = doc.ref;
            oldAbout.get().then((old) => {oldAbout.update({about, gallery: g.concat(old.data().gallery)});})  
          });
        }
      });
    } else { console.log(about)
      snapshot.docs.forEach(async (doc) => doc.ref.update({ about})) 
    }
  });
}

export async function getAbout() {
  return (await getAll("about"))[0];
}

export const formatDate = (date, formatter) => {
  date = new Date(date);
  if (formatter) {
    const [day, month, year] = date.toLocaleDateString().split(" ");
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
  let daily = [];
  let random = _.random(1, max);
  for (let i = 0; i < max; i++) {
    if (i === random) {
      daily.push(dn.shift());
      random = _.random(i, max);
    } else if (dd.length === 0) {
      daily = daily.concat(dn);
      break;
    } else daily.push(dd.shift());
  }
  return daily;
};
