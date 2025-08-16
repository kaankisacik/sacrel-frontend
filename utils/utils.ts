interface IUtils {
  height: ComputedRef<number>;
  customAlert(title: string, message: string, status: number): void;
  getHelloWorld(): string;
  getOnlyDateFromString(dateString: string): string;
  getOnlyDate(date: Date): string;
  filterValue(value: string | null): string;
  openObject(base64: string): void;
  getOnlyDateWithTimezoneOffset(date: string): Date;
  getOnlyDateWithTimezoneOffsetToIsoString(date: string): string;
  jsonUndefinedPropertiesToNull(obj: any): any;
  jsonUndefinedPropertiesToRemove(obj: any): any;
  removeKeysByConditions(obj: any, conditions: string[]): any;
  isJwtTokenExpired(token: string): boolean;
}

class Utils implements IUtils {
  height = computed(() => {
    return window.innerHeight - 250;
  });
  customAlert = (title: string, message: string, status?: number) => {
    alert(`${message}\n${status ? status : ""} ${title}`);
  };
  getHelloWorld(): string {
    return "Hello World";
  }
  getOnlyDate(date: Date): string {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    return `${day}.${month}.${year}`;
  }
  getOnlyDateFromString(dateString: string): string {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    return `${day}.${month}.${year}`;
  }
  getOnlyDateWithTimezoneOffset(date: string): Date {
    let rrr = new Date(date);
    const timezoneOffset = rrr.getTimezoneOffset();
    rrr.setMinutes(rrr.getMinutes() - timezoneOffset);
    return rrr;
  }
  getOnlyDateWithTimezoneOffsetToIsoString(date: string): string {
    if (!date) {
      return "";
    }

    let rrr = new Date(date);
    if (isNaN(rrr.getTime())) {
      return "";
    }

    const timezoneOffset = rrr.getTimezoneOffset();
    rrr.setMinutes(rrr.getMinutes() - timezoneOffset);
    return rrr.toISOString();
  }
  filterValue(value: string | null): string {
    return value == null ? "" : value.toString().trim();
  }
  openObject(base64: string): void {
    const win = window.open();
    if (base64.includes("data:application/pdf;base64,")) {
      win?.document.write(
        `<iframe src="${base64}" style="width:100%;height:100%;"></iframe>`
      );
      return;
    } else {
      win?.document.write(
        `<img src="${base64}" style="width:100%;height:100%;object-fit:contain;"/>`
      );
      return;
    }
  }

  jsonUndefinedPropertiesToNull(obj: any) {
    return JSON.parse(
      JSON.stringify(obj, (key, value) => {
        return value === undefined ? null : value;
      })
    );
  }

  jsonUndefinedPropertiesToRemove(obj: any): any {
    return JSON.parse(
      JSON.stringify(obj, (key, value) => {
        return value === undefined ? undefined : value;
      })
    );
  }

  removeKeysByConditions(obj: any, conditions: string[]): any {
    const newObj: any = {};
    for (const key in obj) {
      if (conditions.includes(key)) {
        continue;
      }
      newObj[key] = obj[key];
    }
    return newObj;
  }

  filterObjectKeys(obj: any): any {
    const newObj: any = {};
    for (const key in obj) {
      if (obj[key] === null || obj[key] === undefined) {
        continue;
      }
      newObj[key] = obj[key];
    }
    return newObj;
  }

  isJwtTokenExpired(token: string): boolean {
    if (!token) {
      return true;
    }
    const payloadPart = token.split(".")[1];
    if (!payloadPart) {
      return true;
    }
    const payload = JSON.parse(atob(payloadPart));
    const expirationTime = payload.exp * 1000; // Convert to milliseconds
    return Date.now() >= expirationTime;
  }
}

export const utils = new Utils();
