import {http, HttpResponse} from "msw";


export const handlers = [
  http.get("/api/v1/users", () => {
    return HttpResponse.json(
      {
        content: [
          {
            user: {
              id: 0,
              surname: "Космач",
              name: "Мария",
              patronymic: "Романовна",
              email: "masha@mail.ru",
              phone: "88005553535",
              timezone: "+3",
              createdAt: "2025-02-22T12:32:17.867Z",
              updatedAt: "2025-02-22T12:32:17.867Z",
              role: "Администратор",
              status: "ACTIVE",
              organization: 0 ,
              hex: " #CADFE0" ,
            },
            notes: '',
            subjects: [
              {
                id: 0,
                name: "string",
                organization: 0
              }
            ],
            grades: [
              0
            ]
          },
          {
            id: 1,
            user: {
              id: 1,
              surname:"Аверин ",
              name: "Роман",
              patronymic: "Сергеевич",
              email: "masha@mail.ru",
              phone: "88005553535",
              timezone: "+3",
              createdAt: "2025-02-22T12:32:17.867Z",
              updatedAt: "2025-02-22T12:32:17.867Z",
              role: "Менеджер",
              hex: " #F2F2D7" ,
              status: "ACTIVE",
              organization: 0
            },
            notes: '',
            subjects: [
              {
                id: 0,
                name: "string",
                organization: 0
              }
            ],
            grades: [
              0
            ]
          },
          {
            id: 2,
            user: {
              id: 2,
              surname:"Губанова",
              name: "Елена",
              patronymic: "Борисовна",
              email: "masha@mail.ru",
              phone: "88005553535",
              timezone: "+3",
              createdAt: "2025-02-22T12:32:17.867Z",
              updatedAt: "2025-02-22T12:32:17.867Z",
              role: "Преподаватель",
              status: "ACTIVE",
              hex: " #D8F4D6" ,
              organization: 0
            },
            notes: '',
            subjects: [
              {
                id: 0,
                name: "string",
                organization: 0
              }
            ],
            grades: [
              0
            ]
          },
          {
            id: 3,
            user: {
              id: 3,
              surname: "Космач",
              name: "Михаил",
              patronymic: "Романович",
              email: "masha@mail.ru",
              phone: "88005553535",
              timezone: "+3",
              createdAt: "2025-02-22T12:32:17.867Z",
              updatedAt: "2025-02-22T12:32:17.867Z",
              role: "Администратор",
              status: "ACTIVE",
              hex: " #CADFE0" ,
              organization: 0
            },
            socials: [
              {
                socialName: "masyanya",
                link: "htttp://google.com"
              }
            ],
            notes: '',
            subjects: [
              {
                id: 0,
                name: "string",
                organization: 0
              }
            ],
            grades: [
              0
            ]
          },
        ],
        page: 0,
        limit: 0,
        totalCount: 0,
        totalPages: 0
      },
    );
  }),
  http.get('/users', () => {
    return HttpResponse.json([])
  })
];
