import "isomorphic-fetch";
import { getSheet, getWorkbook } from "sheetsy";
import _ from "lodash";

const WORKSHEET_ID = "1hhlHA9pDyzdDFueNdd9mptPMW9Skj-REAr2l16VnPto";

export const getData = async () => {
  const workbook = await getWorkbook(WORKSHEET_ID);
  const firstSheet = _.first(workbook.sheets);
  const addresses = await getSheet(WORKSHEET_ID, firstSheet.id);
  return addresses.rows;
};
