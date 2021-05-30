import { getAll, getRef } from "./utils";

export const requestPrayer = (name, request ) => {
  getRef("prayerrequests").add({ name, request });
  return "Your prayer has been answered. Amen!!!";
};

export const getRequests = async () => await getAll("prayerrequests");
