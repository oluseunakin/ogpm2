import { getAll, getRef } from "./utils";

export const requestPrayer = async (name, request ) => {
  await getRef("prayerrequests").add({ name, request, date: Date.now() });
  return "Your prayer has been answered. Amen!!!";
};

export const getRequests = async () => await getAll("prayerrequests", "desc");
