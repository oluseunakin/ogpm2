import firebase from 'firebase'

export function getRef(collection) {
  return firebase.firestore().collection(collection);
}

export const getAll = async (collection) => {
  const all = [];
  const snapshot = await getRef(collection).get();
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

export const formatDate = (date) => {
  const [day,month,year] = date.toLocaleDateString().split('/') 
  return `${year}-${month}-${day}`
}
