import type { Options as TSUPOptions } from "tsup";

export interface Entry {
  entry: string;
  name?: string;
  noExternal?: TSUPOptions["noExternal"];
  external?: TSUPOptions["external"];
}
export type MainEntry = Omit<Entry, "name">;
export type OtherEntry = Entry & Required<Pick<Entry, "name">>;

export interface CommonOptions {
  mainEntry: MainEntry;
  otherEntries?: OtherEntry[];
}

export interface GeneratePackageJSONOptions extends CommonOptions {
  withInternalEntry: boolean;
}

export function generatePackageJSON(
  oldPackageJSON: any,
  opts: GeneratePackageJSONOptions,
): any;

export interface GenerateTSUPOptionsOptions extends CommonOptions {
  external?: TSUPOptions["external"];
}

export function generateTSUPOptions(
  opts: GenerateTSUPOptionsOptions,
): TSUPOptions[];
