/* 
 +---------+-------+----------+------------------------------------+
 | Name    | Value | Key Type | Description                        |
 +---------+-------+----------+------------------------------------+
 | P-256   | 1     | EC2      | NIST P-256 also known as secp256r1 |
 | P-384   | 2     | EC2      | NIST P-384 also known as secp384r1 |
 | P-521   | 3     | EC2      | NIST P-521 also known as secp521r1 |
 | X25519  | 4     | OKP      | X25519 for use w/ ECDH only        |
 | X448    | 5     | OKP      | X448 for use w/ ECDH only          |
 | Ed25519 | 6     | OKP      | Ed25519 for use w/ EdDSA only      |
 | Ed448   | 7     | OKP      | Ed448 for use w/ EdDSA only        |
 +---------+-------+----------+------------------------------------+*/

export enum ECCurveName {
  P256 = 1,
  P384 = 2,
  P521 = 3,
  X25519 = 4,
  X448 = 5,
  Ed25519 = 6,
  Ed448 = 7,
}

/*
 +-----------+-------+-----------------------------------------------+
 | Name      | Value | Description                                   |
 +-----------+-------+-----------------------------------------------+
 | OKP       | 1     | Octet Key Pair                                |
 | EC2       | 2     | Elliptic Curve Keys w/ x- and y-coordinate    |
 |           |       | pair                                          |
 | Symmetric | 4     | Symmetric Keys                                |
 | Reserved  | 0     | This value is reserved                        |
 +-----------+-------+-----------------------------------------------+
 */

export enum ECCurveType {
  OKP = 1,
  EC2 = 2,
  Symmetric = 4,
  Reserved = 0,
}

export type CoseSignature = {
  dataSigned: string;
  publicKey: string;
};

export type COSEKey = {
  crv: ECCurveName;
  kty: ECCurveType;
  x: string;
  y: string;
};
