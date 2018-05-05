import "isomorphic-fetch";
import * as _ from "lodash";

const sheetsy = require("sheetsy");

const WORKSHEET_ID = "1hhlHA9pDyzdDFueNdd9mptPMW9Skj-REAr2l16VnPto";

export type Address = {
  id: Number;
  photo: string;
  street: string;
  name: string;
  area: string;
};

export const getData = async (): Promise<Address[]> => {
  const workbook = await sheetsy.getWorkbook(WORKSHEET_ID);
  const firstSheet = _.first(workbook.sheets) as any;
  const addresses = await sheetsy.getSheet(WORKSHEET_ID, firstSheet.id);
  return addresses.rows;
};
