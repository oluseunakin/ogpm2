import { by, getAll, getRef, formatDate } from "./utils";


export const bookAppointment = async (name) => {

  const today = new Date().getTime()
  const appointmentRef = getRef('appointments')
  const docs = await appointmentRef
    .orderBy("date", "desc").limit(1).get()
  let appointment;
  if (!docs.empty) {
    const doc = docs.docs[0].data()
    let lastDate = doc.date 
    if(lastDate < today) lastDate = today
    const count = (await appointmentRef.get()).size;
    if (count === 5) lastDate += 1000 * 60 * 60 * 24;
    appointment = await appointmentRef.add({ name, date: lastDate });
  } 
  else appointment = await appointmentRef.add({name,date: today});
  const appoint = (await appointment.get()).data();
  return appoint.name + " has been booked for " + formatDate(new Date(appoint.date)) 
};

export const dailyAppointment = () => {
  return by('appointments', Date.now())
}

export const appointments = async () => {
  return await getAll('appointments', 'desc')
}