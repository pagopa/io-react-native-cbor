import { Documents, DocumentTypeEnum } from '../schema';

describe('Documents schema', () => {
  it('should parse decoded data', async () => {
    const result = Documents.safeParse({
      status: 0,
      version: '1.0.0',
      documents: JSON.stringify([
        {
          docType: DocumentTypeEnum.MDL,
          issuerSigned: {
            nameSpaces: {
              'https://example.com': JSON.stringify([
                {
                  digestID: 1,
                  random: '1234567890',
                  elementIdentifier: '1234567890',
                  elementValue: '1234567890',
                },
                {
                  digestID: 2,
                  random: '1234567890',
                  elementIdentifier: '1234567890',
                  elementValue: 2,
                },
              ]),
            },
            issuerAuth: '123456789',
          },
        },
      ]),
    });
    expect(result.success).toBe(true);
    expect(result.data).toEqual({
      status: 0,
      version: '1.0.0',
      documents: [
        {
          docType: DocumentTypeEnum.MDL,
          issuerSigned: {
            nameSpaces: {
              'https://example.com': [
                {
                  digestID: 1,
                  random: '1234567890',
                  elementIdentifier: '1234567890',
                  elementValue: '1234567890',
                },
                {
                  digestID: 2,
                  random: '1234567890',
                  elementIdentifier: '1234567890',
                  elementValue: 2,
                },
              ],
            },
            issuerAuth: '123456789',
          },
        },
      ],
    });
  });
});
