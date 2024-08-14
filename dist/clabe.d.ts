//! clabe-validator v3.0.2 ~~ https://github.com/center-key/clabe-validator ~~ MIT License

export type ClabeBank = {
    tag?: string;
    name?: string;
};
export type ClabeBanksMap = {
    [bankCode: number]: ClabeBank;
};
export type ClabeCityInfo = [code: number, name: string, state?: ClabeMxState];
export type ClabeCitiesMap = {
    [cityCode: number]: ClabeCityInfo[];
};
export type ClabeCheck = {
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
export type ClabeMxState = 'MX-AGU' | 'MX-BCN' | 'MX-BCS' | 'MX-CAM' | 'MX-CHH' | 'MX-CHP' | 'MX-CMX' | 'MX-COA' | 'MX-COL' | 'MX-DUR' | 'MX-GRO' | 'MX-GUA' | 'MX-HID' | 'MX-JAL' | 'MX-MEX' | 'MX-MIC' | 'MX-MOR' | 'MX-NAY' | 'MX-NLE' | 'MX-OAX' | 'MX-PUE' | 'MX-QUE' | 'MX-ROO' | 'MX-SIN' | 'MX-SLP' | 'MX-SON' | 'MX-TAB' | 'MX-TAM' | 'MX-TLA' | 'MX-VER' | 'MX-YUC' | 'MX-ZAC';
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
