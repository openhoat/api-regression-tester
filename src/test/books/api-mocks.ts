import nock from 'nock'

export const mockApis = (legacyBaseUrl: string, actualBaseUrl: string) => {
  nock(legacyBaseUrl)
    .get('/api/books')
    .reply(200, [
      {
        id: 'be933b5b-d5d8-4cc9-ac04-d026302b9d65',
        title: 'Notre-Dame de Paris',
        author: 'Victor Hugo',
      },
      {
        id: '8ec42af3-a24d-4d1e-9932-5f3480c5c0e0',
        title: 'Le Petit Prince',
        author: 'Antoine de Saint-Exupéry',
      },
    ])
  nock(actualBaseUrl)
    .get('/api/books')
    .reply(200, [
      {
        id: '02cc7200-c5e6-4fb6-80d6-86fe3d504ecd',
        title: 'Le Petit Prince',
        author: 'Antoine de Saint-Exupéry',
      },
      {
        id: 'f150d66f-40ca-4307-ac69-b02c3207a3ed',
        title: 'Notre-Dame de Paris',
        author: 'Victor Hugo',
      },
    ])
}
