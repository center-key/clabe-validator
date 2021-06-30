//! CLABE Validator v1.6.4 ~ github.com/center-key/clabe-validator ~ MIT License

export declare type ClabeBank = {
    tag?: string;
    name?: string;
};
export declare type ClabeBanksMap = {
    [bankCode: number]: ClabeBank;
};
export declare type ClabeCity = [number, string];
export declare type ClabeCitiesMap = {
    [cityCode: number]: string;
};
export declare type ClabeCheck = {
    ok: boolean;
    formatOk: boolean;
    error: string | null;
    message: string;
    clabe: string | null;
    tag: string | null;
    bank: string | null;
    city: string | null;
    account: string;
    code: {
        bank: string;
        city: string;
    };
    checksum: number | null;
};
declare const clabe: {
    version: string;
    computeChecksum(clabeNum17: string): number | null;
    validate(clabeNum: string): ClabeCheck;
    calculate(bankCode: number, cityCode: number, accountNumber: number): string;
    banksMap: ClabeBanksMap;
    cities: ClabeCity[];
    citiesMap: ClabeCitiesMap;
};
export { clabe };
