import firebase from './firebase'
import Bible from './Bible'
import { dailyNews } from './news';
import { dailyDevotion } from './devotion';
import _ from "lodash";

export function getRef(collection) {
  return firebase.firestore().collection(collection);
}

export const getAll = async (collection, sort) => {
  const all = [];
  let ref = getRef(collection)
  if(sort) ref = ref.orderBy('date', sort)
  const snapshot = await ref.get();
  snapshot.forEach((doc) => all.push(doc.data()));
  return all;
};

export const by = async (collection, value, by = "date") => {
  return (
    await getRef(collection)
      .where(by, "==", value)
      .get()
  ).docs.map(doc => doc.data());
};

export const formatDate = (date, formatter) => {
  date = new Date(date)
  if(formatter) {
    const [day,month,year] = date.toLocaleDateString().split(' ')
    return `${year}${formatter}${month}${formatter}${day}` 
  }
  return date.toDateString()
}

export const bibleTypes = () => {
  const data = [<option key='k'>Select Bible version</option>]
  Bible.types.forEach((v,k) => data.push(<option key={k} value={v}>{k}</option>))
  return data
}

export const daily = async () => {
  const dn = await dailyNews()
  const dd = await dailyDevotion()
  const max = dn.length+dd.length
  let daily = []
  let random = _.random(1,max)
  for(let i = 0;i<max;i++) {
    if(i === random) {
      daily.push(dn.shift())
      random = _.random(i,max)
    }
    else if (dd.length === 0 ) {
      daily = daily.concat(dn)
      break
    }
    else daily.push(dd.shift())
  }
  return daily
}