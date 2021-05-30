import { by, getAll, getRef } from "./utils";

export const bookAppointment = async (name) => {
  const appointmentRef = getRef('appointments')
  const docs = await appointmentRef
    .orderBy("date", "desc").limit(1).get()
  let appointment;
  if (!docs.empty) {
    const date = docs.docs[0].data().date;
    const count = (await appointmentRef.get()).size;
    if (count === 5) appointmentDate += 1000 * 60 * 60 * 24;
    appointment = await appointmentRef.add({ name, date });
  } else
      appointment = await appointmentRef.add({name,date: new Date().toDateString()});
  return (await appointment.get()).data();
};

export const dailyAppointment = () => {
  return by('appointments', new Date().toDateString())
}

export const appointments = async () => {
  return await getAll('appointments')
}