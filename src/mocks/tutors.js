import { http, HttpResponse } from "msw";

export const tutorsrHandlers = [
  http.get("/api/v1/tutors", () => {
    return HttpResponse.json({
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
            organization: 0,
            hex: "#CADFE0",
          },
          notes: "",
          subjects: [
            {
              id: 0,
              name: "string",
              organization: 0,
            },
          ],
          grades: [0],
        },
      ],
      page: 0,
      limit: 0,
      totalCount: 0,
      totalPages: 0,
    });
  }),
  http.get("/users", () => {
    return HttpResponse.json([]);
  }),
];
