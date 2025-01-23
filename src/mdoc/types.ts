export enum DocType {
  MDL = 'org.iso.18013.5.1.mDL',
  EU_PID = 'eu.europa.ec.eudi.pid.1',
  ANY_OTHER = '',
}

export type DocumentX = {
  digestID?: number;
  random?: string;
  elementIdentifier?: string;
  elementValue?: any;
};

export type IssuerSigned = {
  nameSpaces?: Record<string, DocumentX[]>;
  rawValue?: string;
  nameSpacedData?: Record<string, Record<string, string>>;
  issuerAuth?: string;
};

export type Document = {
  docType?: DocType;
  issuerSigned?: IssuerSigned;
  rawValue: string;
};

export type MDoc = {
  documents: any;
  status?: number;
  version?: string;
};
