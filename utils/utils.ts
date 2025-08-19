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
  searchQueryHelper: {
    encodeForUrl(query: string): string;
    decodeFromUrl(encodedQuery: string): string;
    normalizeSearchQuery(query: string): string;
    convertToUrlSlug(text: string): string;
    convertFromUrlSlug(slug: string): string;
    sanitizeQuery(query: string): string;
    turkishCharacterMap: Record<string, string>;
    reverseTurkishCharacterMap: Record<string, string>;
  };
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

  /**
   * Comprehensive search query helper for Turkish character handling and URL formatting
   */
  searchQueryHelper = {
    // Turkish character mappings for URL-friendly conversion
    turkishCharacterMap: {
      'ç': 'c', 'Ç': 'C',
      'ğ': 'g', 'Ğ': 'G',
      'ı': 'i', 'I': 'I',
      'İ': 'I', 'i': 'i',
      'ö': 'o', 'Ö': 'O',
      'ş': 's', 'Ş': 'S',
      'ü': 'u', 'Ü': 'U'
    } as Record<string, string>,

    // Reverse mapping for converting back from URL-friendly format
    reverseTurkishCharacterMap: {
      'c': 'ç', 'C': 'Ç',
      'g': 'ğ', 'G': 'Ğ',
      'i': 'ı', 'I': 'İ',
      'o': 'ö', 'O': 'Ö',
      's': 'ş', 'S': 'Ş',
      'u': 'ü', 'U': 'Ü'
    } as Record<string, string>,

    /**
     * Encode search query for URL with proper Turkish character handling
     * @param query - The search query to encode
     * @returns URL-encoded query string
     */
    encodeForUrl: (query: string): string => {
      if (!query || typeof query !== 'string') return '';
      
      try {
        // First normalize and clean the query
        const normalizedQuery = query.trim().replace(/\s+/g, '-');
        
        // Encode the query to handle Turkish characters properly
        return encodeURIComponent(normalizedQuery);
      } catch (error) {
        console.warn('Error encoding search query:', error);
        // Fallback: simple space replacement
        return query.trim().replace(/\s+/g, '-');
      }
    },

    /**
     * Decode search query from URL with proper Turkish character handling
     * @param encodedQuery - The URL-encoded query string
     * @returns Decoded and formatted query string
     */
    decodeFromUrl: (encodedQuery: string): string => {
      if (!encodedQuery || typeof encodedQuery !== 'string') return '';
      
      try {
        // Decode URL-encoded characters
        const decodedQuery = decodeURIComponent(encodedQuery);
        
        // Convert dashes back to spaces
        return decodedQuery.replace(/-/g, ' ').trim();
      } catch (error) {
        console.warn('Error decoding search query:', error);
        // Fallback: simple dash replacement
        return encodedQuery.replace(/-/g, ' ').trim();
      }
    },

    /**
     * Normalize search query for consistent formatting
     * @param query - The search query to normalize
     * @returns Normalized query string
     */
    normalizeSearchQuery: (query: string): string => {
      if (!query || typeof query !== 'string') return '';
      
      return query
        .trim()
        .toLowerCase()
        .replace(/\s+/g, ' ') // Replace multiple spaces with single space
        .replace(/[^\w\sçğıöşüÇĞIİÖŞÜ-]/g, '') // Keep only alphanumeric, spaces, dashes, and Turkish chars
        .trim();
    },

    /**
     * Convert text to URL-friendly slug (alternative approach)
     * @param text - Text to convert to slug
     * @returns URL-friendly slug
     */
    convertToUrlSlug: (text: string): string => {
      if (!text || typeof text !== 'string') return '';
      
      return text
        .trim()
        .toLowerCase()
        .replace(/\s+/g, '-') // Replace spaces with dashes
        .replace(/[^\w\-çğıöşüÇĞIİÖŞÜ]/g, '') // Remove special chars except Turkish
        .replace(/--+/g, '-') // Replace multiple dashes with single dash
        .replace(/^-+|-+$/g, ''); // Remove leading/trailing dashes
    },

    /**
     * Convert URL slug back to readable text
     * @param slug - URL slug to convert back
     * @returns Human-readable text
     */
    convertFromUrlSlug: (slug: string): string => {
      if (!slug || typeof slug !== 'string') return '';
      
      return slug
        .replace(/-/g, ' ') // Replace dashes with spaces
        .trim()
        .replace(/\s+/g, ' '); // Clean up multiple spaces
    },

    /**
     * Sanitize search query for security and consistency
     * @param query - Query to sanitize
     * @returns Sanitized query string
     */
    sanitizeQuery: (query: string): string => {
      if (!query || typeof query !== 'string') return '';
      
      return query
        .trim()
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove script tags
        .replace(/[<>'"&]/g, '') // Remove potentially dangerous characters
        .replace(/\s+/g, ' ') // Normalize spaces
        .substring(0, 100) // Limit length
        .trim();
    }
  };
}

export const utils = new Utils();
