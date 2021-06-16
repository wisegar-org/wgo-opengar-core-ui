import { ObjExt } from '@wisegar-org/wgo-opengar-shared';

const DbName = 'WG_App_DB';
const ObjStoreName = 'WG_App_DBObjectStore';
const IndexName = 'NameIndex';
const TrasactionAccess = 'readwrite';
const CachedRecordKey = 'CachedRecordKey';
const CurrentOfferKey: string = 'CurrentOfferKey';
const USER_TOKEN = 'access_token';
const USER_NAME = 'username';
const USER_TOKEN_EXPIRATION = 'user_token_expiration';
const APP_LANGUAGE = 'app_language';
const USER_ID = 'userid';
const USER_ISADMIN = 'isAdmin';
const USER_INFO = 'FullUserInfo';
const BASE_URL = 'BASE_URL';

const GetCachedRecordKey = (id: any) => {
  return `${CachedRecordKey}-${id}`;
};

export const CacheService = {
  GetBaseUrl: (onSuccess: any, onError: any) => {
    CacheService.Get(BASE_URL, onSuccess, onError);
  },
  SetBaseUrl: (baseUrlObject: any, onSuccess: any, onError: any) => {
    CacheService.Store(BASE_URL, baseUrlObject, onSuccess, onError);
  },
  GetFullUserInfo: (onSuccess: any, onError: any) => {
    CacheService.Get(USER_INFO, onSuccess, onError);
  },
  SetFullUserinfo: (fullUserObject: any, onSuccess: any, onError: any) => {
    CacheService.Store(USER_INFO, fullUserObject, onSuccess, onError);
  },
  GetUserToken: () => {
    const token = localStorage.getItem(USER_TOKEN);
    if (ObjExt.IsNullOrUndefined(token)) return '';
    return token;
  },
  GetUserData: () => {
    return {
      username: localStorage.getItem(USER_NAME),
      id: localStorage.getItem(USER_ID),
      isAdmin: localStorage.getItem(USER_ISADMIN),
      usertoken: localStorage.getItem(USER_TOKEN),
    };
  },
  SetUserData: (usertoken: string, user: { username: string; id: string; isAdmin: string }) => {
    localStorage.setItem(USER_TOKEN, usertoken);
    localStorage.setItem(USER_NAME, user.username);
    localStorage.setItem(USER_ID, user.id);
    localStorage.setItem(USER_ISADMIN, user.isAdmin);
    localStorage.setItem(USER_TOKEN_EXPIRATION, JSON.stringify(`${60 * 60 * 24 * 1000}${new Date()}`));
  },
  RemoveUserData: () => {
    localStorage.removeItem(USER_TOKEN);
    localStorage.removeItem(USER_NAME);
    localStorage.removeItem(USER_ID);
    localStorage.removeItem(USER_ISADMIN);
    localStorage.removeItem(USER_TOKEN_EXPIRATION);
    CacheService.Remove(USER_INFO);
  },
  SetLanguage: (language: string) => {
    localStorage.setItem(APP_LANGUAGE, language);
  },
  GetLanguage: () => {
    return localStorage.getItem(APP_LANGUAGE);
  },
  RemoveLanguage: () => {
    return localStorage.removeItem(APP_LANGUAGE);
  },
  GetCurrentOffer: () => {
    return localStorage.getItem(CurrentOfferKey);
  },
  SetCurrentOffer: (code: string) => {
    localStorage.setItem(CurrentOfferKey, code);
  },
  RemoveCurrentOffer: (code: any) => {
    localStorage.removeItem(CurrentOfferKey);
  },
  SetCachedRecord: (record: any) => {
    localStorage.setItem(GetCachedRecordKey(record.id), record);
  },
  GetCachedRecord: (id: any) => {
    localStorage.getItem(GetCachedRecordKey(id));
  },
  CleanCachedRecord: (id: any) => {
    localStorage.removeItem(GetCachedRecordKey(id));
  },
  SetCachedRecords: (records: any[]) => {
    if (!records) return;
    if (!Array.isArray(records)) return;
    records.forEach((record) => {
      CacheService.SetCachedRecord(record);
    });
  },
  GetCachedRecords: () => {
    localStorage.getItem(CachedRecordKey);
  },
  CleanCachedRecords: () => {
    localStorage.removeItem(CachedRecordKey);
  },
  GetQueuedRequests: (onSuccess: (arg0: any) => void, onError: () => void) => {
    var openDB = CacheService.openRequestsIndexedDB();
    openDB.onsuccess = () => {
      var db = CacheService.getQueueStoreIndexedDB(openDB);
      const alldata = db.store.getAll();
      alldata.onsuccess = (event: { target: { result: any } }) => {
        console.log(event);
        if (!ObjExt.IsFuncAndDefined(onSuccess)) return;
        onSuccess(event.target.result);
      };
      alldata.onerror = (event: any) => {
        console.log(event);
        if (!ObjExt.IsFuncAndDefined(onError)) return;
        onError();
      };
      const allKeys = db.store.getAllKeys();
      allKeys.onsuccess = (event: any) => {
        console.log(event);
      };
      allKeys.onerror = (event: any) => {
        console.log(event);
      };
    };

    openDB.onerror = () => {
      if (!ObjExt.IsFuncAndDefined(onError)) return;
      onError();
    };
  },
  Store: (keyName: unknown, data: unknown, onSuccess: (data?: unknown) => void, onError?: () => void) => {
    var openDB = CacheService.openIndexedDB();
    openDB.onsuccess = () => {
      var db = CacheService.getStoreIndexedDB(openDB);
      db.store.put({ key: keyName, data: data });
      if (!ObjExt.IsFuncAndDefined(onSuccess)) return;
      onSuccess();
    };
    openDB.onerror = () => {
      if (!ObjExt.IsFuncAndDefined(onError)) return;
      onError();
    };
    return true;
  },
  StoreList: (keyName: unknown, data: any, onSuccess: (data?: unknown) => void, onError: (error?: unknown) => void) => {
    if (ObjExt.IsNullOrUndefined(keyName)) return;
    if (ObjExt.IsNotArrayOrEmpty(data)) return;
    data.forEach((d: any, i: any) => {
      CacheService.Store(
        keyName,
        d,
        () => {
          if (!ObjExt.IsFuncAndDefined(onSuccess)) return;
          onSuccess(d);
        },
        () => {
          if (!ObjExt.IsFuncAndDefined(onError)) return;
          onError(d);
        }
      );
    });
  },
  GetAll: (onSuccess: (arg0: any) => void, onError: () => void) => {
    var openDB = CacheService.openIndexedDB();
    openDB.onsuccess = () => {
      var db = CacheService.getStoreIndexedDB(openDB);
      const alldata = db.store.getAll();
      alldata.onsuccess = (event: { target: { result: any } }) => {
        console.log(event);
        if (!ObjExt.IsFuncAndDefined(onSuccess)) return;
        onSuccess(event.target.result);
      };
      alldata.onerror = (event: any) => {
        console.log(event);
        if (!ObjExt.IsFuncAndDefined(onError)) return;
        onError();
      };
      const allKeys = db.store.getAllKeys();
      allKeys.onsuccess = (event: any) => {
        console.log(event);
      };
      allKeys.onerror = (event: any) => {
        console.log(event);
      };
    };
    openDB.onerror = () => {
      if (!ObjExt.IsFuncAndDefined(onError)) return;
      onError();
    };
  },
  Get: (key: any, onSuccess: (data: unknown) => void, onError: any) => {
    var openDB = CacheService.openIndexedDB();
    openDB.onsuccess = () => {
      let db = CacheService.getStoreIndexedDB(openDB);
      let getData = db.store.get(key);
      if (ObjExt.IsNullOrUndefined(getData)) {
        onSuccess(undefined);
      }
      getData.onsuccess = () => {
        onSuccess(getData.result ? getData.result.data : undefined);
      };
    };
    openDB.onerror = () => {
      onSuccess(undefined);
    };
  },
  Remove: (key: any, onSuccess?: (data?: unknown) => void, onComplete?: () => void) => {
    var openDB = CacheService.openIndexedDB();
    openDB.onsuccess = () => {
      let db = CacheService.getStoreIndexedDB(openDB);
      let getData = db.store.delete(key);
      if (ObjExt.IsNullOrUndefined(getData)) return;
      getData.onsuccess = () => {
        if (!ObjExt.IsFuncAndDefined(onSuccess)) return;
        onSuccess();
      };
      db.tx.oncomplete = function () {
        db.result.close();
        if (!ObjExt.IsFuncAndDefined(onComplete)) return;
        onComplete();
      };
    };
    return true;
  },
  RemoveAll: (onSuccess: () => void) => {
    const openDB = CacheService.openIndexedDB();
    openDB.onsuccess = () => {
      var db = CacheService.getStoreIndexedDB(openDB);
      console.log(db.store);
      db.store.clear();
      if (!ObjExt.IsFuncAndDefined(onSuccess)) return;
      onSuccess();
    };
  },
  openIndexedDB: (fileindex?: any) => {
    const win: any = window;
    const indexedDB = win.indexedDB || win.mozIndexedDB || win.webkitIndexedDB || win.msIndexedDB || win.shimIndexedDB;
    var openDB = indexedDB.open(DbName, 1);
    openDB.onupgradeneeded = () => {
      const db: any = {};
      db.result = openDB.result;
      db.store = db.result.createObjectStore(ObjStoreName, { keyPath: 'key' });

      if (fileindex) db.index = db.store.createIndex(IndexName, fileindex);
    };
    return openDB;
  },
  openRequestsIndexedDB: (fileindex?: any) => {
    const win: any = window;
    const indexedDB = win.indexedDB || win.mozIndexedDB || win.webkitIndexedDB || win.msIndexedDB || win.shimIndexedDB;
    var openDB = indexedDB.open('workbox-background-sync', 1);
    const ObjStoreName = 'requests';
    openDB.onupgradeneeded = () => {
      const db: any = {};
      db.result = openDB.result;
      db.store = db.result.createObjectStore(ObjStoreName, { keyPath: 'key' });

      if (fileindex) db.index = db.store.createIndex(IndexName, fileindex);
    };
    return openDB;
  },
  getQueueStoreIndexedDB: (openDB: { result: any }) => {
    const ObjStoreName = 'requests';
    const db: any = {};
    db.result = openDB.result;
    db.tx = db.result.transaction(ObjStoreName, TrasactionAccess);
    db.store = db.tx.objectStore(ObjStoreName);
    if (db.store.indexNames && db.store.indexNames.length > 0) {
      db.index = db.store.index(IndexName);
    }
    return db;
  },
  getStoreIndexedDB: (openDB: { result: unknown }) => {
    var db: any = {};
    db.result = openDB.result;
    db.tx = db.result.transaction(ObjStoreName, TrasactionAccess);
    db.store = db.tx.objectStore(ObjStoreName);
    if (db.store.indexNames && db.store.indexNames.length > 0) {
      db.index = db.store.index(IndexName);
    }
    return db;
  },
  TestingIndexedDb: () => {
    const example = () => {
      CacheService.Store(12345, { name: { first: 'John', last: 'Doe' }, age: 42 }, (data: any) => {
        console.log('Data saved: ', data);
      });
      CacheService.Store(67890, { name: { first: 'Bob', last: 'Smith' }, age: 35 }, (data: any) => {
        console.log('Data saved: ', data);
      });
      CacheService.Get(
        12345,
        (data: any) => {
          console.log('Data founded: ', data);
        },
        (error) => {}
      );
      CacheService.Get(
        67890,
        (data: any) => {
          console.log('Data founded: ', data);
        },
        (error) => {}
      );
      CacheService.Remove(12345, (data: any) => {
        console.log('Data removed: 12345');
      });
    };
    CacheService.RemoveAll(() => {
      example();
    });
  },
  SetApiOfflineStack: (type: any, url: any, params: any) => {},
  ExeApiOfflineApiCalls: () => {},
};
