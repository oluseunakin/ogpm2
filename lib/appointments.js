import { by, getAll, getRef, formatDate } from "./utils";


export const bookAppointment = async (name) => {

  let lastDate = Math.floor(Date.now()/(1000*60*60*24))
  const appointmentRef = getRef('appointments')
  const docs = await appointmentRef
    .orderBy("date", "desc").limit(1).get()
  if (!docs.empty) {
    const doc = docs.docs[0].data()
    if(lastDate < doc.date) lastDate = doc.date
    const count = (await by("appointments", lastDate)).length
    if (count >= 5) lastDate++;  
  }
  appointmentRef.add({ name: name.toUpperCase(), date: lastDate });
  return name + " has been booked for " + formatDate(new Date(lastDate*(1000*60*60*24))) 
};

export const dailyAppointment = () => {
  return by('appointments', Math.floor(new Date().getTime()/(1000*60*60*24)))
}

export const appointments = async () => {
  return await getAll('appointments', 'desc')
}