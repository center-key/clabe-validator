//! CLABE Validator v1.5.2 ~ github.com/center-key/clabe-validator ~ MIT License

declare type ClabeBank = {
    tag?: string;
    name?: string;
};
declare type ClabeBanksMap = {
    [bankCode: number]: ClabeBank;
};
declare type ClabeCity = [number, string];
declare type ClabeCitiesMap = {
    [cityCode: number]: string;
};
declare type ClabeCheck = {
    ok: boolean;
    error: string | null;
    formatOk: boolean;
    message: string;
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
