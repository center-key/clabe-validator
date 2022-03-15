//! clabe-validator v2.0.1 ~~ https://github.com/center-key/clabe-validator ~~ MIT License

export declare type ClabeBank = {
    tag?: string;
    name?: string;
};
export declare type ClabeBanksMap = {
    [bankCode: number]: ClabeBank;
};
export declare type ClabeCityInfo = [number, string, ClabeMxState?];
export declare type ClabeCitiesMap = {
    [cityCode: number]: ClabeCityInfo[];
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
    multiple: boolean;
    total: number;
    account: string;
    code: {
        bank: string;
        city: string;
    };
    checksum: number | null;
};
export declare type ClabeMxState = 'MX-AGU' | 'MX-BCN' | 'MX-BCS' | 'MX-CAM' | 'MX-CHH' | 'MX-CHP' | 'MX-CMX' | 'MX-COA' | 'MX-COL' | 'MX-DUR' | 'MX-GRO' | 'MX-GUA' | 'MX-HID' | 'MX-JAL' | 'MX-MEX' | 'MX-MIC' | 'MX-MOR' | 'MX-NAY' | 'MX-NLE' | 'MX-OAX' | 'MX-PUE' | 'MX-QUE' | 'MX-ROO' | 'MX-SIN' | 'MX-SLP' | 'MX-SON' | 'MX-TAB' | 'MX-TAM' | 'MX-TLA' | 'MX-VER' | 'MX-YUC' | 'MX-ZAC';
declare const clabe: {
    version: string;
    computeChecksum(clabeNum17: string): number | null;
    validate(clabeNum: string): ClabeCheck;
    calculate(bankCode: number, cityCode: number, accountNumber: number): string;
    banksMap: ClabeBanksMap;
    cities: ClabeCityInfo[];
    citiesMap: ClabeCitiesMap;
};
export { clabe };
