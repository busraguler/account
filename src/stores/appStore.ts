import vegemite from "vegemite";

import { useState, useEffect } from "react";

export interface Account {
  tckn: string;
  name: string;
  surname: string;
  title: string;
  address: string;
  city: string;
  district: string;
}

interface AppStoreEventMap {
  accounts: Account;
}

interface AppStoreState {
  accounts: any;
}

export const appStore = vegemite<AppStoreEventMap, AppStoreState>({
  accounts: [
    {
      tckn: "40582092582",
      title: "Developer",
      name: "Büşra",
      surname: "GÜLER",
      address: "Meşrutiyet Cad. 24/5-6 Yenişehir 06640 ANKARA ",
      city: "Samsun",
      district: "Atakum",
    },
    {
      tckn: "4062778345",
      title: "Dr.",
      name: "Buğra",
      surname: "Cicioğlu",
      address: "Muratpaşa Mah. 879.sok No:23 Kat:2 daire:12",
      city: "Antalya",
      district: "Muratpaşa",
    },
    {
      tckn: "3459874565",
      title: "Yrd.",
      name: "Fırat",
      surname: "Güler",
      address: "Mevlana Mah. 879.sok No:23 Kat:2 daire:12",
      city: "Samsun",
      district: "Merkez",
    },
  ],
});

export const useAppStoreState = () => {
  const [appState, setAppState] = useState(appStore.state);
  useEffect(() => appStore.listen(setAppState));
  return appState;
};

appStore.on("accounts", (state, value) => {
  state.accounts = value;
});
